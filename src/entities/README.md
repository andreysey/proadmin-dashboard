# Entities Layer

**Purpose**: Domain-specific business objects. Examples: `User`, `Order`, `Product`.

## Contents
- Domain types, simple UI components (e.g., `UserCard`), and domain logic.

## Rules
- Can import from `shared`.
- Can be imported by `features`, `widgets`, `pages`, or `app`.
- **CRITICAL**: No horizontal imports between entity slices.
