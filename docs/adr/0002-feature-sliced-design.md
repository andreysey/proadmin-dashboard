# ADR 0002: Feature-Sliced Design (FSD)

## Status

Accepted

## Context

The project required a scalable and maintainable folder structure to handle increasing complexity and a large number of features.

## Decision

We adopted **Feature-Sliced Design (FSD)**.

- **Layers**: app, pages, widgets, features, entities, shared.
- **Rules**: Strict hierarchy (lower layers cannot import from upper layers), Public APIs (index.ts) for every slice.

## Consequences

- **Positive**: High cohesion, low coupling, clear boundaries, easier testing.
- **Negative**: Steeper learning curve for developers unfamiliar with FSD.
