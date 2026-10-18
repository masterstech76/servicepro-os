# ServicePro OS — Progress Tracker

## Current Status
- **Phase 1 (Booking UI - Mock Data)**: DONE & VERIFIED (all 8 acceptance checks pass)
- **Phase 2 (Supabase + Slot Logic)**: In Progress

## Phase 1 Acceptance Checklist (Completed)
1. **/book completes all 7 steps on 390×844 with no horizontal scroll**: PASS (`tests/e2e/booking-phase1.spec.ts` asserts `scrollWidth <= clientWidth` on `/` and every wizard step 1–7).
2. **Unserved ZIP (90210) blocks Step 2 with specified error**: PASS (`Sorry, we don't serve 90210 yet.` shown and `Continue` button disabled).
3. **Slot picker shows morning/afternoon groups, "Only 1 left" state, and fully-booked day with next-available link**: PASS (verified in Step 4 E2E test).
4. **Simulated `SLOT_TAKEN` returns to Step 4 with toast**: PASS (11:00 AM slot triggers `SLOT_TAKEN`, shows toast `"That time was just taken"`, stays on Step 4).
5. **Hold countdown expiry opens "Pick a new time" modal**: PASS (verified by second E2E test in `tests/e2e/booking-phase1.spec.ts`).
6. **Step 6 deposit math matches `pricing.ts` ($99 → $19.80 deposit, $79.20 remaining)**: PASS (verified in `tests/unit/pricing.test.ts` and Step 6 E2E test).
7. **axe shows zero critical/serious issues on `/` and every step; orange buttons use navy text**: PASS (`@axe-core/playwright` zero violations, `rgb(15, 23, 42)` navy text on `#F97316` orange button verified).
8. **Unit and E2E tests pass**: PASS (`pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e` all exit 0).

## Phase 2 Task Plan (In Progress)
1. **Task 2.1 — Migrations `0001`–`0007`**: Verbatim SQL from `BUILD_PLAN.md` §7 plus `0004_functions.sql` implementing `slot_capacity`, `get_available_slots`, `hold_slot`, `convert_hold_to_job`, `assign_job`, `transition_job`, `reschedule_job`, `report_revenue`, and `purge_expired_holds` with `pg_advisory_xact_lock` and `service_role`-only grants.
2. **Task 2.2 — DB Types, Supabase Clients, Middleware, and `/login`**: `src/lib/supabase/{types,browser,server,middleware}.ts`, `src/lib/server/supabase-admin.ts` (`import "server-only"`), `src/middleware.ts` with role redirects, and `/login` wired to auth.
3. **Task 2.3 — CLI Scripts & Seed**: `scripts/verify-env.ts`, `scripts/sync-config.ts` (idempotent upsert, `--prune`, prints diff), `scripts/create-owner.ts`, and `supabase/seed/seed.sql` with the 4 demo technicians (Carlos Mendez, Danny Reyes, Maria Alvarez, Tony Brooks) + Tony's Wednesday time off.
4. **Task 2.4 — Public API Routes & Photo Flow**: `/api/service-area`, `/api/services`, `/api/slots`, `/api/slots/hold`, `/api/uploads/sign`, `/api/jobs/checkout` (with Mapbox geocoding + fallback and fake `clientSecret`), `/api/dev/simulate-payment`, and `/api/jobs/by-intent`.
5. **Task 2.5 — Switch Wizard to `API_MODE=real` & Run Phase 2 Tests**: Slot-engine fixture tests, 20-parallel-hold concurrency test, DST boundary test, RLS tests for owner/tech/anon, route validation tests, and full E2E booking test in `API_MODE=real`.
