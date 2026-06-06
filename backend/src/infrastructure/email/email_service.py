from abc import ABC, abstractmethod

from src.domain.entities.contact_submission import ContactSubmission


class IEmailService(ABC):
    @abstractmethod
    def send_contact_notification(self, submission: ContactSubmission) -> None: ...
