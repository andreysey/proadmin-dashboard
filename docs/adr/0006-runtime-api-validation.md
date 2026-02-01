# ADR 0006: Runtime API Validation (Zod)

## Status

Accepted

## Context

TypeScript types only exist at compile-time. If the API returns unexpected data (e.g., a missing field or wrong type), the app may crash at runtime despite passing TS checks.

## Decision

We implemented **Runtime Validation** using **Zod** in the `entities` layer.

- **Schemas**: Defined for every API response and domain entity.
- **Enforcement**: API calls parse the raw response through the schema before returning data to the UI.

## Consequences

- **Positive**: Guaranteed data integrity, instant "fail-fast" errors during development, self-documenting API contracts.
- **Negative**: Slight performance overhead for parsing large responses.
