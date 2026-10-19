# Elite Forums Supabase project

This directory contains the complete database setup used by the website.

## Included files

- `config.toml` — local Supabase CLI configuration.
- `migrations/0001_admin_console.sql` — managed events and editable site content.
- `migrations/0002_form_submissions.sql` — student, college, ambassador, contact and event registration submissions.
- `migrations/0003_program_applications.sql` — programme admission applications (Startup Cohort, Startup Incubation, Coworking Space Membership).
- `migrations/0004_event_posters_and_registration_url.sql` — event poster storage and external registration links.
- `migrations/0005_event_seo_and_utm.sql` — per-event SEO, time, entry and seats; campaign (UTM) attribution on every form.
- `migrations/0006_editable_forms.sql` — forms edited in the admin console: extra answers, optional built-in questions, new programmes.
- `seed.sql` — intentionally empty production seed; events and submissions are created through the app.

## Apply the database

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), authenticate, and link the project:

```sh
supabase login
supabase link --project-ref pgyneccmpvekogvihgvu
supabase db push
```

For a local project:

```sh
supabase start
supabase db reset
```

The public site can insert a submission only when `consent = true`. Public
clients cannot read or update submissions. The admin server uses the
`SUPABASE_SERVICE_ROLE_KEY`, protected by the application’s Supabase Auth
session and `ADMIN_EMAILS` allowlist.

Create the administrator user in Supabase Dashboard under Authentication.
Do not put service-role keys, passwords or access tokens in this directory or
in a client-side `VITE_` variable.
