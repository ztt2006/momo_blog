"""add comments

Revision ID: 20260414_02
Revises: 20260414_01
Create Date: 2026-04-14 17:50:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260414_02"
down_revision: Union[str, Sequence[str], None] = "20260414_01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "comments",
        sa.Column("article_id", sa.Integer(), nullable=True),
        sa.Column("author_name", sa.String(length=100), nullable=False),
        sa.Column("author_email", sa.String(length=255), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="approved"),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["article_id"], ["articles.id"], name=op.f("fk_comments_article_id_articles")),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_comments")),
    )
    op.create_index(op.f("ix_comments_status"), "comments", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_comments_status"), table_name="comments")
    op.drop_table("comments")
