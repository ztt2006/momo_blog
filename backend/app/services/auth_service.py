from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.crud.user import get_user_by_username
from app.models.user import User
from app.schemas.auth import LoginResponse


def authenticate_user(db: Session, username: str, password: str) -> User:
    user = get_user_by_username(db, username)
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive",
        )
    return user


def login_user(db: Session, username: str, password: str) -> LoginResponse:
    user = authenticate_user(db, username, password)
    access_token = create_access_token(str(user.id))
    return LoginResponse(access_token=access_token, user=user)
