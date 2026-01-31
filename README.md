# ProAdmin Dashboard (React Edition)

A professional-grade administrative interface built with a focus on engineering excellence, scalability, and maintainable architecture.

This project serves as a demonstration of a **Junior+ to Middle** transition, moving beyond simple coding to system design.

## Project Goals

The primary objective is to incrementally build build a production-oriented dashboard that solves real-world engineering challenges:

- **Scalability:** Using Feature-Sliced Design (FSD) to prevent "spaghetti code".
- **Type Safety:** 100% TypeScript coverage with strict mode.
- **Data Integrity:** Runtime validation of API responses and form inputs.
- **Team Readiness:** Clean documentation, linting, and modular structure.

## Tech Stack

- **Core:** React 19 + Vite
- **Language:** TypeScript (Strict Mode)
- **State Management:** - **TanStack Query (v5):** Server state, caching, and synchronization.
- **Zustand:** Lightweight client-side UI state.
- **Forms & Validation:** React Hook Form + **Zod** (Schema-based validation).
- **UI & Styling:** Tailwind CSS + **shadcn/ui** (Accessible Radix-based components).
- **Networking:** Axios with custom interceptors for error handling.
- **Mocking:** MSW (Mock Service Worker) for realistic API simulation (Stage 1).

## Architecture: Feature-Sliced Design (FSD)

The project follows the FSD methodology to ensure a clear separation of concerns:

- **app/** — Global providers (QueryClient, Auth), global styles, and routing setup.
- **pages/** — Composition layer; assembles widgets into full-screen views.
- **widgets/** — Self-contained, complex UI blocks (e.g., `UserTable`, `AnalyticsDashboard`).
- **features/** — User-centric actions with business value (e.g., `UpdateUserStatus`, `ExportReport`).
- **entities/** — Domain-specific logic, types, and simple components (e.g., `User`, `Order`).
- **shared/** — Reusable UI-kit, API clients, utility functions, and constants.

## Engineering Focus Areas

### 1. Robust Error Handling

Implementation of **Global Error Boundaries** and Axios interceptors to handle 401/403/500 errors gracefully with user-friendly notifications.

### 2. Performance Optimization

- **Code Splitting:** Dynamic imports for route-level components.
- **Render Optimization:** Strategic use of `useMemo` and `useCallback` for heavy list computations.
- **Resilient Data Synchronization:** Leveraging TanStack Query's invalidation patterns to ensure the UI always reflects the source of truth after mutations.

### 3. Strict Type Safety

No `any` policy. All API responses are validated via Zod schemas at the network boundary to ensure the frontend never processes "garbage" data.

### 4. Role-Based Access Control (RBAC)

- **Declarative Permissions API:** `<ProtectedAction permission="users:delete" />` and `usePermission('orders:edit')` hooks.
- **Type-Safe Permissions:** All permissions defined as TypeScript literal types to prevent typos.
- **Route-Level Guards:** Automatic redirection based on user role and required permissions.

### 5. Advanced Data Management

- **Server-Side Operations:** Pagination, sorting, and filtering handled on the backend.
- **URL State Synchronization:** Query parameters persist table state for shareable links.
- **Debounced Search:** Optimized search input with 300ms debounce to reduce API calls.
- **Smart Loading States:** Skeleton UI components instead of generic spinners.

### 6. Real-Time Analytics

- **Live Dashboard:** Auto-refreshing charts using TanStack Query's `refetchInterval`.
- **Date Range Filtering:** Interactive date pickers for custom report periods.
- **Data Export:** Client-side CSV/Excel generation using `papaparse` or `xlsx`.

## Features (Roadmap)

- [x] **Auth System (Stage 1 - MVP):**
  - [x] MSW handlers for login (mocking DummyJSON)
  - [x] Login Page (React Hook Form + Zod)
  - [x] Protected routes (Basic Guard)
  - [x] LocalStorage token management
- [x] **User Management (Stage 2):**
  - [x] Complex tables with server-side pagination, sorting, and filtering
  - [x] URL-synced table state (shareable filter/sort links)
  - [x] Bulk actions (delete, export, role change)
- [x] **RBAC (Stage 3):**
  - [x] Declarative permission system (`usePermission`, `<ProtectedAction>`)
  - [x] Type-safe permission definitions
  - [x] Role-based route guards
- [x] **Advanced Security & UX (Stage 4):**
  - [x] JWT Refresh token rotation & Request Queuing
  - [x] Global 401/403 interceptors and error handling
  - [x] Reactive Auth Watcher for seamless redirection
  - [x] Theme System (Dark Mode) & Premium UI Polish
  - [x] Enhanced Navigation (Dual Pagination & Search alignment)
  - [x] Professional "About" page implementation
  - [ ] HttpOnly cookies integration (Architecture ready, requires Backend)
- [x] **Live Analytics & Dashboard (Stage 5):**
  - [x] Interactive Dashboard with real-time charts (Recharts)
  - [x] Dynamic widgets (User Activity, Revenue, Growth)
  - [x] Global Date Range filtering for all reports
  - [x] Data Export (Excel/PDF) for audit logs
- [ ] **Testing & Quality (Stage 6):**
  - [x] Unit tests for business logic (Vitest)
  - [x] Component tests (React Testing Library)
  - [x] E2E Integration tests (Playwright)
  - [x] CI/CD Github Actions setup
  - [ ] Target: 70%+ coverage for `features/` and `entities/`
- [ ] **Production Deployment (Stage 7):**
  - [ ] Deployed to Vercel/Netlify with CI/CD
  - [ ] Environment-based configuration (Production/Staging)
  - [ ] Performance monitoring & Analytics integration
  - [ ] Final project walkthrough & Handover documentation

## Development Workflow

This project follows an **incremental development approach** with a transparent planning process:

1. **[Live Project Board](https://github.com/users/andreysey/projects/2):** I use GitHub Projects to track tasks, manage stages, and visualize progress.
2. **Feature Branches:** Each feature developed in isolation with descriptive branch names.
3. **Self-Code Review:** Every PR includes a self-review checklist before merging.
4. **Documentation-First:** Features documented before implementation to clarify requirements.

## Deployment

**Live Demo:** [Coming Soon - Vercel Deployment]

The project will be deployed to **Vercel** (free tier) with automatic deployments on every push to `main`. This provides:

- Shareable link for recruiters/interviewers
- Real performance metrics
- Production-like environment testing

## AI Policy

I use AI as a **Technical Partner**, not a code generator.

- **Usage:** Architecture brainstorming, brainstorming edge cases in TypeScript, and generating mock data.
- **Constraint:** Every line of code is manually reviewed, refactored, and integrated with a full understanding of its impact on the system.

## Author

**Andrii Butsvin** _Frontend Developer based in Germany_

- **Technical Skills:** JavaScript (ES6+), TypeScript, React, Vue 3.
- **Languages:**
  - German (B1 - Actively progressing to B2)
  - English (B2)
  - Ukrainian (Native)
  - Russian (Native)
- **Work Status:** Resident in Germany (§24), Full Work Permit.

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server (with MSW auto-start)
npm run dev
```
