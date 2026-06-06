from uuid import UUID

from fastapi import APIRouter, Depends, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.admin.image_use_cases import (
    DeleteImage,
    ListImages,
    UpdateImageMetadata,
    UploadImage,
)
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_image_repository import SQLAlchemyImageRepository
from src.infrastructure.storage.image_storage import LocalImageStorageService
from src.presentation.dependencies.auth import CallerIdentity, get_admin_caller
from src.presentation.schemas.admin.image_schema import (
    ImageListMeta,
    ImageListResponse,
    ImageMetadataUpdateRequest,
    ImageResponse,
)

router = APIRouter(prefix="/admin/images", tags=["admin-images"])


def _repo(session: AsyncSession = Depends(get_session)) -> SQLAlchemyImageRepository:
    return SQLAlchemyImageRepository(session)


def _storage() -> LocalImageStorageService:
    return LocalImageStorageService()


@router.post("/", response_model=ImageResponse, status_code=201)
async def upload_image(
    file: UploadFile,
    repo: SQLAlchemyImageRepository = Depends(_repo),
    storage: LocalImageStorageService = Depends(_storage),
    _: CallerIdentity = Depends(get_admin_caller),
) -> ImageResponse:
    file_bytes = await file.read()
    image = await UploadImage(repo, storage).execute(
        file_bytes=file_bytes,
        content_type=file.content_type or "application/octet-stream",
    )
    return ImageResponse(**image.__dict__)


@router.patch("/{image_id}", response_model=ImageResponse)
async def update_image_metadata(
    image_id: UUID,
    body: ImageMetadataUpdateRequest,
    repo: SQLAlchemyImageRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> ImageResponse:
    image = await UpdateImageMetadata(repo).execute(image_id, body.alt_text, body.subtitle)
    return ImageResponse(**image.__dict__)


@router.delete("/{image_id}", status_code=204)
async def delete_image(
    image_id: UUID,
    repo: SQLAlchemyImageRepository = Depends(_repo),
    storage: LocalImageStorageService = Depends(_storage),
    _: CallerIdentity = Depends(get_admin_caller),
) -> None:
    await DeleteImage(repo, storage).execute(image_id)


@router.get("/", response_model=ImageListResponse)
async def list_images(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    repo: SQLAlchemyImageRepository = Depends(_repo),
    _: CallerIdentity = Depends(get_admin_caller),
) -> ImageListResponse:
    result = await ListImages(repo).execute(page=page, page_size=page_size)
    return ImageListResponse(
        data=[ImageResponse(**img.__dict__) for img in result.items],
        meta=ImageListMeta(total=result.total, page=result.page, page_size=result.page_size),
    )
