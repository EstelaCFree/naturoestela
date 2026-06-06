import logging

import resend

from src.config import Settings
from src.domain.entities.contact_submission import ContactSubmission
from src.infrastructure.email.email_service import IEmailService

logger = logging.getLogger(__name__)


class ResendEmailService(IEmailService):
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def send_contact_notification(self, submission: ContactSubmission) -> None:
        if not self._settings.resend_enabled:
            logger.debug("Email sending disabled (RESEND_ENABLED=false). Skipping notification.")
            return

        try:
            resend.api_key = self._settings.resend_api_key
            resend.Emails.send(
                {
                    "from": f"{self._settings.from_name} <{self._settings.from_email}>",
                    "to": [self._settings.notification_email],
                    "reply_to": submission.email,
                    "subject": f"[Contacto] {submission.subject}",
                    "html": self._build_html(submission),
                }
            )
        except Exception:
            logger.error(
                "Failed to send email notification for submission %s",
                submission.id,
                exc_info=True,
            )

    def _build_html(self, submission: ContactSubmission) -> str:
        submitted_at = submission.submitted_at.strftime("%d/%m/%Y %H:%M UTC")
        return f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #5a7a4a; border-bottom: 2px solid #5a7a4a; padding-bottom: 8px;">
    Nuevo mensaje de contacto
  </h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr>
      <td style="padding: 8px; font-weight: bold; width: 120px; vertical-align: top;">Nombre:</td>
      <td style="padding: 8px;">{submission.name}</td>
    </tr>
    <tr style="background-color: #f5f5f5;">
      <td style="padding: 8px; font-weight: bold; vertical-align: top;">Email:</td>
      <td style="padding: 8px;">
        <a href="mailto:{submission.email}" style="color: #5a7a4a;">{submission.email}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; vertical-align: top;">Asunto:</td>
      <td style="padding: 8px;">{submission.subject}</td>
    </tr>
    <tr style="background-color: #f5f5f5;">
      <td style="padding: 8px; font-weight: bold; vertical-align: top;">Mensaje:</td>
      <td style="padding: 8px; white-space: pre-wrap;">{submission.message}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; vertical-align: top;">Recibido:</td>
      <td style="padding: 8px; color: #666; font-size: 0.9em;">{submitted_at}</td>
    </tr>
  </table>
  <p style="margin-top: 24px; font-size: 0.85em; color: #888;">
    Puedes responder directamente a este email para contactar a {submission.name}.
  </p>
</body>
</html>"""
