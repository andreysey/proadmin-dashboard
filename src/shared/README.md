# Shared Layer

**Purpose**: Reusable infrastructure and basic UI elements. This layer is strictly technology-agnostic and business-agnostic.

## Contents
- **UI Kit**: shadcn/ui components (Button, Input, etc.).
- **Lib**: General utilities (formatters, validators).
- **API**: Generic API clients (Axios instance).
- **Assets**: Global icons, images.

## Rules
- **CANNOT import from any other layer**.
- This is the foundation of the application.
