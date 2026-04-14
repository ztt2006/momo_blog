from fastapi import APIRouter, Depends, File, Response, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.media import MediaAssetResponse
from app.services.media_service import create_media_asset_for_admin, delete_media_asset_for_admin, list_media_assets_for_admin

router = APIRouter(prefix="/admin/media", tags=["admin-media"])


def _serialize_media_asset(media_asset) -> MediaAssetResponse:
    return MediaAssetResponse(
        id=media_asset.id,
        filename=media_asset.filename,
        original_name=media_asset.original_name,
        mime_type=media_asset.mime_type,
        file_size=media_asset.file_size,
        storage_type=media_asset.storage_type,
        file_url=media_asset.file_url,
        width=media_asset.width,
        height=media_asset.height,
        uploaded_by=media_asset.uploaded_by,
        created_at=media_asset.created_at,
        updated_at=media_asset.updated_at,
    )


@router.get("", response_model=PaginatedResponse[MediaAssetResponse])
def get_media_assets(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
) -> PaginatedResponse[MediaAssetResponse]:
    items, total = list_media_assets_for_admin(db)
    return PaginatedResponse(total=total, items=[_serialize_media_asset(item) for item in items])


@router.post("/upload", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
def upload_media_asset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> MediaAssetResponse:
    media_asset = create_media_asset_for_admin(db, file, current_user)
    return _serialize_media_asset(media_asset)


@router.delete("/{media_asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset_item(
    media_asset_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin_user),
) -> Response:
    delete_media_asset_for_admin(db, media_asset_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
