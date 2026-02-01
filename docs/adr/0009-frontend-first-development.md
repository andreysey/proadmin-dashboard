# ADR 0009: Frontend-First Development (MSW)

## Status

Accepted

## Context

Waiting for a backend to be ready often blocks frontend progress. We also needed a reliable way to simulate various server states (latency, errors, specific data).

## Decision

Integrated **Mock Service Worker (MSW)** at the heart of the development cycle.

- **API Mocking**: Intercepts requests at the network level.
- **Reliability**: Used for both local development and testing (Vitest/Playwright).
- **Environment**: Enables a fully functional "Demo Mode" for production previews.

## Consequences

- **Positive**: Complete decoupling from backend, reliable testing without "real" data, easy simulation of edge cases.
- **Negative**: Requires maintenance of mock handlers alongside real API evolution.
