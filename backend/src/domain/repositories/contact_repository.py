from abc import ABC, abstractmethod

from src.domain.entities.contact_submission import ContactSubmission


class ContactRepository(ABC):
    @abstractmethod
    async def save(self, submission: ContactSubmission) -> ContactSubmission: ...
