# Auth And Role System Design

## Scope

Implement a complete identity and permission system across the blog:

- Frontend public site gets user registration and login.
- Roles are `superadmin`, `admin`, `user`.
- `user` cannot write articles or access the admin app.
- `admin` can access the admin app and manage content, comments, media, and settings.
- `superadmin` has the same content permissions as `admin` and additionally manages users.
- There must be exactly one bootstrap `superadmin` account with username `admin` and password `123456`.
- Remove the public-site "go to admin" entry.

## Current State

- Backend already has `User.role`, but effectively treats all authenticated users the same.
- Backend only exposes login and current-user endpoints.
- Admin app only has one auth state and no role-based UI or route filtering.
- Frontend public site has no auth flows and still exposes a direct link to the admin login page.

## Target Behavior

### Backend

- Add registration endpoint for public users.
- Add user management endpoints for `superadmin` only:
  - list users
  - create users
  - update users
  - activate/deactivate users
  - delete non-superadmin users
- Enforce role-aware dependencies:
  - admin APIs require `admin` or `superadmin`
  - user-management APIs require `superadmin`
- Ensure bootstrap logic creates the single `superadmin` account if missing.
- Keep login shared, but deny admin-app APIs to `user`.

### Admin App

- Allow only `admin` and `superadmin` to remain in the admin app after login.
- Show a user-management entry only for `superadmin`.
- Add a user-management page for CRUD-style staff/member management.
- Preserve existing content-management behavior for `admin` and `superadmin`.

### Frontend Public Site

- Remove the header button that links to the admin app.
- Add public auth pages for register and login.
- Add a lightweight authenticated user menu in the public header.
- Keep browsing public content open to guests.
- Logged-in `user` identity can be used later by comments/profile features, but this round focuses on auth entry, persistence, and profile basics.

## Role Rules

- `superadmin`
  - unique bootstrap account
  - can manage all users except cannot create another `superadmin`
  - can manage all admin content
- `admin`
  - can manage admin content
  - cannot access user-management APIs
- `user`
  - can log in on the public site
  - cannot access admin routes or admin APIs
  - cannot create or edit articles

## Data Changes

- Keep `users.role` as the source of truth.
- Add migration/seed logic to normalize existing first admin account if needed and ensure the bootstrap `superadmin` exists.

## Risks To Handle

- Existing admin accounts must continue to work after role checks are added.
- The hardcoded bootstrap password should be easy to change later, but must match the requested default now.
- Admin app should fail closed for `user` role sessions.
- Public auth should not leak into admin storage keys or interceptors.
