from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.comment import Comment


def create_comment(db: Session, comment: Comment) -> Comment:
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def list_public_comments_by_article(db: Session, article_id: int) -> tuple[list[Comment], int]:
    statement = (
        select(Comment)
        .options(selectinload(Comment.article))
        .where(Comment.article_id == article_id, Comment.status == "approved")
        .order_by(Comment.created_at.asc(), Comment.id.asc())
    )
    items = list(db.scalars(statement))
    total = (
        db.scalar(
            select(func.count()).select_from(Comment).where(
                Comment.article_id == article_id,
                Comment.status == "approved",
            )
        )
        or 0
    )
    return items, total


def list_public_guestbook_messages(db: Session) -> tuple[list[Comment], int]:
    statement = (
        select(Comment)
        .options(selectinload(Comment.article))
        .where(Comment.article_id.is_(None), Comment.status == "approved")
        .order_by(Comment.created_at.desc(), Comment.id.desc())
    )
    items = list(db.scalars(statement))
    total = (
        db.scalar(
            select(func.count()).select_from(Comment).where(
                Comment.article_id.is_(None),
                Comment.status == "approved",
            )
        )
        or 0
    )
    return items, total


def get_comment_by_id(db: Session, comment_id: int) -> Comment | None:
    statement = (
        select(Comment)
        .options(selectinload(Comment.article))
        .where(Comment.id == comment_id)
    )
    return db.scalar(statement)


def list_admin_comments(db: Session) -> tuple[list[Comment], int]:
    statement = (
        select(Comment)
        .options(selectinload(Comment.article))
        .order_by(Comment.created_at.desc(), Comment.id.desc())
    )
    items = list(db.scalars(statement))
    total = db.scalar(select(func.count()).select_from(Comment)) or 0
    return items, total


def update_comment(db: Session, comment: Comment) -> Comment:
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
