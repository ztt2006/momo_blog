from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.category import CategoryPublicSummary
from app.schemas.common import ORMModel
from app.schemas.tag import TagPublicSummary


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
    cover_image_url: str | None = None
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
    cover_image_url: str | None = None


class ArticleTocItem(BaseModel):
    id: str
    text: str
    level: int


class ArticlePublicDetail(ArticlePublicItem):
    content_md: str
    category: CategoryPublicSummary | None = None
    tags: list[TagPublicSummary] = Field(default_factory=list)
    toc: list[ArticleTocItem] = Field(default_factory=list)
    previous_article: ArticlePublicItem | None = None
    next_article: ArticlePublicItem | None = None
    related_articles: list[ArticlePublicItem] = Field(default_factory=list)
    allow_comment: bool = True
