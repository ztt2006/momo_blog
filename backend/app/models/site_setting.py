from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, PrimaryKeyMixin, TimestampMixin


class SiteSetting(PrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "site_settings"

    site_name: Mapped[str] = mapped_column(String(120), nullable=False)
    site_subtitle: Mapped[str | None] = mapped_column(String(255))
    site_description: Mapped[str | None] = mapped_column(String(500))
    site_keywords: Mapped[str | None] = mapped_column(String(255))
    logo: Mapped[str | None] = mapped_column(String(500))
    favicon: Mapped[str | None] = mapped_column(String(500))
    github_url: Mapped[str | None] = mapped_column(String(500))
    about_markdown: Mapped[str | None] = mapped_column(Text)
    icp: Mapped[str | None] = mapped_column(String(255))
    public_email: Mapped[str | None] = mapped_column(String(255))
