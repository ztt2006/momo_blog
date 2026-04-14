import unittest

from fastapi.testclient import TestClient

from app.main import create_app


class AppBootstrapTests(unittest.TestCase):
    def test_health_endpoint_returns_ok(self) -> None:
        app = create_app()
        client = TestClient(app)

        response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")


if __name__ == "__main__":
    unittest.main()
