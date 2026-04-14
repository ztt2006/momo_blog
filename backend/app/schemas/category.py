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
