from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.article import ArticlePublicDetail, ArticlePublicItem
from app.schemas.common import PaginatedResponse
from app.services.article_service import get_public_article_or_404, list_public_articles

router = APIRouter(prefix="/public/articles", tags=["public-articles"])


def _serialize_public_article(article) -> ArticlePublicItem:
    return ArticlePublicItem(
        id=article.id,
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        published_at=article.published_at,
        reading_time=article.reading_time,
        word_count=article.word_count,
        cover_image_id=article.cover_image_id,
    )


@router.get("", response_model=PaginatedResponse[ArticlePublicItem])
def get_published_articles(db: Session = Depends(get_db)) -> PaginatedResponse[ArticlePublicItem]:
    items, total = list_public_articles(db)
    return PaginatedResponse(total=total, items=[_serialize_public_article(item) for item in items])


@router.get("/{slug}", response_model=ArticlePublicDetail)
def get_published_article(slug: str, db: Session = Depends(get_db)) -> ArticlePublicDetail:
    article = get_public_article_or_404(db, slug)
    return ArticlePublicDetail(
        id=article.id,
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        published_at=article.published_at,
        reading_time=article.reading_time,
        word_count=article.word_count,
        cover_image_id=article.cover_image_id,
        content_md=article.content_md,
    )
