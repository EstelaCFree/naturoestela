from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CategoryCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    slug: str | None = None


class CategoryUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    slug: str | None = None


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    slug: str
    post_count: int
    created_at: datetime


class CategoryListResponse(BaseModel):
    data: list[CategoryResponse]
