from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class ArticleBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=255)
    summary: str | None = None
    content_md: str = Field(min_length=1)
    status: str = "draft"
    category_id: int | None = None
    cover_image_id: int | None = None
    tag_ids: list[int] = Field(default_factory=list)
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None
    is_top: bool = False
    allow_comment: bool = True


class ArticleCreate(ArticleBase):
    published_at: datetime | None = None


class ArticleUpdate(ArticleBase):
    published_at: datetime | None = None


class ArticleAdminResponse(ORMModel):
    id: int
    title: str
    slug: str
    summary: str | None = None
    content_md: str
    status: str
    category_id: int | None = None
    cover_image_id: int | None = None
    author_id: int
    seo_title: str | None = None
    seo_description: str | None = None
    seo_keywords: str | None = None
    is_top: bool
    allow_comment: bool
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    tag_ids: list[int] = Field(default_factory=list)


class ArticlePublicItem(ORMModel):
    id: int
    title: str
    slug: str
    summary: str | None = None
    published_at: datetime | None = None
    reading_time: int
    word_count: int
    cover_image_id: int | None = None


class ArticlePublicDetail(ArticlePublicItem):
    content_md: str
