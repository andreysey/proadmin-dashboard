# Project Preparation Plan for Feature Development

## 1. API Client Setup (`shared/api`)

- [x] **Create base `axios` instance**: configure `baseURL` and timeouts.
- [x] **Add Interceptors**:
  - _Request_: automatic `Authorization: Bearer token` attachment.
  - _Response_: centralized error handling (401 Unauthorized -> logout, API error parsing).

## 2. Configuration (`shared/config`)

- [x] **Environment Variable Validation (Env Vars)**:
  - Use a schema (e.g., via `zod`) to verify all required variables (`VITE_API_URL`, etc.) at startup.

## 3. Base Layout & Routing

- [x] **Implement `DashboardLayout`**:
  - Sidebar (side navigation).
  - Header (top bar with user info/theme).
- [x] **Setup Route Protection (Auth Guard)**:
  - Authentication check before rendering protected pages.
  - Redirect to login if the user is not authorized.
