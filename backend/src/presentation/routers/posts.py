from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.get_post_by_slug import GetPostBySlug
from src.application.use_cases.get_posts import GetPosts
from src.infrastructure.database.session import get_session
from src.infrastructure.repositories.sqlalchemy_post_repository import SQLAlchemyPostRepository
from src.presentation.schemas.post_schema import PostListMeta, PostListResponse, PostResponse

router = APIRouter(prefix="/posts", tags=["posts"])


def _get_posts_use_case(session: AsyncSession = Depends(get_session)) -> GetPosts:
    return GetPosts(SQLAlchemyPostRepository(session))


def _get_post_by_slug_use_case(session: AsyncSession = Depends(get_session)) -> GetPostBySlug:
    return GetPostBySlug(SQLAlchemyPostRepository(session))


@router.get("/", response_model=PostListResponse)
async def list_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=20),
    category: str | None = Query(default=None),
    tag: str | None = Query(default=None),
    preview: bool = Query(default=False),
    use_case: GetPosts = Depends(_get_posts_use_case),
) -> PostListResponse:
    result = await use_case.execute(
        page=page, page_size=page_size, category_slug=category, tag_slug=tag, preview=preview
    )
    return PostListResponse(
        data=[PostResponse.from_entity(p) for p in result.items],
        meta=PostListMeta(total=result.total, page=result.page, page_size=result.page_size),
    )


@router.get("/{slug}", response_model=PostResponse)
async def get_post(
    slug: str,
    use_case: GetPostBySlug = Depends(_get_post_by_slug_use_case),
) -> PostResponse:
    post = await use_case.execute(slug)
    return PostResponse.from_entity(post)
