from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.post_use_cases import (
    CreatePost,
    DeletePost,
    GetPostAdmin,
    ListPostsAdmin,
    PublishPost,
    SetPostBodyImages,
    SetPostTags,
    UnpublishPost,
    UpdatePost,
)
from src.domain.entities.image import PostBodyImage
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_image_repository import SQLAlchemyImageRepository
from src.infrastructure.repositories.sqlalchemy_post_admin_repository import (
    SQLAlchemyPostAdminRepository,
)
from src.infrastructure.repositories.sqlalchemy_tag_repository import SQLAlchemyTagRepository
from src.presentation.dependencies.auth import CallerIdentity, get_admin_caller
from src.presentation.schemas.admin.post_schema import (
    AdminPostListMeta,
    AdminPostListResponse,
    AdminPostResponse,
    PostCreateRequest,
    PostUpdateRequest,
    PublishRequest,
    SetBodyImagesRequest,
    SetTagsRequest,
)

router = APIRouter(prefix="/admin/posts", tags=["admin-posts"])


def _repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyPostAdminRepository:
    return SQLAlchemyPostAdminRepository(session)


@router.post("/", response_model=AdminPostResponse, status_code=201)
async def create_post(
    body: PostCreateRequest,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    caller: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostResponse:
    post = await CreatePost(repo).execute(
        title=body.title,
        content=body.content,
        category_id=body.category_id,
        created_by=caller.source,
        excerpt=body.excerpt,
        slug=body.slug,
        featured_image_id=body.featured_image_id,
        seo_title=body.seo_title,
        seo_description=body.seo_description,
        seo_keywords=body.seo_keywords,
    )
    return AdminPostResponse.from_entity(post)


@router.put("/{post_id}", response_model=AdminPostResponse)
async def update_post(
    post_id: UUID,
    body: PostUpdateRequest,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostResponse:
    post = await UpdatePost(repo).execute(
        post_id=post_id,
        title=body.title,
        content=body.content,
        category_id=body.category_id,
        excerpt=body.excerpt,
        slug=body.slug,
        featured_image_id=body.featured_image_id,
        seo_title=body.seo_title,
        seo_description=body.seo_description,
        seo_keywords=body.seo_keywords,
    )
    return AdminPostResponse.from_entity(post)


@router.patch("/{post_id}/publish", response_model=AdminPostResponse)
async def publish_post(
    post_id: UUID,
    body: PublishRequest | None = None,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostResponse:
    published_at = body.published_at if body else None
    post = await PublishPost(repo).execute(post_id, published_at)
    return AdminPostResponse.from_entity(post)


@router.patch("/{post_id}/unpublish", response_model=AdminPostResponse)
async def unpublish_post(
    post_id: UUID,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostResponse:
    post = await UnpublishPost(repo).execute(post_id)
    return AdminPostResponse.from_entity(post)


@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: UUID,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> None:
    await DeletePost(repo).execute(post_id)


@router.get("/", response_model=AdminPostListResponse)
async def list_posts_admin(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: Literal["draft", "scheduled", "published"] | None = Query(default=None),
    category_id: UUID | None = Query(default=None),
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostListResponse:
    result = await ListPostsAdmin(repo).execute(
        page=page, page_size=page_size, status=status, category_id=category_id
    )
    return AdminPostListResponse(
        data=[AdminPostResponse.from_entity(p) for p in result.items],
        meta=AdminPostListMeta(total=result.total, page=result.page, page_size=result.page_size),
    )


@router.get("/{post_id}", response_model=AdminPostResponse)
async def get_post_admin(
    post_id: UUID,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> AdminPostResponse:
    post = await GetPostAdmin(repo).execute(post_id)
    return AdminPostResponse.from_entity(post)


def _tag_repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyTagRepository:
    return SQLAlchemyTagRepository(session)


def _image_repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyImageRepository:
    return SQLAlchemyImageRepository(session)


@router.put("/{post_id}/tags", response_model=dict)
async def set_post_tags(
    post_id: UUID,
    body: SetTagsRequest,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    tag_repo: SQLAlchemyTagRepository = Depends(_tag_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> dict[str, str]:
    await SetPostTags(repo, tag_repo).execute(post_id, body.tag_ids)
    return {"message": "Tags updated"}


@router.put("/{post_id}/body-images", response_model=dict)
async def set_post_body_images(
    post_id: UUID,
    body: SetBodyImagesRequest,
    repo: SQLAlchemyPostAdminRepository = Depends(_repo),
    image_repo: SQLAlchemyImageRepository = Depends(_image_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> dict[str, str]:
    body_images = [
        PostBodyImage(
            image_id=item.image_id,
            original_url="",
            thumbnail_url="",
            alt_text=None,
            subtitle=None,
            alignment=item.alignment,
            size=item.size,
            sort_order=item.sort_order,
        )
        for item in body.body_images
    ]
    await SetPostBodyImages(repo, image_repo).execute(post_id, body_images)
    return {"message": "Body images updated"}
