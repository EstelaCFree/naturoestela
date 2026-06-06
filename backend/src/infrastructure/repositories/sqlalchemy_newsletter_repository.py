from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.newsletter_subscriber import NewsletterSubscriber
from src.domain.repositories.newsletter_repository import NewsletterRepository
from src.infrastructure.database.models import NewsletterSubscriberModel


class SQLAlchemyNewsletterRepository(NewsletterRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_email(self, email: str) -> NewsletterSubscriber | None:
        result = await self._session.execute(
            select(NewsletterSubscriberModel).where(NewsletterSubscriberModel.email == email)
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def save(self, subscriber: NewsletterSubscriber) -> NewsletterSubscriber:
        model = NewsletterSubscriberModel.from_entity(subscriber)
        self._session.add(model)
        await self._session.flush()
        return model.to_entity()
