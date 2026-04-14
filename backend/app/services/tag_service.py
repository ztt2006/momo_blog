from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.tag import create_tag, get_tag_by_id, get_tag_by_slug, list_tags, update_tag
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate


def create_tag_for_admin(db: Session, payload: TagCreate) -> Tag:
    if get_tag_by_slug(db, payload.slug):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tag slug already exists")

    tag = Tag(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        color=payload.color,
    )
    return create_tag(db, tag)


def update_tag_for_admin(db: Session, tag_id: int, payload: TagUpdate) -> Tag:
    tag = get_tag_by_id(db, tag_id)
    if tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")

    existing = get_tag_by_slug(db, payload.slug)
    if existing and existing.id != tag_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tag slug already exists")

    tag.name = payload.name
    tag.slug = payload.slug
    tag.description = payload.description
    tag.color = payload.color
    return update_tag(db, tag)


def list_tags_for_admin(db: Session) -> tuple[list[Tag], int]:
    return list_tags(db)
