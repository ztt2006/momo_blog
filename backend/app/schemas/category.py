from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=120)
    description: str | None = None
    sort_order: int = 0
    is_visible: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryResponse(ORMModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    sort_order: int
    is_visible: bool


class CategoryPublicSummary(ORMModel):
    id: int
    name: str
    slug: str


class CategoryPublicArticleItem(ORMModel):
    id: int
    title: str
    slug: str
    summary: str | None = None
    published_at: str | None = None
    reading_time: int
    word_count: int
    cover_image_id: int | None = None


class CategoryPublicItem(ORMModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    sort_order: int
    article_count: int
    articles: list[CategoryPublicArticleItem] = Field(default_factory=list)
