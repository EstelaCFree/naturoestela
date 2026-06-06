from datetime import UTC, datetime
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from src.application.use_cases.admin.post_use_cases import (
    CreatePost,
    PublishPost,
    SetPostBodyImages,
    SetPostTags,
    UnpublishPost,
)
from src.domain.entities.image import PostBodyImage
from src.domain.entities.post import Post
from src.domain.exceptions import NotFoundError, SlugConflictError


def make_post(**kwargs) -> Post:
    return Post(
        id=kwargs.get("id", uuid4()),
        title=kwargs.get("title", "Test Post"),
        slug=kwargs.get("slug", "test-post"),
        excerpt="",
        content="Content",
        category_id=uuid4(),
        created_by=kwargs.get("created_by", "human"),
        published_at=kwargs.get("published_at", None),
    )


@pytest.fixture
def repo():
    r = AsyncMock()
    r.find_by_slug_any_status.return_value = None
    return r


@pytest.fixture
def tag_repo():
    return AsyncMock()


@pytest.fixture
def image_repo():
    return AsyncMock()


class TestCreatePost:
    async def test_creates_draft_with_auto_slug(self, repo):
        post = make_post(title="Mi Artículo", slug="mi-articulo")
        repo.save.return_value = post

        result = await CreatePost(repo).execute(
            title="Mi Artículo",
            content="...",
            category_id=uuid4(),
            created_by="human",
        )

        repo.save.assert_called_once()
        assert result.published_at is None
        assert result.status == "draft"

    async def test_sets_created_by_from_caller_identity(self, repo):
        post = make_post(created_by="ai")
        repo.save.return_value = post

        result = await CreatePost(repo).execute(
            title="AI Post",
            content="...",
            category_id=uuid4(),
            created_by="ai",
        )

        assert result.created_by == "ai"

    async def test_raises_conflict_when_slug_taken(self, repo):
        repo.find_by_slug_any_status.return_value = make_post()

        with pytest.raises(SlugConflictError):
            await CreatePost(repo).execute(
                title="Test",
                content="...",
                category_id=uuid4(),
                created_by="human",
                slug="test-post",
            )

    async def test_auto_generates_slug_from_title(self, repo):
        captured: list[Post] = []

        async def capture_save(post: Post) -> Post:
            captured.append(post)
            return post

        repo.save.side_effect = capture_save

        await CreatePost(repo).execute(
            title="Salud y Bienestar",
            content="...",
            category_id=uuid4(),
            created_by="human",
        )

        assert captured[0].slug == "salud-y-bienestar"


class TestPublishPost:
    async def test_publishes_immediately_when_no_date(self, repo):
        post = make_post(published_at=datetime.now(tz=UTC))
        repo.publish.return_value = post

        result = await PublishPost(repo).execute(post.id)

        repo.publish.assert_called_once()
        assert result.published_at is not None

    async def test_schedules_with_future_date(self, repo):
        future = datetime(2027, 1, 1, tzinfo=UTC)
        post = make_post(published_at=future)
        repo.publish.return_value = post

        result = await PublishPost(repo).execute(post.id, published_at=future)

        assert result.status == "scheduled"

    async def test_immediate_publish_status_is_published(self, repo):
        past = datetime(2025, 1, 1, tzinfo=UTC)
        post = make_post(published_at=past)
        repo.publish.return_value = post

        result = await PublishPost(repo).execute(post.id)

        assert result.status == "published"


class TestUnpublishPost:
    async def test_sets_published_at_to_none(self, repo):
        post = make_post(published_at=None)
        repo.unpublish.return_value = post

        result = await UnpublishPost(repo).execute(post.id)

        assert result.status == "draft"


class TestSetPostTags:
    async def test_sets_tags_when_all_ids_valid(self, repo, tag_repo):
        post = make_post()
        repo.find_by_id.return_value = post
        tag_repo.find_by_id.return_value = AsyncMock()
        tag_ids = [uuid4(), uuid4()]

        await SetPostTags(repo, tag_repo).execute(post.id, tag_ids)

        repo.set_tags.assert_called_once_with(post.id, tag_ids)

    async def test_raises_not_found_for_unknown_tag(self, repo, tag_repo):
        post = make_post()
        repo.find_by_id.return_value = post
        tag_repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await SetPostTags(repo, tag_repo).execute(post.id, [uuid4()])

    async def test_raises_not_found_for_unknown_post(self, repo, tag_repo):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await SetPostTags(repo, tag_repo).execute(uuid4(), [])


class TestSetPostBodyImages:
    async def test_sets_body_images_when_all_ids_valid(self, repo, image_repo):
        post = make_post()
        repo.find_by_id.return_value = post
        image_repo.find_by_id.return_value = AsyncMock()
        bi = PostBodyImage(
            image_id=uuid4(),
            original_url="",
            thumbnail_url="",
            alt_text=None,
            subtitle=None,
            alignment="center",
            size="full",
            sort_order=0,
        )

        await SetPostBodyImages(repo, image_repo).execute(post.id, [bi])

        repo.set_body_images.assert_called_once_with(post.id, [bi])

    async def test_raises_not_found_for_unknown_image(self, repo, image_repo):
        post = make_post()
        repo.find_by_id.return_value = post
        image_repo.find_by_id.return_value = None
        bi = PostBodyImage(
            image_id=uuid4(),
            original_url="",
            thumbnail_url="",
            alt_text=None,
            subtitle=None,
            alignment="center",
            size="full",
            sort_order=0,
        )

        with pytest.raises(NotFoundError):
            await SetPostBodyImages(repo, image_repo).execute(post.id, [bi])
