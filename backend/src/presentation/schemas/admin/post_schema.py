from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PostBodyImageItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    image_id: UUID
    alignment: Literal["left", "center", "right"]
    size: Literal["small", "medium", "full"]
    sort_order: int = 0


class PostCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str
    content: str
    category_id: UUID
    excerpt: str = ""
    slug: str | None = None
    featured_image_id: UUID | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None


class PostUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str
    content: str
    category_id: UUID
    excerpt: str = ""
    slug: str | None = None
    featured_image_id: UUID | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None


class PublishRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    published_at: datetime | None = None


class SetTagsRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    tag_ids: list[UUID]


class SetBodyImagesRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    body_images: list[PostBodyImageItem]


class CategoryInPost(BaseModel):
    id: UUID
    name: str
    slug: str


class TagInPost(BaseModel):
    id: UUID
    name: str
    slug: str


class ImageInPost(BaseModel):
    original_url: str
    thumbnail_url: str
    alt_text: str | None
    subtitle: str | None


class BodyImageInPost(BaseModel):
    image_id: UUID
    original_url: str
    thumbnail_url: str
    alt_text: str | None
    subtitle: str | None
    alignment: str
    size: str
    sort_order: int


class SeoInPost(BaseModel):
    title: str | None
    description: str | None
    keywords: str | None


class AdminPostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    title: str
    slug: str
    excerpt: str
    content: str
    status: str
    created_by: str
    category: CategoryInPost | None
    featured_image: ImageInPost | None
    tags: list[TagInPost]
    body_images: list[BodyImageInPost]
    seo: SeoInPost
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, post: object) -> "AdminPostResponse":
        from src.domain.entities.post import Post

        p: Post = post  # type: ignore[assignment]
        return cls(
            id=p.id,
            title=p.title,
            slug=p.slug,
            excerpt=p.excerpt,
            content=p.content,
            status=p.status,
            created_by=p.created_by,
            category=CategoryInPost(id=p.category.id, name=p.category.name, slug=p.category.slug)
            if p.category
            else None,
            featured_image=ImageInPost(
                original_url=p.featured_image.original_url,
                thumbnail_url=p.featured_image.thumbnail_url,
                alt_text=p.featured_image.alt_text,
                subtitle=p.featured_image.subtitle,
            )
            if p.featured_image
            else None,
            tags=[TagInPost(id=t.id, name=t.name, slug=t.slug) for t in p.tags],
            body_images=[
                BodyImageInPost(
                    image_id=bi.image_id,
                    original_url=bi.original_url,
                    thumbnail_url=bi.thumbnail_url,
                    alt_text=bi.alt_text,
                    subtitle=bi.subtitle,
                    alignment=bi.alignment,
                    size=bi.size,
                    sort_order=bi.sort_order,
                )
                for bi in p.body_images
            ],
            seo=SeoInPost(
                title=p.seo_title, description=p.seo_description, keywords=p.seo_keywords
            ),
            published_at=p.published_at,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )


class AdminPostListMeta(BaseModel):
    total: int
    page: int
    page_size: int


class AdminPostListResponse(BaseModel):
    data: list[AdminPostResponse]
    meta: AdminPostListMeta
