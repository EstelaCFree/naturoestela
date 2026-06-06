from uuid import UUID

from src.application.use_cases.admin.utils import slugify
from src.domain.entities.category import Category
from src.domain.exceptions import CategoryInUseError, NotFoundError, SlugConflictError
from src.domain.repositories.category_repository import CategoryRepository


class CreateCategory:
    def __init__(self, repo: CategoryRepository) -> None:
        self._repo = repo

    async def execute(self, name: str, slug: str | None = None) -> Category:
        existing = await self._repo.find_by_name(name)
        if existing:
            raise SlugConflictError(existing.slug)
        computed_slug = slug or slugify(name)
        if await self._repo.find_by_slug(computed_slug):
            raise SlugConflictError(computed_slug)
        return await self._repo.save(Category(name=name, slug=computed_slug))


class UpdateCategory:
    def __init__(self, repo: CategoryRepository) -> None:
        self._repo = repo

    async def execute(self, category_id: UUID, name: str, slug: str | None = None) -> Category:
        category = await self._repo.find_by_id(category_id)
        if not category:
            raise NotFoundError("Category", str(category_id))
        duplicate = await self._repo.find_by_name(name)
        if duplicate and duplicate.id != category_id:
            raise SlugConflictError(duplicate.slug)
        category.name = name
        category.slug = slug or slugify(name)
        return await self._repo.save(category)


class DeleteCategory:
    def __init__(self, repo: CategoryRepository) -> None:
        self._repo = repo

    async def execute(self, category_id: UUID) -> None:
        category = await self._repo.find_by_id(category_id)
        if not category:
            raise NotFoundError("Category", str(category_id))
        count = await self._repo.count_posts(category_id)
        if count > 0:
            raise CategoryInUseError()
        await self._repo.delete(category_id)


class ListCategories:
    def __init__(self, repo: CategoryRepository) -> None:
        self._repo = repo

    async def execute(self, published_only: bool = False) -> list[Category]:
        return await self._repo.find_all_with_post_count(published_only=published_only)
