from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from src.config import settings
from src.domain.exceptions import (
    CategoryInUseError,
    ConflictError,
    DomainError,
    FileTooLargeError,
    ImageInUseError,
    InvalidFileTypeError,
    NotFoundError,
    SlugConflictError,
    UnauthorizedError,
)
from src.presentation.routers import categories as public_categories
from src.presentation.routers import contact, newsletter, posts
from src.presentation.routers import tags as public_tags
from src.presentation.routers.admin import categories as admin_categories
from src.presentation.routers.admin import images as admin_images
from src.presentation.routers.admin import posts as admin_posts
from src.presentation.routers.admin import tags as admin_tags

if settings.resend_enabled and not settings.resend_api_key:
    raise ValueError(
        "RESEND_ENABLED is True but RESEND_API_KEY is not set. "
        "Provide the key or set RESEND_ENABLED=false."
    )

app = FastAPI(title="naturoestela API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media files
media_path = Path(settings.media_root)
media_path.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(media_path)), name="media")


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"error": str(exc), "code": "NOT_FOUND"})


@app.exception_handler(SlugConflictError)
async def slug_conflict_handler(request: Request, exc: SlugConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"error": str(exc), "code": "CONFLICT"})


@app.exception_handler(CategoryInUseError)
async def category_in_use_handler(request: Request, exc: CategoryInUseError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"error": str(exc), "code": "CONFLICT"})


@app.exception_handler(ImageInUseError)
async def image_in_use_handler(request: Request, exc: ImageInUseError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"error": str(exc), "code": "CONFLICT"})


@app.exception_handler(ConflictError)
async def conflict_handler(request: Request, exc: ConflictError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"error": str(exc), "code": "CONFLICT"})


@app.exception_handler(FileTooLargeError)
async def file_too_large_handler(request: Request, exc: FileTooLargeError) -> JSONResponse:
    return JSONResponse(status_code=413, content={"error": str(exc), "code": "FILE_TOO_LARGE"})


@app.exception_handler(InvalidFileTypeError)
async def invalid_file_type_handler(request: Request, exc: InvalidFileTypeError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"error": str(exc), "code": "INVALID_FILE_TYPE"})


@app.exception_handler(UnauthorizedError)
async def unauthorized_handler(request: Request, exc: UnauthorizedError) -> JSONResponse:
    return JSONResponse(status_code=401, content={"error": str(exc), "code": "UNAUTHORIZED"})


@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"error": str(exc), "code": "DOMAIN_ERROR"})


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


# Public routes
app.include_router(posts.router, prefix="/api/v1")
app.include_router(public_categories.router, prefix="/api/v1")
app.include_router(public_tags.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(contact.router, prefix="/api/v1")

# Admin routes
app.include_router(admin_posts.router, prefix="/api/v1")
app.include_router(admin_categories.router, prefix="/api/v1")
app.include_router(admin_tags.router, prefix="/api/v1")
app.include_router(admin_images.router, prefix="/api/v1")
