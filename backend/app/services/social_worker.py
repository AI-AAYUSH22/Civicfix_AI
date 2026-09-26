import asyncio
import logging
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.case import Case
from app.services.reddit_listener import RedditListener

logger = logging.getLogger("civicfix.social_worker")


class SocialWorker:
    """
    Background Task Coordinator for social intake and periodic tasks.
    Manages Reddit listener task and background maintenance jobs with graceful shutdown.
    """

    def __init__(self):
        self._stop_event = asyncio.Event()
        self._tasks = []
        self._reddit_listener = RedditListener()

    async def start(self):
        """Starts background tasks."""
        self._stop_event.clear()
        logger.info("Starting SocialWorker background services...")

        # 1. Start Reddit Listener Task
        reddit_task = asyncio.create_task(
            self._reddit_listener.run_listener(self._stop_event),
            name="reddit_listener_task"
        )
        self._tasks.append(reddit_task)

        # 2. Start Periodic Location & Notification Cleaner Task
        cleaner_task = asyncio.create_task(
            self._run_maintenance_loop(),
            name="social_maintenance_task"
        )
        self._tasks.append(cleaner_task)

        # 3. Start Telegram Bot Listener Loop Task
        telegram_task = asyncio.create_task(
            self._run_telegram_polling_loop(),
            name="telegram_polling_task"
        )
        self._tasks.append(telegram_task)

        logger.info(f"SocialWorker started {len(self._tasks)} background tasks.")

    async def stop(self):
        """Gracefully stops all background tasks."""
        logger.info("Stopping SocialWorker background services...")
        self._stop_event.set()

        for task in self._tasks:
            if not task.done():
                task.cancel()

        # Await completion
        await asyncio.gather(*self._tasks, return_exceptions=True)
        self._tasks.clear()
        logger.info("SocialWorker stopped gracefully.")

    async def _run_maintenance_loop(self):
        """
        Runs periodic maintenance every 60 seconds:
        - Logs status of unresolved PENDING cases older than 48 hours.
        """
        while not self._stop_event.is_set():
            try:
                db: Session = SessionLocal()
                try:
                    cutoff = datetime.utcnow() - timedelta(hours=48)
                    stale_cases = (
                        db.query(Case)
                        .filter(
                            Case.location_status == "PENDING",
                            Case.created_at < cutoff
                        )
                        .all()
                    )
                    if stale_cases:
                        logger.info(f"SocialWorker Maintenance: Found {len(stale_cases)} stale PENDING cases awaiting location.")
                finally:
                    db.close()

                # Sleep with interruption check
                for _ in range(60):
                    if self._stop_event.is_set():
                        break
                    await asyncio.sleep(1.0)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in SocialWorker maintenance loop: {e}")
                await asyncio.sleep(10.0)

    async def _run_telegram_polling_loop(self):
        """
        Background poller for Telegram Bot updates.
        Allows instant execution without requiring ngrok or external webhooks.
        """
        from app.core.config import settings
        if not settings.TELEGRAM_BOT_TOKEN:
            logger.info("No TELEGRAM_BOT_TOKEN configured. Skipping Telegram polling loop.")
            return

        logger.info("Starting Telegram Bot Polling background loop...")
        last_update_id = 0
        import httpx
        from app.api.v1.telegram_bot import process_telegram_update

        while not self._stop_event.is_set():
            try:
                url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getUpdates"
                params = {"offset": last_update_id + 1, "timeout": 5}

                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.get(url, params=params)
                    if res.status_code == 200:
                        res_data = res.json()
                        if res_data.get("ok"):
                            updates = res_data.get("result", [])
                            if updates:
                                logger.info(f"Telegram poller received {len(updates)} update(s).")
                                db = SessionLocal()
                                try:
                                    for update in updates:
                                        up_id = update.get("update_id", 0)
                                        last_update_id = max(last_update_id, up_id)
                                        try:
                                            await process_telegram_update(update, db)
                                        except Exception as err:
                                            logger.error(f"Error processing Telegram update {up_id}: {err}", exc_info=True)
                                finally:
                                    db.close()
                    elif res.status_code == 409:
                        # Another instance polled getUpdates; wait a bit
                        logger.warning("Telegram getUpdates returned 409 Conflict (multiple pollers active). Waiting 3s...")
                        await asyncio.sleep(3.0)

                await asyncio.sleep(0.5)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in Telegram polling loop: {e}", exc_info=True)
                await asyncio.sleep(3.0)


# Global singleton instance
social_worker = SocialWorker()

