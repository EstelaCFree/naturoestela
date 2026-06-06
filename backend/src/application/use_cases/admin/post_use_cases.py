from datetime import UTC, datetime
from typing import Literal
from uuid import UUID

from src.application.use_cases.admin.utils import slugify
from src.domain.entities.image import PostBodyImage
from src.domain.entities.post import Post
from src.domain.exceptions import NotFoundError, SlugConflictError
from src.domain.repositories.image_repository import ImageRepository
from src.domain.repositories.post_repository import PostAdminRepository, PostListResult
from src.domain.repositories.tag_repository import TagRepository


class CreatePost:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(
        self,
        title: str,
        content: str,
        category_id: UUID,
        created_by: Literal["human", "ai"],
        excerpt: str = "",
        slug: str | None = None,
        featured_image_id: UUID | None = None,
        seo_title: str | None = None,
        seo_description: str | None = None,
        seo_keywords: str | None = None,
    ) -> Post:
        computed_slug = slug or slugify(title)
        if await self._repo.find_by_slug_any_status(computed_slug):
            raise SlugConflictError(computed_slug)
        post = Post(
            title=title,
            slug=computed_slug,
            excerpt=excerpt,
            content=content,
            category_id=category_id,
            created_by=created_by,
            featured_image_id=featured_image_id,
            seo_title=seo_title,
            seo_description=seo_description,
            seo_keywords=seo_keywords,
        )
        return await self._repo.save(post)


class UpdatePost:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(
        self,
        post_id: UUID,
        title: str,
        content: str,
        category_id: UUID,
        excerpt: str = "",
        slug: str | None = None,
        featured_image_id: UUID | None = None,
        seo_title: str | None = None,
        seo_description: str | None = None,
        seo_keywords: str | None = None,
    ) -> Post:
        post = await self._repo.find_by_id(post_id)
        if not post:
            raise NotFoundError("Post", str(post_id))
        computed_slug = slug or slugify(title)
        if computed_slug != post.slug:
            existing = await self._repo.find_by_slug_any_status(computed_slug)
            if existing and existing.id != post_id:
                raise SlugConflictError(computed_slug)
        post.title = title
        post.slug = computed_slug
        post.excerpt = excerpt
        post.content = content
        post.category_id = category_id
        post.featured_image_id = featured_image_id
        post.seo_title = seo_title
        post.seo_description = seo_description
        post.seo_keywords = seo_keywords
        return await self._repo.save(post)


class PublishPost:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(self, post_id: UUID, published_at: datetime | None = None) -> Post:
        when = published_at or datetime.now(tz=UTC)
        return await self._repo.publish(post_id, when)


class UnpublishPost:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(self, post_id: UUID) -> Post:
        return await self._repo.unpublish(post_id)


class DeletePost:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(self, post_id: UUID) -> None:
        await self._repo.delete(post_id)


class ListPostsAdmin:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Literal["draft", "scheduled", "published"] | None = None,
        category_id: UUID | None = None,
    ) -> PostListResult:
        return await self._repo.list_admin(
            page=page, page_size=page_size, status=status, category_id=category_id
        )


class GetPostAdmin:
    def __init__(self, repo: PostAdminRepository) -> None:
        self._repo = repo

    async def execute(self, post_id: UUID) -> Post:
        post = await self._repo.find_by_id(post_id)
        if not post:
            raise NotFoundError("Post", str(post_id))
        return post


class SetPostTags:
    def __init__(self, repo: PostAdminRepository, tag_repo: TagRepository) -> None:
        self._repo = repo
        self._tag_repo = tag_repo

    async def execute(self, post_id: UUID, tag_ids: list[UUID]) -> None:
        if not await self._repo.find_by_id(post_id):
            raise NotFoundError("Post", str(post_id))
        for tag_id in tag_ids:
            if not await self._tag_repo.find_by_id(tag_id):
                raise NotFoundError("Tag", str(tag_id))
        await self._repo.set_tags(post_id, tag_ids)


class SetPostBodyImages:
    def __init__(self, repo: PostAdminRepository, image_repo: ImageRepository) -> None:
        self._repo = repo
        self._image_repo = image_repo

    async def execute(self, post_id: UUID, body_images: list[PostBodyImage]) -> None:
        if not await self._repo.find_by_id(post_id):
            raise NotFoundError("Post", str(post_id))
        for bi in body_images:
            if not await self._image_repo.find_by_id(bi.image_id):
                raise NotFoundError("Image", str(bi.image_id))
        await self._repo.set_body_images(post_id, body_images)
