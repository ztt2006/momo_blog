from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class TagBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=120)
    description: str | None = None
    color: str | None = Field(default=None, max_length=20)


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    pass


class TagResponse(ORMModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    color: str | None = None


class TagPublicSummary(ORMModel):
    id: int
    name: str
    slug: str
    color: str | None = None


class TagPublicArticleItem(ORMModel):
    id: int
    title: str
    slug: str
    summary: str | None = None
    published_at: str | None = None
    reading_time: int
    word_count: int
    cover_image_id: int | None = None


class TagPublicItem(ORMModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    color: str | None = None
    article_count: int
    articles: list[TagPublicArticleItem] = Field(default_factory=list)
