from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.entities.image import Image
from src.domain.repositories.image_repository import ImageListResult, ImageRepository
from src.infrastructure.database.models import ImageModel, PostBodyImageModel, PostModel


class SQLAlchemyImageRepository(ImageRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_by_id(self, image_id: UUID) -> Image | None:
        result = await self._session.execute(select(ImageModel).where(ImageModel.id == image_id))
        model = result.scalar_one_or_none()
        return model.to_entity() if model else None

    async def find_all_paginated(self, page: int, page_size: int) -> ImageListResult:
        count_result = await self._session.execute(select(func.count(ImageModel.id)))
        total = count_result.scalar_one()

        offset = (page - 1) * page_size
        result = await self._session.execute(
            select(ImageModel)
            .order_by(ImageModel.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        items = [m.to_entity() for m in result.scalars().all()]
        return ImageListResult(items=items, total=total, page=page, page_size=page_size)

    async def save(self, image: Image) -> Image:
        model = ImageModel.from_entity(image)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def update_metadata(
        self, image_id: UUID, alt_text: str | None, subtitle: str | None
    ) -> Image:
        result = await self._session.execute(select(ImageModel).where(ImageModel.id == image_id))
        model = result.scalar_one_or_none()
        if not model:
            from src.domain.exceptions import NotFoundError

            raise NotFoundError("Image", str(image_id))
        model.alt_text = alt_text
        model.subtitle = subtitle
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def delete(self, image_id: UUID) -> None:
        result = await self._session.execute(select(ImageModel).where(ImageModel.id == image_id))
        model = result.scalar_one_or_none()
        if model:
            await self._session.delete(model)
            await self._session.flush()

    async def is_in_use(self, image_id: UUID) -> bool:
        featured_result = await self._session.execute(
            select(func.count(PostModel.id)).where(PostModel.featured_image_id == image_id)
        )
        if featured_result.scalar_one() > 0:
            return True
        body_result = await self._session.execute(
            select(func.count(PostBodyImageModel.post_id)).where(
                PostBodyImageModel.image_id == image_id
            )
        )
        return body_result.scalar_one() > 0
