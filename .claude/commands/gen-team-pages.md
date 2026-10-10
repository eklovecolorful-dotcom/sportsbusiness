---
description: Extend the statically generated team pages (SEO)
---
Team pages live at src/app/teams/[league]/[team]/page.tsx and are prerendered via generateStaticParams from src/lib/catalog.ts.
- No logos, official fonts or photos — text names and neutral chips only.
- Request-time or uncached data must sit behind <Suspense>; cached data uses 'use cache' + cacheLife.
- If you add teams/players to catalog.ts, run `npm run db:seed:gen`.
Task: $ARGUMENTS
