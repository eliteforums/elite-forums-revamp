-- Learning platform at /lms. Idempotent: safe to run more than once.
--
-- Learners sign in with accounts the admin creates (Supabase Auth). Every table
-- has row level security switched on with no public policies: the site reads and
-- writes them only from server functions, which check who is asking first.

create table if not exists public.lms_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  organisation text,
  status text not null default 'active' check (status in ('active', 'suspended')),
  must_change_password boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  title text not null,
  kind text not null default 'cohort'
    check (kind in ('cohort', 'course', 'bootcamp', 'fellowship', 'workshop')),
  summary text not null default '',
  description text not null default '',
  cover_image text,
  certificate_title text,
  published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_cohorts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  name text not null,
  starts_on date,
  ends_on date,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'active', 'completed', 'archived')),
  meeting_url text,
  community_url text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.lms_profiles (id) on delete cascade,
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  cohort_id uuid references public.lms_cohorts (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed', 'dropped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, program_id)
);

create table if not exists public.lms_modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  title text not null,
  summary text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_lessons (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  module_id uuid not null references public.lms_modules (id) on delete cascade,
  title text not null,
  kind text not null default 'reading'
    check (kind in ('video', 'reading', 'assignment', 'live', 'resource')),
  body text not null default '',
  video_url text,
  resource_url text,
  resource_label text,
  duration_minutes integer check (duration_minutes is null or duration_minutes between 0 and 1440),
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_progress (
  user_id uuid not null references public.lms_profiles (id) on delete cascade,
  lesson_id uuid not null references public.lms_lessons (id) on delete cascade,
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.lms_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.lms_profiles (id) on delete cascade,
  lesson_id uuid not null references public.lms_lessons (id) on delete cascade,
  program_id uuid not null references public.lms_programs (id) on delete cascade,
  body text not null default '',
  link text,
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'changes_requested')),
  feedback text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.lms_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.lms_cohorts (id) on delete cascade,
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  duration_minutes integer not null default 60 check (duration_minutes between 5 and 1440),
  meeting_url text,
  recording_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- No programme and no cohort: shown to every learner.
create table if not exists public.lms_announcements (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.lms_programs (id) on delete cascade,
  cohort_id uuid references public.lms_cohorts (id) on delete cascade,
  title text not null,
  body text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Certificates keep the recipient's name and the programme title as issued, so
-- they stay valid if the account or programme is later removed.
create table if not exists public.lms_certificates (
  id uuid primary key default gen_random_uuid(),
  serial text not null unique check (serial ~ '^[A-Z0-9-]{6,40}$'),
  user_id uuid references public.lms_profiles (id) on delete set null,
  recipient_name text not null,
  recipient_email text,
  title text not null,
  program_id uuid references public.lms_programs (id) on delete set null,
  cohort_id uuid references public.lms_cohorts (id) on delete set null,
  program_title text,
  description text,
  issued_on date not null default current_date,
  revoked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lms_enrollments_program_idx on public.lms_enrollments (program_id);
create index if not exists lms_enrollments_cohort_idx on public.lms_enrollments (cohort_id);
create index if not exists lms_modules_program_idx on public.lms_modules (program_id, position);
create index if not exists lms_lessons_module_idx on public.lms_lessons (module_id, position);
create index if not exists lms_lessons_program_idx on public.lms_lessons (program_id);
create index if not exists lms_progress_program_idx on public.lms_progress (program_id, user_id);
create index if not exists lms_submissions_status_idx on public.lms_submissions (status, created_at);
create index if not exists lms_sessions_cohort_idx on public.lms_sessions (cohort_id, starts_at);
create index if not exists lms_certificates_user_idx on public.lms_certificates (user_id);
create index if not exists lms_certificates_email_idx on public.lms_certificates (lower(recipient_email));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'lms_profiles',
    'lms_programs',
    'lms_cohorts',
    'lms_enrollments',
    'lms_modules',
    'lms_lessons',
    'lms_progress',
    'lms_submissions',
    'lms_sessions',
    'lms_announcements',
    'lms_certificates'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
  end loop;
end
$$;

-- Lessons completed per learner per programme, for progress bars. Runs with the
-- caller's permissions, so it is as private as lms_progress.
create or replace view public.lms_progress_summary
  with (security_invoker = true) as
  select user_id, program_id, count(*)::integer as completed, max(completed_at) as last_activity
  from public.lms_progress
  group by user_id, program_id;

revoke all on public.lms_progress_summary from anon, authenticated;
