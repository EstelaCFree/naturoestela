"""add images and post_body_images tables

Revision ID: 005
Revises: 004
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "005"
down_revision: str | None = "004"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "images",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("original_url", sa.String(500), nullable=False),
        sa.Column("thumbnail_url", sa.String(500), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("alt_text", sa.String(255), nullable=True),
        sa.Column("subtitle", sa.String(255), nullable=True),
        sa.Column("width", sa.Integer, nullable=True),
        sa.Column("height", sa.Integer, nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )

    op.create_table(
        "post_body_images",
        sa.Column("post_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("image_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("alignment", sa.String(10), nullable=False, server_default="center"),
        sa.Column("size", sa.String(10), nullable=False, server_default="full"),
    )
    op.create_primary_key("pk_post_body_images", "post_body_images", ["post_id", "image_id"])
    op.create_foreign_key(
        "fk_post_body_images_post",
        "post_body_images",
        "posts",
        ["post_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_post_body_images_image",
        "post_body_images",
        "images",
        ["image_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_check_constraint(
        "ck_post_body_images_alignment",
        "post_body_images",
        "alignment IN ('left','center','right')",
    )
    op.create_check_constraint(
        "ck_post_body_images_size", "post_body_images", "size IN ('small','medium','full')"
    )


def downgrade() -> None:
    op.drop_table("post_body_images")
    op.drop_table("images")
