from datetime import UTC, datetime
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.get_posts import GetPosts
from src.domain.entities.post import Post
from src.domain.repositories.post_repository import PostListResult


def make_published_post(**kwargs) -> Post:
    return Post(
        id=uuid4(),
        title=kwargs.get("title", "Test Post"),
        slug=kwargs.get("slug", "test-post"),
        excerpt="An excerpt",
        content="Content",
        category_id=uuid4(),
        published_at=kwargs.get("published_at", datetime(2026, 1, 1, tzinfo=UTC)),
    )


@pytest.fixture
def repository():
    return AsyncMock()


@pytest.fixture
def use_case(repository):
    return GetPosts(repository)


async def test_returns_published_posts(use_case, repository):
    posts = [make_published_post()]
    repository.list_published.return_value = PostListResult(
        items=posts, total=1, page=1, page_size=10
    )

    result = await use_case.execute()

    repository.list_published.assert_called_once_with(
        page=1, page_size=10, category_slug=None, tag_slug=None, preview=False
    )
    assert result.total == 1
    assert result.items == posts


async def test_preview_mode_passes_flag(use_case, repository):
    repository.list_published.return_value = PostListResult(items=[], total=0, page=1, page_size=3)

    await use_case.execute(preview=True)

    call_kwargs = repository.list_published.call_args.kwargs
    assert call_kwargs["preview"] is True


async def test_page_size_capped_at_20(use_case, repository):
    repository.list_published.return_value = PostListResult(items=[], total=0, page=1, page_size=20)

    await use_case.execute(page_size=100)

    call_kwargs = repository.list_published.call_args.kwargs
    assert call_kwargs["page_size"] == 20


async def test_category_slug_filter_passed_through(use_case, repository):
    repository.list_published.return_value = PostListResult(items=[], total=0, page=1, page_size=10)

    await use_case.execute(category_slug="fitoterapia")

    call_kwargs = repository.list_published.call_args.kwargs
    assert call_kwargs["category_slug"] == "fitoterapia"


async def test_tag_slug_filter_passed_through(use_case, repository):
    repository.list_published.return_value = PostListResult(items=[], total=0, page=1, page_size=10)

    await use_case.execute(tag_slug="sistema-nervioso")

    call_kwargs = repository.list_published.call_args.kwargs
    assert call_kwargs["tag_slug"] == "sistema-nervioso"


async def test_empty_result(use_case, repository):
    repository.list_published.return_value = PostListResult(items=[], total=0, page=1, page_size=10)

    result = await use_case.execute()

    assert result.total == 0
    assert result.items == []
