from src.domain.entities.newsletter_subscriber import NewsletterSubscriber
from src.domain.repositories.newsletter_repository import NewsletterRepository


class SubscribeNewsletter:
    def __init__(self, repository: NewsletterRepository) -> None:
        self._repository = repository

    async def execute(self, email: str) -> tuple[NewsletterSubscriber, bool]:
        """Returns (subscriber, created). created=False when already subscribed."""
        existing = await self._repository.find_by_email(email)
        if existing is not None:
            return existing, False
        subscriber = NewsletterSubscriber(email=email)
        saved = await self._repository.save(subscriber)
        return saved, True
