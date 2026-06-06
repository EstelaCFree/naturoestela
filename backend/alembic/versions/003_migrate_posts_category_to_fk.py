"""migrate posts.category varchar to category_id FK

Revision ID: 003
Revises: 002
Create Date: 2026-06-04
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "003"
down_revision: str | None = "002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # 1. Add category_id column (nullable initially)
    op.add_column("posts", sa.Column("category_id", postgresql.UUID(as_uuid=True), nullable=True))

    # 2. Backfill: create one category row per distinct category string (title-case normalised)
    conn = op.get_bind()
    categories_result = conn.execute(
        sa.text("SELECT DISTINCT INITCAP(category) AS name FROM posts")
    )
    distinct_categories = categories_result.fetchall()

    import re
    import uuid

    for row in distinct_categories:
        name = row[0]
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        cat_id = str(uuid.uuid4())
        conn.execute(
            sa.text(
                "INSERT INTO categories (id, name, slug) VALUES (:id, :name, :slug) "
                "ON CONFLICT (name) DO NOTHING"
            ),
            {"id": cat_id, "name": name, "slug": slug},
        )

    # 3. Update posts.category_id from the newly created categories
    conn.execute(
        sa.text(
            "UPDATE posts p SET category_id = c.id "
            "FROM categories c WHERE INITCAP(p.category) = c.name"
        )
    )

    # 4. Set NOT NULL
    op.alter_column("posts", "category_id", nullable=False)

    # 5. Add FK constraint
    op.create_foreign_key("fk_posts_category_id", "posts", "categories", ["category_id"], ["id"])
    op.create_index("ix_posts_category_id", "posts", ["category_id"])

    # 6. Drop old category column and its index
    op.drop_index("ix_posts_category", table_name="posts")
    op.drop_column("posts", "category")


def downgrade() -> None:
    op.add_column("posts", sa.Column("category", sa.String(100), nullable=True))
    conn = op.get_bind()
    conn.execute(
        sa.text("UPDATE posts p SET category = c.name FROM categories c WHERE p.category_id = c.id")
    )
    op.alter_column("posts", "category", nullable=False)
    op.create_index("ix_posts_category", "posts", ["category"])
    op.drop_index("ix_posts_category_id", table_name="posts")
    op.drop_constraint("fk_posts_category_id", "posts", type_="foreignkey")
    op.drop_column("posts", "category_id")
