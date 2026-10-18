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
