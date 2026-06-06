from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.domain.entities.post import Post
from src.domain.repositories.post_repository import PostListResult, PostRepository
from src.infrastructure.database.models import (
    CategoryModel,
    PostBodyImageModel,
    PostModel,
    PostTagModel,
    TagModel,
)


def _eager_options() -> list:  # type: ignore[type-arg]
    return [
        selectinload(PostModel.category_rel),
        selectinload(PostModel.featured_image_rel),
        selectinload(PostModel.post_tags).selectinload(PostTagModel.tag),
        selectinload(PostModel.body_image_assocs).selectinload(PostBodyImageModel.image),
    ]


class SQLAlchemyPostRepository(PostRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_published(
        self,
        page: int = 1,
        page_size: int = 10,
        category_slug: str | None = None,
        tag_slug: str | None = None,
        preview: bool = False,
    ) -> PostListResult:
        now = datetime.now(tz=UTC)
        base = (
            select(PostModel)
            .options(*_eager_options())
            .where(PostModel.published_at.isnot(None), PostModel.published_at <= now)
        )

        if category_slug:
            base = base.join(CategoryModel, PostModel.category_id == CategoryModel.id).where(
                CategoryModel.slug == category_slug
            )

        if tag_slug:
            base = (
                base.join(PostTagModel, PostModel.id == PostTagModel.post_id)
                .join(TagModel, PostTagModel.tag_id == TagModel.id)
                .where(TagModel.slug == tag_slug)
            )

        base = base.order_by(PostModel.published_at.desc())

        if preview:
            result = await self._session.execute(base.limit(3))
            items = [m.to_entity() for m in result.scalars().unique().all()]
            return PostListResult(items=items, total=len(items), page=1, page_size=3)

        count_query = select(func.count()).select_from(base.subquery())
        total_result = await self._session.execute(count_query)
        total = total_result.scalar_one()

        offset = (page - 1) * page_size
        result = await self._session.execute(base.offset(offset).limit(page_size))
        items = [m.to_entity() for m in result.scalars().unique().all()]
        return PostListResult(items=items, total=total, page=page, page_size=page_size)

    async def find_by_slug(self, slug: str) -> Post | None:
        now = datetime.now(tz=UTC)
        result = await self._session.execute(
            select(PostModel)
            .options(*_eager_options())
            .where(
                PostModel.slug == slug,
                PostModel.published_at.isnot(None),
                PostModel.published_at <= now,
            )
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None
