from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.category_use_cases import (
    CreateCategory,
    DeleteCategory,
    ListCategories,
    UpdateCategory,
)
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_category_repository import (
    SQLAlchemyCategoryRepository,
)
from src.presentation.dependencies.auth import CallerIdentity, get_admin_caller
from src.presentation.schemas.admin.category_schema import (
    CategoryCreateRequest,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdateRequest,
)

router = APIRouter(prefix="/admin/categories", tags=["admin-categories"])


def _repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyCategoryRepository:
    return SQLAlchemyCategoryRepository(session)


@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    body: CategoryCreateRequest,
    repo: SQLAlchemyCategoryRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> CategoryResponse:
    category = await CreateCategory(repo).execute(body.name, body.slug)
    return CategoryResponse(**category.__dict__)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    body: CategoryUpdateRequest,
    repo: SQLAlchemyCategoryRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> CategoryResponse:
    category = await UpdateCategory(repo).execute(category_id, body.name, body.slug)
    return CategoryResponse(**category.__dict__)


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: UUID,
    repo: SQLAlchemyCategoryRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> None:
    await DeleteCategory(repo).execute(category_id)


@router.get("/", response_model=CategoryListResponse)
async def list_categories(
    repo: SQLAlchemyCategoryRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> CategoryListResponse:
    categories = await ListCategories(repo).execute()
    return CategoryListResponse(data=[CategoryResponse(**c.__dict__) for c in categories])
