# App Layer

**Purpose**: Orchestrates the entire application. It contains the initialization logic, global styles, and application-wide providers.

## Contents
- **Providers**: Global Context API providers, QueryClient, Router setup.
- **Styles**: Global CSS files (Tailwind base, variables).
- **Entry Points**: `App.tsx` and `main.tsx`.

## Rules
- Can import from **any** other layer (`pages`, `widgets`, `features`, `entities`, `shared`).
- Should lead the initialization process of the application.
