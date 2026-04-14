from pathlib import Path
from secrets import token_hex

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.crud.user import create_user, get_user_by_email, get_user_by_username, update_user
from app.models.user import User
from app.schemas.auth import LoginResponse, ProfileUpdateRequest, RegisterRequest


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


def update_current_user_profile(db: Session, current_user: User, payload: ProfileUpdateRequest) -> User:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user is not None and existing_user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    current_user.email = payload.email
    current_user.nickname = payload.nickname
    current_user.bio = payload.bio

    if payload.password:
        current_user.password_hash = get_password_hash(payload.password)

    return update_user(db, current_user)


def update_current_user_avatar(db: Session, current_user: User, file: UploadFile) -> User:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file selected")

    content = file.file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename).suffix.lower()
    filename = f"user-avatar-{current_user.id}-{token_hex(12)}{suffix}"
    destination = upload_dir / filename
    destination.write_bytes(content)

    previous_avatar = current_user.avatar
    current_user.avatar = f"/uploads/{filename}"
    updated_user = update_user(db, current_user)

    if previous_avatar and previous_avatar.startswith("/uploads/"):
        previous_file = upload_dir / previous_avatar.removeprefix("/uploads/")
        if previous_file.exists():
            previous_file.unlink()

    return updated_user
