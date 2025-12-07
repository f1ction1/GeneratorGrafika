import logging
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

logger = logging.getLogger(__name__)

_ENV_LOADED = False

def _load_env_file() -> None:
    global _ENV_LOADED
    if _ENV_LOADED:
        return
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if env_path.exists():
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    else:
        logger.debug("No .env file found at %s", env_path)
    _ENV_LOADED = True

_load_env_file()

SMTP_HOST = os.getenv("ZOHO_SMTP_HOST", "smtp.zoho.eu") or "smtp.zoho.eu"
SMTP_PORT = int(os.getenv("ZOHO_SMTP_PORT", "587"))
SMTP_USER = os.getenv("ZOHO_SMTP_USER") or ""
SMTP_PASSWORD = os.getenv("ZOHO_SMTP_PASSWORD") or ""
FROM_EMAIL = os.getenv("ZOHO_FROM_EMAIL", SMTP_USER) or SMTP_USER
FROM_NAME = os.getenv("ZOHO_FROM_NAME", "Schedule Generator") or "Schedule Generator"
PASSWORD_RESET_URL = os.getenv("PASSWORD_RESET_URL", "http://localhost:3000/reset-password") or "http://localhost:3000/reset-password"

def _is_configured() -> bool:
    return all([SMTP_USER, SMTP_PASSWORD, FROM_EMAIL])

def send_registration_email(recipient_email: str, recipient_name: str | None = None) -> None:
    if not recipient_email:
        logger.warning("Recipient email missing, skipping registration notification.")
        return
    if not _is_configured():
        logger.warning("Zoho SMTP not configured, skip sending registration email.")
        return

    friendly_name = recipient_name or recipient_email.split("@")[0]
    message = EmailMessage()
    message["Subject"] = "Witamy w Generatorze Grafików"
    message["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    message["To"] = recipient_email
    message.set_content(
        (
            f"Cześć {friendly_name},\n\n"
            "Twoje konto zostało utworzone. Możesz teraz zalogować się i zacząć budować harmonogramy.\n\n"
            "Pozdrawiamy,\nZespół GeneratorGrafika"
        )
    )

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)
    except Exception:
        logger.exception("Failed to send registration email via Zoho SMTP.")

def _build_reset_link(token: str) -> str:
    base = PASSWORD_RESET_URL
    separator = "&" if "?" in base else "?"
    return f"{base}{separator}token={token}"

def send_password_reset_email(recipient_email: str, token: str, recipient_name: str | None = None) -> None:
    if not recipient_email or not token:
        logger.warning("Missing recipient or token, skipping password reset email.")
        return
    if not _is_configured():
        logger.warning("Zoho SMTP not configured, skip sending password reset email.")
        return
    friendly_name = recipient_name or recipient_email.split("@")[0]
    reset_link = _build_reset_link(token)
    message = EmailMessage()
    message["Subject"] = "Resetowanie hasła w Generatorze Grafików"
    message["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
    message["To"] = recipient_email
    message.set_content(
        (
            f"Cześć {friendly_name},\n\n"
            "Otrzymaliśmy prośbę o zresetowanie hasła. Kliknij poniższy link, aby ustawić nowe hasło:\n"
            f"{reset_link}\n\n"
            "Jeżeli to nie Ty wysłałeś prośbę, zignoruj tę wiadomość.\n\n"
            "Pozdrawiamy,\nZespół GeneratorGrafika"
        )
    )
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)
    except Exception:
        logger.exception("Failed to send password reset email via Zoho SMTP.")
