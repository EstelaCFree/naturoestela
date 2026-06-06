import contextlib

from src.domain.entities.contact_submission import ContactSubmission
from src.domain.repositories.contact_repository import ContactRepository
from src.infrastructure.email.email_service import IEmailService


class SubmitContact:
    def __init__(
        self,
        repository: ContactRepository,
        email_service: IEmailService | None = None,
    ) -> None:
        self._repository = repository
        self._email_service = email_service

    async def execute(
        self,
        name: str,
        email: str,
        subject: str,
        message: str,
    ) -> ContactSubmission:
        submission = ContactSubmission(name=name, email=email, subject=subject, message=message)
        saved = await self._repository.save(submission)
        if self._email_service is not None:
            with contextlib.suppress(Exception):
                self._email_service.send_contact_notification(saved)
        return saved
