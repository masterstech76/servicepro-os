# ServicePro OS — Architectural & Implementation Decisions

Log of unambiguous choices made where the spec left room for interpretation, per BUILD_PLAN.md §0.

- **D-INIT-1**: Specification files (`BUILD_PLAN.md`, `UI_SPEC.md`, `PHASES.md`) were found in `/doc` and copied to `/docs` so both paths work seamlessly.
- **D-INIT-2**: Installed Node.js LTS (v24.20.0), `pnpm` (v12.14.0), and portable Git (`MinGit` v2.47.1) in user space as the fresh machine lacked pre-installed CLI tools.
- **D-MAPBOX-1**: When `MAPBOX_SERVER_TOKEN` or `NEXT_PUBLIC_MAPBOX_TOKEN` is absent, address autocomplete, geocoding, and driving matrix calculations gracefully fall back to deterministic Miami mock coordinates / haversine calculations, and the missing token is logged in `BLOCKERS.md`.
