from pathlib import Path
from secrets import token_hex

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud.media_asset import create_media_asset, delete_media_asset, get_media_asset_by_id, list_media_assets
from app.models.media_asset import MediaAsset
from app.models.user import User


def _build_filename(original_name: str) -> str:
    suffix = Path(original_name).suffix.lower()
    return f"{token_hex(16)}{suffix}"


def create_media_asset_for_admin(db: Session, file: UploadFile, current_user: User) -> MediaAsset:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file selected")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    content = file.file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")

    filename = _build_filename(file.filename)
    destination = upload_dir / filename
    destination.write_bytes(content)

    media_asset = MediaAsset(
        filename=filename,
        original_name=file.filename,
        mime_type=file.content_type or "application/octet-stream",
        file_size=len(content),
        storage_type="local",
        file_path=str(destination.resolve()),
        file_url=f"/uploads/{filename}",
        uploaded_by=current_user.id,
    )

    return create_media_asset(db, media_asset)


def list_media_assets_for_admin(db: Session) -> tuple[list[MediaAsset], int]:
    return list_media_assets(db)


def get_media_asset_or_none(db: Session, media_asset_id: int | None) -> MediaAsset | None:
    if media_asset_id is None:
        return None
    return get_media_asset_by_id(db, media_asset_id)


def delete_media_asset_for_admin(db: Session, media_asset_id: int) -> None:
    media_asset = get_media_asset_by_id(db, media_asset_id)
    if media_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")

    file_path = Path(media_asset.file_path)

    for article in list(media_asset.articles):
        article.cover_image = None

    delete_media_asset(db, media_asset)

    if file_path.exists():
        file_path.unlink()
