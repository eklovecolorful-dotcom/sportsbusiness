# P3 · Data Model

Migrations: `supabase/migrations/0001_core.sql`, `0002_billing_content.sql`. Seed: `supabase/seed.sql`（由 `npm run db:seed:gen` 產生）。

```
leagues ─┬─< teams ─┬─< players (is_taiwanese)
         │          └─< games (home_id / away_id, start_utc UTC, status)
         └─< games
auth.users ─┬─ profiles (stripe_customer_id)
            ├─< subscriptions   ← Stripe webhook only (service role)
            ├─< follows (team | player | league)
            ├─< trip_inquiries  ← server action (service role)
            └─< notifications   (unique user/kind/ref → exactly one push)
briefs (public meta + excerpt) ─ brief_bodies (RLS paywall)
```

## RLS 摘要
| Table | anon / user 可讀 | 寫入 |
|---|---|---|
| leagues, teams, games, players | 全部 | service role（cron / seed） |
| briefs | 已發佈 | service role（publish script） |
| brief_bodies | 免費文章，或 `has_active_subscription(auth.uid())` | service role |
| subscriptions | 本人 | webhook |
| follows | 本人（可新增／刪除） | 本人 |
| trip_inquiries | 本人 | server action |
| notifications | 本人 | cron |
