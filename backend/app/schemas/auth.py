from pydantic import BaseModel
from pydantic import Field

from app.schemas.common import ORMModel


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=6, max_length=128)
    nickname: str | None = Field(default=None, max_length=100)


class UserResponse(ORMModel):
    id: int
    username: str
    email: str
    nickname: str | None = None
    avatar: str | None = None
    role: str
    is_active: bool


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
