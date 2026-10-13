create table if not exists public.admin_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null check (type in ('Workshop', 'Hackathon', 'Founder Connect', 'Bootcamp')),
  title text not null,
  date date not null,
  format text not null check (format in ('Online', 'In-person')),
  city text,
  location text not null,
  summary text not null,
  image text not null,
  agenda jsonb not null default '[]'::jsonb,
  eligibility text not null,
  organizer text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.admin_events enable row level security;
alter table public.site_content enable row level security;

create policy "Published events are public"
  on public.admin_events for select
  using (published = true);

create policy "Site content is public"
  on public.site_content for select
  using (true);

create index if not exists admin_events_date_idx on public.admin_events (date);
