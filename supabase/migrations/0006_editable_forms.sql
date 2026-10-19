-- Forms edited in the admin console. Idempotent: safe to run more than once.
--
-- 1. Questions added in the admin console are saved in `answers` on every form.
-- 2. Built-in questions other than name, email and consent can be made optional
--    or hidden, so their columns accept empty values.
-- 3. Programmes can be added, so `program` accepts any short code.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'student_registrations',
    'college_applications',
    'ambassador_applications',
    'contact_enquiries',
    'event_registrations',
    'program_applications'
  ] loop
    execute format(
      'alter table public.%I add column if not exists answers jsonb not null default ''{}''::jsonb',
      table_name
    );
  end loop;
end
$$;

alter table public.student_registrations
  alter column institution drop not null,
  alter column city drop not null,
  alter column preferred_channel drop not null;

alter table public.college_applications
  alter column city drop not null,
  alter column state drop not null,
  alter column rep_designation drop not null,
  alter column support_needed drop not null;

alter table public.ambassador_applications
  alter column college drop not null,
  alter column course_year drop not null,
  alter column motivation drop not null,
  alter column availability drop not null;

alter table public.contact_enquiries
  alter column topic drop not null,
  alter column message drop not null;

alter table public.event_registrations
  alter column institution drop not null;

alter table public.program_applications
  alter column phone drop not null,
  alter column city drop not null,
  alter column applicant_type drop not null,
  alter column industry drop not null,
  alter column stage drop not null,
  alter column why_join drop not null,
  alter column biggest_challenge drop not null,
  alter column expected_outcome drop not null,
  alter column heard_from drop not null;

alter table public.program_applications
  drop constraint if exists program_applications_program_check;
alter table public.program_applications
  drop constraint if exists program_applications_program_code;
alter table public.program_applications
  add constraint program_applications_program_code check (program ~ '^[a-z0-9-]{1,40}$');

-- Acknowledgements are now configurable; the public may still only insert, and
-- only with consent given.
drop policy if exists "Public can submit" on public.program_applications;
create policy "Public can submit"
  on public.program_applications for insert to anon, authenticated
  with check (consent = true and status = 'new');
