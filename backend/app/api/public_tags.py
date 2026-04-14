from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.tag import TagPublicArticleItem, TagPublicItem
from app.services.tag_service import list_tags_for_public

router = APIRouter(prefix="/public/tags", tags=["public-tags"])


@router.get("", response_model=PaginatedResponse[TagPublicItem])
def get_public_tags(db: Session = Depends(get_db)) -> PaginatedResponse[TagPublicItem]:
    items, total = list_tags_for_public(db)

    return PaginatedResponse(
        total=total,
        items=[
            TagPublicItem(
                id=tag.id,
                name=tag.name,
                slug=tag.slug,
                description=tag.description,
                color=tag.color,
                article_count=len(tag.articles),
                articles=[
                    TagPublicArticleItem(
                        id=article.id,
                        title=article.title,
                        slug=article.slug,
                        summary=article.summary,
                        published_at=article.published_at.isoformat() if article.published_at else None,
                        reading_time=article.reading_time,
                        word_count=article.word_count,
                        cover_image_id=article.cover_image_id,
                    )
                    for article in tag.articles
                ],
            )
            for tag in items
        ],
    )
