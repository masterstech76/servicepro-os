# ServicePro OS — BUILD_PLAN.md

Home services dispatch system (HVAC / plumbing / electrical / cleaning), sold as a one-time license ($2,500–$4,000) to shops with 2–15 techs.

**How to use this file:** Treat it as the source of truth. If something is ambiguous, follow Section 0 (Decisions). If still ambiguous, choose the simplest option, and record the choice in `/docs/DECISIONS.md`. Do not ask questions; do not add features not listed here.

---

## 0. Decisions already made (override here, not in code)

| # | Decision | Why |
|---|---|---|
| D1 | **One deployment per client.** Each client gets their own Vercel project, Supabase project, Stripe account, Twilio number, Mapbox token. Not multi-tenant SaaS. The schema still carries `business_id` on every table so RLS is uniform and a future multi-tenant move is cheap. | Own-it-once sale; client owns their data and keys; no cross-client leakage risk. |
| D2 | All money is **integer cents**, USD only. | No float errors. |
| D3 | A **job row is created only after the deposit is paid**. A `slot_holds` row (10 min) bridges slot selection → payment. There is no `pending_payment` job status. | Keeps the status enum exactly as specified and the Kanban free of junk cards. |
| D4 | Slot capacity is **count-based**: `capacity = eligible techs working that window − overlapping jobs/holds`. It is an approximation (no per-tech bin packing). | Simple, explainable, matches "tech count × hours". |
| D5 | **Reads via RLS, writes via API routes.** Owner has full RLS CRUD. Technicians and the public never write tables directly; every tech/public mutation goes through a route handler using the service-role key after server-side authz. | Column-level restrictions are fragile in RLS. |
| D6 | **Secrets never live in `business.config.ts`.** The config holds branding/business rules and *names* of env vars; secret values live in env. | A committed file with `sk_live_...` is a breach. |
| D7 | FullCalendar: **free packages only** (`daygrid`, `timegrid`, `interaction`). `resource-timeline` / `resource-timegrid` need a paid license and are banned. | Licensing on a resold product. |
| D8 | SMS goes through a `SmsProvider` interface with `twilio` and `console` drivers (`SMS_DRIVER` env). | Demos work without carrier registration. |
| D9 | Photos are stored in a **private** Supabase bucket and served via short-lived signed URLs. | Photos of customers' homes are sensitive. |
| D10 | Timestamps stored in UTC (`timestamptz`); all slot/date math is done in `businesses.timezone` with `date-fns-tz`. | DST correctness. |
| D11 | Sales tax = configurable basis points, applied to **parts only** by default (`tax_applies_to`). The client's accountant must confirm for their state. | Rules vary by state. |
| D12 | Cancellation: full deposit refund if cancelled ≥ `cancellation_window_hours` (default 24) before start, otherwise deposit is retained (owner may override and refund). | Standard industry policy. |
| D13 | Single working window per tech per day (no split shifts) in v1. | Scope. |

## 1. Scope

**In v1:** everything in the feature list from the brief (service areas, services, photo upload, slot engine, dispatch Kanban + map, tech CRUD, invoices, Stripe deposit/remaining/card-on-file, Twilio SMS, reports, white-label config).

**Explicitly out of v1 (list these as paid add-ons in sales):** multi-tenant SaaS, native apps, recurring maintenance agreements, inventory, QuickBooks sync, payroll export, live GPS tracking, multi-option estimates, Stripe Terminal / Tap to Pay, customer self-serve cancel/reschedule, 24h reminder SMS, AI features.

## 2. Architecture

```
                ┌────────────────────── Vercel (Next.js 14, Node runtime) ─────────────────────┐
 Customer ─────▶│ (public)  /book  /pay/[token]                                                │
 Owner ────────▶│ (admin)   /admin/*          Route handlers  /api/*  (zod-validated)          │
 Technician ───▶│ (tech)    /tech/*  (PWA)    lib/* domain logic (pricing, slots, dispatch)    │
                └───────┬──────────────┬─────────────┬───────────────┬──────────────┬─────────┘
                        │              │             │               │              │
                 Supabase Postgres   Supabase     Supabase        Stripe          Twilio
                 + RLS + RPC         Auth         Storage +       (PaymentIntents, (SMS +
                 (slot engine)                    Realtime         Checkout,       status/inbound
                                                  (jobs table)     webhooks)       webhooks)
                                         Mapbox (GL JS map, geocoding, matrix)
```

**Layering rules**
1. `app/**` = UI + thin route handlers (parse → authorize → call `lib/` → respond).
2. `lib/domain/*` = pure business logic (pricing, state machine, scoring). No I/O. Unit-tested.
3. `lib/server/*` = I/O adapters (Supabase admin client, Stripe, Twilio, Mapbox). Marked `import "server-only"`.
4. Slot availability and booking-atomicity live in **Postgres functions** (single source of truth; Supabase JS cannot hold a transaction across calls).
5. Browser code only ever uses the anon Supabase client (RLS-protected) and public env vars.

**Realtime:** Supabase Realtime `postgres_changes` on `jobs` (RLS-filtered). Admin board and tech "My Jobs" subscribe; on event, patch React Query cache. Fall back to 15s polling if the channel drops.

## 3. Package list

Next.js 14.2.x (App Router), React 18, TypeScript (`strict`), Tailwind 3.4, shadcn/ui, `@supabase/supabase-js` 2 + `@supabase/ssr`, `stripe`, `@stripe/stripe-js` + `@stripe/react-stripe-js`, `twilio`, `mapbox-gl` + `react-map-gl`, `@fullcalendar/react` + `daygrid` + `timegrid` + `interaction`, `@dnd-kit/core` + `sortable` + `utilities`, `zod`, `react-hook-form` + `@hookform/resolvers`, `@tanstack/react-query`, `date-fns` + `date-fns-tz`, `libphonenumber-js`, `browser-image-compression`, `sonner`, `lucide-react`, `recharts` (reports), `vitest`, `@playwright/test`. Optional: `@sentry/nextjs`, Cloudflare Turnstile.

## 4. Folder structure

Route-group folders in parentheses do not appear in URLs, so each group contains an explicit URL segment where needed.

