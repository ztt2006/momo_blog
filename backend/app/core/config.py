from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Momo Blog API"
    app_version: str = "0.1.0"
    app_env: Literal["development", "testing", "production"] = "development"
    debug: bool = True

    api_v1_prefix: str = "/api"
    docs_url: str | None = "/docs"
    redoc_url: str | None = "/redoc"
    openapi_url: str | None = "/openapi.json"

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/momo_blog"
    cors_origins_raw: str = Field(
        default="http://localhost:5173,http://localhost:5174",
        validation_alias="CORS_ORIGINS",
    )

    secret_key: str = "please-change-me"
    access_token_expire_minutes: int = 1440
    upload_dir: str = "uploads"

    @property
    def cors_origins(self) -> list[str]:
        return [item.strip() for item in self.cors_origins_raw.split(",") if item.strip()]

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
