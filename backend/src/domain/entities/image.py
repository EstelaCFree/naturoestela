from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class Image:
    original_url: str
    thumbnail_url: str
    filename: str
    id: UUID = field(default_factory=uuid4)
    alt_text: str | None = None
    subtitle: str | None = None
    width: int | None = None
    height: int | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class PostBodyImage:
    image_id: UUID
    original_url: str
    thumbnail_url: str
    alt_text: str | None
    subtitle: str | None
    alignment: str
    size: str
    sort_order: int
