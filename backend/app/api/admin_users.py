from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_superadmin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.user import UserAdminResponse, UserCreate, UserUpdate
from app.services.user_service import (
    create_user_for_superadmin,
    delete_user_for_superadmin,
    list_users_for_superadmin,
    update_user_for_superadmin,
)

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("", response_model=PaginatedResponse[UserAdminResponse])
def get_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_superadmin_user),
) -> PaginatedResponse[UserAdminResponse]:
    items, total = list_users_for_superadmin(db)
    return PaginatedResponse(total=total, items=items)


@router.post("", response_model=UserAdminResponse, status_code=status.HTTP_201_CREATED)
def create_user_item(
    payload: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_superadmin_user),
) -> UserAdminResponse:
    return create_user_for_superadmin(db, payload)


@router.put("/{user_id}", response_model=UserAdminResponse)
def update_user_item(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_superadmin_user),
) -> UserAdminResponse:
    return update_user_for_superadmin(db, user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_item(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_superadmin_user),
) -> Response:
    delete_user_for_superadmin(db, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
