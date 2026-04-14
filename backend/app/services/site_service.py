from sqlalchemy.orm import Session

from app.crud.site_setting import create_site_setting, get_site_setting, update_site_setting
from app.models.site_setting import SiteSetting
from app.schemas.site_setting import SiteSettingUpdate


def _build_default_site_setting() -> SiteSetting:
    return SiteSetting(
        site_name="Momo Notes",
        site_subtitle="写给未来的自己，也偶尔分享给路过的人。",
        site_description="一个慢慢生长的个人博客，记录技术、项目和日常思考。",
        site_keywords="个人博客,技术笔记,React,FastAPI",
        about_markdown="## 关于这个博客\n\n这里记录长期可回看的技术笔记与项目复盘。",
    )


def get_or_create_site_setting(db: Session) -> SiteSetting:
    site_setting = get_site_setting(db)
    if site_setting is not None:
      return site_setting
    return create_site_setting(db, _build_default_site_setting())


def get_site_setting_for_admin(db: Session) -> SiteSetting:
    return get_or_create_site_setting(db)


def update_site_setting_for_admin(db: Session, payload: SiteSettingUpdate) -> SiteSetting:
    site_setting = get_or_create_site_setting(db)
    site_setting.site_name = payload.site_name
    site_setting.site_subtitle = payload.site_subtitle
    site_setting.site_description = payload.site_description
    site_setting.site_keywords = payload.site_keywords
    site_setting.logo = payload.logo
    site_setting.favicon = payload.favicon
    site_setting.github_url = payload.github_url
    site_setting.about_markdown = payload.about_markdown
    site_setting.icp = payload.icp
    site_setting.public_email = payload.public_email
    return update_site_setting(db, site_setting)


def get_site_setting_for_public(db: Session) -> SiteSetting:
    return get_or_create_site_setting(db)
