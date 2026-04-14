from datetime import UTC, datetime
import re

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.article import (
    create_article,
    get_article_by_id,
    get_article_by_slug,
    get_next_published_article,
    get_previous_published_article,
    list_articles,
    list_published_articles,
    list_related_published_articles,
    update_article,
)
from app.crud.media_asset import get_media_asset_by_id
from app.models.article import Article
from app.models.tag import Tag
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticlePublicItem, ArticleTocItem, ArticleUpdate

HEADING_PATTERN = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.MULTILINE)


def _slugify_heading(value: str) -> str:
    normalized = re.sub(r"[^\w\u4e00-\u9fff\s-]", "", value.strip().lower())
    normalized = re.sub(r"\s+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized or "section"


def _extract_toc(content_md: str) -> list[dict[str, str | int]]:
    toc: list[dict[str, str | int]] = []
    slug_counts: dict[str, int] = {}

    for match in HEADING_PATTERN.finditer(content_md):
        level = len(match.group(1))
        text = match.group(2).strip()
        base_id = _slugify_heading(text)
        current_count = slug_counts.get(base_id, 0)
        slug_counts[base_id] = current_count + 1
        heading_id = base_id if current_count == 0 else f"{base_id}-{current_count + 1}"
        toc.append({"id": heading_id, "text": text, "level": level})

    return toc


def _serialize_public_article_item(article: Article | None) -> ArticlePublicItem | None:
    if article is None:
        return None

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


def _validate_cover_image(db: Session, cover_image_id: int | None) -> int | None:
    if cover_image_id is None:
        return None
    media_asset = get_media_asset_by_id(db, cover_image_id)
    if media_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover image not found")
    return media_asset.id


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
        cover_image_id=_validate_cover_image(db, payload.cover_image_id),
        author_id=author.id,
        seo_title=payload.seo_title,
        seo_description=payload.seo_description,
        seo_keywords=payload.seo_keywords,
        is_top=payload.is_top,
        allow_comment=payload.allow_comment,
        toc_json=_extract_toc(payload.content_md),
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
    article.cover_image_id = _validate_cover_image(db, payload.cover_image_id)
    article.seo_title = payload.seo_title
    article.seo_description = payload.seo_description
    article.seo_keywords = payload.seo_keywords
    article.is_top = payload.is_top
    article.allow_comment = payload.allow_comment
    article.toc_json = _extract_toc(payload.content_md)
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


def get_article_toc(article: Article) -> list[ArticleTocItem]:
    toc_source = article.toc_json if isinstance(article.toc_json, list) else _extract_toc(article.content_md)
    return [ArticleTocItem(id=str(item["id"]), text=str(item["text"]), level=int(item["level"])) for item in toc_source]


def get_public_article_navigation(db: Session, article: Article) -> tuple[ArticlePublicItem | None, ArticlePublicItem | None]:
    previous_article = get_previous_published_article(db, article)
    next_article = get_next_published_article(db, article)
    return _serialize_public_article_item(previous_article), _serialize_public_article_item(next_article)


def get_related_public_articles(db: Session, article: Article, limit: int = 3) -> list[ArticlePublicItem]:
    return [
        _serialize_public_article_item(item)
        for item in list_related_published_articles(db, article, limit=limit)
        if item is not None
    ]
