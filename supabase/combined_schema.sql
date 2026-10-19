create extension if not exists pgcrypto;

create type job_status     as enum ('unassigned','assigned','on_the_way','in_progress','completed','cancelled');
create type user_role      as enum ('owner','technician');
create type pricing_type   as enum ('flat','hourly');
create type invoice_status as enum ('draft','sent','paid','void');
create type payment_kind   as enum ('deposit','remaining','tip','refund');
create type payment_status as enum ('pending','succeeded','failed');
create type line_item_kind as enum ('labor','parts','fee','discount');
create type sms_template   as enum ('booked','on_the_way','completed','rescheduled','cancelled','payment_link','slot_lost');
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
-- Migration 0004: Database functions (BUILD_PLAN Section 8 & Section 9)
-- All functions are security definer, set search_path = public, executable only by service_role.

create or replace function public.slot_capacity(
  p_business uuid,
  p_service uuid,
  p_zip text,
  p_start timestamptz
) returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_biz record;
  v_svc record;
  v_local_date date;
  v_dow smallint;
  v_bh record;
  v_day_open timestamptz;
  v_day_close timestamptz;
  v_end timestamptz;
  v_occ_end timestamptz;
  v_tech_count integer := 0;
  v_busy_jobs integer := 0;
  v_busy_holds integer := 0;
begin
  -- 1. Zip check
  if not exists (
    select 1 from service_areas
    where business_id = p_business and zip = p_zip and active = true
  ) then
    return 0;
  end if;

  -- 2. Load business and service rules
  select * into v_biz from businesses where id = p_business;
  if not found then return 0; end if;

  select * into v_svc from services where id = p_service and business_id = p_business and active = true;
  if not found then return 0; end if;

  v_local_date := (p_start at time zone v_biz.timezone)::date;
  v_dow := extract(dow from (p_start at time zone v_biz.timezone))::smallint;

  -- Check advance days and closures
  if v_local_date > ((now() at time zone v_biz.timezone)::date + v_biz.max_advance_days) then
    return 0;
  end if;

  if exists (
    select 1 from business_closures
    where business_id = p_business and closed_on = v_local_date
  ) then
    return 0;
  end if;

  select * into v_bh from business_hours
  where business_id = p_business and day_of_week = v_dow;
  if not found or v_bh.is_closed or v_bh.open_time is null or v_bh.close_time is null then
    return 0;
  end if;

  v_day_open := ((v_local_date + v_bh.open_time) at time zone v_biz.timezone);
  v_day_close := ((v_local_date + v_bh.close_time) at time zone v_biz.timezone);
  v_end := p_start + make_interval(mins => v_svc.duration_minutes);
  v_occ_end := v_end + make_interval(mins => v_biz.buffer_minutes);

  -- Must fit within business open..close and respect min_notice_hours
  if p_start < v_day_open or v_end > v_day_close then
    return 0;
  end if;

  if p_start < (now() + make_interval(hours => v_biz.min_notice_hours)) then
    return 0;
  end if;

  -- 7. techCount(start): eligible techs whose window [max(open, tech.start), min(close, tech.end)]
  -- contains [p_start, v_end] and has no overlapping technician_time_off
  select count(*) into v_tech_count
  from technicians t
  join technician_hours th
    on th.technician_id = t.id and th.day_of_week = v_dow
  where t.business_id = p_business
    and t.active = true
    and v_svc.skill_tag = any(t.skills)
    and (cardinality(t.zip_codes) = 0 or p_zip = any(t.zip_codes))
    and p_start >= greatest(v_day_open, ((v_local_date + th.start_time) at time zone v_biz.timezone))
    and v_end <= least(v_day_close, ((v_local_date + th.end_time) at time zone v_biz.timezone))
    and not exists (
      select 1 from technician_time_off tto
      where tto.technician_id = t.id
        and tto.starts_at < v_end
        and tto.ends_at > p_start
    );

  if v_tech_count <= 0 then
    return 0;
  end if;

  -- 8a. busy jobs over [p_start, v_occ_end)
  select count(*) into v_busy_jobs
  from jobs j
  join services s on s.id = j.service_id
  where j.business_id = p_business
    and j.status not in ('cancelled', 'completed')
    and j.scheduled_start < v_occ_end
    and (j.scheduled_end + make_interval(mins => v_biz.buffer_minutes)) > p_start
    and (
      (
        j.technician_id is not null and exists (
          select 1 from technicians t
          where t.id = j.technician_id
            and t.active = true
            and v_svc.skill_tag = any(t.skills)
            and (cardinality(t.zip_codes) = 0 or p_zip = any(t.zip_codes))
        )
      )
      or (j.technician_id is null and s.skill_tag = v_svc.skill_tag)
    );

  -- 8b. busy unexpired unconverted holds over [p_start, v_occ_end)
  select count(*) into v_busy_holds
  from slot_holds h
  join services s on s.id = h.service_id
  where h.business_id = p_business
    and h.converted_job_id is null
    and h.expires_at > now()
    and s.skill_tag = v_svc.skill_tag
    and h.starts_at < v_occ_end
    and (h.ends_at + make_interval(mins => v_biz.buffer_minutes)) > p_start;

  return greatest(0, v_tech_count - (v_busy_jobs + v_busy_holds));
