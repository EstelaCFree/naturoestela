from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.category import Category


class CategoryRepository(ABC):
    @abstractmethod
    async def find_by_id(self, category_id: UUID) -> Category | None: ...

    @abstractmethod
    async def find_by_name(self, name: str) -> Category | None: ...

    @abstractmethod
    async def find_by_slug(self, slug: str) -> Category | None: ...

    @abstractmethod
    async def find_all_with_post_count(self, published_only: bool = False) -> list[Category]: ...

    @abstractmethod
    async def save(self, category: Category) -> Category: ...

    @abstractmethod
    async def delete(self, category_id: UUID) -> None: ...

    @abstractmethod
    async def count_posts(self, category_id: UUID) -> int: ...
