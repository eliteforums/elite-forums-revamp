-- Programme admission applications: Startup Cohort Program, Startup Incubation
-- Program and Coworking Space Membership.
--
-- Questions asked of every applicant are stored as columns. Programme-specific
-- answers are stored in `answers` (jsonb), keyed by the question keys defined in
-- src/lib/program-application.ts, so questions can change without a migration.
-- This migration is idempotent.

create table if not exists public.program_applications (
  id uuid primary key default gen_random_uuid(),
  program text not null check (program in ('cohort', 'incubation', 'coworking')),

  -- Personal and professional details
  full_name text not null,
  email text not null,
  phone text not null,
  whatsapp_available boolean not null default false,
  city text not null,
  profile_url text,

  -- Startup or work profile
  applicant_type text not null,
  startup_name text,
  website_url text,
  industry text not null,
  stage text not null,

  -- Expectations and readiness
  why_join text not null,
  biggest_challenge text not null,
  expected_outcome text not null,
  heard_from text not null,

  -- Programme-specific answers
  answers jsonb not null default '{}'::jsonb,

  -- Acknowledgements
  terms_agreed boolean not null default false,
  contact_ok boolean not null default false,
  accuracy_confirmed boolean not null default false,
  consent boolean not null default false,

  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists program_applications_created_at_idx
  on public.program_applications (created_at desc);
create index if not exists program_applications_program_idx
  on public.program_applications (program);
create index if not exists program_applications_email_idx
  on public.program_applications (lower(email));

grant insert on public.program_applications to anon, authenticated;
grant all on public.program_applications to service_role;

alter table public.program_applications enable row level security;

-- The public site may only add an application, and only with every
-- acknowledgement accepted. Nobody but the service role (the admin console) can
-- read, change or delete applications.
drop policy if exists "Public can submit" on public.program_applications;
create policy "Public can submit"
  on public.program_applications for insert to anon, authenticated
  with check (
    consent = true
    and terms_agreed = true
    and contact_ok = true
    and accuracy_confirmed = true
    and status = 'new'
  );
