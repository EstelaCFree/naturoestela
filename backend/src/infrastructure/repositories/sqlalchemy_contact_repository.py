from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.contact_submission import ContactSubmission
from src.domain.repositories.contact_repository import ContactRepository
from src.infrastructure.database.models import ContactSubmissionModel


class SQLAlchemyContactRepository(ContactRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, submission: ContactSubmission) -> ContactSubmission:
        model = ContactSubmissionModel.from_entity(submission)
        self._session.add(model)
        await self._session.flush()
        return model.to_entity()
