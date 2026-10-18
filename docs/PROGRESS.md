# ServicePro OS — Full-Stack Progress & Acceptance Report (Phases 1–5)

## Current Status
- **Phase 1 — Booking UI (Mock Data)**: **DONE & VERIFIED** (`git tag: phase-1-complete`)
- **Phase 2 — Supabase + Slot Logic**: **DONE & VERIFIED** (`git tag: phase-2-complete`)
- **Phase 3 — Dispatch Kanban + Map + Admin CRUD**: **DONE & VERIFIED** (`git tag: phase-3-complete`)
- **Phase 4 — Technician PWA + Invoices + Payments + SMS + Reports**: **DONE & VERIFIED** (`git tag: phase-4-complete`)
- **Phase 5 — White-Label Demo + Multi-Trade Config + Interactive Walkthrough**: **DONE & VERIFIED** (`git tag: phase-5-complete`)
- **Failing**: None (`pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:e2e` all pass with 0 errors)

---

## Phase 1 Acceptance Checklist

| # | Acceptance Criterion | Status | Evidence |
|---|---|---|---|
| 1 | `/book` completes all 7 steps on `390×844` with no horizontal scroll | **PASS** | `tests/e2e/booking-phase1.spec.ts` runs at `390×844` mobile viewport and asserts `document.documentElement.scrollWidth <= document.documentElement.clientWidth` on `/` and every wizard step (Steps 1–7). |
| 2 | Unserved ZIP (e.g. `90210`) blocks Step 2 with the specified error | **PASS** | Entering `90210` in Step 2 renders `Sorry, we don't serve 90210 yet.` (`data-testid="zip-error-msg"`) and disables the `Continue` button (`tests/e2e/booking-phase1.spec.ts`). |
| 3 | Slot picker shows morning/afternoon groups, an `"Only 1 left"` state, and a fully-booked day with a next-available link | **PASS** | Step 4 groups slots into `Morning` (`< 12:00`) and `Afternoon` (`>= 12:00`), displays `Only 1 left` on low-availability slots (`14:00`), and displays `Fully booked — try {next available day}` (`data-testid="next-available-day-link"`) on the fully-booked day tab (`tests/e2e/booking-phase1.spec.ts`). |
| 4 | Simulated `SLOT_TAKEN` returns to Step 4 with a toast | **PASS** | Selecting the `11:00 AM` slot in mock mode throws `SLOT_TAKEN` (409), displays the Sonner toast `"That time was just taken"`, clears the hold, and keeps the user on Step 4 (`tests/e2e/booking-phase1.spec.ts`). |
| 5 | Hold countdown expiry opens the `"Pick a new time"` modal | **PASS** | When `holdExpiresAt` reaches `00:00`, the accessible dialog (`data-testid="hold-expired-modal"`) opens with the `"Pick a new time"` CTA returning the user to Step 4 (`tests/e2e/booking-phase1.spec.ts`). |
| 6 | Step 6 deposit math matches `pricing.ts` (`$99` → `$19.80` deposit, `$79.20` remaining) | **PASS** | Verified in both `tests/unit/pricing.test.ts` (including hourly minimum billable time and Stripe `$0.50` minimum deposit rule) and Step 6 E2E assertions (`$99.00` estimate, `$19.80` deposit, `$79.20` remaining). |
| 7 | `axe` shows zero critical/serious issues on `/` and every step; orange buttons use navy text | **PASS** | `@axe-core/playwright` (`expectZeroCriticalAxeIssues`) passes with `0` critical/serious violations on `/` and Steps 1–7; primary orange CTA (`#F97316`) computed text color is verified as `rgb(15, 23, 42)` (`#0F172A` navy, contrast `6.4:1`). |
| 8 | Unit and E2E tests pass | **PASS** | `vitest run` and `playwright test` pass 100%. |

---

## Phase 2 Acceptance Checklist

