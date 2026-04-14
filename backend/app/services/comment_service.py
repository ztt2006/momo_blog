from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.comment import (
    create_comment,
    get_comment_by_id,
    list_admin_comments as list_all_comments,
    list_public_comments_by_article,
    list_public_guestbook_messages,
    update_comment,
)
from app.models.comment import Comment
from app.schemas.comment import CommentAdminItem, CommentCreate, CommentPublicItem
from app.services.article_service import get_public_article_or_404


def _serialize_comment(comment: Comment) -> CommentPublicItem:
    return CommentPublicItem(
        id=comment.id,
        author_name=comment.author_name,
        content=comment.content,
        created_at=comment.created_at,
        source_type="article" if comment.article_id else "guestbook",
        article_slug=comment.article.slug if comment.article else None,
    )


def _serialize_admin_comment(comment: Comment) -> CommentAdminItem:
    return CommentAdminItem(
        id=comment.id,
        author_name=comment.author_name,
        author_email=comment.author_email,
        content=comment.content,
        created_at=comment.created_at,
        status=comment.status,
        source_type="article" if comment.article_id else "guestbook",
        article_id=comment.article_id,
        article_title=comment.article.title if comment.article else None,
        article_slug=comment.article.slug if comment.article else None,
    )


def list_article_comments(db: Session, slug: str) -> tuple[list[CommentPublicItem], int]:
    article = get_public_article_or_404(db, slug)
    items, total = list_public_comments_by_article(db, article.id)
    return [_serialize_comment(item) for item in items], total


def create_article_comment(db: Session, slug: str, payload: CommentCreate) -> CommentPublicItem:
    article = get_public_article_or_404(db, slug)
    if not article.allow_comment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comments are disabled for this article",
        )

    comment = Comment(
        article_id=article.id,
        author_name=payload.author_name.strip(),
        author_email=payload.author_email.strip() if payload.author_email else None,
        content=payload.content.strip(),
        status="pending",
    )
    return _serialize_comment(create_comment(db, comment))


def list_guestbook_messages(db: Session) -> tuple[list[CommentPublicItem], int]:
    items, total = list_public_guestbook_messages(db)
    return [_serialize_comment(item) for item in items], total


def create_guestbook_message(db: Session, payload: CommentCreate) -> CommentPublicItem:
    comment = Comment(
        author_name=payload.author_name.strip(),
        author_email=payload.author_email.strip() if payload.author_email else None,
        content=payload.content.strip(),
        status="pending",
    )
    return _serialize_comment(create_comment(db, comment))


def list_admin_comments(db: Session) -> tuple[list[CommentAdminItem], int]:
    items, total = list_all_comments(db)
    return [_serialize_admin_comment(item) for item in items], total


def update_comment_status_for_admin(db: Session, comment_id: int, status_value: str) -> CommentAdminItem:
    comment = get_comment_by_id(db, comment_id)
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    comment.status = status_value
    updated = update_comment(db, comment)
    return _serialize_admin_comment(updated)
