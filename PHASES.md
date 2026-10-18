# ServicePro OS — PHASES.md

Five phases, each ending in a **demoable, verified increment**. Each phase has: goal → deliverables → acceptance checks → **the prompt to paste into Antigravity**.

## How to run this in Antigravity

1. Create the repo, then put `BUILD_PLAN.md`, `UI_SPEC.md`, `PHASES.md` in `/docs`.
2. Paste **Prompt 0 (Global preamble)** once at the start of the project. Re-paste it if the agent starts drifting or opens a new session.
3. Paste one phase prompt at a time. Don't start the next phase until the acceptance checks of the current one pass. Commit to git at the end of every phase (`phase-1-complete`, …).
4. Ask the agent to produce its task plan first and review it against the phase's deliverables list before it writes code. Reject plans that add features outside the phase.
5. After each phase, run: `pnpm typecheck && pnpm lint && pnpm test` and the phase's manual checks.

Manual things the agent cannot do for you (do them before the phase that needs them): create the Supabase project (Phase 2), Stripe test account + CLI (Phase 4), Twilio account (Phase 4, optional — use the console driver), Mapbox token (Phase 3), Vercel account (Phase 5).

---

## Prompt 0 — Global preamble (paste once)

```
You are building "ServicePro OS", a white-label home-services dispatch system for US HVAC/plumbing/electrical shops.

Source of truth (read fully before doing anything): /docs/BUILD_PLAN.md, /docs/UI_SPEC.md, /docs/PHASES.md.
Rules:
1. Follow BUILD_PLAN Section 0 (decisions D1–D13) exactly. If something is ambiguous, pick the simplest option that satisfies the docs and append a line to /docs/DECISIONS.md. Do not ask me questions unless a required credential/account is missing.
2. Stack is fixed: Next.js 14 App Router, TypeScript strict, Tailwind, shadcn/ui, Supabase, Stripe, Twilio, Mapbox, FullCalendar (free plugins only), dnd-kit, Vercel. Use pnpm.
3. Money is integer cents everywhere. Times are stored UTC and computed in the business timezone.
4. Business logic lives in src/lib/domain (pure, unit-tested). I/O adapters live in src/lib/server. Never import server-only modules in client code.
5. Never put secrets in config/business.config.ts or in the client bundle.
6. Work only on the current phase's deliverables. Do not build ahead. Do not add dependencies not listed in BUILD_PLAN Section 3 without noting why in DECISIONS.md.
7. After each task: run typecheck, lint, and tests; fix failures before moving on. At the end of the phase, give me (a) a checklist of acceptance criteria with pass/fail and evidence, (b) a list of anything deferred, (c) the exact commands to run the app.
Reply "Ready" and then wait for the phase prompt.
```

---

## Phase 1 — Booking UI (frontend only, mock data)

**Goal:** A polished, mobile-first 7-step booking wizard running entirely against **mock adapters** behind interfaces, so Phase 2 swaps in the real backend without touching UI code. Also lays the project foundation (config, tokens, shell).

**Deliverables**
- Project scaffold: Next.js 14 + TS strict + Tailwind + shadcn/ui; ESLint/Prettier; Vitest; Playwright config; folder structure from BUILD_PLAN §4 (create empty route-group folders for admin/tech with placeholder pages).
- `config/business.config.ts` + `business.schema.ts` (zod) with the **Cool Air HVAC Miami** demo values (services, ZIPs, hours, tax, deposit, colors) — see Phase 5 for the full demo data; include enough now to run the wizard.
- Design tokens from UI_SPEC §1 as CSS variables + Tailwind theme; Inter via `next/font`; `Button`, `StatusBadge`, `Money`, `ServiceCard`, `SlotChip`, `PhotoUploader`, `TipSelector` components.
- Landing page `/` (UI_SPEC §3.3) and the wizard `/book` with all 7 steps and states (UI_SPEC §3).
- `lib/domain/pricing.ts` estimate + deposit functions (BUILD_PLAN §14) with unit tests including the worked example.
- **Adapter interfaces** in `lib/api/` — `getServices()`, `checkZip(zip)`, `getSlots(serviceId, zip, from, to)`, `holdSlot(...)`, `signUploads(...)`, `startCheckout(...)`, `getJobByIntent(...)` — with `mock` implementations (in-memory, simulated latency 300–600 ms, deterministic slots, one fully-booked day, `SLOT_TAKEN` simulated on a specific slot). A single `API_MODE=mock|real` switch selects the implementation.
- Stripe step uses a **mock Payment Element placeholder** (card form look-alike) — real Stripe arrives in Phase 2/4.
- Wizard state in a reducer + `sessionStorage` autosave; hold countdown timer; zod validation per step (`libphonenumber-js` for phone, 5-digit ZIP, email).
- Playwright e2e: complete the whole booking in mock mode at 390×844 and assert the 60-second path works with prefilled data.

