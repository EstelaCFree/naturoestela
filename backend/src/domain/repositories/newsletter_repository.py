from abc import ABC, abstractmethod

from src.domain.entities.newsletter_subscriber import NewsletterSubscriber


class NewsletterRepository(ABC):
    @abstractmethod
    async def find_by_email(self, email: str) -> NewsletterSubscriber | None: ...

    @abstractmethod
    async def save(self, subscriber: NewsletterSubscriber) -> NewsletterSubscriber: ...
