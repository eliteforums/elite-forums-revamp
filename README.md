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
```

The `VITE_` variables are read in the browser, the unprefixed ones by server code.

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
