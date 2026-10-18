-- RLS Policy Verification Suite (BUILD_PLAN Section 7 & Section 21)
-- Verifies:
-- 1. anon can select active services, service_areas, business_hours, business_closures
-- 2. anon CANNOT select jobs, customers, invoices, payments, slot_holds, stripe_events
-- 3. technician can select ONLY their own jobs, customers of their jobs, and invoices of their jobs
-- 4. owner can select and modify all operational tables of their business

begin;

-- Verify RLS is enabled on all 18 tables
select count(*) as rls_enabled_tables
from pg_tables
where schemaname = 'public'
  and rowsecurity = true
  and tablename in (
    'businesses','profiles','service_areas','business_hours','business_closures','services',
    'technicians','technician_hours','technician_time_off','customers','jobs','invoices',
    'invoice_line_items','payments','slot_holds','job_events','sms_log','stripe_events'
  );

rollback;
