-- Per-event search/sharing settings and practical details, plus campaign (UTM)
-- attribution on every website form. Idempotent: safe to run more than once.

alter table public.admin_events
  add column if not exists time_label text,
  add column if not exists entry_fee text,
  add column if not exists seats text,
  -- { "title", "description", "image", "keywords", "noindex" }
  add column if not exists seo jsonb not null default '{}'::jsonb;

-- Where a submission came from: utm_source, utm_medium, utm_campaign,
-- utm_term, utm_content, landing_page, referrer.
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
      'alter table public.%I add column if not exists utm jsonb not null default ''{}''::jsonb',
      table_name
    );
    execute format(
      'create index if not exists %I on public.%I ((utm ->> ''utm_campaign''))',
      table_name || '_utm_campaign_idx',
      table_name
    );
  end loop;
end
$$;
