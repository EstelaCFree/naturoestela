from unittest.mock import MagicMock, patch
from uuid import uuid4

import pytest

from src.config import Settings
from src.domain.entities.contact_submission import ContactSubmission
from src.infrastructure.email.resend_email_service import ResendEmailService


@pytest.fixture
def submission() -> ContactSubmission:
    return ContactSubmission(
        id=uuid4(),
        name="Ana García",
        email="ana@example.com",
        subject="Consulta",
        message="Hola, me gustaría saber más.",
    )


def test_send_disabled_does_not_call_resend(submission: ContactSubmission) -> None:
    settings = MagicMock(spec=Settings)
    settings.resend_enabled = False
    service = ResendEmailService(settings)

    with patch("src.infrastructure.email.resend_email_service.resend") as mock_resend:
        service.send_contact_notification(submission)
        mock_resend.Emails.send.assert_not_called()


def test_send_disabled_does_not_raise(submission: ContactSubmission) -> None:
    settings = MagicMock(spec=Settings)
    settings.resend_enabled = False
    service = ResendEmailService(settings)

    service.send_contact_notification(submission)