**Acceptance checks**
1. `pnpm dev` → `/book` completes all 7 steps on a 390×844 viewport with no horizontal scroll.
2. Unserved ZIP (e.g. 90210) blocks Step 2 with the specified error.
3. Slot picker shows morning/afternoon groups, a "Only 1 left" state, and a fully-booked day with a "next available" link.
4. Simulated `SLOT_TAKEN` returns the user to Step 4 with a toast.
5. Hold countdown expiry opens the "pick a new time" modal.
6. Deposit math on Step 6 matches `pricing.ts` (AC Repair $99 → $19.80 deposit, $79.20 remaining).
7. axe has zero critical issues on `/` and each wizard step; orange buttons use navy text.
8. Unit + e2e tests pass.

**Prompt 1**
```
PHASE 1 — Booking UI with mock data. Read /docs/BUILD_PLAN.md (§0, §3, §4, §5, §9, §14 estimate part) and /docs/UI_SPEC.md (§1, §2, §3, §6, §7, §8) first.

First output a task plan; then implement. Scope is strictly:
1. Scaffold the project per BUILD_PLAN §4 (pnpm, Next.js 14 App Router, TS strict, Tailwind, shadcn/ui, Vitest, Playwright, ESLint/Prettier). Create placeholder pages for (admin)/admin and (tech)/tech so the route groups exist.
2. Implement config/business.config.ts and business.schema.ts (zod) per BUILD_PLAN §5, populated with the Cool Air HVAC Miami demo: timezone America/New_York; hours Mon–Fri 7:00–19:00, Sat 8:00–16:00, Sun closed; tax 700 bps on parts; deposit 20%; tip presets 15/20/25; slot interval 60, buffer 30; ZIPs 33125–33146 plus 33149; services: AC Repair $99 flat 90 min; AC Tune-Up $89 flat 60 min; Thermostat Install $149 flat 60 min; Duct Cleaning $249 flat 180 min; Refrigerant Recharge $125/hr hourly, 60 min minimum. Inject colors as CSS variables from config.
3. Build the design tokens, fonts and components listed in UI_SPEC §1–§2, honoring the contrast rules (navy text on orange buttons).
4. Build the landing page (UI_SPEC §3.3) and the 7-step booking wizard at /book exactly as wireframed in UI_SPEC §3, including loading/empty/error states, the hold countdown, the sticky footer, and sessionStorage autosave.
5. Create adapter interfaces in src/lib/api with mock implementations and an API_MODE env switch (BUILD_PLAN §11 public routes define the contract shapes). Mock behaviors: simulated latency, deterministic slots (a few 1-left slots, one fully-booked day), SLOT_TAKEN on a specific slot, ZIP check against config.zipCodes.
6. Implement src/lib/domain/pricing.ts estimate + deposit functions with unit tests including: AC Repair $99 → deposit $19.80; hourly service estimate uses the minimum billable time; Stripe $0.50 minimum rule.
7. Write a Playwright e2e that completes the booking at 390×844 and an axe check per step.
Out of scope: Supabase, real Stripe, Twilio, Mapbox maps, admin/tech UIs.
Finish with the acceptance checklist (pass/fail + evidence) and commands to run.
```

