from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Literal
from uuid import UUID, uuid4

from src.domain.entities.category import Category
from src.domain.entities.image import Image, PostBodyImage
from src.domain.entities.tag import Tag


@dataclass
class Post:
    title: str
    slug: str
    excerpt: str
    content: str
    category_id: UUID
    id: UUID = field(default_factory=uuid4)
    featured_image_id: UUID | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None
    created_by: Literal["human", "ai"] = "human"
    published_at: datetime | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    category: Category | None = None
    featured_image: Image | None = None
    tags: list[Tag] = field(default_factory=list)
    body_images: list[PostBodyImage] = field(default_factory=list)

    @property
    def status(self) -> Literal["draft", "scheduled", "published"]:
        if self.published_at is None:
            return "draft"
        now = datetime.now(tz=UTC)
        pub = (
            self.published_at if self.published_at.tzinfo else self.published_at.replace(tzinfo=UTC)
        )
        return "published" if pub <= now else "scheduled"
