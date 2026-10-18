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
