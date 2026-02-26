# AGENTS.md

## Cursor Cloud specific instructions

### Overview

UtilByte is a single Next.js 16 application — a browser-based utility toolkit with 46+ tools across image, PDF, text, utility, dev, and video categories. Almost all tools run entirely client-side; no backend services are required for core functionality.

### Development commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (Next.js with Turbopack on port 3000) |
| Type check | `npm run type-check` |
| Build | `npm run build` |

### Known caveats

- **Lint**: The `npm run lint` script calls `next lint`, which was removed in Next.js 16. There is no standalone `eslint.config.js` file. Linting is not functional until an ESLint flat config is added or the script is updated.
- **Sentry**: The build wraps config with `@sentry/nextjs`. Sentry DSN values are hardcoded but Sentry is non-blocking for local dev. The build may emit Sentry source-map upload warnings without `SENTRY_AUTH_TOKEN`; these are safe to ignore.
- **Supabase**: Only 3 dev tools (Request Catcher, API Client, Local Proxy) require Supabase. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars if testing those tools. The rest of the app works without them.
- **No `.env` file committed**: Create `.env.local` if needed for Supabase or Slack webhook keys.
