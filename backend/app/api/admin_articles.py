from fastapi import APIRouter
from fastapi import Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.article import ArticleAdminResponse, ArticleCreate, ArticleUpdate
from app.schemas.common import PaginatedResponse
from app.services.article_service import (
    create_article_for_admin,
    get_admin_article_or_404,
    list_admin_articles,
    update_article_for_admin,
)

router = APIRouter(prefix="/admin/articles", tags=["admin-articles"])


def _serialize_admin_article(article) -> ArticleAdminResponse:
    return ArticleAdminResponse(
        id=article.id,
        title=article.title,
        slug=article.slug,
        summary=article.summary,
        content_md=article.content_md,
        status=article.status,
        category_id=article.category_id,
        cover_image_id=article.cover_image_id,
        author_id=article.author_id,
        seo_title=article.seo_title,
        seo_description=article.seo_description,
        seo_keywords=article.seo_keywords,
        is_top=article.is_top,
        allow_comment=article.allow_comment,
        published_at=article.published_at,
        created_at=article.created_at,
        updated_at=article.updated_at,
        tag_ids=[tag.id for tag in article.tags],
    )


@router.get("", response_model=PaginatedResponse[ArticleAdminResponse])
def get_articles(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PaginatedResponse[ArticleAdminResponse]:
    items, total = list_admin_articles(db)
    return PaginatedResponse(total=total, items=[_serialize_admin_article(item) for item in items])


@router.post("", response_model=ArticleAdminResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    payload: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ArticleAdminResponse:
    article = create_article_for_admin(db, payload, current_user)
    return _serialize_admin_article(article)


@router.get("/{article_id}", response_model=ArticleAdminResponse)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ArticleAdminResponse:
    article = get_admin_article_or_404(db, article_id)
    return _serialize_admin_article(article)


@router.put("/{article_id}", response_model=ArticleAdminResponse)
def update_article(
    article_id: int,
    payload: ArticleUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ArticleAdminResponse:
    article = update_article_for_admin(db, article_id, payload)
    return _serialize_admin_article(article)
