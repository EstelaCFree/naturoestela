from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.tag_use_cases import CreateTag, DeleteTag, ListTags, UpdateTag
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_tag_repository import SQLAlchemyTagRepository
from src.presentation.dependencies.auth import CallerIdentity, get_admin_caller
from src.presentation.schemas.admin.tag_schema import (
    TagCreateRequest,
    TagListResponse,
    TagResponse,
    TagUpdateRequest,
)

router = APIRouter(prefix="/admin/tags", tags=["admin-tags"])


def _repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyTagRepository:
    return SQLAlchemyTagRepository(session)


@router.post("/", response_model=TagResponse, status_code=201)
async def create_tag(
    body: TagCreateRequest,
    repo: SQLAlchemyTagRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> TagResponse:
    tag = await CreateTag(repo).execute(body.name, body.slug)
    return TagResponse(**tag.__dict__)


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: UUID,
    body: TagUpdateRequest,
    repo: SQLAlchemyTagRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> TagResponse:
    tag = await UpdateTag(repo).execute(tag_id, body.name, body.slug)
    return TagResponse(**tag.__dict__)


@router.delete("/{tag_id}", status_code=204)
async def delete_tag(
    tag_id: UUID,
    repo: SQLAlchemyTagRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> None:
    await DeleteTag(repo).execute(tag_id)


@router.get("/", response_model=TagListResponse)
async def list_tags(
    repo: SQLAlchemyTagRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> TagListResponse:
    tags = await ListTags(repo).execute()
    return TagListResponse(data=[TagResponse(**t.__dict__) for t in tags])
