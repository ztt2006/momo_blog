from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.site_setting import SiteSettingResponse, SiteSettingUpdate
from app.services.site_service import get_site_setting_for_admin, update_site_setting_for_admin

router = APIRouter(prefix="/admin/site-settings", tags=["admin-site-settings"])


@router.get("", response_model=SiteSettingResponse)
def get_site_settings(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> SiteSettingResponse:
    return get_site_setting_for_admin(db)


@router.put("", response_model=SiteSettingResponse)
def update_site_settings(
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> SiteSettingResponse:
    return update_site_setting_for_admin(db, payload)
