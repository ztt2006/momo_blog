from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, PrimaryKeyMixin, TimestampMixin


class Article(PrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "articles"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    content_md: Mapped[str] = mapped_column(Text, nullable=False)
    content_html: Mapped[str | None] = mapped_column(Text)
    toc_json: Mapped[dict | list | None] = mapped_column(JSON)
    cover_image_id: Mapped[int | None] = mapped_column(ForeignKey("media_assets.id"))
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"))
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True, nullable=False)
    is_top: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    allow_comment: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    seo_title: Mapped[str | None] = mapped_column(String(255))
    seo_description: Mapped[str | None] = mapped_column(String(500))
    seo_keywords: Mapped[str | None] = mapped_column(String(255))
    reading_time: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    word_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)

    category: Mapped["Category | None"] = relationship(back_populates="articles")
    author: Mapped["User"] = relationship(back_populates="articles")
    cover_image: Mapped["MediaAsset | None"] = relationship(back_populates="articles")
    tags: Mapped[list["Tag"]] = relationship(
        secondary="article_tags",
        back_populates="articles",
    )
