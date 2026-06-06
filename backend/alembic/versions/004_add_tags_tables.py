"""add tags and post_tags tables

Revision ID: 004
Revises: 003
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "004"
down_revision: str | None = "003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "tags",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    op.create_unique_constraint("uq_tags_name", "tags", ["name"])
    op.create_unique_constraint("uq_tags_slug", "tags", ["slug"])

    op.create_table(
        "post_tags",
        sa.Column("post_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tag_id", postgresql.UUID(as_uuid=True), nullable=False),
    )
    op.create_primary_key("pk_post_tags", "post_tags", ["post_id", "tag_id"])
    op.create_foreign_key(
        "fk_post_tags_post", "post_tags", "posts", ["post_id"], ["id"], ondelete="CASCADE"
    )
    op.create_foreign_key(
        "fk_post_tags_tag", "post_tags", "tags", ["tag_id"], ["id"], ondelete="CASCADE"
    )


def downgrade() -> None:
    op.drop_constraint("fk_post_tags_tag", "post_tags", type_="foreignkey")
    op.drop_constraint("fk_post_tags_post", "post_tags", type_="foreignkey")
    op.drop_table("post_tags")
    op.drop_constraint("uq_tags_slug", "tags")
    op.drop_constraint("uq_tags_name", "tags")
    op.drop_table("tags")
