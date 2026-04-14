from app.core.config import settings
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.crud.user import get_user_by_email, get_user_by_username
from app.models.user import User


def ensure_admin_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    nickname: str | None = None,
) -> User:
    user = get_user_by_username(db, username) or get_user_by_email(db, email)

    if user is None:
        user = User(
            username=username,
            email=email,
            password_hash=get_password_hash(password),
            nickname=nickname,
            role="admin",
            is_active=True,
        )
        db.add(user)
    else:
        user.username = username
        user.email = email
        user.password_hash = get_password_hash(password)
        user.nickname = nickname
        user.role = "admin"
        user.is_active = True

    db.commit()
    db.refresh(user)
    return user


def ensure_superadmin_user(
    db: Session,
    username: str | None = None,
    email: str | None = None,
    password: str | None = None,
    nickname: str | None = None,
) -> User:
    final_username = username or settings.bootstrap_superadmin_username
    final_email = email or settings.bootstrap_superadmin_email
    final_password = password or settings.bootstrap_superadmin_password
    final_nickname = nickname or settings.bootstrap_superadmin_nickname

    user = get_user_by_username(db, final_username) or get_user_by_email(db, final_email)

    if user is None:
        user = User(
            username=final_username,
            email=final_email,
            password_hash=get_password_hash(final_password),
            nickname=final_nickname,
            role="superadmin",
            is_active=True,
        )
        db.add(user)
    else:
        user.username = final_username
        user.email = final_email
        user.password_hash = get_password_hash(final_password)
        user.nickname = final_nickname
        user.role = "superadmin"
        user.is_active = True

    db.commit()
    db.refresh(user)
    return user


def _upsert_seed_user(
    db: Session,
    *,
    username: str,
    email: str,
    password: str,
    nickname: str,
    role: str,
    is_active: bool,
) -> User:
    user = get_user_by_username(db, username) or get_user_by_email(db, email)

    if user is None:
        user = User(
            username=username,
            email=email,
            password_hash=get_password_hash(password),
            nickname=nickname,
            role=role,
            is_active=is_active,
        )
        db.add(user)
    else:
        user.username = username
        user.email = email
        user.password_hash = get_password_hash(password)
        user.nickname = nickname
        user.role = role
        user.is_active = is_active

    db.commit()
    db.refresh(user)
    return user


def seed_demo_users(
    db: Session,
    *,
    admin_count: int = 2,
    user_count: int = 8,
    inactive_user_count: int = 2,
    password: str = "123456",
) -> list[User]:
    seeded_users: list[User] = []

    seeded_users.append(ensure_superadmin_user(db))

    for index in range(1, admin_count + 1):
        seeded_users.append(
            _upsert_seed_user(
                db,
                username=f"admin{index:02d}",
                email=f"admin{index:02d}@example.com",
                password=password,
                nickname=f"Admin {index:02d}",
                role="admin",
                is_active=True,
            )
        )

    for index in range(1, user_count + 1):
        seeded_users.append(
            _upsert_seed_user(
                db,
                username=f"user{index:02d}",
                email=f"user{index:02d}@example.com",
                password=password,
                nickname=f"User {index:02d}",
                role="user",
                is_active=index > inactive_user_count,
            )
        )

    return seeded_users
