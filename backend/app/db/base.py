from datetime import datetime

from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=naming_convention)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class PrimaryKeyMixin:
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)


from app.models import article  # noqa: E402,F401
from app.models import article_tag  # noqa: E402,F401
from app.models import category  # noqa: E402,F401
from app.models import media_asset  # noqa: E402,F401
from app.models import site_setting  # noqa: E402,F401
from app.models import tag  # noqa: E402,F401
from app.models import user  # noqa: E402,F401
