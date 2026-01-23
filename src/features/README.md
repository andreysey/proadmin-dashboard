# Features Layer

**Purpose**: User-centric actions that provide business value. Examples: `AuthByEmail`, `SearchDashboard`, `UpdateUserStatus`.

## Contents
- Interactive components, hooks, and logic specific to a user action.

## Rules
- Can import from `entities` and `shared`.
- Can be imported by `widgets`, `pages`, or `app`.
- **CRITICAL**: No horizontal imports between feature slices.