---

## Phase 2 — Supabase + slot logic (backend foundation)

**Goal:** Real database, RLS, storage, auth, and the **slot engine** — the booking wizard now runs against real data up to (but not including) real payment. Payment step stays mocked until Phase 4.

**Prerequisites (human):** Supabase project created; env vars set in `.env.local`.

**Deliverables**
- Migrations 0001–0007 exactly as BUILD_PLAN §7 plus 0004 functions from §8 (`get_available_slots`, `slot_capacity`, `hold_slot`, `convert_hold_to_job`, `assign_job`, `transition_job`, `reschedule_job`, `report_revenue` stubbed if not yet needed, `purge_expired_holds`).
- Generated TypeScript DB types; `lib/supabase/{browser,server,middleware}.ts`; `lib/server/supabase-admin.ts` (server-only); `middleware.ts` with role redirects; `/login`.
- Scripts: `verify-env`, `sync-config` (config → DB), `create-owner`.
- Seed: Cool Air demo data (services, ZIPs, hours) via `sync-config`, plus **4 demo technicians** with hours, skills, ZIP coverage (demo data below) via `supabase/seed`.
- Public API routes: `/api/service-area`, `/api/services`, `/api/slots`, `/api/slots/hold`, `/api/uploads/sign`, `/api/jobs/checkout` (creates the hold payload; in this phase returns a **fake client secret** and a dev-only `/api/dev/simulate-payment` that calls `convert_hold_to_job`), `/api/jobs/by-intent`.
- Photo upload end-to-end to the private bucket with signed URLs and draft → job folder move.
- Wizard `API_MODE=real` wired to these routes (UI unchanged).
- Tests: slot-engine fixture tests (BUILD_PLAN §21), concurrency test (20 parallel holds, one winner), RLS tests (owner/tech/anon), route tests with zod validation and error mapping.

**Acceptance checks**
1. Fresh DB → `supabase db push` → `pnpm sync-config` → `pnpm create-owner` works from scratch with no manual SQL.
2. `/api/slots` for AC Repair at ZIP 33133 returns slots consistent with the fixture rules (working hours, buffer, time off, closures, min notice).
3. 20 concurrent holds on a 1-capacity slot → exactly 1 succeeds, 19 get `SLOT_TAKEN`.
4. A hold expires after `hold_minutes` and the slot reappears without any cron.
5. Booking through the UI with the dev payment simulation creates a job (`unassigned`), moves photos into `{jobId}/issue/`, and the confirmation page shows job #.
6. RLS: anon cannot select `jobs/customers/invoices`; technician can select only their own jobs; owner can select all of their business.
7. Daylight-saving test date (spring-forward Sunday is closed; test the Saturday/Monday boundary) produces correct local slot times.

