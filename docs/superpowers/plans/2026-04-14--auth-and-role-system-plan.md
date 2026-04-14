# Auth And Role System Implementation Plan

## Files In Scope

- Backend:
  - `backend/tests/test_auth_and_articles.py`
  - `backend/app/models/user.py`
  - `backend/app/crud/user.py`
  - `backend/app/services/auth_service.py`
  - `backend/app/api/auth.py`
  - `backend/app/api/deps.py`
  - `backend/app/api/router.py`
  - `backend/app/api/admin_users.py`
  - `backend/app/schemas/auth.py`
  - `backend/app/schemas/user.py`
  - `backend/app/services/user_service.py`
  - `backend/app/core/config.py`
  - `backend/app/main.py`
  - `backend/alembic/versions/*role*.py` or equivalent new migration
- Admin:
  - `admin/src/features/auth/*`
  - `admin/src/stores/authStore.ts`
  - `admin/src/router/guards/*`
  - `admin/src/router/routes/index.tsx`
  - `admin/src/components/layouts/adminLayout/index.tsx`
  - `admin/src/lib/constants.ts`
  - `admin/src/pages/users/*`
  - `admin/src/features/user/*`
  - tests for auth and users page
- Frontend:
  - `frontend/src/features/site/components/siteHeader/index.tsx`
  - `frontend/src/router/routes/index.tsx`
  - `frontend/src/router/guards/*`
  - `frontend/src/features/auth/*`
  - `frontend/src/stores/authStore.ts`
  - `frontend/src/pages/login/*`
  - `frontend/src/pages/register/*`
  - related tests

## Plan Review

- Review result against `plan-document-reviewer-prompt.md`: `APPROVED`

## Tasks

1. Add backend tests for role-aware auth and bootstrap user.
- Files: `backend/tests/test_auth_and_articles.py`
- Failing test:
  - login returns `superadmin` for bootstrap account
  - public registration creates `user`
  - `user` cannot call admin content API
  - `admin` can call admin content API
  - `superadmin` can access user-management API
- Run:
  - `cd backend && .venv\\Scripts\\python -m unittest tests.test_auth_and_articles.AuthAndArticleApiTests.test_*role*`
- Expected failure:
  - missing registration route, missing role guards, missing user API
- Minimal implementation:
  - only enough backend behavior to satisfy tests
- Verify:
  - same unittest command passes
- Commit step:
  - checkpoint after backend role foundation

2. Add backend tests for user-management CRUD.
- Files: `backend/tests/test_auth_and_articles.py`
- Failing test:
  - `superadmin` lists users
  - creates `admin` and `user`
  - updates role and active state
  - deletes non-superadmin user
  - cannot create/delete another `superadmin`
- Run:
  - `cd backend && .venv\\Scripts\\python -m unittest tests.test_auth_and_articles.AuthAndArticleApiTests.test_superadmin_*`
- Expected failure:
  - missing endpoints/service logic
- Minimal implementation:
  - `admin_users.py`, `schemas/user.py`, `services/user_service.py`, `crud/user.py`, role dependency helpers
- Verify:
  - same unittest command passes
- Commit step:
  - checkpoint after backend user management

3. Add migration/bootstrap coverage for the single `superadmin`.
- Files:
  - `backend/alembic/versions/...py`
  - `backend/app/main.py` or bootstrap helper
  - `backend/app/core/config.py` if config constants are needed
- Failing test:
  - app startup with empty DB creates requested bootstrap account
- Run:
  - targeted unittest covering startup/bootstrap behavior
- Expected failure:
  - no bootstrap account exists
- Minimal implementation:
  - startup bootstrap helper that creates only one `superadmin`
- Verify:
  - targeted unittest passes
- Commit step:
  - checkpoint after seed/bootstrap logic

4. Add admin-app tests for role-gated login and superadmin navigation.
- Files:
  - `admin/src/features/auth/components/loginForm/index.test.tsx`
  - `admin/src/components/layouts/adminLayout/index.test.tsx` or new page/route tests
- Failing test:
  - `user` login is rejected from admin app
  - `superadmin` sees users nav item
  - `admin` does not see users nav item
- Run:
  - `cd admin && pnpm test -- --run <targeted test files>`
- Expected failure:
  - missing role checks and nav filtering
- Minimal implementation:
  - update auth types/store/guards/layout rendering
- Verify:
  - targeted admin tests pass
- Commit step:
  - checkpoint after admin role gating

5. Add admin tests for user-management page CRUD.
- Files:
  - new `admin/src/pages/users/index.test.tsx`
  - new `admin/src/features/user/*`
- Failing test:
  - loads users
  - creates user
  - edits user role/status
  - deletes user
- Run:
  - `cd admin && pnpm test -- --run src/pages/users/index.test.tsx`
- Expected failure:
  - page/API/components missing
- Minimal implementation:
  - add users feature and route
- Verify:
  - targeted test passes
- Commit step:
  - checkpoint after admin user management UI

6. Add frontend tests for removing admin entry and adding public auth routes.
- Files:
  - `frontend/src/features/site/components/siteHeader/index.test.tsx` or page-level tests
  - new auth page tests
- Failing test:
  - header no longer contains admin link
  - login/register routes render
  - successful public login persists user state
- Run:
  - `cd frontend && pnpm test -- --run <targeted test files>`
- Expected failure:
  - routes, store, and UI missing
- Minimal implementation:
  - add frontend auth feature, store, pages, routes
- Verify:
  - targeted frontend tests pass
- Commit step:
  - checkpoint after public auth UI

7. Add frontend role/identity polish and final verification.
- Files:
  - frontend auth header/menu components
  - any remaining route guard or store files
- Failing test:
  - authenticated public user sees identity UI and logout
- Run:
  - targeted frontend test command
- Expected failure:
  - missing authenticated header state
- Minimal implementation:
  - minimal header auth menu and logout path
- Verify:
  - `cd frontend && pnpm test`
  - `cd admin && pnpm test`
  - `cd admin && pnpm build`
  - `cd frontend && pnpm test`
  - `cd frontend && pnpm build`
  - `cd backend && .venv\\Scripts\\python -m unittest discover -s tests`
- Commit step:
  - final checkpoint
