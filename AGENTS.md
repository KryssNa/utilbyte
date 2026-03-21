# AGENTS.md

## Cursor Cloud specific instructions

### Overview

UtilByte is a single Next.js 16 application — a browser-based utility toolkit with 45+ tools across image, PDF, text, utility, dev, and video categories. Almost all tools run entirely client-side; no backend services are required for core functionality.

This is an open-source project under the MIT license. See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Development commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Next.js with Turbopack on port 3000) |
| Type check | `npm run type-check` |
| Build | `npm run build` |

### Architecture

- **Pages** live in `src/app/{category}/{tool}/page.tsx` — export SEO metadata and render the tool component.
- **Tool components** live in `src/components/tools/{category}/` — contain all UI and processing logic.
- **Shared components** (`src/components/shared/`) — `ToolLayout`, `FileDropZone`, `RelatedTools` for consistent UX.
- **UI primitives** (`src/components/ui/`) — shadcn/ui style components built on Radix UI.
- **JSON-LD** structured data is rendered via `<script type="application/ld+json">` tags in page components (not via `metadata.other`).

### Adding a new tool

1. Create the component in `src/components/tools/{category}/`.
2. Create the page in `src/app/{category}/{tool-slug}/page.tsx` with full metadata (title, description, canonical, OG, Twitter, JSON-LD).
3. Add the route to `src/app/sitemap.ts`.
4. Add the tool to navigation data in `src/components/layout/navbar/data.ts`.
5. Run `npm run type-check && npm run build` to verify.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full template.

### Known caveats

- **Lint**: The `npm run lint` script calls `next lint`, which was removed in Next.js 16. There is no standalone `eslint.config.js` file. Linting is not functional until an ESLint flat config is added or the script is updated.
- **Sentry**: The build wraps config with `@sentry/nextjs`. Sentry DSN values are hardcoded but Sentry is non-blocking for local dev. The build may emit Sentry source-map upload warnings without `SENTRY_AUTH_TOKEN`; these are safe to ignore.
- **Supabase**: Only 3 dev tools (Request Catcher, API Client, Local Proxy) require Supabase. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars if testing those tools. The rest of the app works without them.
- **Environment variables**: Copy `.env.example` to `.env.local` for Supabase, Slack webhook, analytics, or Sentry configuration. Most tools work without any env vars.
