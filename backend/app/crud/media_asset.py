from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.media_asset import MediaAsset


def create_media_asset(db: Session, media_asset: MediaAsset) -> MediaAsset:
    db.add(media_asset)
    db.commit()
    db.refresh(media_asset)
    return media_asset


def list_media_assets(db: Session) -> tuple[list[MediaAsset], int]:
    statement = select(MediaAsset).order_by(MediaAsset.created_at.desc(), MediaAsset.id.desc())
    items = list(db.scalars(statement))
    return items, len(items)


def get_media_asset_by_id(db: Session, media_asset_id: int) -> MediaAsset | None:
    statement = select(MediaAsset).where(MediaAsset.id == media_asset_id)
    return db.scalar(statement)


def delete_media_asset(db: Session, media_asset: MediaAsset) -> None:
    db.delete(media_asset)
    db.commit()
