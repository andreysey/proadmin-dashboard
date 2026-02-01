# ADR 0008: Testing Strategy

## Status

Accepted

## Context

A high-performance dashboard requires high reliability. We needed a cost-effective yet thorough testing strategy.

## Decision

Implemented a hybrid testing approach:

- **Unit/Integration (Vitest + RTL)**: Focused on business logic, hooks, and individual component behavior.
- **End-to-End (Playwright)**: Focused on critical user flows (Login, User Management, Analytics) across different viewports.

## Consequences

- **Positive**: High confidence in core logic, verified mobile/desktop compatibility, automated regressions in CI.
- **Negative**: E2E tests are slower to run and require more maintenance.
