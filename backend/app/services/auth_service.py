from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.crud.user import create_user, get_user_by_email, get_user_by_username
from app.models.user import User
from app.schemas.auth import LoginResponse, RegisterRequest


def ensure_bootstrap_superadmin(db: Session) -> User:
    bootstrap_user = get_user_by_username(db, settings.bootstrap_superadmin_username)
    if bootstrap_user is not None:
        if bootstrap_user.role != "superadmin":
            bootstrap_user.role = "superadmin"
            bootstrap_user.is_active = True
            db.add(bootstrap_user)
            db.commit()
            db.refresh(bootstrap_user)
        return bootstrap_user

    bootstrap_user = User(
        username=settings.bootstrap_superadmin_username,
        email=settings.bootstrap_superadmin_email,
        password_hash=get_password_hash(settings.bootstrap_superadmin_password),
        nickname=settings.bootstrap_superadmin_nickname,
        role="superadmin",
        is_active=True,
    )
    return create_user(db, bootstrap_user)


def authenticate_user(db: Session, username: str, password: str) -> User:
    ensure_bootstrap_superadmin(db)
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


def register_user(db: Session, payload: RegisterRequest) -> LoginResponse:
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user = User(
        username=payload.username,
        email=str(payload.email),
        password_hash=get_password_hash(payload.password),
        nickname=payload.nickname,
        role="user",
        is_active=True,
    )
    created_user = create_user(db, user)
    access_token = create_access_token(str(created_user.id))
    return LoginResponse(access_token=access_token, user=created_user)
