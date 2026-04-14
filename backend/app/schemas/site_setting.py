from pydantic import BaseModel, Field

from app.schemas.common import ORMModel


class SiteSettingBase(BaseModel):
    site_name: str = Field(min_length=1, max_length=120)
    site_subtitle: str | None = Field(default=None, max_length=255)
    site_description: str | None = Field(default=None, max_length=500)
    site_keywords: str | None = Field(default=None, max_length=255)
    logo: str | None = Field(default=None, max_length=500)
    favicon: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)
    about_markdown: str | None = None
    icp: str | None = Field(default=None, max_length=255)
    public_email: str | None = Field(default=None, max_length=255)


class SiteSettingUpdate(SiteSettingBase):
    pass


class SiteSettingResponse(ORMModel):
    id: int
    site_name: str
    site_subtitle: str | None = None
    site_description: str | None = None
    site_keywords: str | None = None
    logo: str | None = None
    favicon: str | None = None
    github_url: str | None = None
    about_markdown: str | None = None
    icp: str | None = None
    public_email: str | None = None
