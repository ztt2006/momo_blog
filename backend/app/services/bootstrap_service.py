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
