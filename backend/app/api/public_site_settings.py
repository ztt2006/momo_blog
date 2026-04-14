from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.site_setting import SiteSettingResponse
from app.services.site_service import get_site_setting_for_public

router = APIRouter(prefix="/public/site-settings", tags=["public-site-settings"])


@router.get("", response_model=SiteSettingResponse)
def get_public_site_settings(db: Session = Depends(get_db)) -> SiteSettingResponse:
    return get_site_setting_for_public(db)
