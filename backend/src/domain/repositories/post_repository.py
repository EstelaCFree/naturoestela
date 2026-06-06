from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Literal
from uuid import UUID

from src.domain.entities.image import PostBodyImage
from src.domain.entities.post import Post


@dataclass
class PostListResult:
    items: list[Post]
    total: int
    page: int
    page_size: int


class PostRepository(ABC):
    @abstractmethod
    async def list_published(
        self,
        page: int = 1,
        page_size: int = 10,
        category_slug: str | None = None,
        tag_slug: str | None = None,
        preview: bool = False,
    ) -> PostListResult: ...

    @abstractmethod
    async def find_by_slug(self, slug: str) -> Post | None: ...


class PostAdminRepository(PostRepository):
    @abstractmethod
    async def find_by_id(self, post_id: UUID) -> Post | None: ...

    @abstractmethod
    async def find_by_slug_any_status(self, slug: str) -> Post | None: ...

    @abstractmethod
    async def list_admin(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Literal["draft", "scheduled", "published"] | None = None,
        category_id: UUID | None = None,
    ) -> PostListResult: ...

    @abstractmethod
    async def save(self, post: Post) -> Post: ...

    @abstractmethod
    async def publish(self, post_id: UUID, published_at: datetime) -> Post: ...

    @abstractmethod
    async def unpublish(self, post_id: UUID) -> Post: ...

    @abstractmethod
    async def set_tags(self, post_id: UUID, tag_ids: list[UUID]) -> None: ...

    @abstractmethod
    async def set_body_images(self, post_id: UUID, body_images: list[PostBodyImage]) -> None: ...

    @abstractmethod
    async def delete(self, post_id: UUID) -> None: ...