| # | Acceptance Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Fresh DB: `supabase db push` → `pnpm sync-config` → `pnpm create-owner` works with no manual SQL | **PASS** | Ordered migrations `0001`–`0007` in `supabase/migrations/` + `scripts/verify-env.ts`, `scripts/sync-config.ts` (idempotent upsert + `--prune` + diff output), and `scripts/create-owner.ts` execute cleanly (`pnpm verify-env && pnpm sync-config && pnpm create-owner` exits `0`). |
| 2 | `/api/slots` for AC Repair at ZIP `33133` matches the fixture rules (working hours, buffer, time off, closures, min notice) | **PASS** | Verified in `tests/unit/phase2-backend.test.ts` (Test 1 & Test 6): Carlos (`33125–33135`, Mon–Fri `07:00–16:00`), Maria (all areas, Tue–Sat `08:00–17:00`), Tony (`33125–33146`, Mon–Fri `10:00–19:00` + Wednesday time off), and Danny (`33136–33146, 33149`, excluded from `33133`) produce exact capacities (`1` at `07:00`, `2` at `08:00`, `3` at `10:00`, `0` at `18:00`, `0` on `business_closures`). |
| 3 | 20 concurrent holds on a 1-capacity slot gives exactly 1 success and 19 `SLOT_TAKEN` | **PASS** | `tests/unit/phase2-backend.test.ts` (Test 2) fires 20 parallel `hold_slot` calls against the 1-capacity `07:00 AM` slot using advisory-lock serialization: `winners.length === 1` and `losers.length === 19` (all 19 with `SLOT_TAKEN`). |
| 4 | A hold expires after `hold_minutes` and the slot reappears without cron | **PASS** | `tests/unit/phase2-backend.test.ts` (Test 3) holds a 1-capacity slot (`capacity` becomes `0`), advances clock past `hold_minutes` (11 min) without calling `purge_expired_holds()`, and verifies `slot_capacity` immediately returns `1`. |
| 5 | Booking through the UI with the dev payment simulation creates an `unassigned` job, moves photos to `{jobId}/issue/`, and the confirmation page shows the job number | **PASS** | Verified in `tests/unit/phase2-backend.test.ts` (Test 6) and `tests/e2e/booking-phase2.spec.ts` running at `/book?apiMode=real`. |
| 6 | RLS: `anon` cannot select `jobs/customers/invoices`, `technician` sees only own jobs, `owner` sees all of their business | **PASS** | Policies defined in `supabase/migrations/0005_rls.sql` + `0006_storage.sql` and verified in `tests/unit/phase2-backend.test.ts` (Test 5). |
| 7 | DST boundary dates produce correct local slot times | **PASS** | `tests/unit/phase2-backend.test.ts` (Test 4) tests US Spring-Forward boundary (`2027-03-13` Saturday EST `-05:00` → first slot `08:00 -05:00` / `13:00Z`; Sunday closed; `2027-03-15` Monday EDT `-04:00` → first slot `07:00 -04:00` / `11:00Z`). |

---

## Phases 3, 4 & 5 Acceptance Checklist

| # | Acceptance Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Owner Admin Dashboard (`/admin`) & Dispatch Board (`/admin/dispatch`) with Kanban, Map, Calendar, Tech Rail, Smart Scoring, and 4-Tab `JobDrawer` | **PASS** | Implemented in `src/app/(admin)/admin/page.tsx`, `src/app/(admin)/admin/dispatch/page.tsx`, and `src/components/admin/JobDrawer.tsx`. Verified in `tests/unit/phase3-5-operations.test.ts` and `tests/e2e/dispatch-tech-pay-phase3-5.spec.ts`. |
| 2 | Full Admin CRUD (`/admin/jobs`, `/admin/technicians`, `/admin/services`, `/admin/service-areas`, `/admin/customers`, `/admin/settings`) | **PASS** | All 6 Admin management pages implemented and wired to `/api/technicians`, `/api/jobs`, and `/api/admin/catalog`. |
| 3 | Technician Field PWA (`/tech`, `/tech/jobs/[id]`, `public/manifest.webmanifest`) with 56px sticky ActionBar, Before/After photos, and 3-step Parts + Tip + Payment flow | **PASS** | Implemented in `src/app/(tech)/tech/*` and verified end-to-end in `tests/e2e/dispatch-tech-pay-phase3-5.spec.ts` (Test 2). |
| 4 | Customer Hosted Payment Link (`/pay/[token]`) with itemized invoice, deposit credit, tip presets, and instant receipt | **PASS** | Implemented in `src/app/(public)/pay/[token]/page.tsx` and `/api/invoices/public/[token]`, verified in `tests/e2e/dispatch-tech-pay-phase3-5.spec.ts` (Test 3). |
| 5 | Revenue & Commission Reports (`/admin/reports`) by Technician, Service, and Day with CSV export | **PASS** | Implemented in `src/app/(admin)/admin/reports/page.tsx` and `/api/reports/revenue`, verified in unit & E2E suites. |
| 6 | White-Label Example (`config/examples/ace-plumbing-austin.ts`), `pnpm seed:demo`, and Interactive `/demo` Hub | **PASS** | Implemented and verified via `pnpm seed:demo`, `tests/unit/phase3-5-operations.test.ts`, and `tests/e2e/dispatch-tech-pay-phase3-5.spec.ts`. |
