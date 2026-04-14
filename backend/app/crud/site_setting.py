from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting


def get_site_setting(db: Session) -> SiteSetting | None:
    statement = select(SiteSetting).order_by(SiteSetting.id.asc())
    return db.scalar(statement)


def create_site_setting(db: Session, site_setting: SiteSetting) -> SiteSetting:
    db.add(site_setting)
    db.commit()
    db.refresh(site_setting)
    return site_setting


def update_site_setting(db: Session, site_setting: SiteSetting) -> SiteSetting:
    db.add(site_setting)
    db.commit()
    db.refresh(site_setting)
    return site_setting
