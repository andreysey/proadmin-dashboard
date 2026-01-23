# Widgets Layer

**Purpose**: Self-contained, complex UI blocks that participate in different pages. Examples: `Header`, `Sidebar`, `UserTable`.

## Contents
- Complex UI components that combine multiple features and entities.

## Rules
- Can import from `features`, `entities`, and `shared`.
- Can be imported **only** by `pages` or `app`.
- Slices should be independent (no horizontal imports).
