from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.common import PaginatedResponse
from app.services.category_service import create_category_for_admin, list_categories_for_admin, update_category_for_admin

router = APIRouter(prefix="/admin/categories", tags=["admin-categories"])


@router.get("", response_model=PaginatedResponse[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PaginatedResponse[CategoryResponse]:
    items, total = list_categories_for_admin(db)
    return PaginatedResponse(total=total, items=items)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> CategoryResponse:
    return create_category_for_admin(db, payload)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> CategoryResponse:
    return update_category_for_admin(db, category_id, payload)
