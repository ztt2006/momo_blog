from pydantic import BaseModel

from app.schemas.common import ORMModel


class LoginRequest(BaseModel):
    username: str
    password: str


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
