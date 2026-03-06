---
applyTo: "client/**"
description: "Use when working in the client frontend; prioritize WebAwesome components and existing UI/service patterns."
---

# Client Frontend Instructions

- Use WebAwesome as the default component and design system.
- Reuse existing UI primitives and patterns before adding new component abstractions.
- Avoid introducing additional UI libraries unless explicitly requested.
- Keep visual and interaction behavior consistent with existing files in `client/src/components/`, `client/src/views/`, and `client/src/css/`.
- Prefer existing service layers in `client/src/services/` for API/auth/user flows.
- Keep generated API artifacts in `client/api/` as the source of truth; do not hand-edit generated files unless the task explicitly requires it.
- Preserve TypeScript strictness and existing Vite project conventions.
- Match naming and file organization already used in the client codebase.
- Keep changes focused and minimal; avoid broad refactors unless requested.
