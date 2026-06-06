class DomainError(Exception):
    pass


class NotFoundError(DomainError):
    def __init__(self, resource: str, resource_id: str) -> None:
        super().__init__(f"{resource} with id {resource_id!r} not found")
        self.resource = resource
        self.resource_id = resource_id


class ConflictError(DomainError):
    pass


class UnauthorizedError(DomainError):
    pass


class SlugConflictError(ConflictError):
    def __init__(self, slug: str) -> None:
        super().__init__(f"Slug {slug!r} is already in use")
        self.slug = slug


class CategoryInUseError(ConflictError):
    def __init__(self) -> None:
        super().__init__("Category has assigned posts")


class ImageInUseError(ConflictError):
    def __init__(self) -> None:
        super().__init__("Image is in use by one or more posts")


class FileTooLargeError(DomainError):
    def __init__(self, max_mb: int) -> None:
        super().__init__(f"File exceeds the maximum allowed size of {max_mb} MB")
        self.max_mb = max_mb


class InvalidFileTypeError(DomainError):
    def __init__(self, content_type: str) -> None:
        super().__init__(f"Unsupported file type: {content_type!r}")
        self.content_type = content_type
