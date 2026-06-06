from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.submit_contact import SubmitContact
from src.config import settings
from src.infrastructure.database.session import get_session
from src.infrastructure.email.resend_email_service import ResendEmailService
from src.infrastructure.repositories.sqlalchemy_contact_repository import (
    SQLAlchemyContactRepository,
)
from src.presentation.schemas.contact_schema import ContactRequest, ContactResponse

router = APIRouter(prefix="/contact", tags=["contact"])


def _get_use_case(session: AsyncSession = Depends(get_session)) -> SubmitContact:
    return SubmitContact(
        repository=SQLAlchemyContactRepository(session),
        email_service=ResendEmailService(settings),
    )


@router.post("/", status_code=201, response_model=ContactResponse)
async def submit_contact(
    body: ContactRequest,
    use_case: SubmitContact = Depends(_get_use_case),
) -> ContactResponse:
    await use_case.execute(
        name=body.name,
        email=str(body.email),
        subject=body.subject,
        message=body.message,
    )
    return ContactResponse(data={"message": "Your message has been received"})
