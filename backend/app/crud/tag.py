from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.tag import Tag


def list_tags(db: Session) -> tuple[list[Tag], int]:
    statement = select(Tag).order_by(Tag.name.asc(), Tag.id.asc())
    items = list(db.scalars(statement))
    return items, len(items)


def list_tags_with_articles(db: Session) -> tuple[list[Tag], int]:
    statement = (
        select(Tag)
        .options(selectinload(Tag.articles))
        .order_by(Tag.name.asc(), Tag.id.asc())
    )
    items = list(db.scalars(statement))
    return items, len(items)


def get_tag_by_id(db: Session, tag_id: int) -> Tag | None:
    statement = select(Tag).where(Tag.id == tag_id)
    return db.scalar(statement)


def get_tag_by_slug(db: Session, slug: str) -> Tag | None:
    statement = select(Tag).where(Tag.slug == slug)
    return db.scalar(statement)


def create_tag(db: Session, tag: Tag) -> Tag:
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def update_tag(db: Session, tag: Tag) -> Tag:
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag
