from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, PrimaryKeyMixin, TimestampMixin


class Comment(PrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "comments"

    article_id: Mapped[int | None] = mapped_column(ForeignKey("articles.id"))
    author_name: Mapped[str] = mapped_column(String(100), nullable=False)
    author_email: Mapped[str | None] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False, index=True)

    article: Mapped["Article | None"] = relationship(back_populates="comments")
