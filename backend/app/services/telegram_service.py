import os
import uuid
import logging
import httpx
from typing import Optional, Tuple, Dict, Any
from app.core.config import settings

logger = logging.getLogger("civicfix.telegram_service")

TELEGRAM_API_BASE = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}"
TELEGRAM_FILE_BASE = f"https://api.telegram.org/file/bot{settings.TELEGRAM_BOT_TOKEN}"


from app.services.storage_service import save_raw_bytes

async def download_telegram_file(file_id: str) -> Tuple[str, str, str]:
    """
    Retrieves file metadata from Telegram Bot API and downloads the image to local storage.
    Returns: (relative_storage_path, original_filename, sha256_hash)
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Step 1: Get file path from Telegram
        get_file_url = f"{TELEGRAM_API_BASE}/getFile"
        res = await client.get(get_file_url, params={"file_id": file_id})
        res_data = res.json()
        
        if not res_data.get("ok"):
            raise ValueError(f"Telegram getFile failed: {res_data}")
        
        file_path = res_data.get("result", {}).get("file_path")
        if not file_path:
            raise ValueError("No file_path returned from Telegram getFile")

        # Step 2: Download raw binary
        download_url = f"{TELEGRAM_FILE_BASE}/{file_path}"
        file_res = await client.get(download_url)
        file_res.raise_for_status()

        ext = os.path.splitext(file_path)[1] or ".jpg"
        filename = f"telegram_{uuid.uuid4().hex[:10]}{ext}"
        rel_path, orig_name, file_hash = save_raw_bytes(content=file_res.content, orig_filename=filename, subfolder="complaints")
        logger.info(f"Downloaded Telegram media {file_id} -> {rel_path} (hash: {file_hash[:8]})")
        return rel_path, orig_name, file_hash


async def send_telegram_message(
    chat_id: str | int,
    text: str,
    reply_to_message_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Sends a message to a Telegram chat with automatic fallback to plain text if Markdown parsing fails.
    """
    url = f"{TELEGRAM_API_BASE}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown",
    }
    if reply_to_message_id:
        payload["reply_to_message_id"] = reply_to_message_id

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            res = await client.post(url, json=payload)
            res_data = res.json()
            if not res_data.get("ok"):
                # Retry without Markdown if parse error
                payload.pop("parse_mode", None)
                res = await client.post(url, json=payload)
                res_data = res.json()
            if res_data.get("ok"):
                logger.info(f"Sent Telegram message to chat {chat_id}")
            else:
                logger.error(f"Telegram sendMessage failed for chat {chat_id}: {res_data}")
            return res_data
        except Exception as e:
            logger.error(f"Failed to send Telegram message to {chat_id}: {e}")
            return {"ok": False, "error": str(e)}


async def get_telegram_bot_info() -> Dict[str, Any]:
    """
    Fetches Telegram Bot details using getMe endpoint.
    """
    url = f"{TELEGRAM_API_BASE}/getMe"
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.get(url)
            return res.json()
        except Exception as e:
            logger.error(f"Failed to fetch Telegram bot info: {e}")
            return {"ok": False, "error": str(e)}


async def set_telegram_webhook(webhook_url: str) -> Dict[str, Any]:
    """
    Registers the Webhook URL with Telegram API.
    """
    url = f"{TELEGRAM_API_BASE}/setWebhook"
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            res = await client.post(url, data={"url": webhook_url, "secret_token": settings.TELEGRAM_WEBHOOK_SECRET})
            return res.json()
        except Exception as e:
            logger.error(f"Failed to set Telegram webhook: {e}")
            return {"ok": False, "error": str(e)}
