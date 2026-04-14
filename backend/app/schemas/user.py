from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.auth import UserResponse


UserRole = Literal["superadmin", "admin", "user"]
class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    nickname: str | None = Field(default=None, max_length=100)
    role: UserRole
    is_active: bool = True


class UserUpdate(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    nickname: str | None = Field(default=None, max_length=100)
    role: UserRole
    is_active: bool = True
    password: str | None = Field(default=None, min_length=6, max_length=128)


class UserAdminResponse(UserResponse):
    pass
