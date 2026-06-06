from datetime import UTC, datetime
from typing import Literal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.domain.entities.image import PostBodyImage
from src.domain.entities.post import Post
from src.domain.exceptions import NotFoundError
from src.domain.repositories.post_repository import PostAdminRepository, PostListResult
from src.infrastructure.database.models import (
    PostBodyImageModel,
    PostModel,
    PostTagModel,
)


def _options() -> list:  # type: ignore[type-arg]
    return [
        selectinload(PostModel.category_rel),
        selectinload(PostModel.featured_image_rel),
        selectinload(PostModel.post_tags).selectinload(PostTagModel.tag),
        selectinload(PostModel.body_image_assocs).selectinload(PostBodyImageModel.image),
    ]


class SQLAlchemyPostAdminRepository(PostAdminRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    # ── Public interface (required by PostRepository ABC) ──────────────────

    async def list_published(
        self,
        page: int = 1,
        page_size: int = 10,
        category_slug: str | None = None,
        tag_slug: str | None = None,
        preview: bool = False,
    ) -> PostListResult:
        from src.infrastructure.repositories.sqlalchemy_post_repository import (
            SQLAlchemyPostRepository,
        )

        repo = SQLAlchemyPostRepository(self._session)
        return await repo.list_published(
            page=page,
            page_size=page_size,
            category_slug=category_slug,
            tag_slug=tag_slug,
            preview=preview,
        )

    async def find_by_slug(self, slug: str) -> Post | None:
        from src.infrastructure.repositories.sqlalchemy_post_repository import (
            SQLAlchemyPostRepository,
        )

        repo = SQLAlchemyPostRepository(self._session)
        return await repo.find_by_slug(slug)

    # ── Admin interface ─────────────────────────────────────────────────────

    async def find_by_id(self, post_id: UUID) -> Post | None:
        result = await self._session.execute(
            select(PostModel).options(*_options()).where(PostModel.id == post_id)
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_by_slug_any_status(self, slug: str) -> Post | None:
        result = await self._session.execute(
            select(PostModel).options(*_options()).where(PostModel.slug == slug)
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def list_admin(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Literal["draft", "scheduled", "published"] | None = None,
        category_id: UUID | None = None,
    ) -> PostListResult:
        now = datetime.now(tz=UTC)
        base = select(PostModel).options(*_options())

        if status == "draft":
            base = base.where(PostModel.published_at.is_(None))
        elif status == "scheduled":
            base = base.where(PostModel.published_at > now)
        elif status == "published":
            base = base.where(PostModel.published_at <= now)

        if category_id:
            base = base.where(PostModel.category_id == category_id)

        base = base.order_by(PostModel.updated_at.desc())

        count_result = await self._session.execute(
            select(func.count()).select_from(base.subquery())
        )
        total = count_result.scalar_one()

        offset = (page - 1) * page_size
        result = await self._session.execute(base.offset(offset).limit(page_size))
        items = [m.to_entity() for m in result.scalars().unique().all()]
        return PostListResult(items=items, total=total, page=page, page_size=page_size)

    async def save(self, post: Post) -> Post:
        result = await self._session.execute(
            select(PostModel).options(*_options()).where(PostModel.id == post.id)
        )
        model = result.scalar_one_or_none()
        if model:
            model.title = post.title
            model.slug = post.slug
            model.excerpt = post.excerpt
            model.content = post.content
            model.category_id = post.category_id
            model.featured_image_id = post.featured_image_id
            model.seo_title = post.seo_title
            model.seo_description = post.seo_description
            model.seo_keywords = post.seo_keywords
            model.published_at = post.published_at
        else:
            model = PostModel.from_entity(post)
            self._session.add(model)
        await self._session.flush()
        await self._session.refresh(
            model, ["category_rel", "featured_image_rel", "post_tags", "body_image_assocs"]
        )
        return model.to_entity()

    async def publish(self, post_id: UUID, published_at: datetime) -> Post:
        result = await self._session.execute(
            select(PostModel).options(*_options()).where(PostModel.id == post_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            raise NotFoundError("Post", str(post_id))
        model.published_at = published_at
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def unpublish(self, post_id: UUID) -> Post:
        result = await self._session.execute(
            select(PostModel).options(*_options()).where(PostModel.id == post_id)
        )
        model = result.scalar_one_or_none()
        if not model:
            raise NotFoundError("Post", str(post_id))
        model.published_at = None
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def set_tags(self, post_id: UUID, tag_ids: list[UUID]) -> None:
        await self._session.execute(
            PostTagModel.__table__.delete().where(PostTagModel.post_id == post_id)  # type: ignore[attr-defined]
        )
        for tag_id in tag_ids:
            self._session.add(PostTagModel(post_id=post_id, tag_id=tag_id))
        await self._session.flush()

    async def set_body_images(self, post_id: UUID, body_images: list[PostBodyImage]) -> None:
        await self._session.execute(
            PostBodyImageModel.__table__.delete().where(PostBodyImageModel.post_id == post_id)  # type: ignore[attr-defined]
        )
        for bi in body_images:
            self._session.add(
                PostBodyImageModel(
                    post_id=post_id,
                    image_id=bi.image_id,
                    sort_order=bi.sort_order,
                    alignment=bi.alignment,
                    size=bi.size,
                )
            )
        await self._session.flush()

    async def delete(self, post_id: UUID) -> None:
        result = await self._session.execute(select(PostModel).where(PostModel.id == post_id))
        model = result.scalar_one_or_none()
        if not model:
            raise NotFoundError("Post", str(post_id))
        await self._session.delete(model)
        await self._session.flush()
