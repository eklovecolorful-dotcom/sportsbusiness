---
description: Work on the schedule sync (licensed provider → Supabase games)
---
Context: src/app/api/cron/sync-schedule/route.ts, src/lib/sports-data/*, docs/adr/0001-licensed-data-only.md.
- Never scrape league/team websites. Only use the provider configured in SPORTS_DATA_PROVIDER.
- Store times in UTC; convert with src/lib/time.ts. Add a test in src/lib/time.test.ts for any new timezone logic, including US DST weeks (Mar, Nov).
- Keep the postponed → notifications outbox behaviour (exactly one per follower per game).
Task: $ARGUMENTS
