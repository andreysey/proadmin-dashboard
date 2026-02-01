# ADR 0007: Styling and Design System

## Status

Accepted

## Context

Consistency in design and speed of UI development are critical. We needed a system that supports dark mode, responsiveness, and complex animations.

## Decision

Adopted a three-tier styling strategy:

1. **Tailwind CSS**: For utility-first styling and rapid prototyping.
2. **shadcn/ui**: For accessible, high-quality component primitives.
3. **CVA (Class Variance Authority)**: For managing complex component variants in a type-safe way.

## Consequences

- **Positive**: Extremely fast UI iteration, consistent aesthetics, built-in accessibility, robust dark mode support.
- **Negative**: Potential for "utility class bloat" if not careful with component extraction.
