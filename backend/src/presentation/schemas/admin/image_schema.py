from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ImageMetadataUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    alt_text: str | None = None
    subtitle: str | None = None


class ImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    original_url: str
    thumbnail_url: str
    filename: str
    alt_text: str | None
    subtitle: str | None
    width: int | None
    height: int | None
    created_at: datetime


class ImageListMeta(BaseModel):
    total: int
    page: int
    page_size: int


class ImageListResponse(BaseModel):
    data: list[ImageResponse]
    meta: ImageListMeta
