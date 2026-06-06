from datetime import UTC, datetime
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.get_post_by_slug import GetPostBySlug
from src.domain.entities.post import Post
from src.domain.exceptions import NotFoundError


def make_post(published: bool = True) -> Post:
    return Post(
        id=uuid4(),
        title="Test",
        slug="test-slug",
        excerpt="...",
        content="...",
        category_id=uuid4(),
        published_at=datetime(2026, 1, 1, tzinfo=UTC) if published else None,
    )


@pytest.fixture
def repository():
    return AsyncMock()


@pytest.fixture
def use_case(repository):
    return GetPostBySlug(repository)


async def test_returns_published_post(use_case, repository):
    post = make_post(published=True)
    repository.find_by_slug.return_value = post

    result = await use_case.execute("test-slug")

    assert result == post


async def test_raises_not_found_for_unknown_slug(use_case, repository):
    repository.find_by_slug.return_value = None

    with pytest.raises(NotFoundError):
        await use_case.execute("unknown-slug")
