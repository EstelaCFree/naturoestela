from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TagCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    slug: str | None = None


class TagUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    slug: str | None = None


class TagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    slug: str
    post_count: int
    created_at: datetime


class TagListResponse(BaseModel):
    data: list[TagResponse]
