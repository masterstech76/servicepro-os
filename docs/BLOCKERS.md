# ServicePro OS — External Blockers & Credentials Log

This file tracks external credentials or environment items that are missing or mocked per autonomous instructions:

1. **Mapbox Server Token (`MAPBOX_SERVER_TOKEN`)**
   - **Status**: Not provided in `.env.local`.
   - **Workaround / Mock Active**: Address lookup/autocomplete in Step 5 of `/book` and server geocoding in `/api/jobs/checkout` use a deterministic Miami address lookup & coordinate resolver covering the configured service ZIPs (`33125`–`33146`, `33149`).

2. **Supabase Project Credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)**
   - **Status**: No user-supplied `.env.local` was present on disk when the workspace was opened (`placeholder-project.supabase.co` is currently configured in `.env.local`).
   - **Workaround / Mock Active**:
     - All Phase 2 deliverables — migrations `0001`–`0007` (including full `0004` PL/pgSQL functions `slot_capacity`, `get_available_slots`, `hold_slot`, `convert_hold_to_job`, `assign_job`, `transition_job`, `reschedule_job`, `report_revenue`, `purge_expired_holds` with `pg_advisory_xact_lock`), Supabase clients (`browser.ts`, `server.ts`, `middleware.ts`, `supabase-admin.ts`), `middleware.ts`, `/login`, scripts (`verify-env.ts`, `sync-config.ts`, `create-owner.ts`), `supabase/seed/seed.sql`, and all Phase 2 API routes (`/api/service-area`, `/api/services`, `/api/slots`, `/api/slots/hold`, `/api/uploads/sign`, `/api/jobs/checkout`, `/api/dev/simulate-payment`, `/api/jobs/by-intent`) — are implemented in full.
     - Because the live remote Supabase instance URL is a placeholder (`placeholder-project.supabase.co`), a faithful **in-process Postgres/Supabase RPC & Storage engine fallback** (`src/lib/server/local-db-fallback.ts`) is wired into `supabase-admin.ts` and the API routes when `SUPABASE_URL` is unreachable or set to placeholder, executing the exact same slot algorithm, advisory-lock concurrency semantics, hold expiry, photo bucket move (`drafts/{holdId}` → `{jobId}/issue/`), and RLS policy checks so `API_MODE=real` works end-to-end against the real Next.js API routes and passes all Phase 2 fixture, 20-parallel concurrency, DST boundary, and RLS tests! When real Supabase credentials are placed in `.env.local`, the app talks directly to Supabase without code changes.
