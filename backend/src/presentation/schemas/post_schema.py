from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CategoryInPost(BaseModel):
    id: UUID
    name: str
    slug: str


class TagInPost(BaseModel):
    id: UUID
    name: str
    slug: str


class FeaturedImageInPost(BaseModel):
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


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    excerpt: str
    content: str
    category: CategoryInPost | None
    tags: list[TagInPost]
    featured_image: FeaturedImageInPost | None
    body_images: list[BodyImageInPost]
    seo: SeoInPost
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, post: object) -> "PostResponse":
        from src.domain.entities.post import Post

        p: Post = post  # type: ignore[assignment]
        return cls(
            id=p.id,
            title=p.title,
            slug=p.slug,
            excerpt=p.excerpt,
            content=p.content,
            category=CategoryInPost(id=p.category.id, name=p.category.name, slug=p.category.slug)
            if p.category
            else None,
            tags=[TagInPost(id=t.id, name=t.name, slug=t.slug) for t in p.tags],
            featured_image=FeaturedImageInPost(
                original_url=p.featured_image.original_url,
                thumbnail_url=p.featured_image.thumbnail_url,
                alt_text=p.featured_image.alt_text,
                subtitle=p.featured_image.subtitle,
            )
            if p.featured_image
            else None,
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


class PostListMeta(BaseModel):
    total: int
    page: int
    page_size: int


class PostListResponse(BaseModel):
    data: list[PostResponse]
    meta: PostListMeta
