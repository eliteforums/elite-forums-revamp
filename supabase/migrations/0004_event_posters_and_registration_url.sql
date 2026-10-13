-- Event posters are public assets; event records can optionally link to an
-- external registration provider.

alter table public.admin_events
  add column if not exists registration_url text;

insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view event posters" on storage.objects;
create policy "Public can view event posters"
  on storage.objects for select
  using (bucket_id = 'event-posters');

drop policy if exists "Admins can manage event posters" on storage.objects;
create policy "Admins can manage event posters"
  on storage.objects for all to authenticated
  using (bucket_id = 'event-posters')
  with check (bucket_id = 'event-posters');
