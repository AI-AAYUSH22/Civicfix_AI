import logging
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, Response, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.services.social_intake_service import SocialIntakeService
from app.services.telegram_service import (
    download_telegram_file,
    send_telegram_message,
    get_telegram_bot_info,
    set_telegram_webhook,
)
from app.models.case import Case

logger = logging.getLogger("civicfix.telegram_bot")
router = APIRouter()

# Global in-memory offset for dev polling
_last_update_id = 0


@router.get("/status")
async def get_telegram_status():
    """
    Returns Telegram bot status and account info from Telegram API.
    """
    info = await get_telegram_bot_info()
    return {
        "status": "active" if info.get("ok") else "error",
        "bot_info": info.get("result"),
        "has_token": bool(settings.TELEGRAM_BOT_TOKEN),
    }


@router.post("/set-webhook")
async def setup_webhook(request: Request):
    """
    Registers the webhook URL with Telegram API.
    Provide {"url": "https://your-domain.com/api/v1/telegram/webhook"} in payload.
    """
    body = await request.json()
    webhook_url = body.get("url")
    if not webhook_url:
        raise HTTPException(status_code=400, detail="Missing 'url' parameter")
    
    result = await set_telegram_webhook(webhook_url)
    return result


@router.post("/webhook")
async def receive_telegram_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Telegram Webhook Receiver Endpoint.
    Processes text, photo, location pins, and commands from Telegram citizens.
    """
    try:
        update = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON update")

    await process_telegram_update(update, db)
    return {"status": "ok"}


async def process_telegram_update(update: Dict[str, Any], db: Session) -> None:
    """
    Core handler for a single Telegram update payload.
    """
    message = update.get("message") or update.get("edited_message")
    if not message:
        return

    chat = message.get("chat", {})
    chat_id = chat.get("id")
    if not chat_id:
        return

    from_user = message.get("from", {})
    username = from_user.get("username") or from_user.get("first_name") or "Telegram Citizen"
    source_id = f"tg-{chat_id}"

    text = message.get("text", "").strip()
    caption = message.get("caption", "").strip()
    full_text = text or caption or ""

    # Command Handling
    if full_text.startswith("/start"):
        welcome_text = (
            "👋 *Welcome to CivicFix AI!*\n\n"
            "I am your automated civic issue reporting assistant.\n\n"
            "📸 *How to Report an Issue:*\n"
            "1. Send a photo of the road defect, pothole, or garbage issue.\n"
            "2. Tap 📎 and share your *Location Pin* (or write nearby street landmark).\n"
            "3. Our AI automatically verifies the repair work and updates you!\n\n"
            "Commands:\n"
            "• `/status <CASE_ID>` - Check progress of a reported case"
        )
        await send_telegram_message(chat_id, welcome_text)
        return

    if full_text.startswith("/status"):
        parts = full_text.split()
        if len(parts) > 1:
            case_id = parts[1].strip().upper()
            case = db.query(Case).filter(Case.id == case_id).first()
            if case:
                status_text = (
                    f"📋 *Case #{case.id} Status*\n\n"
                    f"🔹 *Status:* `{case.status}`\n"
                    f"🏛️ *Ward:* {case.ward.name if case.ward else 'Unassigned'}\n"
                    f"📅 *Reported:* {case.created_at.strftime('%Y-%m-%d %H:%M')}\n"
                    f"📌 *Location:* {case.location.landmark or case.location.address or 'Recorded'}"
                )
            else:
                status_text = f"❌ Case `{case_id}` not found. Please verify the Case ID."
        else:
            status_text = "Please specify a Case ID. Example: `/status CASE-48201`"
        await send_telegram_message(chat_id, status_text)
        return

    # Extract Media (Photo attachments)
    media_files = []
    photos = message.get("photo")
    if photos and isinstance(photos, list):
        # Telegram photos array is sorted by resolution, last element is highest resolution
        best_photo = photos[-1]
        file_id = best_photo.get("file_id")
        if file_id:
            try:
                saved_media = await download_telegram_file(file_id)
                media_files.append(saved_media)
            except Exception as e:
                logger.error(f"Failed to download Telegram photo {file_id}: {e}")

    # Extract Location Pin
    location_pin = None
    loc_obj = message.get("location")
    if loc_obj:
        lat = loc_obj.get("latitude")
        lng = loc_obj.get("longitude")
        if lat is not None and lng is not None:
            location_pin = (float(lat), float(lng))
            if not full_text:
                full_text = f"Location Pin ({lat:.5f}, {lng:.5f})"

    # Check Active Conversation State to determine if this is a follow-up or new submission
    conv_state = SocialIntakeService.get_or_create_conversation_state(db, "TELEGRAM", source_id)
    is_followup = conv_state.current_step in ["WAITING_LOCATION", "WAITING_CLARIFICATION"] and conv_state.active_case_id

    if is_followup:
        res = SocialIntakeService.ingest_followup(
            db=db,
            channel="TELEGRAM",
            source_id=source_id,
            username=username,
            text=full_text,
            location_pin=location_pin,
            media_files=media_files
        )
    else:
        res = SocialIntakeService.ingest_submission(
            db=db,
            channel="TELEGRAM",
            source_id=source_id,
            username=username,
            text=full_text or "Pothole/Civic defect reported via Telegram",
            media_files=media_files,
            location_pin=location_pin,
            source_url=f"https://t.me/{username}" if username != "Telegram Citizen" else None,
            raw_metadata={"chat_id": chat_id, "message_id": message.get("message_id")}
        )

    # Send Outbound Automated Response to Citizen
    reply_text = res.get("reply_message")
    if reply_text:
        await send_telegram_message(chat_id=chat_id, text=reply_text)


@router.post("/poll")
async def poll_telegram_updates(db: Session = Depends(get_db)):
    """
    Developer helper endpoint: performs a single-pass long poll against Telegram API
    to fetch and process incoming messages without needing an external ngrok tunnel.
    """
    global _last_update_id
    import httpx

    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/getUpdates"
    params = {"offset": _last_update_id + 1, "timeout": 2}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.get(url, params=params)
            res_data = res.json()
            if not res_data.get("ok"):
                return {"status": "error", "detail": res_data}
            
            updates = res_data.get("result", [])
            processed_count = 0
            for update in updates:
                _last_update_id = max(_last_update_id, update.get("update_id", 0))
                await process_telegram_update(update, db)
                processed_count += 1

            return {
                "status": "success",
                "processed_updates": processed_count,
                "last_update_id": _last_update_id
            }
        except Exception as e:
            logger.error(f"Telegram polling error: {e}")
            return {"status": "error", "detail": str(e)}
