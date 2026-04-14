import unittest
from collections.abc import Generator
from pathlib import Path
import shutil
import tempfile

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models.user import User
from app.services.bootstrap_service import seed_demo_users


class AuthAndArticleApiTests(unittest.TestCase):
    def setUp(self) -> None:
        self.original_upload_dir = settings.upload_dir
        self.temp_upload_dir = tempfile.mkdtemp(prefix="momo_blog_uploads_")
        settings.upload_dir = self.temp_upload_dir

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
                password_hash=get_password_hash("123456"),
                nickname="Admin",
                role="superadmin",
            )
            db.add(admin_user)
            db.commit()

    def tearDown(self) -> None:
        self.app.dependency_overrides.clear()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()
        settings.upload_dir = self.original_upload_dir
        shutil.rmtree(self.temp_upload_dir, ignore_errors=True)

    def test_login_and_get_current_user(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )

        self.assertEqual(login_response.status_code, 200)
        login_data = login_response.json()
        self.assertIn("access_token", login_data)
        self.assertEqual(login_data["user"]["username"], "admin")
        self.assertEqual(login_data["user"]["role"], "superadmin")

        me_response = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {login_data['access_token']}"},
        )

        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.json()["username"], "admin")

    def test_bootstrap_superadmin_is_created_when_missing(self) -> None:
        with self.session_factory() as db:
            db.query(User).delete()
            db.commit()

        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()["user"]["role"], "superadmin")

        with self.session_factory() as db:
            users = db.query(User).all()

        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].username, "admin")
        self.assertEqual(users[0].role, "superadmin")

    def test_public_user_registration_and_role_based_admin_access(self) -> None:
        register_response = self.client.post(
            "/api/auth/register",
            json={
                "username": "reader01",
                "email": "reader01@example.com",
                "password": "reader123",
                "nickname": "Reader 01",
            },
        )

        self.assertEqual(register_response.status_code, 201)
        registered = register_response.json()
        self.assertEqual(registered["user"]["username"], "reader01")
        self.assertEqual(registered["user"]["role"], "user")

        user_headers = {"Authorization": f"Bearer {registered['access_token']}"}
        user_admin_response = self.client.get("/api/admin/articles", headers=user_headers)
        self.assertEqual(user_admin_response.status_code, 403)

        with self.session_factory() as db:
            content_admin = User(
                username="editor",
                email="editor@example.com",
                password_hash=get_password_hash("editor123"),
                nickname="Editor",
                role="admin",
            )
            db.add(content_admin)
            db.commit()

        admin_login_response = self.client.post(
            "/api/auth/login",
            json={"username": "editor", "password": "editor123"},
        )
        self.assertEqual(admin_login_response.status_code, 200)
        self.assertEqual(admin_login_response.json()["user"]["role"], "admin")

        admin_headers = {"Authorization": f"Bearer {admin_login_response.json()['access_token']}"}
        admin_articles_response = self.client.get("/api/admin/articles", headers=admin_headers)
        self.assertEqual(admin_articles_response.status_code, 200)

    def test_superadmin_can_manage_users_but_cannot_create_second_superadmin(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        list_response = self.client.get("/api/admin/users", headers=headers)
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.json()["total"], 1)
        self.assertEqual(list_response.json()["items"][0]["role"], "superadmin")

        invalid_create_response = self.client.post(
            "/api/admin/users",
            headers=headers,
            json={
                "username": "root2",
                "email": "root2@example.com",
                "password": "root2123",
                "nickname": "Root Two",
                "role": "superadmin",
                "is_active": True,
            },
        )
        self.assertEqual(invalid_create_response.status_code, 400)

        create_response = self.client.post(
            "/api/admin/users",
            headers=headers,
            json={
                "username": "staff01",
                "email": "staff01@example.com",
                "password": "staff123",
                "nickname": "Staff 01",
                "role": "admin",
                "is_active": True,
            },
        )
        self.assertEqual(create_response.status_code, 201)
        created_user = create_response.json()
        self.assertEqual(created_user["role"], "admin")

        update_response = self.client.put(
            f"/api/admin/users/{created_user['id']}",
            headers=headers,
            json={
                "email": "staff01@example.com",
                "nickname": "Staff One",
                "role": "user",
                "is_active": False,
                "password": None,
            },
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.json()["role"], "user")
        self.assertEqual(update_response.json()["is_active"], False)

        delete_response = self.client.delete(f"/api/admin/users/{created_user['id']}", headers=headers)
        self.assertEqual(delete_response.status_code, 204)

        delete_superadmin_response = self.client.delete("/api/admin/users/1", headers=headers)
        self.assertEqual(delete_superadmin_response.status_code, 400)

    def test_seed_demo_users_creates_predictable_admin_and_user_accounts(self) -> None:
        with self.session_factory() as db:
            seeded_users = seed_demo_users(
                db,
                admin_count=2,
                user_count=3,
                inactive_user_count=1,
                password="123456",
            )

            usernames = [user.username for user in seeded_users]
            roles = {user.username: user.role for user in seeded_users}
            statuses = {user.username: user.is_active for user in seeded_users}

        self.assertEqual(len(seeded_users), 6)
        self.assertIn("admin", usernames)
        self.assertIn("admin01", usernames)
        self.assertIn("admin02", usernames)
        self.assertIn("user01", usernames)
        self.assertIn("user03", usernames)
        self.assertEqual(roles["admin"], "superadmin")
        self.assertEqual(roles["admin01"], "admin")
        self.assertEqual(roles["user01"], "user")
        self.assertEqual(statuses["user01"], False)
        self.assertEqual(statuses["user02"], True)

    def test_cors_allows_any_origin_preflight_request(self) -> None:
        response = self.client.options(
            "/api/public/site-settings",
            headers={
                "Origin": "https://www.momo-blog.xztxnb.cn",
                "Access-Control-Request-Method": "GET",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("access-control-allow-origin"), "*")

    def test_admin_article_crud_and_public_visibility(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
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
            json={"username": "admin", "password": "123456"},
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

    def test_public_categories_and_tags_return_published_articles(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        category_response = self.client.post(
            "/api/admin/categories",
            json={
                "name": "Engineering",
                "slug": "engineering",
                "description": "Engineering notes",
                "sort_order": 1,
                "is_visible": True,
            },
            headers=headers,
        )
        self.assertEqual(category_response.status_code, 201)
        category = category_response.json()

        hidden_category_response = self.client.post(
            "/api/admin/categories",
            json={
                "name": "Hidden",
                "slug": "hidden",
                "description": "Hidden notes",
                "sort_order": 2,
                "is_visible": False,
            },
            headers=headers,
        )
        self.assertEqual(hidden_category_response.status_code, 201)

        tag_response = self.client.post(
            "/api/admin/tags",
            json={
                "name": "React",
                "slug": "react",
                "description": "React notes",
                "color": "#2563eb",
            },
            headers=headers,
        )
        self.assertEqual(tag_response.status_code, 201)
        tag = tag_response.json()

        self.client.post(
            "/api/admin/articles",
            json={
                "title": "Published Post",
                "slug": "published-post",
                "summary": "Visible content",
                "content_md": "# Published",
                "status": "published",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
            },
            headers=headers,
        )

        self.client.post(
            "/api/admin/articles",
            json={
                "title": "Draft Post",
                "slug": "draft-post",
                "summary": "Hidden content",
                "content_md": "# Draft",
                "status": "draft",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
            },
            headers=headers,
        )

        public_categories_response = self.client.get("/api/public/categories")
        self.assertEqual(public_categories_response.status_code, 200)
        public_categories = public_categories_response.json()
        self.assertEqual(public_categories["total"], 1)
        self.assertEqual(public_categories["items"][0]["slug"], "engineering")
        self.assertEqual(public_categories["items"][0]["article_count"], 1)
        self.assertEqual(public_categories["items"][0]["articles"][0]["slug"], "published-post")

        public_tags_response = self.client.get("/api/public/tags")
        self.assertEqual(public_tags_response.status_code, 200)
        public_tags = public_tags_response.json()
        self.assertEqual(public_tags["total"], 1)
        self.assertEqual(public_tags["items"][0]["slug"], "react")
        self.assertEqual(public_tags["items"][0]["article_count"], 1)
        self.assertEqual(public_tags["items"][0]["articles"][0]["slug"], "published-post")

        public_article_detail_response = self.client.get("/api/public/articles/published-post")
        self.assertEqual(public_article_detail_response.status_code, 200)
        public_article_detail = public_article_detail_response.json()
        self.assertEqual(public_article_detail["category"]["slug"], "engineering")
        self.assertEqual(public_article_detail["tags"][0]["slug"], "react")

    def test_media_upload_and_cover_image_flow(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        upload_response = self.client.post(
            "/api/admin/media/upload",
            headers=headers,
            files={"file": ("cover.png", b"fake-image-bytes", "image/png")},
        )
        self.assertEqual(upload_response.status_code, 201)
        media = upload_response.json()
        self.assertEqual(media["original_name"], "cover.png")
        self.assertEqual(media["mime_type"], "image/png")
        self.assertTrue(media["file_url"].startswith("/uploads/"))
        self.assertTrue(Path(self.temp_upload_dir, media["filename"]).exists())

        media_list_response = self.client.get("/api/admin/media", headers=headers)
        self.assertEqual(media_list_response.status_code, 200)
        self.assertEqual(media_list_response.json()["total"], 1)
        self.assertEqual(media_list_response.json()["items"][0]["id"], media["id"])

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Cover Post",
                "slug": "cover-post",
                "summary": "Post with cover",
                "content_md": "# Cover",
                "status": "published",
                "cover_image_id": media["id"],
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)
        self.assertEqual(article_response.json()["cover_image_id"], media["id"])
        self.assertEqual(article_response.json()["cover_image_url"], media["file_url"])

        public_list_response = self.client.get("/api/public/articles")
        self.assertEqual(public_list_response.status_code, 200)
        self.assertEqual(public_list_response.json()["items"][0]["cover_image_url"], media["file_url"])

        public_detail_response = self.client.get("/api/public/articles/cover-post")
        self.assertEqual(public_detail_response.status_code, 200)
        self.assertEqual(public_detail_response.json()["cover_image_url"], media["file_url"])

        file_response = self.client.get(media["file_url"])
        self.assertEqual(file_response.status_code, 200)
        self.assertEqual(file_response.content, b"fake-image-bytes")

    def test_admin_and_public_site_settings_flow(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        admin_get_response = self.client.get("/api/admin/site-settings", headers=headers)
        self.assertEqual(admin_get_response.status_code, 200)

        update_response = self.client.put(
            "/api/admin/site-settings",
            headers=headers,
            json={
                "site_name": "Momo Notes",
                "site_subtitle": "温暖的个人研究笔记",
                "site_description": "记录技术实现、项目复盘和长期思考。",
                "site_keywords": "React,FastAPI,PostgreSQL",
                "logo": None,
                "favicon": None,
                "github_url": "https://github.com/momo/blog",
                "about_markdown": "# About\n\n持续写作，持续整理。",
                "icp": None,
                "public_email": "momo@example.com",
            },
        )
        self.assertEqual(update_response.status_code, 200)
        updated = update_response.json()
        self.assertEqual(updated["site_name"], "Momo Notes")
        self.assertEqual(updated["github_url"], "https://github.com/momo/blog")

        public_response = self.client.get("/api/public/site-settings")
        self.assertEqual(public_response.status_code, 200)
        public_data = public_response.json()
        self.assertEqual(public_data["site_name"], "Momo Notes")
        self.assertEqual(public_data["site_subtitle"], "温暖的个人研究笔记")
        self.assertEqual(public_data["about_markdown"], "# About\n\n持续写作，持续整理。")

    def test_public_article_detail_navigation_and_seo_feeds(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        self.client.put(
            "/api/admin/site-settings",
            headers=headers,
            json={
                "site_name": "Momo Notes",
                "site_subtitle": "温暖的个人研究笔记",
                "site_description": "记录技术实现、项目复盘和长期思考。",
                "site_keywords": "React,FastAPI,PostgreSQL",
                "logo": None,
                "favicon": None,
                "github_url": "https://github.com/momo/blog",
                "about_markdown": "# About\n\n持续写作，持续整理。",
                "icp": None,
                "public_email": "momo@example.com",
            },
        )

        category_response = self.client.post(
            "/api/admin/categories",
            json={
                "name": "Engineering",
                "slug": "engineering",
                "description": "Engineering notes",
                "sort_order": 1,
                "is_visible": True,
            },
            headers=headers,
        )
        category = category_response.json()

        tag_response = self.client.post(
            "/api/admin/tags",
            json={
                "name": "React",
                "slug": "react",
                "description": "React notes",
                "color": "#2563eb",
            },
            headers=headers,
        )
        tag = tag_response.json()

        for article in [
            {
                "title": "Earlier Post",
                "slug": "earlier-post",
                "summary": "Earlier summary",
                "content_md": "# Earlier\n\n## Setup\n\nFirst body",
                "status": "published",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
                "published_at": "2026-04-12T10:00:00Z",
            },
            {
                "title": "Target Post",
                "slug": "target-post",
                "summary": "Target summary",
                "content_md": "# Target\n\n## Setup\n\n## Result\n\nBody",
                "status": "published",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
                "published_at": "2026-04-13T10:00:00Z",
            },
            {
                "title": "Later Post",
                "slug": "later-post",
                "summary": "Later summary",
                "content_md": "# Later\n\n## Wrap up\n\nBody",
                "status": "published",
                "category_id": category["id"],
                "tag_ids": [tag["id"]],
                "published_at": "2026-04-14T10:00:00Z",
            },
        ]:
            create_response = self.client.post("/api/admin/articles", json=article, headers=headers)
            self.assertEqual(create_response.status_code, 201)

        detail_response = self.client.get("/api/public/articles/target-post")
        self.assertEqual(detail_response.status_code, 200)
        detail = detail_response.json()
        self.assertEqual(detail["previous_article"]["slug"], "earlier-post")
        self.assertEqual(detail["next_article"]["slug"], "later-post")
        self.assertEqual(detail["related_articles"][0]["slug"], "later-post")
        self.assertEqual(detail["toc"][0]["text"], "Target")
        self.assertEqual(detail["toc"][1]["text"], "Setup")

        sitemap_response = self.client.get("/sitemap.xml")
        self.assertEqual(sitemap_response.status_code, 200)
        self.assertIn("/articles/target-post", sitemap_response.text)
        self.assertIn("/articles/later-post", sitemap_response.text)

        robots_response = self.client.get("/robots.txt")
        self.assertEqual(robots_response.status_code, 200)
        self.assertIn("Sitemap:", robots_response.text)

        rss_response = self.client.get("/rss.xml")
        self.assertEqual(rss_response.status_code, 200)
        self.assertIn("<title>Momo Notes</title>", rss_response.text)
        self.assertIn("<title>Target Post</title>", rss_response.text)

    def test_public_article_comments_and_guestbook_messages(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Comment Ready Post",
                "slug": "comment-ready-post",
                "summary": "Open for discussion",
                "content_md": "# Comment Ready",
                "status": "published",
                "allow_comment": True,
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)

        comment_create_response = self.client.post(
            "/api/public/articles/comment-ready-post/comments",
            json={
                "author_name": "读者 A",
                "author_email": "reader@example.com",
                "content": "这篇文章对我很有帮助。",
            },
        )
        self.assertEqual(comment_create_response.status_code, 201)
        created_comment = comment_create_response.json()
        self.assertEqual(created_comment["author_name"], "读者 A")
        self.assertEqual(created_comment["source_type"], "article")
        self.assertEqual(created_comment["article_slug"], "comment-ready-post")

        article_comments_response = self.client.get("/api/public/articles/comment-ready-post/comments")
        self.assertEqual(article_comments_response.status_code, 200)
        article_comments = article_comments_response.json()
        self.assertEqual(article_comments["total"], 0)

        guestbook_create_response = self.client.post(
            "/api/public/messages",
            json={
                "author_name": "访客 B",
                "author_email": "guest@example.com",
                "content": "路过留个言，博客气质很好。",
            },
        )
        self.assertEqual(guestbook_create_response.status_code, 201)
        guestbook_item = guestbook_create_response.json()
        self.assertEqual(guestbook_item["source_type"], "guestbook")
        self.assertIsNone(guestbook_item["article_slug"])

        guestbook_list_response = self.client.get("/api/public/messages")
        self.assertEqual(guestbook_list_response.status_code, 200)
        guestbook_data = guestbook_list_response.json()
        self.assertEqual(guestbook_data["total"], 0)

        detail_response = self.client.get("/api/public/articles/comment-ready-post")
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.json()["allow_comment"], True)

        closed_article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Comments Closed",
                "slug": "comments-closed",
                "summary": "No comments allowed",
                "content_md": "# Closed",
                "status": "published",
                "allow_comment": False,
            },
            headers=headers,
        )
        self.assertEqual(closed_article_response.status_code, 201)

        closed_comment_response = self.client.post(
            "/api/public/articles/comments-closed/comments",
            json={
                "author_name": "读者 C",
                "author_email": "reader-c@example.com",
                "content": "我想留言。",
            },
        )
        self.assertEqual(closed_comment_response.status_code, 400)
        self.assertEqual(closed_comment_response.json()["detail"], "Comments are disabled for this article")

    def test_admin_can_review_comments_and_hide_them_from_public(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        create_article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Moderation Post",
                "slug": "moderation-post",
                "summary": "For moderation",
                "content_md": "# Moderation",
                "status": "published",
                "allow_comment": True,
            },
            headers=headers,
        )
        self.assertEqual(create_article_response.status_code, 201)

        article_comment_response = self.client.post(
            "/api/public/articles/moderation-post/comments",
            json={
                "author_name": "读者 D",
                "author_email": "reader-d@example.com",
                "content": "这一条需要后台审核演示。",
            },
        )
        self.assertEqual(article_comment_response.status_code, 201)
        article_comment = article_comment_response.json()

        guestbook_response = self.client.post(
            "/api/public/messages",
            json={
                "author_name": "访客 E",
                "author_email": "guest-e@example.com",
                "content": "这是关于页的一条留言。",
            },
        )
        self.assertEqual(guestbook_response.status_code, 201)
        guestbook = guestbook_response.json()

        admin_list_response = self.client.get("/api/admin/comments", headers=headers)
        self.assertEqual(admin_list_response.status_code, 200)
        admin_comments = admin_list_response.json()
        self.assertEqual(admin_comments["total"], 2)
        self.assertEqual(admin_comments["items"][0]["status"], "pending")

        approve_response = self.client.put(
            f"/api/admin/comments/{article_comment['id']}",
            headers=headers,
            json={"status": "approved"},
        )
        self.assertEqual(approve_response.status_code, 200)
        self.assertEqual(approve_response.json()["status"], "approved")
        self.assertEqual(approve_response.json()["source_type"], "article")

        reject_guestbook_response = self.client.put(
            f"/api/admin/comments/{guestbook['id']}",
            headers=headers,
            json={"status": "rejected"},
        )
        self.assertEqual(reject_guestbook_response.status_code, 200)
        self.assertEqual(reject_guestbook_response.json()["status"], "rejected")
        self.assertEqual(reject_guestbook_response.json()["source_type"], "guestbook")

        public_article_comments = self.client.get("/api/public/articles/moderation-post/comments")
        self.assertEqual(public_article_comments.status_code, 200)
        self.assertEqual(public_article_comments.json()["total"], 1)

        public_guestbook_messages = self.client.get("/api/public/messages")
        self.assertEqual(public_guestbook_messages.status_code, 200)
        self.assertEqual(public_guestbook_messages.json()["total"], 0)

    def test_admin_can_delete_article_and_related_comments(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        create_article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Delete Me",
                "slug": "delete-me",
                "summary": "Temporary article",
                "content_md": "# Delete Me",
                "status": "published",
                "allow_comment": True,
            },
            headers=headers,
        )
        self.assertEqual(create_article_response.status_code, 201)
        article = create_article_response.json()

        comment_response = self.client.post(
            "/api/public/articles/delete-me/comments",
            json={
                "author_name": "读者 F",
                "author_email": "reader-f@example.com",
                "content": "等会儿这篇文章会被删掉。",
            },
        )
        self.assertEqual(comment_response.status_code, 201)

        delete_response = self.client.delete(f"/api/admin/articles/{article['id']}", headers=headers)
        self.assertEqual(delete_response.status_code, 204)

        admin_detail_response = self.client.get(f"/api/admin/articles/{article['id']}", headers=headers)
        self.assertEqual(admin_detail_response.status_code, 404)

        public_detail_response = self.client.get("/api/public/articles/delete-me")
        self.assertEqual(public_detail_response.status_code, 404)

        admin_list_response = self.client.get("/api/admin/articles", headers=headers)
        self.assertEqual(admin_list_response.status_code, 200)
        self.assertEqual(admin_list_response.json()["total"], 0)

        admin_comments_response = self.client.get("/api/admin/comments", headers=headers)
        self.assertEqual(admin_comments_response.status_code, 200)
        self.assertEqual(admin_comments_response.json()["total"], 0)

    def test_admin_can_delete_category_without_deleting_article(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        category_response = self.client.post(
            "/api/admin/categories",
            json={
                "name": "To Remove",
                "slug": "to-remove",
                "description": "Temporary category",
                "sort_order": 1,
                "is_visible": True,
            },
            headers=headers,
        )
        self.assertEqual(category_response.status_code, 201)
        category = category_response.json()

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Category Bound",
                "slug": "category-bound",
                "summary": "Bound to a category",
                "content_md": "# Category Bound",
                "status": "published",
                "category_id": category["id"],
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)
        article = article_response.json()

        delete_response = self.client.delete(f"/api/admin/categories/{category['id']}", headers=headers)
        self.assertEqual(delete_response.status_code, 204)

        category_list_response = self.client.get("/api/admin/categories", headers=headers)
        self.assertEqual(category_list_response.status_code, 200)
        self.assertEqual(category_list_response.json()["total"], 0)

        article_detail_response = self.client.get(f"/api/admin/articles/{article['id']}", headers=headers)
        self.assertEqual(article_detail_response.status_code, 200)
        self.assertIsNone(article_detail_response.json()["category_id"])

    def test_admin_can_delete_tag_without_deleting_article(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        tag_response = self.client.post(
            "/api/admin/tags",
            json={
                "name": "To Remove",
                "slug": "tag-to-remove",
                "description": "Temporary tag",
                "color": "#1d4ed8",
            },
            headers=headers,
        )
        self.assertEqual(tag_response.status_code, 201)
        tag = tag_response.json()

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Tag Bound",
                "slug": "tag-bound",
                "summary": "Bound to a tag",
                "content_md": "# Tag Bound",
                "status": "published",
                "tag_ids": [tag["id"]],
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)
        article = article_response.json()

        delete_response = self.client.delete(f"/api/admin/tags/{tag['id']}", headers=headers)
        self.assertEqual(delete_response.status_code, 204)

        tag_list_response = self.client.get("/api/admin/tags", headers=headers)
        self.assertEqual(tag_list_response.status_code, 200)
        self.assertEqual(tag_list_response.json()["total"], 0)

        article_detail_response = self.client.get(f"/api/admin/articles/{article['id']}", headers=headers)
        self.assertEqual(article_detail_response.status_code, 200)
        self.assertEqual(article_detail_response.json()["tag_ids"], [])

    def test_admin_can_delete_media_and_clear_article_cover(self) -> None:
        login_response = self.client.post(
            "/api/auth/login",
            json={"username": "admin", "password": "123456"},
        )
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        upload_response = self.client.post(
            "/api/admin/media/upload",
            headers=headers,
            files={"file": ("delete-cover.png", b"fake-image-bytes", "image/png")},
        )
        self.assertEqual(upload_response.status_code, 201)
        media = upload_response.json()
        stored_file = Path(self.temp_upload_dir, media["filename"])
        self.assertTrue(stored_file.exists())

        article_response = self.client.post(
            "/api/admin/articles",
            json={
                "title": "Media Bound",
                "slug": "media-bound",
                "summary": "Bound to a media asset",
                "content_md": "# Media Bound",
                "status": "published",
                "cover_image_id": media["id"],
            },
            headers=headers,
        )
        self.assertEqual(article_response.status_code, 201)
        article = article_response.json()

        delete_response = self.client.delete(f"/api/admin/media/{media['id']}", headers=headers)
        self.assertEqual(delete_response.status_code, 204)

        media_list_response = self.client.get("/api/admin/media", headers=headers)
        self.assertEqual(media_list_response.status_code, 200)
        self.assertEqual(media_list_response.json()["total"], 0)
        self.assertFalse(stored_file.exists())

        article_detail_response = self.client.get(f"/api/admin/articles/{article['id']}", headers=headers)
        self.assertEqual(article_detail_response.status_code, 200)
        self.assertIsNone(article_detail_response.json()["cover_image_id"])
        self.assertIsNone(article_detail_response.json()["cover_image_url"])


if __name__ == "__main__":
    unittest.main()
