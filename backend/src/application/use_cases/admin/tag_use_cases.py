from uuid import UUID

from src.application.use_cases.admin.utils import slugify
from src.domain.entities.tag import Tag
from src.domain.exceptions import NotFoundError, SlugConflictError
from src.domain.repositories.tag_repository import TagRepository


class CreateTag:
    def __init__(self, repo: TagRepository) -> None:
        self._repo = repo

    async def execute(self, name: str, slug: str | None = None) -> Tag:
        existing = await self._repo.find_by_name(name)
        if existing:
            raise SlugConflictError(existing.slug)
        computed_slug = slug or slugify(name)
        if await self._repo.find_by_slug(computed_slug):
            raise SlugConflictError(computed_slug)
        return await self._repo.save(Tag(name=name, slug=computed_slug))


class UpdateTag:
    def __init__(self, repo: TagRepository) -> None:
        self._repo = repo

    async def execute(self, tag_id: UUID, name: str, slug: str | None = None) -> Tag:
        tag = await self._repo.find_by_id(tag_id)
        if not tag:
            raise NotFoundError("Tag", str(tag_id))
        duplicate = await self._repo.find_by_name(name)
        if duplicate and duplicate.id != tag_id:
            raise SlugConflictError(duplicate.slug)
        tag.name = name
        tag.slug = slug or slugify(name)
        return await self._repo.save(tag)


class DeleteTag:
    def __init__(self, repo: TagRepository) -> None:
        self._repo = repo

    async def execute(self, tag_id: UUID) -> None:
        tag = await self._repo.find_by_id(tag_id)
        if not tag:
            raise NotFoundError("Tag", str(tag_id))
        await self._repo.delete(tag_id)


class ListTags:
    def __init__(self, repo: TagRepository) -> None:
        self._repo = repo

    async def execute(self, published_only: bool = False) -> list[Tag]:
        return await self._repo.find_all_with_post_count(published_only=published_only)
