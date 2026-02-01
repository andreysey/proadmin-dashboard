# ProAdmin Dashboard (React Edition)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://proadmin-dashboard.vercel.app/)
[![Project Board](https://img.shields.io/badge/Project_Board-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/users/andreysey/projects/2)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrii-butsvin-136899264/)

A production-grade administrative interface designed to demonstrate a **Junior+ to Middle** transition. This project focuses on engineering excellence, scalability, and maintainable architecture rather than just UI.

## Key Capabilities

### 🛡️ Robust Architecture

- **Feature-Sliced Design (FSD)**: Strict separation of concerns (entities, features, widgets) to prevent technical debt.
- **Strict Type Safety**: 100% TypeScript coverage with `noAny` policy and runtime validation via **Zod**.
- **Scalable State Management**: Hybrid approach using **TanStack Query** (server state) and **Zustand** (client state).

### 🚀 Performance First

- **Optimization**: Route-level code splitting, manual chunking (~36% reduction), and debounced search.
- **Real-Time Analytics**: Live dashboard with auto-refreshing charts (Recharts) and global date filtering.
- **Smart Loading**: Skeleton screens and optimistic UI updates for a perceived "zero-latency" feel.

### 🔒 Security & RBAC

- **Role-Based Access Control**: Declarative permission gates (`<ProtectedAction>`) and route guards.
- **Resilient Auth**: JWT rotation, auto-logout on 401, and redirect safety.
- **Error Handling**: Global Error Boundaries and interceptors for graceful failure recovery.

### 📦 Production Quality

- **Automated CI/CD**: Semantic versioning and release automation via GitHub Actions & Release Please.
- **Monitoring**: Integrated Vercel Analytics and Speed Insights.
- **Testing**: Comprehensive suite with **Vitest** (Unit) and **Playwright** (E2E).

## Tech Stack

| Category    | Technologies               |
| ----------- | -------------------------- |
| **Core**    | React 19, Vite, TypeScript |
| **State**   | TanStack Query v5, Zustand |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Forms**   | React Hook Form, Zod       |
| **Testing** | Vitest, Playwright, MSW    |
| **Infra**   | Vercel, GitHub Actions     |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/andreysey/proadmin-dashboard.git

# Install dependencies
pnpm install

# Start development server (MSW mock backend included)
pnpm dev
```

### Available Scripts

- `pnpm build`: Production build with type checks.
- `pnpm typecheck`: Fast TypeScript validation.
- `pnpm lint:fix`: Auto-fix ESLint issues.
- `pnpm test`: Run unit tests.

## Author

**Andrii Butsvin** — Frontend Developer (Germany)
_Focusing on Modern Frontend (React, Vue) and System Design._
