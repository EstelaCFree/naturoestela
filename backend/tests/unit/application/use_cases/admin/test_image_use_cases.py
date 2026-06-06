from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest

from src.application.use_cases.admin.image_use_cases import DeleteImage, UploadImage
from src.domain.entities.image import Image
from src.domain.exceptions import (
    FileTooLargeError,
    ImageInUseError,
    InvalidFileTypeError,
    NotFoundError,
)


def make_image(**kwargs) -> Image:
    return Image(
        id=kwargs.get("id", uuid4()),
        original_url="/media/abc.webp",
        thumbnail_url="/media/abc_thumb.webp",
        filename="abc",
    )


@pytest.fixture
def repo():
    return AsyncMock()


@pytest.fixture
def storage():
    s = AsyncMock()
    s.save.return_value = ("/media/abc.webp", "/media/abc_thumb.webp")
    return s


class TestUploadImage:
    async def test_uploads_and_returns_image(self, repo, storage):
        image = make_image()
        repo.save.return_value = image

        with patch(
            "src.application.use_cases.admin.image_use_cases.process_upload"
        ) as mock_process:
            mock_process.return_value = MagicMock(
                base_filename="abc",
                width=800,
                height=600,
                original_bytes=b"orig",
                thumbnail_bytes=b"thumb",
            )
            result = await UploadImage(repo, storage).execute(b"data", "image/jpeg")

        repo.save.assert_called_once()
        assert result.original_url == "/media/abc.webp"

    async def test_raises_invalid_file_type(self, repo, storage):
        with (
            patch(
                "src.application.use_cases.admin.image_use_cases.process_upload",
                side_effect=InvalidFileTypeError("application/pdf"),
            ),
            pytest.raises(InvalidFileTypeError),
        ):
            await UploadImage(repo, storage).execute(b"data", "application/pdf")

    async def test_raises_file_too_large(self, repo, storage):
        with (
            patch(
                "src.application.use_cases.admin.image_use_cases.process_upload",
                side_effect=FileTooLargeError(10),
            ),
            pytest.raises(FileTooLargeError),
        ):
            await UploadImage(repo, storage).execute(b"x" * 1024, "image/jpeg")


class TestDeleteImage:
    async def test_deletes_image_when_not_in_use(self, repo, storage):
        image = make_image()
        repo.find_by_id.return_value = image
        repo.is_in_use.return_value = False

        await DeleteImage(repo, storage).execute(image.id)

        storage.delete.assert_called_once_with(image.filename)
        repo.delete.assert_called_once_with(image.id)

    async def test_raises_in_use_when_referenced(self, repo, storage):
        image = make_image()
        repo.find_by_id.return_value = image
        repo.is_in_use.return_value = True

        with pytest.raises(ImageInUseError):
            await DeleteImage(repo, storage).execute(image.id)

        storage.delete.assert_not_called()

    async def test_raises_not_found_for_unknown_id(self, repo, storage):
        repo.find_by_id.return_value = None

        with pytest.raises(NotFoundError):
            await DeleteImage(repo, storage).execute(uuid4())
