import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.domain.entities.category import Category
from src.domain.entities.contact_submission import ContactSubmission
from src.domain.entities.image import Image, PostBodyImage
from src.domain.entities.newsletter_subscriber import NewsletterSubscriber
from src.domain.entities.post import Post
from src.domain.entities.tag import Tag
from src.infrastructure.database.base import Base


class CategoryModel(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    posts: Mapped[list["PostModel"]] = relationship("PostModel", back_populates="category_rel")

    def to_entity(self, post_count: int = 0) -> Category:
        return Category(
            id=self.id,
            name=self.name,
            slug=self.slug,
            created_at=self.created_at,
            post_count=post_count,
        )

    @classmethod
    def from_entity(cls, category: Category) -> "CategoryModel":
        return cls(id=category.id, name=category.name, slug=category.slug)


class TagModel(Base):
    __tablename__ = "tags"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    post_tags: Mapped[list["PostTagModel"]] = relationship("PostTagModel", back_populates="tag")

    def to_entity(self, post_count: int = 0) -> Tag:
        return Tag(
            id=self.id,
            name=self.name,
            slug=self.slug,
            created_at=self.created_at,
            post_count=post_count,
        )

    @classmethod
    def from_entity(cls, tag: Tag) -> "TagModel":
        return cls(id=tag.id, name=tag.name, slug=tag.slug)


class PostTagModel(Base):
    __tablename__ = "post_tags"

    post_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True
    )
    tag_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    )

    post: Mapped["PostModel"] = relationship("PostModel", back_populates="post_tags")
    tag: Mapped[TagModel] = relationship("TagModel", back_populates="post_tags")


class ImageModel(Base):
    __tablename__ = "images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    original_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[str] = mapped_column(String(500), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    alt_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subtitle: Mapped[str | None] = mapped_column(String(255), nullable=True)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def to_entity(self) -> Image:
        return Image(
            id=self.id,
            original_url=self.original_url,
            thumbnail_url=self.thumbnail_url,
            filename=self.filename,
            alt_text=self.alt_text,
            subtitle=self.subtitle,
            width=self.width,
            height=self.height,
            created_at=self.created_at,
        )

    @classmethod
    def from_entity(cls, image: Image) -> "ImageModel":
        return cls(
            id=image.id,
            original_url=image.original_url,
            thumbnail_url=image.thumbnail_url,
            filename=image.filename,
            alt_text=image.alt_text,
            subtitle=image.subtitle,
            width=image.width,
            height=image.height,
        )


class PostBodyImageModel(Base):
    __tablename__ = "post_body_images"
    __table_args__ = (
        CheckConstraint(
            "alignment IN ('left','center','right')", name="ck_post_body_images_alignment"
        ),
        CheckConstraint("size IN ('small','medium','full')", name="ck_post_body_images_size"),
    )

    post_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True
    )
    image_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("images.id", ondelete="RESTRICT"), primary_key=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    alignment: Mapped[str] = mapped_column(String(10), nullable=False, default="center")
    size: Mapped[str] = mapped_column(String(10), nullable=False, default="full")

    post: Mapped["PostModel"] = relationship("PostModel", back_populates="body_image_assocs")
    image: Mapped[ImageModel] = relationship("ImageModel")

    def to_domain(self) -> PostBodyImage:
        img = self.image
        return PostBodyImage(
            image_id=self.image_id,
            original_url=img.original_url,
            thumbnail_url=img.thumbnail_url,
            alt_text=img.alt_text,
            subtitle=img.subtitle,
            alignment=self.alignment,
            size=self.size,
            sort_order=self.sort_order,
        )


class PostModel(Base):
    __tablename__ = "posts"
    __table_args__ = (CheckConstraint("created_by IN ('human','ai')", name="ck_posts_created_by"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True
    )
    featured_image_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("images.id", ondelete="SET NULL"), nullable=True
    )
    seo_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    seo_keywords: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_by: Mapped[str] = mapped_column(String(10), nullable=False, default="human")
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    category_rel: Mapped[CategoryModel] = relationship("CategoryModel", back_populates="posts")
    featured_image_rel: Mapped[ImageModel | None] = relationship(
        "ImageModel", foreign_keys=[featured_image_id]
    )
    post_tags: Mapped[list[PostTagModel]] = relationship(
        "PostTagModel", back_populates="post", cascade="all, delete-orphan"
    )
    body_image_assocs: Mapped[list[PostBodyImageModel]] = relationship(
        "PostBodyImageModel",
        back_populates="post",
        cascade="all, delete-orphan",
        order_by="PostBodyImageModel.sort_order",
    )

    def to_entity(self) -> Post:
        category = self.category_rel.to_entity() if self.category_rel else None
        featured_image = self.featured_image_rel.to_entity() if self.featured_image_rel else None
        tags = [pt.tag.to_entity() for pt in self.post_tags if pt.tag]
        body_images = [bi.to_domain() for bi in self.body_image_assocs]
        return Post(
            id=self.id,
            title=self.title,
            slug=self.slug,
            excerpt=self.excerpt,
            content=self.content,
            category_id=self.category_id,
            featured_image_id=self.featured_image_id,
            seo_title=self.seo_title,
            seo_description=self.seo_description,
            seo_keywords=self.seo_keywords,
            created_by=self.created_by,  # type: ignore[arg-type]
            published_at=self.published_at,
            created_at=self.created_at,
            updated_at=self.updated_at,
            category=category,
            featured_image=featured_image,
            tags=tags,
            body_images=body_images,
        )

    @classmethod
    def from_entity(cls, post: Post) -> "PostModel":
        return cls(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            category_id=post.category_id,
            featured_image_id=post.featured_image_id,
            seo_title=post.seo_title,
            seo_description=post.seo_description,
            seo_keywords=post.seo_keywords,
            created_by=post.created_by,
            published_at=post.published_at,
            created_at=post.created_at,
            updated_at=post.updated_at,
        )


class NewsletterSubscriberModel(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    subscribed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def to_entity(self) -> NewsletterSubscriber:
        return NewsletterSubscriber(
            id=self.id, email=self.email, subscribed_at=self.subscribed_at, is_active=self.is_active
        )

    @classmethod
    def from_entity(cls, subscriber: NewsletterSubscriber) -> "NewsletterSubscriberModel":
        return cls(
            id=subscriber.id,
            email=subscriber.email,
            subscribed_at=subscriber.subscribed_at,
            is_active=subscriber.is_active,
        )


class ContactSubmissionModel(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def to_entity(self) -> ContactSubmission:
        return ContactSubmission(
            id=self.id,
            name=self.name,
            email=self.email,
            subject=self.subject,
            message=self.message,
            submitted_at=self.submitted_at,
            is_read=self.is_read,
        )

    @classmethod
    def from_entity(cls, submission: ContactSubmission) -> "ContactSubmissionModel":
        return cls(
            id=submission.id,
            name=submission.name,
            email=submission.email,
            subject=submission.subject,
            message=submission.message,
            submitted_at=submission.submitted_at,
            is_read=submission.is_read,
        )
