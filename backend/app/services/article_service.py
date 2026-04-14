from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.article import (
    create_article,
    get_article_by_id,
    get_article_by_slug,
    list_articles,
    list_published_articles,
    update_article,
)
from app.models.article import Article
from app.models.tag import Tag
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleUpdate


def _estimate_word_count(content_md: str) -> int:
    return len([word for word in content_md.split() if word.strip()])


def _estimate_reading_time(content_md: str) -> int:
    word_count = _estimate_word_count(content_md)
    return max(1, (word_count + 199) // 200) if word_count else 1


def _resolve_tags(db: Session, tag_ids: list[int]) -> list[Tag]:
    if not tag_ids:
        return []
    statement = select(Tag).where(Tag.id.in_(tag_ids))
    return list(db.scalars(statement))


def create_article_for_admin(db: Session, payload: ArticleCreate, author: User) -> Article:
    if get_article_by_slug(db, payload.slug):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Article slug already exists")

    article = Article(
        title=payload.title,
        slug=payload.slug,
        summary=payload.summary,
        content_md=payload.content_md,
        status=payload.status,
        category_id=payload.category_id,
        cover_image_id=payload.cover_image_id,
        author_id=author.id,
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        seo_keywords=payload.seo_keywords,
        is_top=payload.is_top,
        allow_comment=payload.allow_comment,
        reading_time=_estimate_reading_time(payload.content_md),
        word_count=_estimate_word_count(payload.content_md),
        published_at=payload.published_at,
    )
    if article.status == "published" and article.published_at is None:
        article.published_at = datetime.now(UTC)
    article.tags = _resolve_tags(db, payload.tag_ids)
    return create_article(db, article)


def update_article_for_admin(db: Session, article_id: int, payload: ArticleUpdate) -> Article:
    article = get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")

    existing = get_article_by_slug(db, payload.slug)
    if existing and existing.id != article_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Article slug already exists")

    article.title = payload.title
    article.slug = payload.slug
    article.summary = payload.summary
    article.content_md = payload.content_md
    article.status = payload.status
    article.category_id = payload.category_id
    article.cover_image_id = payload.cover_image_id
    article.seo_title = payload.seo_title
    article.seo_description = payload.seo_description
    article.seo_keywords = payload.seo_keywords
    article.is_top = payload.is_top
    article.allow_comment = payload.allow_comment
    article.word_count = _estimate_word_count(payload.content_md)
    article.reading_time = _estimate_reading_time(payload.content_md)
    article.published_at = payload.published_at
    if article.status == "published" and article.published_at is None:
        article.published_at = datetime.now(UTC)
    article.tags = _resolve_tags(db, payload.tag_ids)
    return update_article(db, article)


def get_admin_article_or_404(db: Session, article_id: int) -> Article:
    article = get_article_by_id(db, article_id)
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return article


def list_admin_articles(db: Session) -> tuple[list[Article], int]:
    return list_articles(db)


def list_public_articles(db: Session) -> tuple[list[Article], int]:
    return list_published_articles(db)


def get_public_article_or_404(db: Session, slug: str) -> Article:
    article = get_article_by_slug(db, slug)
    if article is None or article.status != "published":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return article
