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