**Prompt 2**
```
PHASE 2 — Supabase + slot logic. Phase 1 is complete and committed. Read /docs/BUILD_PLAN.md §0, §6–§11, §17, §19–§21 and /docs/PHASES.md Phase 2 first.

Implement exactly this scope:
1. Create supabase/migrations 0001–0007 using the SQL in BUILD_PLAN §7 verbatim (fix only genuine syntax errors and record each fix in DECISIONS.md), then write migration 0004 implementing the functions specified in BUILD_PLAN §8 using the slot algorithm in §9. get_available_slots and hold_slot must share slot_capacity. hold_slot and convert_hold_to_job must use pg_advisory_xact_lock as specified. Revoke function execute from anon/authenticated; grant to service_role.
2. Generate DB types. Implement lib/supabase/* clients, lib/server/supabase-admin.ts (import "server-only"), middleware.ts with session refresh and role redirects (BUILD_PLAN §19), and /login.
3. Write scripts/verify-env.ts, scripts/sync-config.ts (idempotent upsert, --prune flag, prints diff), scripts/create-owner.ts, and supabase/seed with the 4 demo technicians: Carlos Mendez (skills hvac; covers 33125–33135; Mon–Fri 7–16), Danny Reyes (hvac; 33136–33146,33149; Mon–Fri 9–18), Maria Alvarez (hvac; all areas; Tue–Sat 8–17), Tony Brooks (hvac; 33125–33146; Mon–Fri 10–19). Use fictional (305) 555-01xx phone numbers. Add one time-off entry for Tony next Wednesday.
4. Implement the public routes listed for Phase 2 in /docs/PHASES.md with zod validation, Turnstile optional via env flag, and error mapping from DB error codes to {error:{code,message}} (BUILD_PLAN §8, §11). /api/jobs/checkout builds the hold payload and, in this phase only, returns a fake clientSecret; add a dev-only route /api/dev/simulate-payment (disabled when NODE_ENV=production) that calls convert_hold_to_job and the photo move.
5. Implement the photo flow: signed upload URLs, client-side compression (browser-image-compression), draft folder, move on conversion, signed download URLs with 1h TTL.
6. Switch the wizard to API_MODE=real; keep the mock mode working for tests.
7. Tests: slot-engine fixture (3+ techs, mixed zips, time off, a closure, existing jobs, unexpired holds, a DST boundary), 20-parallel-hold concurrency test, RLS tests for owner/technician/anon on every table, and route tests for validation/errors.
Out of scope: real Stripe, SMS, admin/tech UIs, Mapbox maps (Mapbox geocoding for address→lat/lng IS in scope inside /api/jobs/checkout).
Finish with the acceptance checklist (pass/fail + evidence), the SQL test output, and commands to reproduce from a fresh Supabase project.
```

---

## Phase 3 — Dispatch Kanban + Map (+ admin CRUD + tech job view)

**Goal:** The owner can run the day: see jobs in real time, drag to assign, see the map, manage techs/services/areas/hours. The technician can see and progress jobs (no payments yet).

**Prerequisites (human):** Mapbox tokens (public URL-restricted + server).

**Deliverables**
- Admin shell, dashboard (UI_SPEC §4.1), **Dispatch** with Board / Map / Calendar views (UI_SPEC §4.2–§4.4), Job Drawer (§4.5), Jobs list (§4.6).
- dnd-kit Kanban with tech rail drop targets, eligibility feedback (green/amber/dimmed), force-assign confirm, keyboard drag + live-region announcements, optimistic updates with rollback.
- Routes: `/api/dispatch/{board,assign,suggest}`, `/api/jobs` (+ `[id]`, `cancel`, `reschedule`), `/api/technicians` (+ hours, time-off, invite), `/api/services`, `/api/service-areas`, `/api/business-hours`, `/api/closures` (owner CRUD).
- `lib/domain/{job-state,dispatch-score}.ts` with tests; scoring per BUILD_PLAN §13 incl. Mapbox Matrix + haversine fallback.
- Realtime subscription hook on `jobs` with polling fallback and "Live" indicator.
- Mapbox map view: status pins, tech-colored rings, clustering, ZIP polygons (optional; skip if no boundary data — document), route line for a selected tech.
- FullCalendar view (free plugins only) with drag-to-reschedule for unassigned/assigned jobs.
- CRUD screens: Technicians (incl. weekly-hours grid, time off, invite), Services, Service Areas (bulk paste), Settings (hours, closures, deposit, tax, policies) — UI_SPEC §4.7.
- **Technician app v1** (UI_SPEC §5.1–§5.3, §5.5): My Jobs Today, job detail, action bar for Start Route (status + Google Maps deep link; **SMS still stubbed** to the console driver until Phase 4), I've Arrived, before/after photo capture, Complete Job → marks `completed` (invoice/payment flow arrives in Phase 4). PWA manifest.
- Reporting stub page showing "coming in Phase 4".

