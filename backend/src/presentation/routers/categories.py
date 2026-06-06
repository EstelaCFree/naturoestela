from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.category_use_cases import ListCategories
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_category_repository import (
    SQLAlchemyCategoryRepository,
)
from src.presentation.schemas.admin.category_schema import CategoryListResponse, CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=CategoryListResponse)
async def list_categories(session: AsyncSession = Depends(get_session)) -> CategoryListResponse:
    categories = await ListCategories(SQLAlchemyCategoryRepository(session)).execute(
        published_only=True
    )
    return CategoryListResponse(data=[CategoryResponse(**c.__dict__) for c in categories])
