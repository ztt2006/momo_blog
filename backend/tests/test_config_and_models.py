import os
import unittest

from app.core.config import Settings
from app.db.base import Base


class SettingsTests(unittest.TestCase):
    def setUp(self) -> None:
        self.original_env = os.environ.copy()

    def tearDown(self) -> None:
        os.environ.clear()
        os.environ.update(self.original_env)

    def test_settings_load_core_values_from_environment(self) -> None:
        os.environ["APP_NAME"] = "Momo Blog API"
        os.environ["APP_ENV"] = "development"
        os.environ["DATABASE_URL"] = "postgresql+psycopg://postgres:postgres@localhost:5432/momo_blog"
        os.environ["CORS_ORIGINS"] = "http://localhost:5173,http://localhost:5174"

        settings = Settings()

        self.assertEqual(settings.app_name, "Momo Blog API")
        self.assertEqual(settings.app_env, "development")
        self.assertEqual(
            settings.database_url,
            "postgresql+psycopg://postgres:postgres@localhost:5432/momo_blog",
        )
        self.assertEqual(
            settings.cors_origins,
            ["http://localhost:5173", "http://localhost:5174"],
        )


class MetadataTests(unittest.TestCase):
    def test_base_metadata_includes_core_blog_tables(self) -> None:
        expected_tables = {
            "users",
            "categories",
            "tags",
            "articles",
            "article_tags",
            "media_assets",
            "site_settings",
        }

        self.assertTrue(expected_tables.issubset(set(Base.metadata.tables.keys())))


if __name__ == "__main__":
    unittest.main()
