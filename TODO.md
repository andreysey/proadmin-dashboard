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
- [ ] Setup `MSW` handlers for `GET /users` (pagination, sorting, filtering).

### UI Components

- [x] Create `UserTable` using `@tanstack/react-table`.
- [/] Columns: Avatar+Name, Email, Role, Actions.
- [ ] Pagination controls (Next/Prev, Page size).
- [ ] Search input (debounced).

### Architecture

- [x] Use `features/users-list` slice.
- [ ] Sync table state with URL (useSearch hook).
