"""add initial tables

Revision ID: 001
Revises:
Create Date: 2026-05-29
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("excerpt", sa.Text, nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("featured_image_url", sa.String(500), nullable=True),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    op.create_unique_constraint("uq_posts_slug", "posts", ["slug"])
    op.create_index("ix_posts_slug", "posts", ["slug"])
    op.create_index("ix_posts_category", "posts", ["category"])
    op.create_index("ix_posts_published_at", "posts", ["published_at"])

    op.create_table(
        "newsletter_subscribers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column(
            "subscribed_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean, nullable=False, default=True),
    )
    op.create_unique_constraint(
        "uq_newsletter_subscribers_email", "newsletter_subscribers", ["email"]
    )
    op.create_index("ix_newsletter_subscribers_email", "newsletter_subscribers", ["email"])

    op.create_table(
        "contact_submissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("subject", sa.String(255), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column(
            "submitted_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column("is_read", sa.Boolean, nullable=False, default=False),
    )


def downgrade() -> None:
    op.drop_table("contact_submissions")
    op.drop_index("ix_newsletter_subscribers_email", table_name="newsletter_subscribers")
    op.drop_constraint("uq_newsletter_subscribers_email", "newsletter_subscribers")
    op.drop_table("newsletter_subscribers")
    op.drop_index("ix_posts_published_at", table_name="posts")
    op.drop_index("ix_posts_category", table_name="posts")
    op.drop_index("ix_posts_slug", table_name="posts")
    op.drop_constraint("uq_posts_slug", "posts")
    op.drop_table("posts")
