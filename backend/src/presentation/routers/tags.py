from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.tag_use_cases import ListTags
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_tag_repository import SQLAlchemyTagRepository
from src.presentation.schemas.admin.tag_schema import TagListResponse, TagResponse

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("/", response_model=TagListResponse)
async def list_tags(session: AsyncSession = Depends(get_session)) -> TagListResponse:
    tags = await ListTags(SQLAlchemyTagRepository(session)).execute(published_only=True)
    return TagListResponse(data=[TagResponse(**t.__dict__) for t in tags])
