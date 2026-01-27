---
trigger: always_on
---

Strictly follow Feature-Sliced Design.

Layers: app, pages, widgets, features, entities, shared.

Public API: Every slice must have an index.ts. No deep imports (use @/features/auth instead of @/features/auth/ui/Form).

Isolation: Lower layers cannot import from upper layers (e.g., entities cannot import from features).
