# ADR 0003: UI-Driven Optimistic Updates

## Status

Accepted

## Context

We needed a way to provide instant UI feedback during mutations (deletions, role updates) while ensuring the application remains safe from race conditions and concurrent mutation issues.

## Decision

We implemented the **UI-Driven Optimistic Updates** pattern using TanStack Query's `useMutationState`.

- **Logic**: Instead of manual cache manipulation in `onMutate`, we derive the view state globally based on pending mutations.
- **Centralization**: Logic is encapsulated in a shared `useOptimisticUsers` hook.

## Consequences

- **Positive**: Native handling of concurrent mutations, simpler mutation hooks, consistent state.
- **Negative**: Slightly more complex data derivation logic in the UI layer.
