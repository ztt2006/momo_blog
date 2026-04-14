import unittest
from collections.abc import Generator

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models.user import User


class AuthAndArticleApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
            class_=Session,
        )
        Base.metadata.create_all(self.engine)

        self.app = create_app()

        def override_get_db() -> Generator[Session, None, None]:
            db = self.session_factory()
            try:
                yield db
            finally:
                db.close()

        self.app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(self.app)

        with self.session_factory() as db:
            admin_user = User(
                username="admin",
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),
                nickname="Admin",
            )
            db.add(admin_user)
            db.commit()

    def tearDown(self) -> None:
        self.app.dependency_overrides.clear()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_login_and_get_current_user(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "admin123"},
        )

        self.assertEqual(login_response.status_code, 200)
        login_data = login_response.json()
        self.assertIn("access_token", login_data)
        self.assertEqual(login_data["user"]["username"], "admin")

        me_response = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {login_data['access_token']}"},
        )

        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.json()["username"], "admin")

    def test_admin_article_crud_and_public_visibility(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "admin123"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        create_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "My First Post",
                "slug": "my-first-post",
                "summary": "Short summary",
                "content_md": "# Hello",
                "status": "published",
            },
            headers=headers,
        )

        self.assertEqual(create_response.status_code, 201)
        created = create_response.json()
        self.assertEqual(created["title"], "My First Post")
        self.assertEqual(created["status"], "published")
        article_id = created["id"]

        admin_detail_response = self.client.get(f"/api/admin/articles/{article_id}", headers=headers)
        self.assertEqual(admin_detail_response.status_code, 200)
        self.assertEqual(admin_detail_response.json()["slug"], "my-first-post")

        update_response = self.client.put(
            f"/api/admin/articles/{article_id}",
            json={
                "title": "My Updated Post",
                "slug": "my-first-post",
                "summary": "Updated summary",
                "content_md": "# Updated",
                "status": "published",
            },
            headers=headers,
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()["title"], "My Updated Post")

        admin_list_response = self.client.get("/api/admin/articles", headers=headers)
        self.assertEqual(admin_list_response.status_code, 200)
        self.assertEqual(admin_list_response.json()["total"], 1)

        public_list_response = self.client.get("/api/public/articles")
        self.assertEqual(public_list_response.status_code, 200)
        self.assertEqual(public_list_response.json()["total"], 1)
        self.assertEqual(public_list_response.json()["items"][0]["slug"], "my-first-post")

        public_detail_response = self.client.get("/api/public/articles/my-first-post")
        self.assertEqual(public_detail_response.status_code, 200)
        self.assertEqual(public_detail_response.json()["title"], "My Updated Post")

    def test_admin_category_and_tag_crud_and_article_relation(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "admin123"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        category_response = self.client.post(
            "/api/admin/categories",
            json={
                "name": "React",
                "slug": "react",
                "description": "React related notes",
                "sort_order": 10,
                "is_visible": True,
            },
            headers=headers,
        )
        self.assertEqual(category_response.status_code, 201)
        category = category_response.json()

        tag_response = self.client.post(
            "/api/admin/tags",
            json={
                "name": "FastAPI",
                "slug": "fastapi",
                "description": "FastAPI notes",
                "color": "#2563eb",
            },
            headers=headers,
        )
        self.assertEqual(tag_response.status_code, 201)
        tag = tag_response.json()

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Organized Post",
                "slug": "organized-post",
                "summary": "With category and tag",
                "content_md": "# Organized",
                "status": "published",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)
        article = article_response.json()
        self.assertEqual(article["category_id"], category["id"])
        self.assertEqual(article["tag_ids"], [tag["id"]])

        category_list_response = self.client.get("/api/admin/categories", headers=headers)
        self.assertEqual(category_list_response.status_code, 200)
        self.assertEqual(category_list_response.json()["total"], 1)

        tag_list_response = self.client.get("/api/admin/tags", headers=headers)
        self.assertEqual(tag_list_response.status_code, 200)
        self.assertEqual(tag_list_response.json()["total"], 1)

        category_update_response = self.client.put(
            f"/api/admin/categories/{category['id']}",
            json={
                "name": "React Updated",
                "slug": "react",
                "description": "Updated description",
                "sort_order": 20,
                "is_visible": True,
            },
            headers=headers,
        )
        self.assertEqual(category_update_response.status_code, 200)
        self.assertEqual(category_update_response.json()["name"], "React Updated")

        tag_update_response = self.client.put(
            f"/api/admin/tags/{tag['id']}",
            json={
                "name": "FastAPI Updated",
                "slug": "fastapi",
                "description": "Updated description",
                "color": "#1d4ed8",
            },
            headers=headers,
        )
        self.assertEqual(tag_update_response.status_code, 200)
        self.assertEqual(tag_update_response.json()["name"], "FastAPI Updated")


if __name__ == "__main__":
    unittest.main()