**Acceptance checks**
1. Create a booking via `/book` → card appears in **Unassigned** on the open admin board within 2 s (Realtime), without refresh.
2. Drag it onto a technician with a conflict → warning dialog; onto an out-of-coverage tech → snaps back with reason; onto an eligible tech → moves to **Assigned** and appears in that tech's "Today" list in a second browser/device live.
3. Tech walks `Start Route → Arrived → Complete` (with required photos); the owner board mirrors each status in real time.
4. Illegal drags (e.g. Unassigned → Completed) are rejected server-side and visually.
5. Map shows pins for all jobs with correct status colors; selecting a tech filters pins and draws their route.
6. Keyboard-only drag-and-drop works and announces each move.
7. Technician cannot fetch another tech's job via API or direct Supabase query (RLS + handler check tested).
8. Calendar reschedule updates the job, re-checks capacity, and blocks conflicts.
9. All CRUD screens persist and respect soft-delete rules; inviting a technician sends a magic link and links the `profiles` row.
10. Lighthouse mobile ≥ 90 for `/tech` (PWA installable).

**Prompt 3**
```
PHASE 3 — Dispatch Kanban + Map, admin CRUD, technician job view. Phases 1–2 are complete. Read /docs/BUILD_PLAN.md §2, §8, §11–§13, §19, §22 and /docs/UI_SPEC.md §1–§2, §4, §5, §7, §8 and /docs/PHASES.md Phase 3 first.

Scope (build exactly this, in this order, committing after each numbered item):
1. Admin shell (sidebar, top bar, alerts bell), role-guarded layouts, dashboard with live KPIs and the "unassigned within 2h" banner (UI_SPEC §4.1).
2. lib/domain/job-state.ts and lib/domain/dispatch-score.ts with unit tests for every legal/illegal transition and the scoring formula in BUILD_PLAN §13. Mapbox Matrix with haversine fallback in lib/server/mapbox.ts.
3. Owner API routes: /api/dispatch/board, /assign, /suggest; /api/jobs (list/detail/patch/cancel/reschedule — cancel may stub the refund until Phase 4 but must record intent); CRUD routes for technicians (+hours, time-off, invite), services, service-areas, business-hours, closures. Every handler: zod validation, session + role + business check, DB-code→error mapping.
4. Dispatch page: Kanban (dnd-kit) with the technician rail drop targets, eligibility feedback from /suggest, force-assign dialog, optimistic updates with rollback, keyboard drag with aria-live announcements, Realtime subscription hook with 15s polling fallback and a Live indicator. Job cards and Job Drawer exactly per UI_SPEC §4.2 and §4.5.
5. Map view (react-map-gl + Mapbox): status-colored pins, tech color rings, clustering, popover with Assign dropdown, tech filter with route line, hover-linking with the list. Calendar view with FullCalendar free plugins only (timeGrid) and drag-to-reschedule with confirm.
6. CRUD screens for Technicians, Services, Service Areas, Settings per UI_SPEC §4.7, plus the Jobs list.
7. Technician PWA per UI_SPEC §5.1–§5.3 and §5.5: My Jobs Today (live), job detail, bottom action bar (Start Route → Arrived → Complete), Google Maps deep link, before/after photo capture with required-photo rules, completion step that only marks the job completed (no invoice/payment yet). Add manifest.webmanifest and icons. SMS on Start Route goes through the SmsProvider interface using the console driver (implement the interface + console driver now; Twilio driver in Phase 4).
Out of scope: Stripe, invoices, real SMS, reports (leave a "Coming soon" page), white-label polish.
Tests: unit tests as above; Playwright e2e for owner drag-assign + technician status flow using two browser contexts; RLS test proving a technician cannot read another technician's job.
Finish with the acceptance checklist (pass/fail + evidence) and how to run the two-browser demo.
```

---

## Phase 4 — Stripe + SMS + Invoices + Reports

**Goal:** Money and messages work end to end: real deposit at booking, invoice generation, remaining-balance collection with tip (three ways), card on file, Twilio SMS for all templates, and reports.

**Prerequisites (human):** Stripe test keys + Stripe CLI (`stripe listen --forward-to localhost:3000/api/stripe/webhook`); Twilio credentials (or keep `SMS_DRIVER=console`).

