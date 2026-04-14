import argparse

from app.db.session import SessionLocal
from app.services.bootstrap_service import ensure_admin_user


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Create or update the initial admin user.")
    parser.add_argument("--username", required=True, help="Admin login username")
    parser.add_argument("--email", required=True, help="Admin email")
    parser.add_argument("--password", required=True, help="Admin password")
    parser.add_argument("--nickname", default="Admin", help="Admin nickname")
    return parser


def main() -> int:
    args = build_parser().parse_args()

    with SessionLocal() as db:
        user = ensure_admin_user(
            db,
            username=args.username,
            email=args.email,
            password=args.password,
            nickname=args.nickname,
        )

    print(f"Admin user ready: {user.username} <{user.email}>")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
