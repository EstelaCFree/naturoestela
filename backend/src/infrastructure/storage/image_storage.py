import io
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path

from PIL import Image as PILImage

from src.config import settings
from src.domain.exceptions import FileTooLargeError, InvalidFileTypeError

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_ORIGINAL_PX = 1920
MAX_THUMBNAIL_PX = 600


@dataclass
class ProcessedImage:
    original_bytes: bytes
    thumbnail_bytes: bytes
    width: int
    height: int
    base_filename: str


class IImageStorageService(ABC):
    @abstractmethod
    async def save(self, processed: ProcessedImage) -> tuple[str, str]:
        """Returns (original_url, thumbnail_url)."""
        ...

    @abstractmethod
    async def delete(self, filename: str) -> None: ...


class LocalImageStorageService(IImageStorageService):
    def __init__(self, media_root: str | None = None) -> None:
        self._root = Path(media_root or settings.media_root)
        self._root.mkdir(parents=True, exist_ok=True)

    async def save(self, processed: ProcessedImage) -> tuple[str, str]:
        original_name = f"{processed.base_filename}.webp"
        thumb_name = f"{processed.base_filename}_thumb.webp"

        (self._root / original_name).write_bytes(processed.original_bytes)
        (self._root / thumb_name).write_bytes(processed.thumbnail_bytes)

        return f"/media/{original_name}", f"/media/{thumb_name}"

    async def delete(self, filename: str) -> None:
        for suffix in ("", "_thumb"):
            path = self._root / f"{filename}{suffix}.webp"
            if path.exists():
                path.unlink()


def _resize(img: PILImage.Image, max_px: int) -> PILImage.Image:
    w, h = img.size
    if max(w, h) <= max_px:
        return img
    ratio = max_px / max(w, h)
    return img.resize((int(w * ratio), int(h * ratio)), PILImage.LANCZOS)


def _to_webp_bytes(img: PILImage.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="WEBP", quality=85)
    return buf.getvalue()


def process_upload(
    file_bytes: bytes,
    content_type: str,
    max_mb: int | None = None,
) -> ProcessedImage:
    limit = (max_mb or settings.max_upload_size_mb) * 1024 * 1024
    if len(file_bytes) > limit:
        raise FileTooLargeError(max_mb or settings.max_upload_size_mb)

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise InvalidFileTypeError(content_type)

    img = PILImage.open(io.BytesIO(file_bytes)).convert("RGBA").convert("RGB")
    original = _resize(img, MAX_ORIGINAL_PX)
    thumbnail = _resize(img, MAX_THUMBNAIL_PX)

    base = str(uuid.uuid4())
    return ProcessedImage(
        original_bytes=_to_webp_bytes(original),
        thumbnail_bytes=_to_webp_bytes(thumbnail),
        width=original.size[0],
        height=original.size[1],
        base_filename=base,
    )
