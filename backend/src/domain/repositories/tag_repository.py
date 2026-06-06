from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.tag import Tag


class TagRepository(ABC):
    @abstractmethod
    async def find_by_id(self, tag_id: UUID) -> Tag | None: ...

    @abstractmethod
    async def find_by_name(self, name: str) -> Tag | None: ...

    @abstractmethod
    async def find_by_slug(self, slug: str) -> Tag | None: ...

    @abstractmethod
    async def find_all_with_post_count(self, published_only: bool = False) -> list[Tag]: ...

    @abstractmethod
    async def save(self, tag: Tag) -> Tag: ...

    @abstractmethod
    async def delete(self, tag_id: UUID) -> None: ...
