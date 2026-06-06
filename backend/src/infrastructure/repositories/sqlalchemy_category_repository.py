from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.category import Category
from src.domain.repositories.category_repository import CategoryRepository
from src.infrastructure.database.models import CategoryModel, PostModel


class SQLAlchemyCategoryRepository(CategoryRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_id(self, category_id: UUID) -> Category | None:
        result = await self._session.execute(
            select(CategoryModel).where(CategoryModel.id == category_id)
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_by_name(self, name: str) -> Category | None:
        result = await self._session.execute(
            select(CategoryModel).where(func.lower(CategoryModel.name) == name.lower())
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_by_slug(self, slug: str) -> Category | None:
        result = await self._session.execute(
            select(CategoryModel).where(CategoryModel.slug == slug)
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_all_with_post_count(self, published_only: bool = False) -> list[Category]:
        join_cond = PostModel.category_id == CategoryModel.id
        if published_only:
            now = datetime.now(tz=UTC)
            join_cond = (
                join_cond & PostModel.published_at.isnot(None) & (PostModel.published_at <= now)
            )
        result = await self._session.execute(
            select(CategoryModel, func.count(PostModel.id).label("post_count"))
            .outerjoin(PostModel, join_cond)
            .group_by(CategoryModel.id)
            .order_by(CategoryModel.name.asc())
        )
        return [row[0].to_entity(post_count=row[1]) for row in result.all()]

    async def save(self, category: Category) -> Category:
        result = await self._session.execute(
            select(CategoryModel).where(CategoryModel.id == category.id)
        )
        model = result.scalar_one_or_none()
        if model:
            model.name = category.name
            model.slug = category.slug
        else:
            model = CategoryModel.from_entity(category)
            self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def delete(self, category_id: UUID) -> None:
        result = await self._session.execute(
            select(CategoryModel).where(CategoryModel.id == category_id)
        )
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()

    async def count_posts(self, category_id: UUID) -> int:
        result = await self._session.execute(
            select(func.count(PostModel.id)).where(PostModel.category_id == category_id)
        )
        return result.scalar_one()
