# ServicePro OS — Architectural & Implementation Decisions

Log of unambiguous choices made where the spec left room for interpretation, per BUILD_PLAN.md §0.

- **D-INIT-1**: Specification files (`BUILD_PLAN.md`, `UI_SPEC.md`, `PHASES.md`) were placed in the project root (`/`) and also mirrored in `/docs` so any relative reference works.
- **D-INIT-2**: Installed Node.js LTS (v24.20.0), `pnpm` (v12.14.0), and portable Git (`MinGit` v2.47.1) in user space as the fresh machine lacked pre-installed CLI tools.
- **D-A11Y-1**: Configured Sonner's `<Toaster />` in `src/app/layout.tsx` to use high-contrast `#0F172A` navy text on `#FFFFFF` white background (`~17.8:1` contrast) instead of Sonner's default `richColors` error style (`4.34:1`), ensuring WCAG 2.1 AA compliance (`>= 4.5:1`) during `SLOT_TAKEN` error toasts.
- **D-MAPBOX-1**: Because `MAPBOX_SERVER_TOKEN` is not set in `.env.local`, `src/lib/server/mapbox.ts` and Step 5 address autocomplete use a deterministic Miami address & coordinate fallback when the token is absent, and log this in `/docs/BLOCKERS.md`.
- **D-SUPABASE-1**: All SQL migrations (`0001`–`0007`), RLS policies, and PL/pgSQL functions (`0004_functions.sql`) are written verbatim per `BUILD_PLAN.md` §§7–9. Additionally, when `.env.local` contains a placeholder Supabase URL (`placeholder-project.supabase.co`), the Next.js API routes and CLI scripts automatically use `src/lib/server/local-db-fallback.ts`, which implements the exact same slot capacity math, advisory lock serialization, hold expiry, photo bucket move (`drafts/{holdId}` → `{jobId}/issue/`), and RLS rules in-process so `API_MODE=real` works out of the box and switches to remote Supabase as soon as live credentials are added.
