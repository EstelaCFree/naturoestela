from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.admin.tag_use_cases import CreateTag, DeleteTag, ListTags, UpdateTag
from src.domain.entities.tag import Tag
from src.domain.exceptions import NotFoundError, SlugConflictError


def make_tag(**kwargs) -> Tag:
    return Tag(
        id=kwargs.get("id", uuid4()),
        name=kwargs.get("name", "Sistema Nervioso"),
        slug=kwargs.get("slug", "sistema-nervioso"),
    )


@pytest.fixture
def repo():
    r = AsyncMock()
    r.find_by_name.return_value = None
    r.find_by_slug.return_value = None
    return r


class TestCreateTag:
    async def test_creates_tag_with_auto_slug(self, repo):
        tag = make_tag(name="Sistema Nervioso", slug="sistema-nervioso")
        repo.save.return_value = tag

        result = await CreateTag(repo).execute("Sistema Nervioso")

        assert result.slug == "sistema-nervioso"

    async def test_raises_conflict_when_name_exists(self, repo):
        repo.find_by_name.return_value = make_tag()

        with pytest.raises(SlugConflictError):
            await CreateTag(repo).execute("Sistema Nervioso")

    async def test_accepts_custom_slug(self, repo):
        tag = make_tag(slug="custom")
        repo.save.return_value = tag

        result = await CreateTag(repo).execute("Name", slug="custom")

        assert result.slug == "custom"


class TestUpdateTag:
    async def test_updates_name(self, repo):
        existing = make_tag()
        updated = make_tag(name="Nervios", slug="nervios")
        repo.find_by_id.return_value = existing
        repo.save.return_value = updated

        result = await UpdateTag(repo).execute(existing.id, "Nervios")

        assert result.name == "Nervios"

    async def test_raises_not_found(self, repo):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await UpdateTag(repo).execute(uuid4(), "Name")

    async def test_raises_conflict_when_duplicate_name(self, repo):
        existing = make_tag(id=uuid4())
        other = make_tag(id=uuid4())
        repo.find_by_id.return_value = existing
        repo.find_by_name.return_value = other

        with pytest.raises(SlugConflictError):
            await UpdateTag(repo).execute(existing.id, "Other Name")


class TestDeleteTag:
    async def test_deletes_tag_silently(self, repo):
        tag = make_tag()
        repo.find_by_id.return_value = tag

        await DeleteTag(repo).execute(tag.id)

        repo.delete.assert_called_once_with(tag.id)

    async def test_raises_not_found(self, repo):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await DeleteTag(repo).execute(uuid4())


class TestListTags:
    async def test_returns_tags(self, repo):
        repo.find_all_with_post_count.return_value = [make_tag(), make_tag()]

        result = await ListTags(repo).execute()

        assert len(result) == 2

    async def test_passes_published_only_flag(self, repo):
        repo.find_all_with_post_count.return_value = []

        await ListTags(repo).execute(published_only=True)

        repo.find_all_with_post_count.assert_called_once_with(published_only=True)
