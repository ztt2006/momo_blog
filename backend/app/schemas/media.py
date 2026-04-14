from datetime import datetime

from app.schemas.common import ORMModel


class MediaAssetResponse(ORMModel):
    id: int
    filename: str
    original_name: str
    mime_type: str
    file_size: int
    storage_type: str
    file_url: str | None = None
    width: int | None = None
    height: int | None = None
    uploaded_by: int | None = None
    created_at: datetime
    updated_at: datetime
