from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.crud.user import (
    create_user,
    delete_user,
    get_user_by_email,
    get_user_by_id,
    get_user_by_username,
    list_users,
    update_user,
)
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def list_users_for_superadmin(db: Session) -> tuple[list[User], int]:
    return list_users(db)


def create_user_for_superadmin(db: Session, payload: UserCreate) -> User:
    if payload.role == "superadmin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only one superadmin is allowed")
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        nickname=payload.nickname,
        role=payload.role,
        is_active=payload.is_active,
    )
    return create_user(db, user)


def update_user_for_superadmin(db: Session, user_id: int, payload: UserUpdate) -> User:
    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.role == "superadmin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Superadmin cannot be modified here")
    if payload.role == "superadmin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only one superadmin is allowed")

    existing_user = get_user_by_email(db, payload.email)
    if existing_user and existing_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user.email = payload.email
    user.nickname = payload.nickname
    user.role = payload.role
    user.is_active = payload.is_active
    if payload.password:
        user.password_hash = get_password_hash(payload.password)

    return update_user(db, user)


def delete_user_for_superadmin(db: Session, user_id: int) -> None:
    user = get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.role == "superadmin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Superadmin cannot be deleted")

    delete_user(db, user)
