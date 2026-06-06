from abc import ABC, abstractmethod
from dataclasses import dataclass
from uuid import UUID

from src.domain.entities.image import Image


@dataclass
class ImageListResult:
    items: list[Image]
    total: int
    page: int
    page_size: int


class ImageRepository(ABC):
    @abstractmethod
    async def find_by_id(self, image_id: UUID) -> Image | None: ...

    @abstractmethod
    async def find_all_paginated(self, page: int, page_size: int) -> ImageListResult: ...

    @abstractmethod
    async def save(self, image: Image) -> Image: ...

    @abstractmethod
    async def update_metadata(
        self, image_id: UUID, alt_text: str | None, subtitle: str | None
    ) -> Image: ...

    @abstractmethod
    async def delete(self, image_id: UUID) -> None: ...

    @abstractmethod
    async def is_in_use(self, image_id: UUID) -> bool: ...
