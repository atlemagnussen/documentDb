# Repository-Wide Copilot Instructions

These instructions apply to the whole repository.

## General

- Keep changes focused on the requested task and avoid unrelated refactors.
- Follow existing naming, folder structure, and coding style in the touched area.
- Prefer small, incremental edits over broad rewrites.
- Add tests when behavior changes or bug fixes are introduced, where practical.

## Client And Server Contract

- Treat API contracts as the source of truth and keep client usage aligned with server responses.
- When API shape changes, update both server endpoints and client consumers in the same change.
- Keep error handling explicit and user-friendly on the client, and structured on the server.

## Client

- Follow scoped frontend guidance in `.github/instructions/client-ui.instructions.md` for files under `client/**`.
- Do not hand-edit generated files under `client/api/` unless the task explicitly requires it.

## Server

- Follow existing ASP.NET Core patterns in `server/` for startup wiring, DI registration, and endpoint organization.
- Prefer clear domain/service boundaries over controller-heavy logic.
- Keep migrations and persistence changes consistent with existing EF Core conventions.

## Safety

- Do not introduce secrets or credentials into source files.
- Preserve authentication and authorization flows unless explicitly asked to change them.
