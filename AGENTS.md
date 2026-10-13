# Contributor notes

## Project

Server-rendered marketing site built with TanStack Start, React 19, Tailwind CSS 4
and shadcn/ui. Form submissions are stored in Supabase.

## Working agreements

- Use pnpm for dependency management and keep `pnpm-lock.yaml` in sync.
- Routes are file-based; add a `.tsx` file under `src/routes/` instead of creating
  a `src/pages/` directory. `routeTree.gen.ts` is generated — never edit it by hand.
- Keep imports resolving: `@/` maps to `src/`, so every such import must point at a
  file that exists.
- Brand artwork lives in `src/assets/` and is derived from the supplied logo files by
  `tools/generate_brand_assets.py`; regenerate rather than editing the PNGs by hand.
- Before pushing, run `pnpm lint` and `pnpm build`.
