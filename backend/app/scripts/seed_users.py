import argparse

from app.db.session import SessionLocal
from app.services.bootstrap_service import seed_demo_users


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate demo users for the blog database.")
    parser.add_argument("--admins", type=int, default=2, help="Number of admin accounts to generate")
    parser.add_argument("--users", type=int, default=8, help="Number of normal user accounts to generate")
    parser.add_argument(
        "--inactive-users",
        type=int,
        default=2,
        help="Number of generated normal users to mark as inactive from the start",
    )
    parser.add_argument("--password", default="123456", help="Shared password for generated demo accounts")
    return parser


def main() -> int:
    args = build_parser().parse_args()

    with SessionLocal() as db:
        users = seed_demo_users(
            db,
            admin_count=max(0, args.admins),
            user_count=max(0, args.users),
            inactive_user_count=max(0, args.inactive_users),
            password=args.password,
        )

    print("Demo users ready:")
    for user in users:
        print(f"- {user.username:<10} | role={user.role:<10} | active={str(user.is_active).lower()} | {user.email}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