```
/
├─ config/
│  ├─ business.config.ts          # white-label source of truth (Section 5)
│  └─ business.schema.ts          # zod schema validating the config at build/boot
├─ docs/                          # BUILD_PLAN.md, UI_SPEC.md, PHASES.md, DECISIONS.md, ONBOARDING.md
├─ supabase/
│  ├─ migrations/                 # 0001…0007 from Section 7
│  ├─ seed/                       # demo seed (Cool Air HVAC Miami) + test fixtures
│  └─ tests/                      # SQL/RLS tests (pgTAP or scripted)
├─ scripts/
│  ├─ sync-config.ts              # config → DB (idempotent upsert)
│  ├─ create-owner.ts             # creates first owner auth user + profile
│  └─ verify-env.ts               # fails fast on missing env vars
├─ public/                        # logo placeholder, PWA icons, manifest.webmanifest
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # Inter font, CSS vars from config
│  │  ├─ (public)/
│  │  │  ├─ page.tsx              # marketing landing (hero, services, "Book now")
│  │  │  ├─ book/page.tsx         # 7-step booking wizard
│  │  │  ├─ book/confirmation/page.tsx
│  │  │  └─ pay/[token]/page.tsx  # remaining-balance + tip payment page (+ /thanks)
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (admin)/admin/
│  │  │  ├─ layout.tsx            # sidebar shell, role guard (owner)
│  │  │  ├─ page.tsx              # dashboard (today KPIs)
│  │  │  ├─ dispatch/page.tsx     # Kanban + Map toggle + Calendar toggle
│  │  │  ├─ jobs/page.tsx         # searchable table, job drawer
│  │  │  ├─ technicians/page.tsx  # CRUD (+ [id] hours, time off)
│  │  │  ├─ services/page.tsx
│  │  │  ├─ service-areas/page.tsx
│  │  │  ├─ customers/page.tsx
│  │  │  ├─ reports/page.tsx
│  │  │  └─ settings/page.tsx     # business hours, closures, deposit, tax, SMS templates (read-only preview)
│  │  ├─ (tech)/tech/
│  │  │  ├─ layout.tsx            # mobile shell, bottom nav, role guard (technician)
│  │  │  ├─ page.tsx              # My Jobs Today
│  │  │  └─ jobs/[id]/page.tsx    # job detail + action bar + complete/collect flow
│  │  └─ api/ …                   # Section 11
│  ├─ components/
│  │  ├─ ui/                      # shadcn
│  │  ├─ booking/                 # step components, SlotPicker, PhotoUploader, DepositSummary
│  │  ├─ dispatch/                # KanbanBoard, JobCard, TechColumn, MapView, CalendarView, JobDrawer
│  │  ├─ tech/                    # JobListItem, ActionBar, PhotoCapture, CollectPayment, TipSelector
│  │  └─ shared/                  # StatusBadge, Money, PhoneLink, EmptyState, ErrorState
│  ├─ lib/
│  │  ├─ domain/                  # pricing.ts, job-state.ts, dispatch-score.ts, tip.ts, format.ts  (pure)
│  │  ├─ server/                  # supabase-admin.ts, stripe.ts, sms/{index,twilio,console}.ts, mapbox.ts, auth.ts
│  │  ├─ supabase/                # browser.ts, server.ts, middleware.ts, types.ts (generated)
│  │  ├─ validation/              # zod schemas shared by client + routes
│  │  └─ hooks/                   # useRealtimeJobs, useSlots, useGeolocation…
│  └─ middleware.ts               # session refresh + role-based redirects
├─ tests/                         # unit (vitest) + e2e (playwright)
├─ .env.example
└─ vercel.json                    # cron + headers
```

## 5. `/config/business.config.ts` — field spec

Validated by `business.schema.ts` (zod). App refuses to boot with an invalid config.

| Field | Type | Notes |
|---|---|---|
| `businessName` | string | Shown in header, SMS, invoices |
| `legalName`, `licenseNumber` | string? | Printed on invoices (contractor license is legally required in many states) |
| `phone`, `email`, `address` | strings | |
| `logo` | `{ light: string; dark?: string; favicon: string }` | Paths in `/public` |
| `colors` | `{ primary, accent, … }` | Defaults `#0F172A` / `#F97316`; injected as CSS variables, Tailwind reads the variables |
| `currency` | `"USD"` | Literal |
| `timezone` | IANA string | e.g. `America/New_York` |
| `zipCodes` | `string[]` | Seed for `service_areas` |
| `hours` | per-weekday `{open, close} \| null` | Seed for `business_hours` |
| `services` | array | `{ name, category, skillTag, pricing: flat\|hourly, price, durationMinutes, minBillableMinutes?, description }` |
| `booking` | object | `depositPct (20)`, `tipPresets ([15,20,25])`, `slotIntervalMinutes (60)`, `bufferMinutes (30)`, `minNoticeHours (2)`, `maxAdvanceDays (30)`, `holdMinutes (10)`, `maxPhotos (5)` |
| `tax` | `{ rateBps, appliesTo: "parts"\|"parts_and_labor" }` | |
| `policy` | `{ cancellationWindowHours (24), requireBeforePhoto, requireAfterPhoto (both true), techCanEditHours (true) }` | |
| `dispatch` | `{ autoAssign (false), weights {...} }` | Section 13 |
| `sms` | `{ driver, fromEnv: "TWILIO_FROM_NUMBER", reviewUrl }` | Names env vars, never values |
| `stripe` | `{ publishableKeyEnv, secretKeyEnv, webhookSecretEnv }` | Env var *names* only (D6) |
| `mapbox` | `{ publicTokenEnv, defaultCenter: [lng,lat], defaultZoom }` | |
| `seo` | `{ title, description }` | |

`scripts/sync-config.ts` upserts the `businesses` row, `business_hours`, `service_areas`, `services` from this file (matching on natural keys: slug, zip, service name). It never deletes rows that exist in the DB but not in config; it prints a diff and requires `--prune` to delete.

## 6. Environment variables (`.env.example`)

