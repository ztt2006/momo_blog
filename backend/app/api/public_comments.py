from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.comment import CommentCreate, CommentPublicItem
from app.schemas.common import PaginatedResponse
from app.services.comment_service import (
    create_article_comment,
    create_guestbook_message,
    list_article_comments,
    list_guestbook_messages,
)

router = APIRouter(tags=["public-comments"])


@router.get("/public/articles/{slug}/comments", response_model=PaginatedResponse[CommentPublicItem])
def get_article_comments(slug: str, db: Session = Depends(get_db)) -> PaginatedResponse[CommentPublicItem]:
    items, total = list_article_comments(db, slug)
    return PaginatedResponse(total=total, items=items)


@router.post(
    "/public/articles/{slug}/comments",
    response_model=CommentPublicItem,
    status_code=status.HTTP_201_CREATED,
)
def create_public_article_comment(
    slug: str,
    payload: CommentCreate,
    db: Session = Depends(get_db),
) -> CommentPublicItem:
    return create_article_comment(db, slug, payload)


@router.get("/public/messages", response_model=PaginatedResponse[CommentPublicItem])
def get_public_messages(db: Session = Depends(get_db)) -> PaginatedResponse[CommentPublicItem]:
    items, total = list_guestbook_messages(db)
    return PaginatedResponse(total=total, items=items)


@router.post("/public/messages", response_model=CommentPublicItem, status_code=status.HTTP_201_CREATED)
def create_public_message(
    payload: CommentCreate,
    db: Session = Depends(get_db),
) -> CommentPublicItem:
    return create_guestbook_message(db, payload)
