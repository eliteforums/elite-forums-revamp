-- Public form submissions used by the Elite Forums website.
-- This migration is intentionally idempotent so it can be applied to a project
-- that already contains the legacy Drizzle-created tables.

create table if not exists public.student_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  institution text not null,
  course_year text,
  city text not null,
  interests text[] not null default '{}',
  preferred_channel text not null,
  phone text,
  consent boolean not null default false,
  marketing_opt_in boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.college_applications (
  id uuid primary key default gen_random_uuid(),
  institution_name text not null,
  website text,
  city text not null,
  state text not null,
  ecell_name text,
  rep_name text not null,
  rep_designation text not null,
  email text not null,
  phone text,
  community_size text,
  current_activities text,
  support_needed text not null,
  additional_info text,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.ambassador_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  college text not null,
  course_year text not null,
  experience text,
  motivation text not null,
  availability text not null,
  profile_url text,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  consent boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  name text not null,
  email text not null,
  institution text not null,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  constraint event_registrations_event_email_key unique (event_slug, email)
);

-- Existing installations may have been created by Drizzle without these
-- indexes. They are safe to add after the tables already exist.
create index if not exists student_registrations_created_at_idx
  on public.student_registrations (created_at desc);
create index if not exists college_applications_created_at_idx
  on public.college_applications (created_at desc);
create index if not exists ambassador_applications_created_at_idx
  on public.ambassador_applications (created_at desc);
create index if not exists contact_enquiries_created_at_idx
  on public.contact_enquiries (created_at desc);
create index if not exists event_registrations_created_at_idx
  on public.event_registrations (created_at desc);
create index if not exists event_registrations_event_slug_idx
  on public.event_registrations (event_slug);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'student_registrations',
    'college_applications',
    'ambassador_applications',
    'contact_enquiries',
    'event_registrations'
  ] loop
    execute format('grant insert on public.%I to anon, authenticated', table_name);
    execute format('grant all on public.%I to service_role', table_name);
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'drop policy if exists "Public can submit" on public.%I',
      table_name
    );
    execute format(
      'create policy "Public can submit" on public.%I for insert to anon, authenticated with check (consent = true)',
      table_name
    );
  end loop;
end
$$;
