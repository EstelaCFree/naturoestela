from uuid import UUID

from src.domain.entities.image import Image
from src.domain.exceptions import ImageInUseError, NotFoundError
from src.domain.repositories.image_repository import ImageListResult, ImageRepository
from src.infrastructure.storage.image_storage import (
    IImageStorageService,
    ProcessedImage,
    process_upload,
)


class UploadImage:
    def __init__(self, repo: ImageRepository, storage: IImageStorageService) -> None:
        self._repo = repo
        self._storage = storage

    async def execute(
        self,
        file_bytes: bytes,
        content_type: str,
        alt_text: str | None = None,
        subtitle: str | None = None,
    ) -> Image:
        processed: ProcessedImage = process_upload(file_bytes, content_type)
        original_url, thumbnail_url = await self._storage.save(processed)
        image = Image(
            original_url=original_url,
            thumbnail_url=thumbnail_url,
            filename=processed.base_filename,
            alt_text=alt_text,
            subtitle=subtitle,
            width=processed.width,
            height=processed.height,
        )
        return await self._repo.save(image)


class UpdateImageMetadata:
    def __init__(self, repo: ImageRepository) -> None:
        self._repo = repo

    async def execute(self, image_id: UUID, alt_text: str | None, subtitle: str | None) -> Image:
        return await self._repo.update_metadata(image_id, alt_text, subtitle)


class DeleteImage:
    def __init__(self, repo: ImageRepository, storage: IImageStorageService) -> None:
        self._repo = repo
        self._storage = storage

    async def execute(self, image_id: UUID) -> None:
        image = await self._repo.find_by_id(image_id)
        if not image:
            raise NotFoundError("Image", str(image_id))
        if await self._repo.is_in_use(image_id):
            raise ImageInUseError()
        await self._storage.delete(image.filename)
        await self._repo.delete(image_id)


class ListImages:
    def __init__(self, repo: ImageRepository) -> None:
        self._repo = repo

    async def execute(self, page: int = 1, page_size: int = 20) -> ImageListResult:
        return await self._repo.find_all_paginated(page, page_size)
