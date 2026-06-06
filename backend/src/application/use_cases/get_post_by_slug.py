from src.domain.entities.post import Post
from src.domain.exceptions import NotFoundError
from src.domain.repositories.post_repository import PostRepository


class GetPostBySlug:
    def __init__(self, repository: PostRepository) -> None:
        self._repository = repository

    async def execute(self, slug: str) -> Post:
        post = await self._repository.find_by_slug(slug)
        if post is None:
            raise NotFoundError("Post", slug)
        return post
