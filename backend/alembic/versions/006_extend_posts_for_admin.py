"""extend posts table for admin: seo, featured image, created_by

Revision ID: 006
Revises: 005
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "006"
down_revision: str | None = "005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "posts", sa.Column("featured_image_id", postgresql.UUID(as_uuid=True), nullable=True)
    )
    op.add_column("posts", sa.Column("seo_title", sa.String(255), nullable=True))
    op.add_column("posts", sa.Column("seo_description", sa.String(500), nullable=True))
    op.add_column("posts", sa.Column("seo_keywords", sa.String(500), nullable=True))
    op.add_column(
        "posts",
        sa.Column("created_by", sa.String(10), nullable=False, server_default="human"),
    )
    op.create_foreign_key(
        "fk_posts_featured_image",
        "posts",
        "images",
        ["featured_image_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_check_constraint("ck_posts_created_by", "posts", "created_by IN ('human','ai')")
    op.drop_column("posts", "featured_image_url")


def downgrade() -> None:
    op.add_column("posts", sa.Column("featured_image_url", sa.String(500), nullable=True))
    op.drop_constraint("ck_posts_created_by", "posts", type_="check")
    op.drop_constraint("fk_posts_featured_image", "posts", type_="foreignkey")
    op.drop_column("posts", "created_by")
    op.drop_column("posts", "seo_keywords")
    op.drop_column("posts", "seo_description")
    op.drop_column("posts", "seo_title")
    op.drop_column("posts", "featured_image_id")
