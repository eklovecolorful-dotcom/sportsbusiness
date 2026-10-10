@AGENTS.md

# Sports — 美國三大職業運動中文平台

Taiwan-time schedules (free) → paid weekly sports-business brief (Stripe) → US game trips via a licensed agency.
Planning docs: `docs/` (P1–P8). Executable specs: `features/`. Decisions: `docs/adr/`.

## Stack
Next.js 16 App Router (Cache Components + Partial Prefetching on) · Tailwind v4 · Supabase (Auth, Postgres, RLS) · Stripe subscriptions · Vercel Cron · Resend · Vitest.

## Commands
- `npm run dev` · `npm run build` · `npm test` · `npm run typecheck` · `npm run lint`
- `npm run db:seed:gen` — regenerate supabase/seed.sql from src/lib/catalog.ts
- `npm run db:push` — apply supabase/migrations to the linked project
- `npm run stripe:listen` — forward Stripe webhooks locally
- `npm run brief:publish <yyyy-ww>` — publish a fact-checked brief

## Rules
- Times are stored in UTC and displayed in Asia/Taipei via `src/lib/time.ts`. Never hard-code offsets. Any timezone change needs a test covering US DST weeks.
- Licensed data only (ADR-0001). No scraping.
- Red lines (ADR-0002): no logos/footage, no odds or sportsbook links, trips sold only by a licensed agency.
- Paywall is enforced by Supabase RLS on `brief_bodies`, not by UI code. Entitlement is written only by the Stripe webhook.
- Cache Components: reading cookies/searchParams or uncached data must sit inside `<Suspense>`; public data helpers in `src/lib/data/*` use `'use cache'` + `cacheLife` + `cacheTag`.
- Service-role client (`src/lib/supabase/admin.ts`) only in webhooks, cron, and validated server actions.
- Without Supabase env vars the app runs on demo data (`src/lib/sports-data/mock.ts`, `content/brief/*.md`).
