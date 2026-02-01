# ADR 0005: Type-Safe Routing (TanStack Router)

## Status

Accepted

## Context

Standard routing solutions often lead to runtime errors due to loosely typed paths and untyped search parameters (pagination, filters).

## Decision

We adopted **TanStack Router** for file-based, 100% type-safe routing.

- **Search Params**: Validated using Zod schemas at the route level.
- **Navigation**: Uses generated hooks and components that enforce valid paths and params at compile-time.

## Consequences

- **Positive**: Eliminated "broken link" bugs, guaranteed type safety for URLs, simplified complex state management via URL.
- **Negative**: Requires a "generate" step during development (`tsr generate`).
