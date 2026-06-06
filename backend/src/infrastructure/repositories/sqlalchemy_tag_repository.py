from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.tag import Tag
from src.domain.repositories.tag_repository import TagRepository
from src.infrastructure.database.models import PostModel, PostTagModel, TagModel


class SQLAlchemyTagRepository(TagRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_id(self, tag_id: UUID) -> Tag | None:
        result = await self._session.execute(select(TagModel).where(TagModel.id == tag_id))
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_by_name(self, name: str) -> Tag | None:
        result = await self._session.execute(
            select(TagModel).where(func.lower(TagModel.name) == name.lower())
        )
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_by_slug(self, slug: str) -> Tag | None:
        result = await self._session.execute(select(TagModel).where(TagModel.slug == slug))
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_all_with_post_count(self, published_only: bool = False) -> list[Tag]:
        if published_only:
            now = datetime.now(tz=UTC)
            # Join through post_tags → posts, filter to published only
            result = await self._session.execute(
                select(TagModel, func.count(PostTagModel.post_id).label("post_count"))
                .outerjoin(PostTagModel, PostTagModel.tag_id == TagModel.id)
                .outerjoin(
                    PostModel,
                    (PostModel.id == PostTagModel.post_id)
                    & PostModel.published_at.isnot(None)
                    & (PostModel.published_at <= now),
                )
                .group_by(TagModel.id)
                .order_by(TagModel.name.asc())
            )
        else:
            result = await self._session.execute(
                select(TagModel, func.count(PostTagModel.post_id).label("post_count"))
                .outerjoin(PostTagModel, PostTagModel.tag_id == TagModel.id)
                .group_by(TagModel.id)
                .order_by(TagModel.name.asc())
            )
        return [row[0].to_entity(post_count=row[1]) for row in result.all()]

    async def save(self, tag: Tag) -> Tag:
        result = await self._session.execute(select(TagModel).where(TagModel.id == tag.id))
        model = result.scalar_one_or_none()
        if model:
            model.name = tag.name
            model.slug = tag.slug
        else:
            model = TagModel.from_entity(tag)
            self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def delete(self, tag_id: UUID) -> None:
        result = await self._session.execute(select(TagModel).where(TagModel.id == tag_id))
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()
