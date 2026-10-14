# Elite Forums

Marketing site for Elite Forums, a community for anyone who wants to become a founder.
Started in Mumbai and growing across India, it connects aspiring founders, colleges and
E-Cells, and mentors through workshops, hackathons and community programmes.

## Tech stack

- **TanStack Start** (SSR) with file-based routing
- **React 19** + **shadcn/ui** (new-york) and lucide-react icons
- **Tailwind CSS 4** with design tokens declared in `src/styles.css`
- **Supabase** for the form submission tables
- **Vite** for dev/build, **Nitro** for the server output

## Development

```sh
pnpm install
pnpm dev
```

## Admin console

The `/admin` route uses Supabase Auth. Create administrator users in Supabase
Authentication, apply all migrations in `supabase/migrations/`, and set these
server environment variables:

```sh
ADMIN_EMAILS=admin@example.com,another-admin@example.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`ADMIN_EMAILS` is an explicit allowlist; an authenticated Supabase user who is
not listed there cannot use the admin API. The console manages published
events, editable JSON content records, and submissions from all site forms.
The complete Supabase CLI setup is documented in `supabase/README.md`.

The dev server runs on <http://localhost:8080>.

## Scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `pnpm dev`     | Start the dev server       |
| `pnpm build`   | Production build           |
| `pnpm preview` | Preview a production build |
| `pnpm lint`    | Run ESLint                 |
| `pnpm test`    | Run the Vitest suite       |
| `pnpm format`  | Format with Prettier       |

## Environment

Copy `.env` and fill in the Supabase project values:

```
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_GOOGLE_SITE_VERIFICATION=...
```

The `VITE_` variables are read in the browser, the unprefixed ones by server code.
Set `VITE_GOOGLE_SITE_VERIFICATION` to the exact token supplied by Google Search
Console; the verification meta tag is omitted when it is unset. Google Analytics
uses measurement ID `G-RZY47VR9T3`; the tag loads with consent denied and only enables
measurement after the visitor accepts optional cookies.

The static `public/_redirects` file contains the small set of legacy entry-point
redirects currently known to the project. Add verified old-to-new URL mappings
there before deploying additional migrations; do not redirect unknown URLs.

## Structure

```
src/
  assets/              brand artwork (logo marks, lockups, photos)
  components/forms/    shared form primitives and submission forms
  components/site/     header, footer, logo and page sections
  components/ui/       shadcn/ui primitives
  integrations/        Supabase clients and auth middleware
  lib/                 content, schemas, metadata helpers
  routes/              file-based routes (see src/routes/README.md)
  start.ts, server.ts  TanStack Start instance and SSR error wrapper
drizzle/               database schema and migrations for the submissions
public/                favicon, apple touch icon and robots.txt
```
