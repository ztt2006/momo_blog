from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.article import ArticlePublicDetail, ArticlePublicItem
from app.schemas.category import CategoryPublicSummary
from app.schemas.common import PaginatedResponse
from app.schemas.tag import TagPublicSummary
from app.services.article_service import (
    get_article_toc,
    get_public_article_navigation,
    get_public_article_or_404,
    get_related_public_articles,
    list_public_articles,
)

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
        cover_image_url=article.cover_image.file_url if article.cover_image else None,
    )


@router.get("", response_model=PaginatedResponse[ArticlePublicItem])
def get_published_articles(db: Session = Depends(get_db)) -> PaginatedResponse[ArticlePublicItem]:
    items, total = list_public_articles(db)
    return PaginatedResponse(total=total, items=[_serialize_public_article(item) for item in items])


@router.get("/{slug}", response_model=ArticlePublicDetail)
def get_published_article(slug: str, db: Session = Depends(get_db)) -> ArticlePublicDetail:
    article = get_public_article_or_404(db, slug)
    previous_article, next_article = get_public_article_navigation(db, article)

    return ArticlePublicDetail(
        id=article.id,
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        published_at=article.published_at,
        reading_time=article.reading_time,
        word_count=article.word_count,
        cover_image_id=article.cover_image_id,
        cover_image_url=article.cover_image.file_url if article.cover_image else None,
        content_md=article.content_md,
        category=CategoryPublicSummary(
            id=article.category.id,
            name=article.category.name,
            slug=article.category.slug,
        )
        if article.category
        else None,
        tags=[
            TagPublicSummary(
                id=tag.id,
                name=tag.name,
                slug=tag.slug,
                color=tag.color,
            )
            for tag in article.tags
        ],
        toc=get_article_toc(article),
        previous_article=previous_article,
        next_article=next_article,
        related_articles=get_related_public_articles(db, article),
        allow_comment=article.allow_comment,
    )
