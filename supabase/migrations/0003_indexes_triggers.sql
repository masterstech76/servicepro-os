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
