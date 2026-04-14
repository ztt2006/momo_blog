from sqlalchemy import func, select
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
        .options(selectinload(Article.tags))
        .where(Article.id == article_id)
    )
    return db.scalar(statement)


def get_article_by_slug(db: Session, slug: str) -> Article | None:
    statement = (
        select(Article)
        .options(selectinload(Article.tags))
        .where(Article.slug == slug)
    )
    return db.scalar(statement)


def list_articles(db: Session) -> tuple[list[Article], int]:
    items = list(
        db.scalars(
            select(Article)
            .options(selectinload(Article.tags))
            .order_by(Article.created_at.desc())
        )
    )
    total = db.scalar(select(func.count()).select_from(Article)) or 0
    return items, total


def list_published_articles(db: Session) -> tuple[list[Article], int]:
    statement = select(Article).where(Article.status == "published").order_by(Article.published_at.desc(), Article.created_at.desc())
    items = list(db.scalars(statement))
    total = db.scalar(select(func.count()).select_from(Article).where(Article.status == "published")) or 0
    return items, total


def update_article(db: Session, article: Article) -> Article:
    db.add(article)
    db.commit()
    db.refresh(article)
    return article
