from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class CommentCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=100)
    author_email: str | None = Field(default=None, max_length=255)
    content: str = Field(min_length=1, max_length=2000)


class CommentPublicItem(ORMModel):
    id: int
    author_name: str
    content: str
    created_at: datetime
    source_type: str
    article_slug: str | None = None


class CommentAdminItem(ORMModel):
    id: int
    author_name: str
    author_email: str | None = None
    content: str
    created_at: datetime
    status: Literal["pending", "approved", "rejected"]
    source_type: Literal["article", "guestbook"]
    article_id: int | None = None
    article_title: str | None = None
    article_slug: str | None = None


class CommentStatusUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected"]
