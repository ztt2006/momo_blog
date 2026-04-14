from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.category import CategoryPublicArticleItem, CategoryPublicItem
from app.schemas.common import PaginatedResponse
from app.services.category_service import list_categories_for_public

router = APIRouter(prefix="/public/categories", tags=["public-categories"])


@router.get("", response_model=PaginatedResponse[CategoryPublicItem])
def get_public_categories(db: Session = Depends(get_db)) -> PaginatedResponse[CategoryPublicItem]:
    items, total = list_categories_for_public(db)

    return PaginatedResponse(
        total=total,
        items=[
            CategoryPublicItem(
                id=category.id,
                name=category.name,
                slug=category.slug,
                description=category.description,
                sort_order=category.sort_order,
                article_count=len(category.articles),
                articles=[
                    CategoryPublicArticleItem(
                        id=article.id,
                        title=article.title,
                        slug=article.slug,
                        summary=article.summary,
                        published_at=article.published_at.isoformat() if article.published_at else None,
                        reading_time=article.reading_time,
                        word_count=article.word_count,
                        cover_image_id=article.cover_image_id,
                    )
                    for article in category.articles
                ],
            )
            for category in items
        ],
    )
