from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.admin.category_use_cases import (
    CreateCategory,
    DeleteCategory,
    ListCategories,
    UpdateCategory,
)
from src.domain.entities.category import Category
from src.domain.exceptions import CategoryInUseError, NotFoundError, SlugConflictError


def make_category(**kwargs) -> Category:
    return Category(
        id=kwargs.get("id", uuid4()),
        name=kwargs.get("name", "Fitoterapia"),
        slug=kwargs.get("slug", "fitoterapia"),
    )


@pytest.fixture
def repo():
    r = AsyncMock()
    r.find_by_name.return_value = None
    r.find_by_slug.return_value = None
    return r


class TestCreateCategory:
    async def test_creates_category_with_auto_slug(self, repo):
        cat = make_category(name="Salud Hormonal", slug="salud-hormonal")
        repo.save.return_value = cat

        result = await CreateCategory(repo).execute("Salud Hormonal")

        repo.save.assert_called_once()
        assert result.slug == "salud-hormonal"

    async def test_raises_conflict_when_name_exists(self, repo):
        repo.find_by_name.return_value = make_category()

        with pytest.raises(SlugConflictError):
            await CreateCategory(repo).execute("Fitoterapia")

    async def test_raises_conflict_when_slug_taken(self, repo):
        repo.find_by_slug.return_value = make_category()

        with pytest.raises(SlugConflictError):
            await CreateCategory(repo).execute("Otra", slug="fitoterapia")

    async def test_accepts_custom_slug(self, repo):
        cat = make_category(slug="mi-slug")
        repo.save.return_value = cat

        result = await CreateCategory(repo).execute("Nombre", slug="mi-slug")

        assert result.slug == "mi-slug"


class TestUpdateCategory:
    async def test_updates_name_and_slug(self, repo):
        existing = make_category()
        updated = make_category(name="Herbolaria", slug="herbolaria")
        repo.find_by_id.return_value = existing
        repo.save.return_value = updated

        result = await UpdateCategory(repo).execute(existing.id, "Herbolaria")

        repo.save.assert_called_once()
        assert result.name == "Herbolaria"

    async def test_raises_not_found_for_unknown_id(self, repo):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await UpdateCategory(repo).execute(uuid4(), "Name")

    async def test_raises_conflict_when_another_category_has_same_name(self, repo):
        existing = make_category(id=uuid4())
        other = make_category(id=uuid4(), name="Fitoterapia")
        repo.find_by_id.return_value = existing
        repo.find_by_name.return_value = other

        with pytest.raises(SlugConflictError):
            await UpdateCategory(repo).execute(existing.id, "Fitoterapia")


class TestDeleteCategory:
    async def test_deletes_when_no_posts(self, repo):
        cat = make_category()
        repo.find_by_id.return_value = cat
        repo.count_posts.return_value = 0

        await DeleteCategory(repo).execute(cat.id)

        repo.delete.assert_called_once_with(cat.id)

    async def test_raises_in_use_when_posts_exist(self, repo):
        cat = make_category()
        repo.find_by_id.return_value = cat
        repo.count_posts.return_value = 3

        with pytest.raises(CategoryInUseError):
            await DeleteCategory(repo).execute(cat.id)

    async def test_raises_not_found_for_unknown_id(self, repo):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await DeleteCategory(repo).execute(uuid4())


class TestListCategories:
    async def test_returns_categories_with_post_count(self, repo):
        cats = [make_category(), make_category()]
        repo.find_all_with_post_count.return_value = cats

        result = await ListCategories(repo).execute()

        repo.find_all_with_post_count.assert_called_once_with(published_only=False)
        assert len(result) == 2

    async def test_passes_published_only_flag(self, repo):
        repo.find_all_with_post_count.return_value = []

        await ListCategories(repo).execute(published_only=True)

        repo.find_all_with_post_count.assert_called_once_with(published_only=True)
