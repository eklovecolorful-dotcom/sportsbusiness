# ADR-0001 · Licensed sports data only

- **Status:** Accepted · 2026-10
- **Context:** Schedules and scores are the core of the free tier. League sites forbid scraping, and free API tiers are usually non-commercial.
- **Decision:** Schedules/scores come only from a licensed provider (SportsDataIO or Sportradar). Never scrape league or team sites. Until a commercial licence is signed, `SPORTS_DATA_PROVIDER=mock` serves clearly labelled demo data (示範資料).
- **Consequences:**
  - Provider adapter lives in `src/lib/sports-data/`; every row stores `games.source` for audits.
  - Record here, before go-live: plan name, price, commercial-use clause, caching/display rules, attribution requirement, rate limits.
  - Monitor API quota during peak season (P7).

## Licence terms (fill in)

| Item | Value |
|---|---|
| Provider / plan | |
| Commercial use allowed | |
| Max cache duration | |
| Attribution required | |
| Rate limit / monthly quota | |
| Contract renewal date | |

## Amendment · 2026-10-10 — development preview provider

- `SPORTS_DATA_PROVIDER=espn` reads ESPN's public scoreboard (`src/lib/sports-data/espn.ts`) so real schedules and scores can be checked during development.
- It is **not** a licensed source and does not satisfy this ADR. `provider.ts` refuses it when `VERCEL_ENV=production`, and the schedule page labels it 「開發預覽，非商用授權資料」.
- Go-live gate unchanged: switch to a licensed provider before launch.
