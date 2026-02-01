# ADR 0004: Resilient Auth Strategy

## Status

Accepted

## Context

Security and user experience are paramount. The system needs to handle token expiration gracefully without interrupting the user's workflow.

## Decision

Implemented a resilient auth strategy consisting of:

- **Silent Refresh**: Automatic token rotation via Axios interceptors.
- **Request Retry**: Failed requests due to 401 are queued and retried after a successful refresh.
- **Zustand Auth Store**: Global state management for user session and permissions.
- **RBAC**: Permission-based UI rendering using `ProtectedAction`.

## Consequences

- **Positive**: Zero-interruption UX, robust security, clear permission model.
- **Negative**: Complexity in interceptor logic and token lifecycle management.
