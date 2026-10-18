-- Demo seed for Cool Air HVAC Miami (PHASES.md Phase 2)
-- 4 demo technicians:
-- 1. Carlos Mendez (skills: hvac; covers 33125–33135; Mon–Fri 7–16)
-- 2. Danny Reyes (skills: hvac; covers 33136–33146, 33149; Mon–Fri 9–18)
-- 3. Maria Alvarez (skills: hvac; all areas '{}'; Tue–Sat 8–17)
-- 4. Tony Brooks (skills: hvac; covers 33125–33146; Mon–Fri 10–19; time-off next Wednesday)

do $$
declare
  v_biz_id uuid;
  v_carlos_id uuid;
  v_danny_id uuid;
  v_maria_id uuid;
  v_tony_id uuid;
  v_next_wed date;
  v_dow int;
begin
  select id into v_biz_id from businesses where slug = 'cool-air-hvac-miami' limit 1;
  if v_biz_id is null then
    insert into businesses (
      name, slug, phone, email, timezone, currency,
      tax_rate_bps, tax_applies_to, deposit_pct, tip_presets,
      slot_interval_minutes, buffer_minutes, min_notice_hours,
      max_advance_days, cancellation_window_hours, hold_minutes, review_url
    ) values (
      'Cool Air HVAC Miami', 'cool-air-hvac-miami', '(305) 555-0100', 'service@coolairmiami.com',
      'America/New_York', 'usd', 700, 'parts', 20, '{15,20,25}',
      60, 30, 2, 30, 24, 10, 'https://g.page/r/cool-air-hvac-miami/review'
    ) returning id into v_biz_id;
  end if;

  -- Carlos Mendez: covers 33125–33135, Mon–Fri 07:00–16:00
  insert into technicians (business_id, name, phone, email, skills, zip_codes, commission_pct, color, active)
  values (
    v_biz_id,
    'Carlos Mendez',
    '(305) 555-0101',
    'carlos@coolairmiami.com',
    array['hvac'],
    array['33125','33126','33127','33128','33129','33130','33131','33132','33133','33134','33135'],
    20.00,
    '#3B82F6',
    true
  ) returning id into v_carlos_id;

  for v_dow in 1..5 loop
    insert into technician_hours (business_id, technician_id, day_of_week, start_time, end_time)
    values (v_biz_id, v_carlos_id, v_dow, '07:00', '16:00')
    on conflict (technician_id, day_of_week) do update set start_time = excluded.start_time, end_time = excluded.end_time;
  end loop;

  -- Danny Reyes: covers 33136–33146, 33149, Mon–Fri 09:00–18:00
  insert into technicians (business_id, name, phone, email, skills, zip_codes, commission_pct, color, active)
  values (
    v_biz_id,
    'Danny Reyes',
    '(305) 555-0102',
    'danny@coolairmiami.com',
    array['hvac'],
    array['33136','33137','33138','33139','33140','33141','33142','33143','33144','33145','33146','33149'],
    20.00,
    '#14B8A6',
    true
  ) returning id into v_danny_id;

  for v_dow in 1..5 loop
    insert into technician_hours (business_id, technician_id, day_of_week, start_time, end_time)
    values (v_biz_id, v_danny_id, v_dow, '09:00', '18:00')
    on conflict (technician_id, day_of_week) do update set start_time = excluded.start_time, end_time = excluded.end_time;
  end loop;

  -- Maria Alvarez: covers all areas ('{}'), Tue–Sat 08:00–17:00
  insert into technicians (business_id, name, phone, email, skills, zip_codes, commission_pct, color, active)
  values (
    v_biz_id,
    'Maria Alvarez',
    '(305) 555-0103',
    'maria@coolairmiami.com',
    array['hvac'],
    array[]::text[],
    22.00,
    '#A855F7',
    true
  ) returning id into v_maria_id;

  for v_dow in 2..6 loop
    insert into technician_hours (business_id, technician_id, day_of_week, start_time, end_time)
    values (v_biz_id, v_maria_id, v_dow, '08:00', '17:00')
    on conflict (technician_id, day_of_week) do update set start_time = excluded.start_time, end_time = excluded.end_time;
  end loop;

  -- Tony Brooks: covers 33125–33146, Mon–Fri 10:00–19:00
  insert into technicians (business_id, name, phone, email, skills, zip_codes, commission_pct, color, active)
  values (
    v_biz_id,
    'Tony Brooks',
    '(305) 555-0104',
    'tony@coolairmiami.com',
    array['hvac'],
    array['33125','33126','33127','33128','33129','33130','33131','33132','33133','33134','33135','33136','33137','33138','33139','33140','33141','33142','33143','33144','33145','33146'],
    18.00,
    '#EC4899',
    true
  ) returning id into v_tony_id;

  for v_dow in 1..5 loop
    insert into technician_hours (business_id, technician_id, day_of_week, start_time, end_time)
    values (v_biz_id, v_tony_id, v_dow, '10:00', '19:00')
    on conflict (technician_id, day_of_week) do update set start_time = excluded.start_time, end_time = excluded.end_time;
  end loop;

  -- One time-off entry for Tony next Wednesday (all day in America/New_York)
  v_next_wed := current_date + ((3 - extract(dow from current_date)::int + 7) % 7);
  if v_next_wed <= current_date then
    v_next_wed := v_next_wed + 7;
  end if;

  insert into technician_time_off (business_id, technician_id, starts_at, ends_at, reason)
  values (
    v_biz_id,
    v_tony_id,
    ((v_next_wed + time '00:00') at time zone 'America/New_York'),
    ((v_next_wed + time '23:59') at time zone 'America/New_York'),
    'Personal day off'
  );
end $$;