| Var | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Admin client in route handlers |
| `NEXT_PUBLIC_APP_URL` | public | Absolute links in SMS/Stripe redirects |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | mixed | Stripe |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` (or `TWILIO_MESSAGING_SERVICE_SID`) | server | SMS |
| `SMS_DRIVER` | server | `twilio` \| `console` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | public (URL-restricted) | Map GL |
| `MAPBOX_SERVER_TOKEN` | server | Geocoding + Matrix |
| `TURNSTILE_ENABLED`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | mixed | Bot protection on hold creation |
| `CRON_SECRET` | server | Authorizes `/api/cron/*` |
| `OWNER_EMAIL` | server | Used by `create-owner.ts` |
| `SENTRY_DSN` | optional | Errors |

`scripts/verify-env.ts` runs in `prebuild` and fails with a readable list of missing vars.

## 7. Database — SQL (apply as ordered migrations)

### 0001_extensions_enums.sql
```sql
create extension if not exists pgcrypto;

create type job_status     as enum ('unassigned','assigned','on_the_way','in_progress','completed','cancelled');
create type user_role      as enum ('owner','technician');
create type pricing_type   as enum ('flat','hourly');
create type invoice_status as enum ('draft','sent','paid','void');
create type payment_kind   as enum ('deposit','remaining','tip','refund');
create type payment_status as enum ('pending','succeeded','failed');
create type line_item_kind as enum ('labor','parts','fee','discount');
create type sms_template   as enum ('booked','on_the_way','completed','rescheduled','cancelled','payment_link','slot_lost');
```

### 0002_tables.sql
```sql
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  phone text, email text,
  timezone text not null default 'America/New_York',
  currency text not null default 'usd' check (currency = 'usd'),
  tax_rate_bps integer not null default 0 check (tax_rate_bps between 0 and 2500),
  tax_applies_to text not null default 'parts' check (tax_applies_to in ('parts','parts_and_labor')),
  deposit_pct integer not null default 20 check (deposit_pct between 10 and 100),
  tip_presets integer[] not null default '{15,20,25}',
  slot_interval_minutes integer not null default 60 check (slot_interval_minutes in (30,60,120)),
  buffer_minutes integer not null default 30 check (buffer_minutes between 0 and 240),
  min_notice_hours integer not null default 2 check (min_notice_hours >= 0),
  max_advance_days integer not null default 30 check (max_advance_days between 1 and 90),
  cancellation_window_hours integer not null default 24,
  hold_minutes integer not null default 10 check (hold_minutes between 5 and 30),
  review_url text,
  created_at timestamptz not null default now()
);

create table profiles (               -- 1:1 with auth.users; drives RLS
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  role user_role not null,
  technician_id uuid,                 -- FK added below
  full_name text,
  created_at timestamptz not null default now()
);

create table service_areas (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  zip text not null check (zip ~ '^[0-9]{5}$'),
  city text, state text,
  surcharge_cents integer not null default 0 check (surcharge_cents >= 0),
  active boolean not null default true,
  unique (business_id, zip)
);

create table business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),   -- 0 = Sunday
  open_time time, close_time time,
  is_closed boolean not null default false,
  check (is_closed or (open_time is not null and close_time is not null and close_time > open_time)),
  unique (business_id, day_of_week)
);

create table business_closures (      -- holidays / one-off closed dates
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  closed_on date not null, reason text,
  unique (business_id, closed_on)
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null, description text, category text,
  skill_tag text not null,            -- matches technicians.skills entries, e.g. 'hvac'
  pricing_type pricing_type not null default 'flat',
  price_cents integer not null check (price_cents >= 0),   -- flat price OR hourly rate
  duration_minutes integer not null check (duration_minutes between 15 and 480),
  min_billable_minutes integer not null default 60,        -- used for hourly
  deposit_pct_override integer check (deposit_pct_override between 10 and 100),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);

create table technicians (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null, phone text not null, email text,
  skills text[] not null default '{}',
  zip_codes text[] not null default '{}',       -- empty array = covers every active service area
  commission_pct numeric(5,2) not null default 0 check (commission_pct between 0 and 100),
  color text not null default '#3B82F6',
  home_lat double precision, home_lng double precision,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table profiles add constraint profiles_technician_fk
  foreign key (technician_id) references technicians(id) on delete set null;

create table technician_hours (       -- one window per weekday (D13)
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  technician_id uuid not null references technicians(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null, end_time time not null,
  check (end_time > start_time),
  unique (technician_id, day_of_week)
);

create table technician_time_off (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  technician_id uuid not null references technicians(id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null,
  reason text,
  check (ends_at > starts_at)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  phone text not null,                           -- E.164
  email text not null,
  stripe_customer_id text unique,
  stripe_payment_method_id text,                 -- card on file (default)
  card_brand text, card_last4 text,
  sms_opt_out boolean not null default false,
  sms_consent_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index customers_business_email_uq on customers (business_id, lower(email));

create table jobs (
  id uuid primary key default gen_random_uuid(),
  job_number bigint generated always as identity,
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id),
  service_id uuid not null references services(id),
  technician_id uuid references technicians(id) on delete set null,
  status job_status not null default 'unassigned',
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  address_line1 text not null, address_line2 text,
  city text not null, state text not null, zip text not null,
  lat double precision, lng double precision,
  issue_text text,
  issue_photos text[] not null default '{}',     -- storage object paths
  before_photos text[] not null default '{}',
  after_photos  text[] not null default '{}',
  estimated_total_cents integer not null,        -- quoted at booking
  deposit_cents integer not null default 0,
  deposit_payment_intent_id text unique,
  deposit_paid_at timestamptz,
  total_cents integer,                           -- final, set when invoice is generated
  tip_cents integer not null default 0,
  billable_minutes integer,                      -- hourly jobs
  notes_internal text,
  tech_notes text,
  cancel_reason text, cancelled_at timestamptz,
  on_the_way_at timestamptz, started_at timestamptz, completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_end > scheduled_start),
  check (status <> 'unassigned' or technician_id is null),
  check (status in ('unassigned','cancelled') or technician_id is not null),
  check (cardinality(issue_photos) <= 10)
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid not null unique references jobs(id) on delete cascade,
  invoice_number text not null unique,           -- e.g. INV-2026-00042
  public_token uuid not null unique default gen_random_uuid(),   -- /pay/[token]
  status invoice_status not null default 'draft',
  labor_cents integer not null default 0,
  parts_cents integer not null default 0,
  fees_cents integer not null default 0,
  discount_cents integer not null default 0,
  subtotal_cents integer not null default 0,     -- labor+parts+fees-discount (pre-tax)
  tax_rate_bps integer not null default 0,       -- snapshot
  tax_cents integer not null default 0,
  total_cents integer not null default 0,        -- subtotal + tax (tip excluded)
  deposit_paid_cents integer not null default 0,
  tip_cents integer not null default 0,
  amount_due_cents integer not null default 0,   -- total + tip - deposit - other payments
  stripe_checkout_session_id text,
  sent_at timestamptz, paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  kind line_item_kind not null,
  description text not null,
  quantity numeric(10,2) not null default 1 check (quantity > 0),
  unit_price_cents integer not null,
  taxable boolean not null default false,
  amount_cents integer not null,                 -- round(quantity * unit_price_cents); negative for discount
  sort_order integer not null default 0
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  invoice_id uuid references invoices(id) on delete set null,
  kind payment_kind not null,
  method text not null default 'card' check (method in ('card','cash','check','other')),
  status payment_status not null default 'pending',
  amount_cents integer not null,                 -- always positive; kind='refund' means money out
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_refund_id text,
  recorded_by uuid references auth.users(id),    -- for cash/check
  created_at timestamptz not null default now()
);
create unique index payments_pi_kind_uq on payments (stripe_payment_intent_id, kind) where stripe_payment_intent_id is not null;

create table slot_holds (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  service_id uuid not null references services(id),
  zip text not null,
  starts_at timestamptz not null, ends_at timestamptz not null,
  expires_at timestamptz not null,
  ip_hash text,
  payload jsonb,                                 -- booking draft: customer, address, issue, photo paths
  stripe_payment_intent_id text unique,
  converted_job_id uuid references jobs(id),
  created_at timestamptz not null default now()
);

create table job_events (                        -- audit trail
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  actor_id uuid,                                 -- auth user, null = system/customer
  actor_label text,                              -- 'owner' | 'tech' | 'system' | 'customer'
  event_type text not null,                      -- 'created','assigned','status','rescheduled','payment','photo','sms'…
  from_status job_status, to_status job_status,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table sms_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  template sms_template not null,
  to_phone text not null, body text not null,
  provider text not null,                        -- 'twilio' | 'console'
  provider_sid text, status text, error text,
  created_at timestamptz not null default now()
);

create table stripe_events (                     -- webhook idempotency
  id text primary key,                           -- evt_…
  type text not null,
  processed_at timestamptz not null default now()
);
```

### 0003_indexes_triggers.sql
```sql
create index jobs_biz_start_idx   on jobs (business_id, scheduled_start);
create index jobs_tech_start_idx  on jobs (technician_id, scheduled_start) where technician_id is not null;
create index jobs_biz_status_idx  on jobs (business_id, status);
create index jobs_customer_idx    on jobs (customer_id);
create index holds_active_idx     on slot_holds (business_id, starts_at) where converted_job_id is null;
create index holds_expiry_idx     on slot_holds (expires_at);
create index events_job_idx       on job_events (job_id, created_at);
create index payments_job_idx     on payments (job_id);
create index tech_time_off_idx    on technician_time_off (technician_id, starts_at, ends_at);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger jobs_updated_at     before update on jobs     for each row execute function set_updated_at();
create trigger invoices_updated_at before update on invoices for each row execute function set_updated_at();

alter table jobs replica identity full;   -- Realtime payloads include old row (status transitions)
```

### 0005_rls.sql (functions first, then policies)
```sql
create or replace function public.auth_business_id() returns uuid
language sql stable security definer set search_path = public as
$$ select business_id from profiles where id = auth.uid() $$;

create or replace function public.auth_role() returns user_role
language sql stable security definer set search_path = public as
$$ select role from profiles where id = auth.uid() $$;

create or replace function public.auth_technician_id() returns uuid
language sql stable security definer set search_path = public as
$$ select technician_id from profiles where id = auth.uid() $$;

-- enable RLS everywhere
do $$ declare t text; begin
  foreach t in array array['businesses','profiles','service_areas','business_hours','business_closures','services',
    'technicians','technician_hours','technician_time_off','customers','jobs','invoices','invoice_line_items',
    'payments','slot_holds','job_events','sms_log','stripe_events'] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- OWNER: full CRUD on operational tables of their business
do $$ declare t text; begin
  foreach t in array array['service_areas','business_hours','business_closures','services','technicians',
    'technician_hours','technician_time_off','customers','jobs','invoices','invoice_line_items'] loop
    execute format($f$create policy owner_all on %I for all to authenticated
      using (business_id = public.auth_business_id() and public.auth_role() = 'owner')
      with check (business_id = public.auth_business_id() and public.auth_role() = 'owner')$f$, t);
  end loop;
  -- OWNER: read-only on audit/finance logs (writes are server-only)
  foreach t in array array['payments','job_events','sms_log'] loop
    execute format($f$create policy owner_select on %I for select to authenticated
      using (business_id = public.auth_business_id() and public.auth_role() = 'owner')$f$, t);
  end loop;
end $$;

-- businesses / profiles
create policy member_select on businesses for select to authenticated using (id = public.auth_business_id());
create policy owner_update  on businesses for update to authenticated
  using (id = public.auth_business_id() and public.auth_role() = 'owner')
  with check (id = public.auth_business_id());
create policy self_or_owner_select on profiles for select to authenticated
  using (id = auth.uid() or (business_id = public.auth_business_id() and public.auth_role() = 'owner'));

-- PUBLIC (anon + authenticated): non-sensitive catalog data for the booking site
create policy public_read_services on services        for select to anon, authenticated using (active);
create policy public_read_areas    on service_areas   for select to anon, authenticated using (active);
create policy public_read_hours    on business_hours  for select to anon, authenticated using (true);
create policy public_read_closures on business_closures for select to anon, authenticated using (true);

-- TECHNICIAN: read-only, and only what touches their own jobs (all writes go through API routes, D5)
create policy tech_select_self on technicians for select to authenticated
  using (id = public.auth_technician_id());
create policy tech_select_hours on technician_hours for select to authenticated
  using (technician_id = public.auth_technician_id());
create policy tech_select_time_off on technician_time_off for select to authenticated
  using (technician_id = public.auth_technician_id());
create policy tech_select_jobs on jobs for select to authenticated
  using (public.auth_role() = 'technician' and technician_id = public.auth_technician_id());
create policy tech_select_customers on customers for select to authenticated
  using (public.auth_role() = 'technician' and exists (
    select 1 from jobs j where j.customer_id = customers.id and j.technician_id = public.auth_technician_id()));
create policy tech_select_invoices on invoices for select to authenticated
  using (public.auth_role() = 'technician' and exists (
    select 1 from jobs j where j.id = invoices.job_id and j.technician_id = public.auth_technician_id()));
create policy tech_select_line_items on invoice_line_items for select to authenticated
  using (public.auth_role() = 'technician' and exists (
    select 1 from invoices i join jobs j on j.id = i.job_id
    where i.id = invoice_line_items.invoice_id and j.technician_id = public.auth_technician_id()));

-- slot_holds, stripe_events: RLS on, NO policies => service role only.
```

### 0006_storage.sql
```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-photos','job-photos', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Object path convention:
--   {business_id}/drafts/{hold_id}/{uuid}.jpg      customer issue photos before a job exists
--   {business_id}/{job_id}/{issue|before|after}/{uuid}.jpg
-- Uploads happen via signed upload URLs minted by API routes (no INSERT policy needed).
create policy owner_read_photos on storage.objects for select to authenticated
using (bucket_id = 'job-photos'
  and (storage.foldername(name))[1] = public.auth_business_id()::text
  and public.auth_role() = 'owner');

create policy tech_read_own_job_photos on storage.objects for select to authenticated
using (bucket_id = 'job-photos'
  and public.auth_role() = 'technician'
  and (storage.foldername(name))[1] = public.auth_business_id()::text
  and (storage.foldername(name))[2] in (select id::text from public.jobs where technician_id = public.auth_technician_id()));
```

### 0007_realtime.sql
```sql
alter publication supabase_realtime add table public.jobs;
```

(Migration 0004 holds the functions from Section 8.)

## 8. Database functions (migration 0004) — specs

All are `security definer`, `set search_path = public`, executable only by `service_role` (revoke from `anon`, `authenticated`). Route handlers call them via `supabase.rpc()`.

| Function | Signature | Behavior |
|---|---|---|
| `get_available_slots` | `(p_business uuid, p_service uuid, p_zip text, p_from date, p_to date)` → `table(slot_start timestamptz, slot_end timestamptz, remaining int)` | Algorithm in Section 9. Range capped at 14 days. Read-only. |
| `slot_capacity` | `(p_business, p_service, p_zip, p_start timestamptz)` → `int` | Same logic as above for one start time; shared internal helper so both functions agree. |
| `hold_slot` | `(p_business, p_service, p_zip, p_start, p_ip_hash, p_payload jsonb)` → `uuid` (hold id) | In one transaction: `pg_advisory_xact_lock(hashtext(p_business::text \|\| local_date))` → delete expired holds → `slot_capacity() >= 1` else raise `SLOT_TAKEN` → reject if the IP already has ≥ 3 active holds (`TOO_MANY_HOLDS`) → insert hold with `expires_at = now() + hold_minutes`. |
| `convert_hold_to_job` | `(p_hold uuid, p_payment_intent text, p_deposit_cents int)` → `uuid` (job id) | Idempotent on `p_payment_intent`. Locks same advisory key. If hold exists and unexpired → create/upsert customer from payload, create job (`unassigned`), mark hold converted. If hold expired → re-check `slot_capacity`; if ≥ 1 proceed, else raise `SLOT_LOST` (caller refunds, Section 10). Writes `job_events('created')` and a `payments(deposit, succeeded)` row. |
| `assign_job` | `(p_job uuid, p_tech uuid, p_actor uuid, p_force bool)` → `jobs` | Lock job row; validate status ∈ {unassigned, assigned}; validate tech active, skill match, zip covered, and no overlap in `[start, end + buffer)` unless `p_force` (owner override); set status `assigned` (or `unassigned` if `p_tech is null`); write `job_events`. |
| `transition_job` | `(p_job uuid, p_to job_status, p_actor uuid, p_actor_role text, p_meta jsonb)` → `jobs` | Enforces the state machine in Section 12; stamps `on_the_way_at / started_at / completed_at / cancelled_at`; writes `job_events`. Raises `INVALID_TRANSITION`. |
| `reschedule_job` | `(p_job uuid, p_new_start timestamptz, p_actor uuid)` → `jobs` | Allowed for `unassigned/assigned`. Re-checks capacity excluding the job itself; if assigned tech has a conflict, raise `TECH_CONFLICT` (UI offers "unassign & move"). |
| `report_revenue` | `(p_business, p_from timestamptz, p_to timestamptz, p_group text)` → rows | `p_group ∈ {'tech','service','day'}`. Definitions in Section 18. |
| `purge_expired_holds` | `()` → `int` | Deletes holds with `expires_at < now() - interval '1 hour'` and no job. Called by daily cron; correctness never depends on it because expiry is also enforced inline. |

Errors are raised with `RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = '<CODE>'`; route handlers map codes → HTTP status + friendly JSON `{error:{code,message}}`.

## 9. Slot engine algorithm (`get_available_slots`)

**Inputs:** business, service (duration `D`, `skill_tag`), customer zip, date range.

1. **Zip check.** Zip must exist in `service_areas` with `active`. Otherwise return no rows (the API returns `ZIP_NOT_SERVED` separately from `/api/service-area`).
2. **Load rules** from `businesses`: `timezone, slot_interval_minutes (I), buffer_minutes (B), min_notice_hours, max_advance_days`.
3. **For each local date in range** (computed in business tz):
   a. Skip if date is in `business_closures`, or the weekday row is `is_closed`, or the date is beyond `max_advance_days`.
   b. Business window `[open, close]` from `business_hours`.
4. **Eligible techs:** `active = true` AND `service.skill_tag = ANY(skills)` AND (`zip_codes` is empty OR contains the zip).
5. **Per-tech availability window** for the date: intersection of `technician_hours` (that weekday) and the business window, minus any overlapping `technician_time_off` intervals. A tech with no `technician_hours` row for that weekday is unavailable.
6. **Candidate starts:** from `open` stepping by `I` while `start + D <= close`. Drop any start earlier than `now() + min_notice_hours`.
7. **techCount(start)** = number of eligible techs whose availability window fully contains `[start, start + D]`.
8. **busy(start)** over the occupancy interval `[start, start + D + B)`:
   - jobs with status other than `cancelled` or `completed` (completed jobs only matter for past times, which step 6 already excludes), whose occupancy `[scheduled_start, scheduled_end + B)` overlaps, and **either** `technician_id ∈ eligible techs` **or** (`technician_id is null` AND the job's service has the same `skill_tag`);
   - plus unexpired, unconverted `slot_holds` that overlap and whose service has the same `skill_tag`.
9. `remaining = techCount − busy`. Return the slot if `remaining >= 1`.

**UI contract:** the customer UI never shows exact counts; it shows "Only 1–2 left" when `remaining <= 2`. Admin may see the exact count.

**Known limits (documented, accepted):** (a) ignores drive time beyond fixed buffer `B`; (b) a job already assigned to tech X blocks X even if a different arrangement would fit more jobs; (c) a tech with two skills can be double-counted across skill pools. Owner can always force-assign. Document in `ONBOARDING.md`.

## 10. Booking transaction sequence

```
1  Customer picks slot            POST /api/slots/hold   → hold_slot()      → {holdId, expiresAt}
2  Photos upload (optional)       POST /api/uploads/sign → signed PUT URLs → client uploads to drafts/{holdId}/
3  Checkout                       POST /api/jobs/checkout {holdId, customer, address, issue, photoPaths, smsConsent}
                                    ├ validate hold unexpired, zip still served, address geocoded (Mapbox) → lat/lng
                                    ├ compute estimate + deposit (Section 14)
                                    ├ upsert Stripe Customer; create PaymentIntent (deposit, setup_future_usage=off_session,
                                    │   metadata {holdId, businessId}, idempotency key = holdId)
                                    ├ store payload + payment_intent id on hold; extend hold to expires_at + 5 min
                                    └ return {clientSecret, depositCents, totalEstimateCents}
4  Stripe Payment Element confirms in browser (3DS handled by Stripe)
5  Stripe → POST /api/stripe/webhook  payment_intent.succeeded
                                    ├ verify signature; insert into stripe_events (skip if duplicate)
                                    ├ convert_hold_to_job() → job (unassigned)
                                    ├ move photos drafts/{holdId}/* → {jobId}/issue/*; write jobs.issue_photos
                                    ├ save card on file (payment_method → customers)
                                    └ send SMS "booked"
6  Browser → /book/confirmation?pi=…  polls GET /api/jobs/by-intent?pi=… (max 20s, 1s interval) → shows job #, time, address
```

**Failure paths**
- *Payment fails/abandoned:* hold expires; nothing persists besides the hold row (purged later). Draft photos purged by cron after 24 h.
- *Webhook delivered before the browser returns / twice / out of order:* safe — `convert_hold_to_job` is idempotent on the PaymentIntent id; the confirmation page just polls.
- *`SLOT_LOST` at webhook* (hold expired during 3DS and someone else took the slot): auto-refund the PaymentIntent, send SMS `slot_lost` ("we couldn't confirm that time; your deposit was refunded; call/rebook"), create an owner notification row in `job_events`-like alert (dashboard banner "1 failed booking"). Never leave a customer charged without a job.
- *Customer closes the tab after paying:* the webhook still creates the job and sends the SMS.

## 11. API routes

All JSON. All inputs validated with zod. Errors: `{ error: { code, message } }`. "Owner/Tech" auth = Supabase session cookie + role check inside the handler (never trust client role). Rate limits: public mutating routes use Turnstile (if enabled) + the DB hold limit.

### Public
| Route | Method | Contract |
|---|---|---|
| `/api/service-area` | GET `?zip=33101` | `{served: boolean, city?, state?, surchargeCents}` |
| `/api/services` | GET | Active services (id, name, price, pricing type, duration, description) for the wizard |
| `/api/slots` | GET `?serviceId&zip&from&to` | `get_available_slots` → `[{start,end,lowAvailability}]`, ≤ 14 days; `Cache-Control: no-store` |
| `/api/slots/hold` | POST | `{serviceId, zip, start, turnstileToken?}` → `{holdId, expiresAt}`; errors `SLOT_TAKEN`, `TOO_MANY_HOLDS`, `ZIP_NOT_SERVED` |
| `/api/uploads/sign` | POST | `{holdId, files:[{name,type,size}]}` → signed upload URLs; enforces ≤ 5 files, ≤ 10 MB, jpeg/png/webp, hold must be active |
| `/api/jobs/checkout` | POST | Step 3 above |
| `/api/jobs/by-intent` | GET `?pi=` | Minimal job summary for the confirmation page (no PII beyond first name + address city) |
| `/api/invoices/public/[token]` | GET | Invoice summary for `/pay/[token]`: line items, total, deposit credited, amount due, tip presets |
| `/api/stripe/pay-link-intent` | POST | `{token, tipCents}` → PaymentIntent client secret for the remaining balance (used by `/pay/[token]`) |
| `/api/stripe/webhook` | POST | Stripe events (Section 15). `runtime = "nodejs"`; read raw body for signature. |
| `/api/sms/inbound`, `/api/sms/status` | POST | Twilio inbound (STOP/START sync) and delivery-status callbacks; verify `X-Twilio-Signature` |

### Owner (`role = owner`)
| Route | Method | Contract |
|---|---|---|
| `/api/jobs` | GET | Filters: `status, from, to, techId, q`; pagination |
| `/api/jobs/[id]` | GET / PATCH | Detail (customer, photos as signed URLs, invoice, events) / edit address, notes, schedule |
| `/api/jobs/[id]/cancel` | POST | `{reason, refundDeposit: "auto"\|"yes"\|"no"}` → `transition_job` + refund per D12 + SMS `cancelled` |
| `/api/jobs/[id]/reschedule` | POST | `{newStart}` → `reschedule_job` + SMS `rescheduled` |
| `/api/dispatch/board` | GET `?date=` | Jobs grouped by status for the Kanban + tech list with that day's load |
| `/api/dispatch/assign` | POST | `{jobId, technicianId\|null, force?}` → `assign_job`; returns updated job |
| `/api/dispatch/suggest` | GET `?jobId=` | Ranked eligible techs with score breakdown (Section 13) |
| `/api/technicians` (+ `/[id]`, `/[id]/hours`, `/[id]/time-off`, `/[id]/invite`) | CRUD | `invite` creates the auth user via admin API, links `profiles`, emails a magic link |
| `/api/services`, `/api/service-areas`, `/api/business-hours`, `/api/closures` | CRUD (POST/PATCH/DELETE under same path) | Soft-delete services via `active=false` if they have jobs |
| `/api/invoices/[jobId]` | GET / PUT | Fetch / edit draft invoice (line items re-priced by `pricing.ts`) |
| `/api/invoices/[jobId]/send` | POST | Mark `sent`; SMS `payment_link` |
| `/api/stripe/refund` | POST | `{paymentId, amountCents, reason}` |
| `/api/payments/record` | POST | Record cash/check/other against an invoice |
| `/api/reports/revenue` | GET `?from&to&group=tech\|service\|day` | `report_revenue` |

### Technician (`role = technician`, own jobs only — handler asserts `job.technician_id = profile.technician_id`)
| Route | Method | Contract |
|---|---|---|
| `/api/tech/jobs` | GET `?date=` | Today's jobs, ordered by `scheduled_start` |
| `/api/jobs/[id]/status` | POST | `{to: "on_the_way"\|"in_progress"}` → `transition_job`; `on_the_way` computes ETA (Mapbox Matrix from last known/ device position or tech home) and sends SMS |
| `/api/jobs/[id]/photos/sign` | POST | `{kind: "before"\|"after", count}` → signed upload URLs |
| `/api/jobs/[id]/photos/commit` | POST | `{kind, paths[]}` → appends to `before_photos`/`after_photos` after verifying objects exist |
| `/api/jobs/[id]/complete` | POST | `{parts:[{description,qty,unitPriceCents,taxable}], billableMinutes?, techNotes}` → validates photo rules → `transition_job(completed)` → generates invoice (draft) → returns invoice |
| `/api/stripe/charge-card-on-file` | POST | `{jobId, tipCents}` → off-session PaymentIntent for amount due; on `authentication_required` returns `{fallback:"link"}` |
| `/api/stripe/payment-intent` | POST | `{jobId, tipCents}` → client secret so the customer can type a new card on the tech's phone |
| `/api/stripe/remaining-link` | POST | `{jobId}` → ensures invoice `sent`, texts `/pay/[token]` link (SMS `payment_link`) |
| `/api/payments/record` | POST | Same as owner (cash/check), tech-scoped |
| `/api/jobs/[id]/finish` | POST | Called when the tech leaves the payment step (paid or "bill later"); sends SMS `completed` with review link (+ pay link if balance > 0) |

### Cron (`Authorization: Bearer ${CRON_SECRET}`)
| `/api/cron/housekeeping` | GET | Daily: `purge_expired_holds`, delete stale `drafts/` photos (> 24 h), prune old `stripe_events` (> 30 d) |

## 12. Job state machine

```
unassigned ──assign──▶ assigned ──start route──▶ on_the_way ──arrive/start──▶ in_progress ──complete──▶ completed
    ▲  │                  │  ▲                                                                              
    └──┴──unassign────────┘  └──reassign                       (any non-terminal) ──cancel──▶ cancelled
```

| From → To | Actor | Preconditions | Side effects |
|---|---|---|---|
| `unassigned → assigned` | owner | tech eligible, no conflict (or `force`) | event log; (optional) SMS to tech is out of v1 — tech sees it via Realtime |
| `assigned → unassigned` | owner | — | clears `technician_id` |
| `assigned → assigned` (reassign) | owner | same as assign | event log |
| `assigned → on_the_way` | tech (own job) or owner | scheduled date = today (owner may override) | `on_the_way_at`; SMS `on_the_way` with ETA; customer SMS opt-out respected |
| `on_the_way → in_progress` | tech or owner | — | `started_at`; prompts before-photos (required if `requireBeforePhoto`) |
| `in_progress → completed` | tech or owner | ≥ 1 after photo if `requireAfterPhoto`; ≥ 1 before photo if required | `completed_at`; invoice generated (`draft`); `billable_minutes` computed for hourly |
| `unassigned/assigned/on_the_way/in_progress → cancelled` | owner | reason required | refund rule D12; SMS `cancelled`; frees capacity immediately |
| `completed`, `cancelled` | — | terminal in v1 | — |

Drag-and-drop on the Kanban maps onto these rows: dropping onto a **technician lane** = assign/reassign; dropping onto **On The Way / In Progress / Completed** is allowed only for legal transitions and otherwise snaps back with a toast naming the rule.

## 13. Dispatch logic

**Primary mode = manual** (owner drags). The system assists with validation and ranking.

**Eligibility filter** (hard constraints) for assigning job *J* (service skill `k`, zip `z`, window `[s,e]`): tech `active`; `k ∈ skills`; `zip_codes` empty or contains `z`; working window (that weekday, minus time off) contains `[s, e]`; no overlap with another of the tech's non-cancelled jobs in `[s, e + buffer)`.

**Score** for each eligible tech (higher = better), weights in `config.dispatch.weights` with these defaults:

```
score =  100
       − 15 × jobsAlreadyThatDay                (load balance)
       − 0.5 × travelMinutesFromPreviousStop     (route efficiency; previous stop = prior job that day, else tech home, else business address)
       − 0.5 × travelMinutesToNextStop           (if a later job exists that day)
       + 10 × (techAlreadyInZipThatDay ? 1 : 0)  (clustering)
       + 5  × (exactSkillMatch ? 1 : 0)          (skills[0] === service.skill_tag)
       −  tiebreak: lower revenue-so-far-this-week wins
```

Travel minutes: Mapbox Matrix API (driving, batches ≤ 25 coordinates). On error/quota: `haversine_miles × 1.4 ÷ 30 mph × 60`. Results cached in memory for the request only.

**Auto-assign** (off by default): on job creation (webhook), if `config.dispatch.autoAssign` and top score ≥ 40 → `assign_job`; otherwise leave `unassigned`.

**`/api/dispatch/suggest` response:** `[{technicianId, score, breakdown:{load, travelPrev, travelNext, cluster, skill}, conflicts:[…]}]`, ineligible techs listed last with `reason` ("Outside coverage", "Time off", "Overlaps job #1042") so the UI can show *why* a drop is blocked and offer **Force assign** (owner only).

## 14. Pricing & invoice engine (`lib/domain/pricing.ts`, pure + unit-tested)

All inputs/outputs integer cents. One function is the only place totals are computed; routes, UI previews and invoice generation all call it.

**Estimate at booking**
- Flat: `base = price_cents`. Hourly: `base = round(price_cents × max(min_billable_minutes, duration_minutes) / 60)`.
- `estimate = base + surcharge_cents(zip)`.
- `deposit = ceil(estimate × depositPct / 100)`, using `deposit_pct_override` when set; if `deposit < 50` (Stripe minimum) → `deposit = min(50, estimate)`.

**Final invoice**
- Labor: flat → one line at service price; hourly → `rate × billableMinutes / 60` where `billableMinutes = max(min_billable_minutes, ceil((completed_at − started_at)/15 min) × 15)` unless `techCanEditHours` and the tech overrode it.
- Fees (zip surcharge), parts (tech-entered lines), discounts (owner-only, negative).
- `subtotal = labor + parts + fees − discount`.
- `taxable_base = parts (+ labor if tax_applies_to = 'parts_and_labor') + taxable fees`; `tax = round_half_up(taxable_base × rate_bps / 10000)` computed once on the base (not per line).
- `total = subtotal + tax`.
- **Tip:** not taxed; preset tip = `round(subtotal × pct / 100)` (percent of pre-tax subtotal); custom amount allowed.
- `amount_due = total + tip − deposit_paid − other_succeeded_payments`.
- If `deposit_paid > total` → `amount_due` is negative → surface as "refund owed" and require owner action (refund difference).
- Tip belongs 100% to the technician (reports show it separately from commission).

**Worked example (must be a unit test):** AC Repair flat $99.00, deposit 20% = $19.80, parts $120.00 taxable, tax 7.00% on parts, tip 20%.
`subtotal = 9,900 + 12,000 = 21,900` · `tax = 840` · `total = 22,740` · `tip = 4,380` · `amount_due = 22,740 + 4,380 − 1,980 = 25,140`.

**Invoice numbering:** `INV-{YYYY}-{5-digit sequence}` generated server-side inside the invoice-creation transaction.

## 15. Stripe

- Each client uses **their own Stripe account** (keys in env). No Connect, no application fee. Stripe fees are the shop's.
- **Deposit:** PaymentIntent with `automatic_payment_methods`, `setup_future_usage: "off_session"`, `receipt_email`, metadata `{holdId, businessId}`, idempotency key = hold id. Confirmation uses the Payment Element (card, Apple Pay, Google Pay).
- **Card on file:** after `payment_intent.succeeded`, retrieve the PaymentMethod, save `stripe_payment_method_id`, brand, last4 on `customers`.
- **Remaining balance** — three paths, the tech chooses on the Collect screen:
  1. *Charge card on file* (off-session PaymentIntent, `confirm: true`). If Stripe returns `authentication_required`, fall back to path 2.
  2. *Pay link / on-device:* `/pay/[token]` page with Payment Element + tip selector (customer opens SMS link) or the same component embedded on the tech's phone.
  3. *Record cash/check* (`payments.method`).
- **Tip:** included in the final PaymentIntent amount (`amount = amount_due`, with `tip_cents` in metadata); stored on `jobs.tip_cents` and `invoices.tip_cents`.
- **Webhook events handled:** `payment_intent.succeeded` (deposit vs remaining decided by metadata `kind`), `payment_intent.payment_failed`, `charge.refunded` (sync refund rows), `charge.dispute.created` (flag job + dashboard alert). Always verify signature, insert `stripe_events` first, return 200 fast, process idempotently.
- **Refunds:** `/api/stripe/refund` and the cancel route; write `payments(kind='refund')`.
- Test mode in demo; go-live checklist in `ONBOARDING.md` (activate account, add webhook endpoint `/api/stripe/webhook`, copy signing secret).

## 16. Twilio SMS

- `SmsProvider.send({to, template, vars, jobId})` renders the template, enforces opt-out (`customers.sms_opt_out`), writes `sms_log`, returns provider SID. `console` driver logs and records `provider='console'`.
- **Templates** (≤ 2 segments each; variables in braces):
  - `booked`: "{biz}: You're booked! {service} on {date} at {time}. Job #{n}. Questions? Call {phone}. Reply STOP to opt out."
  - `on_the_way`: "{biz}: {techFirst} is on the way to {addressShort}. ETA about {eta} min. Job #{n}."
  - `completed`: "{biz}: Job #{n} is complete. {balanceLine} How did we do? {reviewUrl}" where `balanceLine` = "Thanks for your payment!" or "Balance due ${x}: {payUrl}".
  - `rescheduled`, `cancelled`, `payment_link`, `slot_lost`: short variants of the above.
- Checkout shows a consent notice directly above the Pay button: "By booking you agree to receive booking and service texts from {biz}. Msg & data rates may apply. Reply STOP to opt out." Phone is mandatory, so this is a notice rather than an optional checkbox; store `sms_consent_at` at checkout. Marketing texts are out of scope and would need a separate opt-in.
- Inbound webhook: STOP/UNSUBSCRIBE → `sms_opt_out = true`; START → false. Twilio error 21610 also sets opt-out.
- **US carrier registration (A2P 10DLC) or toll-free verification is required per client before real SMS and can take days to weeks.** Start it first on every client; use `SMS_DRIVER=console` until approved.

## 17. Photos

Customer: ≤ 5 issue photos. Tech: ≤ 10 before, ≤ 10 after. Client-side compression to max 1600 px / ~0.8 quality JPEG (`browser-image-compression`), then direct upload to the signed URL. Server re-checks object existence + size before `commit`. Display via signed URLs (TTL 1 h) generated in the job detail route, never persisted. Delete job photos with the job.

## 18. Reports

`report_revenue(from, to, group)` over **completed jobs** (by `completed_at` in business tz):
- `revenue` = invoice `subtotal_cents` (pre-tax, pre-tip); `tax` and `tips` shown separately; `jobs` = count; `avg_ticket` = revenue / jobs.
- **Per tech:** adds `commission_owed = commission_pct × labor_cents` (commission base = labor only; parts excluded; configurable later) and `tips` (100% to tech).
- **Per service:** revenue, jobs, avg ticket, share %.
- **Per day:** revenue + jobs for the line chart.
- UI: date range presets (Today / 7d / 30d / MTD / custom), tables + recharts bar/line, CSV export (client-side).

## 19. Auth, roles, middleware

- Supabase Auth: owner = email + password; technicians = invited by owner, sign in with email magic link (or password they set).
- `profiles` row defines role and business. `middleware.ts` refreshes the session (`@supabase/ssr`) and redirects: unauthenticated → `/login`; role `owner` → `/admin`; `technician` → `/tech`; wrong-role access → 403 page.
- `scripts/create-owner.ts` creates the first owner. Route handlers re-verify role on every call.
- Tech app is a **PWA** (manifest + icons, "Add to Home Screen" prompt, `display: standalone`). No offline mode in v1; show a clear offline banner and block actions.

## 20. Security & compliance checklist

- Service-role key only in `lib/server/*` (`import "server-only"`); never in client bundles.
- Every route: zod validation, role check, tenant check (`business_id`).
- Public routes: Turnstile (optional flag) + DB hold limit; generic error messages.
- Stripe webhook and Twilio signatures verified; webhook handlers idempotent.
- Security headers via `vercel.json`/`next.config`: CSP (allow Stripe, Mapbox, Supabase, Turnstile), `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (geolocation self, camera self).
- PCI: card data only touches Stripe Elements (SAQ A). Never log card data or full PII; redact phone/email in logs.
- Signed URLs short-lived; storage bucket private.
- RLS tests: for each table, assert anon/tech/owner access matches Section 7 (script in `supabase/tests`).
- Data retention note in `ONBOARDING.md` (client is the data controller).

## 21. Testing strategy

- **Unit (vitest):** `pricing.ts` (worked example + rounding + hourly + deposit minimum), `job-state.ts` (every legal/illegal transition), `dispatch-score.ts`, tip calc, phone/zip validators.
- **DB tests:** slot engine on a fixture (3 techs, mixed skills/zips, time off, holds, a closure, a DST-change date); concurrency test: 20 parallel `hold_slot` calls for a 1-capacity slot → exactly 1 succeeds.
- **RLS tests:** as owner/tech/anon per table.
- **E2E (Playwright):** (1) full booking with Stripe test card `4242…` (+ a 3DS card), (2) owner assigns via drag, (3) tech runs job to completion and collects payment, (4) pay-link flow, (5) mobile viewport 390×844 for booking and tech app.
- **Webhook tests:** replayed/duplicated/out-of-order events.

## 22. Observability

Structured JSON logs with `requestId`; Sentry (optional); an **Admin → Alerts** panel listing: failed SMS (from `sms_log.error`), failed/disputed payments, `SLOT_LOST` refunds, jobs `unassigned` within 2 h of start (also shown as a red banner on the dashboard).

## 23. Risks & assumptions (read before selling)

1. **Not a blue ocean:** Housecall Pro, Jobber, ServiceTitan, Workiz and others are established. Your wedge is *own-it-once + white-label + fast setup*; position on that, not on scarcity.
2. **One-time price ≠ zero running cost.** The client pays Supabase, Vercel, Mapbox, Twilio, and Stripe fees directly (low for 2–15 techs, but not nothing). Offer a paid maintenance/support plan; without it you carry unpaid support forever.
3. **SMS registration lead time** (Section 16) is the most likely thing to delay a client launch.
4. **Tax and licensing** rules differ by state; the plan makes them configurable but you are not giving tax advice.
5. **Count-based slot engine** is intentionally simple (Section 9 limits). If a client has complex territories, quote custom work.
6. **FullCalendar / Mapbox licensing:** core FullCalendar is MIT; Mapbox GL JS requires the client's own token and its usage terms (bill under the client's account).
7. **Live-tracking, offline mode, and reminders** are the most common asks after launch; they are listed as add-ons in Section 1.

## 24. Client onboarding runbook (the "30-minute white-label" — `docs/ONBOARDING.md`)

Time budget excludes third-party account approvals (Stripe activation, Twilio 10DLC) which run in parallel.

1. (2 min) Fork/clone repo; create Vercel project; set region closest to client.
2. (3 min) Create Supabase project; copy URL/anon/service keys into Vercel env.
3. (2 min) Run `supabase db push` (migrations 0001–0007).
4. (8 min) Edit `/config/business.config.ts`: name, logo files in `/public`, colors, timezone, zip codes, hours, services, tax, deposit.
5. (3 min) Create Stripe keys (test first), webhook endpoint, paste into env.
6. (2 min) Create Mapbox tokens (restrict public token to the client's domain), paste into env.
7. (2 min) Twilio number + keys (or `SMS_DRIVER=console` until approved).
8. (2 min) `pnpm verify-env && pnpm sync-config && pnpm create-owner`.
9. (3 min) Deploy; add domain; set Supabase Auth redirect URLs; hit `/api/health`.
10. (3 min) Owner logs in → adds technicians (invite) → places a test booking with a Stripe test card → completes it in the tech app.
