from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud.category import (
    create_category,
    get_category_by_id,
    get_category_by_slug,
    list_categories,
    list_visible_categories,
    update_category,
)
from app.models.article import Article
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category_for_admin(db: Session, payload: CategoryCreate) -> Category:
    if get_category_by_slug(db, payload.slug):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category slug already exists")

    category = Category(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        sort_order=payload.sort_order,
        is_visible=payload.is_visible,
    )
    return create_category(db, category)


def update_category_for_admin(db: Session, category_id: int, payload: CategoryUpdate) -> Category:
    category = get_category_by_id(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    existing = get_category_by_slug(db, payload.slug)
    if existing and existing.id != category_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category slug already exists")

    category.name = payload.name
    category.slug = payload.slug
    category.description = payload.description
    category.sort_order = payload.sort_order
    category.is_visible = payload.is_visible
    return update_category(db, category)


def list_categories_for_admin(db: Session) -> tuple[list[Category], int]:
    return list_categories(db)


def list_categories_for_public(db: Session) -> tuple[list[Category], int]:
    categories, _ = list_visible_categories(db)

    visible_items = []
    for category in categories:
        published_articles = [article for article in category.articles if article.status == "published"]
        published_articles.sort(
            key=lambda article: (
                article.published_at is not None,
                article.published_at or article.created_at,
                article.created_at,
            ),
            reverse=True,
        )

        if not published_articles:
            continue

        category.articles = published_articles
        visible_items.append(category)

    return visible_items, len(visible_items)
