from fastapi import APIRouter

from app.api import (
    admin_articles,
    admin_categories,
    admin_media,
    admin_site_settings,
    admin_tags,
    auth,
    public_articles,
    public_categories,
    public_site_settings,
    public_tags,
)
from app.core.config import settings


api_router = APIRouter(prefix=settings.api_v1_prefix)
api_router.include_router(auth.router)
api_router.include_router(admin_articles.router)
api_router.include_router(admin_categories.router)
api_router.include_router(admin_tags.router)
api_router.include_router(admin_media.router)
api_router.include_router(admin_site_settings.router)
api_router.include_router(public_articles.router)
api_router.include_router(public_categories.router)
api_router.include_router(public_tags.router)
api_router.include_router(public_site_settings.router)
