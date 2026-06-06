"""add categories table

Revision ID: 002
Revises: 001
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "002"
down_revision: str | None = "001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    op.create_unique_constraint("uq_categories_name", "categories", ["name"])
    op.create_unique_constraint("uq_categories_slug", "categories", ["slug"])


def downgrade() -> None:
    op.drop_constraint("uq_categories_slug", "categories")
    op.drop_constraint("uq_categories_name", "categories")
    op.drop_table("categories")