**Deliverables**
- Real Stripe deposit: PaymentIntent in `/api/jobs/checkout`, Payment Element in wizard Step 6, webhook `/api/stripe/webhook` (signature, `stripe_events` idempotency, `payment_intent.succeeded` → `convert_hold_to_job` + photo move + save card on file + SMS `booked`), `SLOT_LOST` auto-refund path. Remove the dev simulation route.
- `lib/domain/pricing.ts` full invoice engine + `tip.ts` (BUILD_PLAN §14) with the worked example test and rounding edge cases; invoice generation inside `/api/jobs/[id]/complete`; owner invoice edit/send routes; invoice drawer tab.
- Tech completion flow (UI_SPEC §5.4): parts & extras, totals panel, TipSelector, collect payment via card-on-file / on-device Payment Element / text pay link / cash-check / bill later; `/api/jobs/[id]/finish`.
- Public `/pay/[token]` page with tip + Payment Element; `charge.refunded`, `payment_failed`, `charge.dispute.created` handling; refunds route; cancel route performs refund per D12.
- Twilio driver + all templates (BUILD_PLAN §16), `sms_log`, inbound STOP/START webhook, status callback, signature verification, Alerts panel for failed SMS/payments.
- Reports page and `report_revenue` (BUILD_PLAN §18) with charts and CSV export.

**Acceptance checks**
1. Stripe test card `4242 4242 4242 4242` books a job; `4000 0025 0000 3155` (3DS) works; `4000 0000 0000 9995` (decline) shows an inline error and creates no job.
2. Webhook replay (resend the same event twice, and out of order) creates exactly one job and one payment row.
3. Hold expires during checkout then payment succeeds with no capacity → job not created, deposit refunded, `slot_lost` SMS logged, dashboard shows an alert.
4. Worked example: $99 job + $120 taxable parts @ 7% + 20% tip → amount due **$251.40** after the $19.80 deposit.
5. Tech can collect via: card on file (off-session), new card on phone, text link, and cash; invoice shows paid and totals reconcile with `payments`.
6. Authentication-required off-session charge falls back to the pay link.
7. Cancelling ≥ 24 h before start refunds the deposit; < 24 h retains it unless the owner overrides.
8. All SMS templates render with correct variables, respect opt-out, and appear in History; with `SMS_DRIVER=console` nothing is sent externally.
9. Reports by tech/service/day match a hand-computed fixture; commission = pct × labor only.
10. No card data or full PII appears in logs.

**Prompt 4**
```
PHASE 4 — Stripe + SMS + Invoices + Reports. Phases 1–3 are complete. Read /docs/BUILD_PLAN.md §10, §14–§18, §20–§22 and /docs/UI_SPEC.md §3.4, §4.5, §4.8, §5.4 and /docs/PHASES.md Phase 4 first.

Scope and order:
1. lib/domain/pricing.ts (full invoice computation) and lib/domain/tip.ts with unit tests, including this worked example: flat $99.00 service, 20% deposit = $19.80, parts $120.00 taxable, tax 7.00% on parts only, tip 20% of pre-tax subtotal → subtotal 21,900¢, tax 840¢, total 22,740¢, tip 4,380¢, amount due 25,140¢. Add tests for hourly rounding to 15 minutes, minimum billable time, deposit > total (refund owed), and zero-tax.
2. Real deposit flow: PaymentIntent creation in /api/jobs/checkout per BUILD_PLAN §10/§15 (Stripe Customer, setup_future_usage=off_session, idempotency key = holdId), Payment Element in wizard Step 6, /api/stripe/webhook (nodejs runtime, raw-body signature check, stripe_events idempotency; handle payment_intent.succeeded, payment_failed, charge.refunded, charge.dispute.created). On success: convert_hold_to_job, move photos, save card on file, send "booked" SMS. Implement SLOT_LOST handling: auto-refund + "slot_lost" SMS + dashboard alert. Delete /api/dev/simulate-payment.
3. Invoices: generate a draft invoice inside /api/jobs/[id]/complete using pricing.ts (invoice number INV-YYYY-00001 style), invoice editing/sending routes, Invoice tab in the Job Drawer, public /pay/[token] page with TipSelector and Payment Element (/api/invoices/public/[token], /api/stripe/pay-link-intent).
4. Technician completion + collect flow per UI_SPEC §5.4: parts, live totals, tip, and the five payment options (card on file, on-device card, text pay link, cash/check via /api/payments/record, bill later), then /api/jobs/[id]/finish which sends the "completed" SMS (with pay link only if balance > 0, plus review URL). Off-session charge with authentication_required must return {fallback:"link"}.
5. Refunds and cancellation: /api/stripe/refund and the cancel route applying decision D12 with the owner override option; write payments rows for every money movement.
6. SMS: implement the Twilio driver behind the existing SmsProvider interface, all templates in BUILD_PLAN §16, opt-out enforcement, sms_log, /api/sms/inbound (STOP/START) and /api/sms/status with X-Twilio-Signature validation, and an Admin Alerts panel for failed SMS, failed/disputed payments and SLOT_LOST events. Keep SMS_DRIVER=console as default in .env.example.
7. Reports: report_revenue SQL function, /api/reports/revenue, and the Reports page per UI_SPEC §4.8 (recharts, CSV export). Commission = commission_pct × labor only; tips shown separately.
8. Tests: webhook idempotency/replay/out-of-order, SLOT_LOST path, off-session fallback, refund policy, report fixture, RLS regression. Playwright e2e: book with test card → owner assigns → tech completes → customer pays via link.
Never log card data or full phone/email. Out of scope: white-label packaging, deployment, Stripe Terminal, reminders.
Finish with the acceptance checklist (pass/fail + evidence) and the Stripe CLI commands used.
```

