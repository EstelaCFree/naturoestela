from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.subscribe_newsletter import SubscribeNewsletter
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_newsletter_repository import (
    SQLAlchemyNewsletterRepository,
)
from src.presentation.schemas.newsletter_schema import SubscribeRequest, SubscribeResponse

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


def _get_use_case(session: AsyncSession = Depends(get_session)) -> SubscribeNewsletter:
    return SubscribeNewsletter(SQLAlchemyNewsletterRepository(session))


@router.post("/subscribe")
async def subscribe(
    body: SubscribeRequest,
    use_case: SubscribeNewsletter = Depends(_get_use_case),
) -> JSONResponse:
    _subscriber, created = await use_case.execute(body.email)
    if created:
        return JSONResponse(
            status_code=201,
            content=SubscribeResponse(data={"message": "Successfully subscribed"}).model_dump(),
        )
    return JSONResponse(
        status_code=200,
        content=SubscribeResponse(data={"message": "Already subscribed"}).model_dump(),
    )