end;
$$;

create or replace function public.get_available_slots(
  p_business uuid,
  p_service uuid,
  p_zip text,
  p_from date,
  p_to date
) returns table(
  slot_start timestamptz,
  slot_end timestamptz,
  remaining integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_biz record;
  v_svc record;
  v_cur_date date;
  v_max_to date;
  v_dow smallint;
  v_bh record;
  v_cand timestamptz;
  v_day_close timestamptz;
  v_rem integer;
begin
  if not exists (
    select 1 from service_areas
    where business_id = p_business and zip = p_zip and active = true
  ) then
    return;
  end if;

  select * into v_biz from businesses where id = p_business;
  if not found then return; end if;

  select * into v_svc from services where id = p_service and business_id = p_business and active = true;
  if not found then return; end if;

  -- Cap range at 14 days per BUILD_PLAN Section 8
  v_max_to := least(p_to, p_from + 13);
  v_cur_date := p_from;

  while v_cur_date <= v_max_to loop
    v_dow := extract(dow from v_cur_date)::smallint;

    select * into v_bh from business_hours
    where business_id = p_business and day_of_week = v_dow;

    if found and not v_bh.is_closed and v_bh.open_time is not null and v_bh.close_time is not null then
      if not exists (
        select 1 from business_closures
        where business_id = p_business and closed_on = v_cur_date
      ) then
        v_cand := ((v_cur_date + v_bh.open_time) at time zone v_biz.timezone);
        v_day_close := ((v_cur_date + v_bh.close_time) at time zone v_biz.timezone);

        while (v_cand + make_interval(mins => v_svc.duration_minutes)) <= v_day_close loop
          v_rem := public.slot_capacity(p_business, p_service, p_zip, v_cand);
          if v_rem >= 1 then
            slot_start := v_cand;
            slot_end := v_cand + make_interval(mins => v_svc.duration_minutes);
            remaining := v_rem;
            return next;
          end if;
          v_cand := v_cand + make_interval(mins => v_biz.slot_interval_minutes);
        end loop;
      end if;
    end if;

    v_cur_date := v_cur_date + 1;
  end loop;
end;
$$;

create or replace function public.hold_slot(
  p_business uuid,
  p_service uuid,
  p_zip text,
  p_start timestamptz,
  p_ip_hash text,
  p_payload jsonb default '{}'::jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_biz record;
  v_svc record;
  v_local_date text;
  v_active_holds integer;
  v_cap integer;
  v_hold_id uuid;
begin
  select * into v_biz from businesses where id = p_business;
  if not found then
    raise exception using errcode = 'P0001', message = 'BUSINESS_NOT_FOUND';
  end if;

  if not exists (
    select 1 from service_areas
    where business_id = p_business and zip = p_zip and active = true
  ) then
    raise exception using errcode = 'P0001', message = 'ZIP_NOT_SERVED';
  end if;

  select * into v_svc from services where id = p_service and business_id = p_business and active = true;
  if not found then
    raise exception using errcode = 'P0001', message = 'SERVICE_NOT_FOUND';
  end if;

  v_local_date := to_char(p_start at time zone v_biz.timezone, 'YYYY-MM-DD');

  -- Advisory transaction lock on (business_id || local_date)
  perform pg_advisory_xact_lock(hashtext(p_business::text || v_local_date));

  -- Delete expired holds
  delete from slot_holds
  where business_id = p_business
    and converted_job_id is null
    and expires_at <= now();

  -- Check IP active hold rate limit (< 3)
  if p_ip_hash is not null and length(p_ip_hash) > 0 then
    select count(*) into v_active_holds
    from slot_holds
    where business_id = p_business
      and ip_hash = p_ip_hash
      and converted_job_id is null
      and expires_at > now();

    if v_active_holds >= 3 then
      raise exception using errcode = 'P0001', message = 'TOO_MANY_HOLDS';
    end if;
  end if;

  -- Check capacity using shared slot_capacity
  v_cap := public.slot_capacity(p_business, p_service, p_zip, p_start);
  if v_cap < 1 then
    raise exception using errcode = 'P0001', message = 'SLOT_TAKEN';
  end if;

  insert into slot_holds (
    business_id,
    service_id,
    zip,
    starts_at,
    ends_at,
    expires_at,
    ip_hash,
    payload
  ) values (
    p_business,
    p_service,
    p_zip,
    p_start,
    p_start + make_interval(mins => v_svc.duration_minutes),
    now() + make_interval(mins => v_biz.hold_minutes),
    p_ip_hash,
    coalesce(p_payload, '{}'::jsonb)
  )
  returning id into v_hold_id;

  return v_hold_id;
end;
$$;

create or replace function public.convert_hold_to_job(
  p_hold uuid,
  p_payment_intent text,
  p_deposit_cents integer
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_job_id uuid;
  v_hold record;
  v_biz record;
  v_local_date text;
  v_cap integer;
  v_customer_id uuid;
  v_job_id uuid;
  v_cust jsonb;
  v_addr jsonb;
  v_photos text[];
begin
  -- Idempotency check on p_payment_intent
  if p_payment_intent is not null then
    select id into v_existing_job_id
    from jobs
    where deposit_payment_intent_id = p_payment_intent;
    if found then
      return v_existing_job_id;
    end if;
  end if;

  select * into v_hold from slot_holds where id = p_hold;
  if not found then
    raise exception using errcode = 'P0001', message = 'HOLD_NOT_FOUND';
  end if;

  if v_hold.converted_job_id is not null then
    return v_hold.converted_job_id;
  end if;

  select * into v_biz from businesses where id = v_hold.business_id;
  v_local_date := to_char(v_hold.starts_at at time zone v_biz.timezone, 'YYYY-MM-DD');

  -- Advisory lock on same key as hold_slot
  perform pg_advisory_xact_lock(hashtext(v_hold.business_id::text || v_local_date));

  -- If hold expired, re-check slot_capacity
  if v_hold.expires_at <= now() then
    v_cap := public.slot_capacity(v_hold.business_id, v_hold.service_id, v_hold.zip, v_hold.starts_at);
    if v_cap < 1 then
      raise exception using errcode = 'P0001', message = 'SLOT_LOST';
    end if;
  end if;

  v_cust := coalesce(v_hold.payload -> 'customer', '{}'::jsonb);
  v_addr := coalesce(v_hold.payload -> 'address', '{}'::jsonb);

  insert into customers (
    business_id,
    name,
    phone,
    email,
    sms_consent_at
  ) values (
    v_hold.business_id,
    coalesce(v_cust ->> 'name', 'Customer'),
    coalesce(v_cust ->> 'phone', '+13055550100'),
    lower(coalesce(v_cust ->> 'email', 'customer@example.com')),
    now()
  )
  on conflict (business_id, lower(email))
  do update set
    name = excluded.name,
    phone = excluded.phone,
    sms_consent_at = coalesce(customers.sms_consent_at, excluded.sms_consent_at)
  returning id into v_customer_id;

  select coalesce(array_agg(elem), '{}')
  into v_photos
  from jsonb_array_elements_text(coalesce(v_hold.payload -> 'photoPaths', '[]'::jsonb)) as elem;

  insert into jobs (
    business_id,
    customer_id,
    service_id,
    status,
    scheduled_start,
    scheduled_end,
    address_line1,
    address_line2,
    city,
    state,
    zip,
    lat,
    lng,
    issue_text,
    issue_photos,
    estimated_total_cents,
    deposit_cents,
    deposit_payment_intent_id,
    deposit_paid_at
  ) values (
    v_hold.business_id,
    v_customer_id,
    v_hold.service_id,
    'unassigned',
    v_hold.starts_at,
    v_hold.ends_at,
    coalesce(v_addr ->> 'line1', '123 Brickell Ave'),
    v_addr ->> 'line2',
    coalesce(v_addr ->> 'city', 'Miami'),
    coalesce(v_addr ->> 'state', 'FL'),
    v_hold.zip,
    (v_addr ->> 'lat')::double precision,
    (v_addr ->> 'lng')::double precision,
    v_hold.payload ->> 'issue',
    v_photos,
    coalesce((v_hold.payload ->> 'estimatedTotalCents')::integer, p_deposit_cents * 5),
    p_deposit_cents,
    p_payment_intent,
    now()
  )
  returning id into v_job_id;

  update slot_holds
  set converted_job_id = v_job_id,
      stripe_payment_intent_id = coalesce(stripe_payment_intent_id, p_payment_intent)
  where id = p_hold;

  insert into job_events (
    business_id,
    job_id,
    actor_label,
    event_type,
    to_status,
    meta
  ) values (
    v_hold.business_id,
    v_job_id,
    'customer',
    'created',
    'unassigned',
    jsonb_build_object('hold_id', p_hold, 'deposit_cents', p_deposit_cents)
  );

  insert into payments (
    business_id,
    job_id,
    kind,
    method,
    status,
    amount_cents,
    stripe_payment_intent_id
  ) values (
    v_hold.business_id,
    v_job_id,
    'deposit',
    'card',
    'succeeded',
    p_deposit_cents,
    p_payment_intent
  )
  on conflict do nothing;

  return v_job_id;
end;
$$;

create or replace function public.assign_job(
  p_job uuid,
  p_tech uuid,
  p_actor uuid,
  p_force boolean default false
) returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
  v_svc record;
  v_biz record;
  v_tech record;
  v_from_status job_status;
begin
  select * into v_job from jobs where id = p_job for update;
  if not found then
    raise exception using errcode = 'P0001', message = 'JOB_NOT_FOUND';
  end if;

  if v_job.status not in ('unassigned', 'assigned') then
    raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION';
  end if;

  v_from_status := v_job.status;

  if p_tech is null then
    update jobs
    set technician_id = null,
        status = 'unassigned'
    where id = p_job
    returning * into v_job;

    insert into job_events (business_id, job_id, actor_id, actor_label, event_type, from_status, to_status)
    values (v_job.business_id, v_job.id, p_actor, 'owner', 'unassigned', v_from_status, 'unassigned');

    return v_job;
  end if;

  select * into v_tech from technicians where id = p_tech and business_id = v_job.business_id and active = true;
  if not found then
    raise exception using errcode = 'P0001', message = 'TECH_NOT_ELIGIBLE';
  end if;

  select * into v_svc from services where id = v_job.service_id;
  select * into v_biz from businesses where id = v_job.business_id;

  if not (v_svc.skill_tag = any(v_tech.skills)) then
    raise exception using errcode = 'P0001', message = 'SKILL_MISMATCH';
  end if;

  if cardinality(v_tech.zip_codes) > 0 and not (v_job.zip = any(v_tech.zip_codes)) then
    raise exception using errcode = 'P0001', message = 'OUTSIDE_COVERAGE';
  end if;

  if not p_force then
    if exists (
      select 1 from jobs j2
      where j2.technician_id = p_tech
        and j2.id <> p_job
        and j2.status not in ('cancelled', 'completed')
        and j2.scheduled_start < (v_job.scheduled_end + make_interval(mins => v_biz.buffer_minutes))
        and (j2.scheduled_end + make_interval(mins => v_biz.buffer_minutes)) > v_job.scheduled_start
    ) then
      raise exception using errcode = 'P0001', message = 'TECH_CONFLICT';
    end if;
  end if;

  update jobs
  set technician_id = p_tech,
      status = 'assigned'
  where id = p_job
  returning * into v_job;

  insert into job_events (business_id, job_id, actor_id, actor_label, event_type, from_status, to_status, meta)
  values (
    v_job.business_id,
    v_job.id,
    p_actor,
    'owner',
    'assigned',
    v_from_status,
    'assigned',
    jsonb_build_object('technician_id', p_tech, 'forced', p_force)
  );

  return v_job;
end;
$$;

create or replace function public.transition_job(
  p_job uuid,
  p_to job_status,
  p_actor uuid,
  p_actor_role text,
  p_meta jsonb default '{}'::jsonb
) returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
  v_from job_status;
  v_valid boolean := false;
begin
  select * into v_job from jobs where id = p_job for update;
  if not found then
    raise exception using errcode = 'P0001', message = 'JOB_NOT_FOUND';
  end if;

  v_from := v_job.status;

  if v_from = 'assigned' and p_to = 'on_the_way' then v_valid := true;
  elsif v_from = 'on_the_way' and p_to = 'in_progress' then v_valid := true;
  elsif v_from = 'in_progress' and p_to = 'completed' then v_valid := true;
  elsif v_from in ('unassigned', 'assigned', 'on_the_way', 'in_progress') and p_to = 'cancelled' then v_valid := true;
  end if;

  if not v_valid then
    raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION';
  end if;

  update jobs
  set status = p_to,
      on_the_way_at = case when p_to = 'on_the_way' then now() else on_the_way_at end,
      started_at    = case when p_to = 'in_progress' then now() else started_at end,
      completed_at  = case when p_to = 'completed' then now() else completed_at end,
      cancelled_at  = case when p_to = 'cancelled' then now() else cancelled_at end,
      cancel_reason = case when p_to = 'cancelled' then coalesce(p_meta ->> 'reason', cancel_reason) else cancel_reason end
  where id = p_job
  returning * into v_job;

  insert into job_events (business_id, job_id, actor_id, actor_label, event_type, from_status, to_status, meta)
  values (v_job.business_id, v_job.id, p_actor, p_actor_role, 'status', v_from, p_to, coalesce(p_meta, '{}'::jsonb));

  return v_job;
end;
$$;

create or replace function public.reschedule_job(
  p_job uuid,
  p_new_start timestamptz,
  p_actor uuid
) returns jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job jobs;
  v_svc record;
  v_biz record;
  v_new_end timestamptz;
begin
  select * into v_job from jobs where id = p_job for update;
  if not found then
    raise exception using errcode = 'P0001', message = 'JOB_NOT_FOUND';
  end if;

  if v_job.status not in ('unassigned', 'assigned') then
    raise exception using errcode = 'P0001', message = 'INVALID_TRANSITION';
  end if;

  select * into v_svc from services where id = v_job.service_id;
  select * into v_biz from businesses where id = v_job.business_id;
  v_new_end := p_new_start + make_interval(mins => v_svc.duration_minutes);

  if v_job.technician_id is not null then
    if exists (
      select 1 from jobs j2
      where j2.technician_id = v_job.technician_id
        and j2.id <> p_job
        and j2.status not in ('cancelled', 'completed')
        and j2.scheduled_start < (v_new_end + make_interval(mins => v_biz.buffer_minutes))
        and (j2.scheduled_end + make_interval(mins => v_biz.buffer_minutes)) > p_new_start
    ) then
      raise exception using errcode = 'P0001', message = 'TECH_CONFLICT';
    end if;
  end if;

  update jobs
  set scheduled_start = p_new_start,
      scheduled_end = v_new_end
  where id = p_job
  returning * into v_job;

  insert into job_events (business_id, job_id, actor_id, actor_label, event_type, meta)
  values (
    v_job.business_id,
    v_job.id,
    p_actor,
    'owner',
    'rescheduled',
    jsonb_build_object('new_start', p_new_start, 'new_end', v_new_end)
  );

  return v_job;
end;
$$;

create or replace function public.report_revenue(
  p_business uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_group text
) returns table(
  group_key text,
  group_label text,
  jobs_count bigint,
  revenue_cents bigint,
  labor_cents bigint,
  tax_cents bigint,
  tips_cents bigint,
  commission_cents bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select
    coalesce(j.technician_id::text, 'unassigned') as group_key,
    coalesce(t.name, 'Unassigned') as group_label,
    count(j.id)::bigint as jobs_count,
    coalesce(sum(i.subtotal_cents), 0)::bigint as revenue_cents,
    coalesce(sum(i.labor_cents), 0)::bigint as labor_cents,
    coalesce(sum(i.tax_cents), 0)::bigint as tax_cents,
    coalesce(sum(i.tip_cents), 0)::bigint as tips_cents,
    coalesce(sum(round((i.labor_cents * coalesce(t.commission_pct, 0)) / 100.0)), 0)::bigint as commission_cents
  from jobs j
  left join invoices i on i.job_id = j.id
  left join technicians t on t.id = j.technician_id
  where j.business_id = p_business
    and j.status = 'completed'
    and j.completed_at >= p_from
    and j.completed_at <= p_to
  group by j.technician_id, t.name;
end;
$$;

create or replace function public.purge_expired_holds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from slot_holds
  where converted_job_id is null
    and expires_at < (now() - interval '1 hour');
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

-- Revoke execute from anon/authenticated; grant only to service_role (BUILD_PLAN Section 8)
revoke execute on function public.slot_capacity(uuid, uuid, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.get_available_slots(uuid, uuid, text, date, date) from public, anon, authenticated;
revoke execute on function public.hold_slot(uuid, uuid, text, timestamptz, text, jsonb) from public, anon, authenticated;
revoke execute on function public.convert_hold_to_job(uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.assign_job(uuid, uuid, uuid, boolean) from public, anon, authenticated;
revoke execute on function public.transition_job(uuid, job_status, uuid, text, jsonb) from public, anon, authenticated;
revoke execute on function public.reschedule_job(uuid, timestamptz, uuid) from public, anon, authenticated;
revoke execute on function public.report_revenue(uuid, timestamptz, timestamptz, text) from public, anon, authenticated;
revoke execute on function public.purge_expired_holds() from public, anon, authenticated;

grant execute on function public.slot_capacity(uuid, uuid, text, timestamptz) to service_role;
grant execute on function public.get_available_slots(uuid, uuid, text, date, date) to service_role;
grant execute on function public.hold_slot(uuid, uuid, text, timestamptz, text, jsonb) to service_role;
grant execute on function public.convert_hold_to_job(uuid, text, integer) to service_role;
grant execute on function public.assign_job(uuid, uuid, uuid, boolean) to service_role;
grant execute on function public.transition_job(uuid, job_status, uuid, text, jsonb) to service_role;
grant execute on function public.reschedule_job(uuid, timestamptz, uuid) to service_role;
grant execute on function public.report_revenue(uuid, timestamptz, timestamptz, text) to service_role;
grant execute on function public.purge_expired_holds() to service_role;
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
alter publication supabase_realtime add table public.jobs;
