from src.domain.repositories.post_repository import PostListResult, PostRepository


class GetPosts:
    def __init__(self, repository: PostRepository) -> None:
        self._repository = repository

    async def execute(
        self,
        page: int = 1,
        page_size: int = 10,
        category_slug: str | None = None,
        tag_slug: str | None = None,
        preview: bool = False,
    ) -> PostListResult:
        return await self._repository.list_published(
            page=page,
            page_size=min(page_size, 20),
            category_slug=category_slug,
            tag_slug=tag_slug,
            preview=preview,
        )
