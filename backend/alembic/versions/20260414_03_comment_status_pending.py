"""comment status pending by default

Revision ID: 20260414_03
Revises: 20260414_02
Create Date: 2026-04-14 18:20:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260414_03"
down_revision: Union[str, Sequence[str], None] = "20260414_02"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "comments",
        "status",
        existing_type=sa.String(length=32),
        server_default="pending",
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "comments",
        "status",
        existing_type=sa.String(length=32),
        server_default="approved",
        existing_nullable=False,
    )
