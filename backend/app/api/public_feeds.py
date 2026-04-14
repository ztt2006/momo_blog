from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.article_service import list_public_articles
from app.services.seo_service import build_robots_txt, build_rss_xml, build_sitemap_xml
from app.services.site_service import get_site_setting_for_public

router = APIRouter(tags=["public-feeds"])


@router.get("/sitemap.xml", response_class=Response)
def sitemap(db: Session = Depends(get_db)) -> Response:
    site_setting = get_site_setting_for_public(db)
    articles, _ = list_public_articles(db)
    return Response(
        content=build_sitemap_xml(site_setting, articles),
        media_type="application/xml",
    )


@router.get("/robots.txt", response_class=Response)
def robots() -> Response:
    return Response(content=build_robots_txt(), media_type="text/plain")


@router.get("/rss.xml", response_class=Response)
def rss(db: Session = Depends(get_db)) -> Response:
    site_setting = get_site_setting_for_public(db)
    articles, _ = list_public_articles(db)
    return Response(
        content=build_rss_xml(site_setting, articles),
        media_type="application/rss+xml",
    )
