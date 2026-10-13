# Elite Forums Supabase project

This directory contains the complete database setup used by the website.

## Included files

- `config.toml` — local Supabase CLI configuration.
- `migrations/0001_admin_console.sql` — managed events and editable site content.
- `migrations/0002_form_submissions.sql` — student, college, ambassador, contact and event registration submissions.
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
