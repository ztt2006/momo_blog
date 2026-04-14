from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.article import Article


def create_article(db: Session, article: Article) -> Article:
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


def get_article_by_id(db: Session, article_id: int) -> Article | None:
    statement = (
        select(Article)
        .options(selectinload(Article.cover_image))
        .options(selectinload(Article.category))
        .options(selectinload(Article.tags))
        .where(Article.id == article_id)
    )
    return db.scalar(statement)


def get_article_by_slug(db: Session, slug: str) -> Article | None:
    statement = (
        select(Article)
        .options(selectinload(Article.cover_image))
        .options(selectinload(Article.category))
        .options(selectinload(Article.tags))
        .where(Article.slug == slug)
    )
    return db.scalar(statement)


def list_articles(db: Session) -> tuple[list[Article], int]:
    items = list(
        db.scalars(
            select(Article)
            .options(selectinload(Article.cover_image))
            .options(selectinload(Article.category))
            .options(selectinload(Article.tags))
            .order_by(Article.created_at.desc())
        )
    )
    total = db.scalar(select(func.count()).select_from(Article)) or 0
    return items, total


def list_published_articles(db: Session) -> tuple[list[Article], int]:
    statement = (
        select(Article)
        .options(selectinload(Article.cover_image))
        .options(selectinload(Article.category))
        .options(selectinload(Article.tags))
        .where(Article.status == "published")
        .order_by(Article.published_at.desc(), Article.created_at.desc())
    )
    items = list(db.scalars(statement))
    total = db.scalar(select(func.count()).select_from(Article).where(Article.status == "published")) or 0
    return items, total


def get_previous_published_article(db: Session, article: Article) -> Article | None:
    statement = (
        select(Article)
        .options(selectinload(Article.cover_image))
        .where(Article.status == "published")
        .where(
            or_(
                Article.published_at < article.published_at,
                (Article.published_at == article.published_at) & (Article.id < article.id),
            )
        )
        .order_by(Article.published_at.desc(), Article.id.desc())
        .limit(1)
    )
    return db.scalar(statement)


def get_next_published_article(db: Session, article: Article) -> Article | None:
    statement = (
        select(Article)
        .options(selectinload(Article.cover_image))
        .where(Article.status == "published")
        .where(
            or_(
                Article.published_at > article.published_at,
                (Article.published_at == article.published_at) & (Article.id > article.id),
            )
        )
        .order_by(Article.published_at.asc(), Article.id.asc())
        .limit(1)
    )
    return db.scalar(statement)


def list_related_published_articles(db: Session, article: Article, limit: int = 3) -> list[Article]:
    items = list(
        db.scalars(
            select(Article)
            .options(selectinload(Article.cover_image))
            .options(selectinload(Article.tags))
            .where(Article.status == "published")
            .where(Article.id != article.id)
            .order_by(Article.published_at.desc(), Article.created_at.desc())
        )
    )

    article_tag_ids = {tag.id for tag in article.tags}

    def score(candidate: Article) -> tuple[int, int]:
        candidate_tag_ids = {tag.id for tag in candidate.tags}
        shared_tags = len(article_tag_ids & candidate_tag_ids)
        shared_category = 1 if article.category_id and article.category_id == candidate.category_id else 0
        return shared_category, shared_tags

    ranked = [candidate for candidate in items if score(candidate) != (0, 0)]
    ranked.sort(
        key=lambda candidate: (
            score(candidate)[0],
            score(candidate)[1],
            candidate.published_at or candidate.created_at,
            candidate.id,
        ),
        reverse=True,
    )
    return ranked[:limit]


def update_article(db: Session, article: Article) -> Article:
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


def delete_article(db: Session, article: Article) -> None:
    db.delete(article)
    db.commit()