---

## Phase 5 — White-label + demo (Cool Air HVAC Miami) + Vercel deploy

**Goal:** A repeatable 30-minute client onboarding, a polished sales demo, and a live Vercel deployment.

**Prerequisites (human):** Vercel account; domain (optional); Supabase project for the demo; Stripe **test** keys; Twilio optional.

**Deliverables**
- White-label hardening: every brand-able string/asset/color flows from `business.config.ts`; contrast validation in `business.schema.ts`; build fails on invalid config; a second sample config (`config/examples/ace-plumbing-austin.ts`) proving the swap works (different colors, services, ZIPs, timezone `America/Chicago`) without code changes.
- `docs/ONBOARDING.md` implementing BUILD_PLAN §24 as a copy-paste runbook, plus Stripe go-live, Twilio 10DLC/toll-free registration steps, DNS, and a "known limits" section (BUILD_PLAN §9, §23).
- Demo dataset: `pnpm seed:demo` creates the **Cool Air HVAC Miami** business with 4 technicians, ~40 customers, ~60 jobs across the past 30 days and next 7 days in all statuses, paid invoices, tips, before/after placeholder photos, and a few unassigned jobs starting soon (to show the dashboard banner). `pnpm seed:demo:reset` wipes and recreates. Demo uses Stripe test mode and `SMS_DRIVER=console`, with a visible "Demo mode" ribbon controlled by config.
- `/demo` helper page (config-gated): one-click owner login and tech login (separate demo accounts), and a 6-step guided script for the sales call.
- `/api/health` (DB + env sanity, no secrets), `vercel.json` (cron for housekeeping, security headers/CSP), `robots`/`sitemap`, OG image, favicon/PWA icons from config.
- Production readiness: error boundary pages, Sentry hook (optional), RLS test suite in CI (GitHub Actions: typecheck, lint, unit, DB tests), `pnpm verify-env` in `prebuild`.
- Vercel deploy: project settings, env vars, Stripe webhook endpoint, Supabase Auth redirect URLs, Mapbox token URL restriction, region near client, cron schedule.
- Handover pack template: `docs/HANDOVER.md` (what the client owns, accounts to transfer, costs they pay, support terms) and a 1-page `docs/CLIENT_QUICKSTART.md` for owner and techs.

