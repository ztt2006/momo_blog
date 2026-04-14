from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.article import Article
from app.models.category import Category


def list_categories(db: Session) -> tuple[list[Category], int]:
    statement = select(Category).order_by(Category.sort_order.asc(), Category.id.asc())
    items = list(db.scalars(statement))
    return items, len(items)


def list_visible_categories(db: Session) -> tuple[list[Category], int]:
    statement = (
        select(Category)
        .options(selectinload(Category.articles))
        .where(Category.is_visible.is_(True))
        .order_by(Category.sort_order.asc(), Category.id.asc())
    )
    items = list(db.scalars(statement))
    return items, len(items)


def get_category_by_id(db: Session, category_id: int) -> Category | None:
    statement = select(Category).where(Category.id == category_id)
    return db.scalar(statement)


def get_category_by_slug(db: Session, slug: str) -> Category | None:
    statement = select(Category).where(Category.slug == slug)
    return db.scalar(statement)


def create_category(db: Session, category: Category) -> Category:
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: Category) -> Category:
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
