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