**Acceptance checks**
1. A clean clone + new Supabase project + new Vercel project + `ace-plumbing-austin` config deploys and passes the e2e smoke suite with **zero code edits** (timer: ≤ 30 min excluding third-party approvals).
2. Demo site deployed on Vercel; full e2e (booking with Stripe test card → assign → tech completes → pay link) passes against the deployed URL.
3. Lighthouse (mobile): `/` and `/book` ≥ 90 performance, ≥ 95 accessibility; `/tech` installable PWA.
4. `pnpm verify-env` fails loudly with missing/invalid vars; an invalid color pair fails the build with a readable message.
5. CSP and security headers present; no secrets in the client bundle (automated grep of `.next/static` for service key, Stripe secret, Twilio token).
6. CI green; RLS suite passes in CI.
7. Demo reset restores a known-good state in < 2 min.

**Prompt 5**
```
PHASE 5 — White-label + demo + deploy. Phases 1–4 are complete. Read /docs/BUILD_PLAN.md §5, §6, §9, §20, §23, §24 and /docs/UI_SPEC.md §9, §10 and /docs/PHASES.md Phase 5 first.

Scope:
1. White-label audit: grep the codebase for hardcoded brand names, colors, ZIPs, hours, services, timezone, phone numbers, tax, deposit and replace with config reads. Add contrast validation (4.5:1 for text pairs) and full zod validation to config/business.schema.ts, failing the build with readable errors. Create config/examples/ace-plumbing-austin.ts (America/Chicago, plumbing skill tag, different brand colors, Austin ZIPs, different services/prices) and prove it works by pointing the app at it with no other code changes; add an e2e smoke test parameterized over both configs.
2. Write docs/ONBOARDING.md as a copy-paste runbook from BUILD_PLAN §24, extended with Stripe go-live, Twilio registration (10DLC / toll-free), Supabase Auth redirect URLs, DNS/domain, Mapbox URL restriction, and known limits. Write docs/HANDOVER.md and docs/CLIENT_QUICKSTART.md (owner and technician, one page each, screenshots placeholders).
3. Build scripts: pnpm seed:demo and pnpm seed:demo:reset creating the Cool Air HVAC Miami demo: 4 technicians (from Phase 2), ~40 fictional customers with Miami addresses inside the configured ZIPs and (305) 555-01xx phones, ~60 jobs spread across the previous 30 days and next 7 days covering every status, paid invoices with parts/tax/tips, placeholder before/after photos, and 3 unassigned jobs starting within 2 hours. Show a "Demo mode" ribbon when config.demo is true.
4. /demo page (only when config.demo): one-click owner and technician demo logins and a 6-step guided sales script (book → see it land on dispatch → drag-assign → tech completes on a phone → customer pays → reports).
5. Production hardening: /api/health, vercel.json (cron /api/cron/housekeeping daily, security headers + CSP allowing Stripe, Mapbox, Supabase, Turnstile), robots/sitemap, OG image, error boundary pages, optional Sentry, GitHub Actions CI (typecheck, lint, unit, DB/RLS tests), pnpm verify-env in prebuild, and an automated check that no secret values appear in .next/static.
6. Deployment: prepare everything for Vercel and give me a numbered deployment checklist with the exact env vars to set, the Stripe webhook URL to add, the Supabase redirect URLs, the Mapbox token restriction, and the cron config. If you have Vercel CLI access, deploy; otherwise stop at a ready-to-deploy state and list the commands.
7. Run the full e2e suite against the deployed (or preview) URL and report results, plus Lighthouse mobile scores for /, /book and /tech.
Out of scope: new features, multi-tenant, add-ons listed in BUILD_PLAN §1.
Finish with the acceptance checklist (pass/fail + evidence), the deployed URL(s) or the ready-to-deploy commands, and a list of anything that still needs a human (account approvals, DNS, 10DLC).
```

---

## Cross-phase definition of done

- Typecheck, lint, unit, DB/RLS, and e2e tests green.
- No TODOs in shipped code paths; deferred items live in `docs/DEFERRED.md`.
- Every new env var added to `.env.example` and `verify-env.ts`.
- Every decision not covered by the docs recorded in `docs/DECISIONS.md`.
- Git tag at the end of each phase.
