# Project Plan

## 1. Auth System (Stage 1)

- [x] **Infrastructure**:
  - [x] Install & Configure MSW.
  - [x] Create `token-storage` utility (localStorage wrapper).
- [x] **UI & Logic**:
  - [x] Implement `LoginForm` with validation (Zod).
  - [x] Create `LoginPage`.
  - [x] create protected route wrapper.

## 2. User Management (Stage 2)

### Data Model

- [x] Define `User` entity type (id, username, email, role, image, name).
- [x] Setup `MSW` handlers for `GET /users` (pagination, sorting, filtering).

### UI Components

- [x] Create `UserTable` using `@tanstack/react-table`.
- [x] Columns: Avatar+Name, Email, Role, Actions.
- [x] Pagination controls (Next/Prev, Page size).
- [x] Search input (debounced).

### Functionality (Mutations)

- [x] Implement Delete User (with confirmation dialog).
- [x] Implement Edit User (navigate to edit page/modal).

### Architecture

- [x] Use `features/users-list` slice.
- [x] Sync table state with URL (useSearch hook).
- [x] Implement Sorting (header toggles, URL sync).

### Bulk Actions

- [x] Implement user selection (checkboxes).
- [x] Implement Bulk Delete.
- [x] Implement Bulk Export to CSV.
- [x] Implement Bulk Role Change.

## 3. RBAC (Stage 3)

### Infrastructure

- [x] Define permissions map and types.
- [x] Create `usePermission` hook.
- [x] Create `ProtectedAction` component.

### Integration

- [x] Implement `auth.store` (Zustand).
- [x] Protect User Management actions.
- [x] Implement `ProtectedRoute` for edit pages.

## 4. Advanced Security (Stage 4)

### Resilience

- [x] Refactor Axios interceptors to use `tokenStorage`.
- [x] Implement global `401 Unauthorized` handling (auto-logout).
- [x] Implement global `403 Forbidden` handling (redirect to dashboard).
- [x] Implement reactive `Auth Watcher` for global redirection.

### Token Management

- [x] Implement Refresh Token rotation logic.
- [x] Add "Retry Query" mechanism for expired tokens.
- [x] Handle "Session Expired" UI notification.
