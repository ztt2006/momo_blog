import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.services.bootstrap_service import ensure_admin_user


class BootstrapServiceTests(unittest.TestCase):
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

    def tearDown(self) -> None:
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()

    def test_ensure_admin_user_creates_new_admin(self) -> None:
        with self.session_factory() as db:
            user = ensure_admin_user(
                db,
                username="admin",
                email="admin@example.com",
                password="admin123",
                nickname="Admin",
            )

            self.assertEqual(user.username, "admin")
            self.assertEqual(user.email, "admin@example.com")
            self.assertEqual(user.nickname, "Admin")
            self.assertEqual(user.role, "admin")
            self.assertTrue(user.is_active)

    def test_ensure_admin_user_updates_existing_admin(self) -> None:
        with self.session_factory() as db:
            ensure_admin_user(
                db,
                username="admin",
                email="admin@example.com",
                password="admin123",
                nickname="Admin",
            )

            user = ensure_admin_user(
                db,
                username="admin",
                email="owner@example.com",
                password="new-password",
                nickname="Owner",
            )

            self.assertEqual(user.username, "admin")
            self.assertEqual(user.email, "owner@example.com")
            self.assertEqual(user.nickname, "Owner")
            self.assertEqual(user.role, "admin")
            self.assertTrue(user.is_active)


if __name__ == "__main__":
    unittest.main()
