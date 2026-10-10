# ADR-0002 · Content red lines

- **Status:** Accepted · 2026-10
- **Decision:**
  1. No league/team logos, official fonts, photos or game footage. Teams are shown by text name and neutral chips (`src/components/game-card.tsx`, team page header).
  2. No odds, picks or sportsbook links; betting may be analysed only as a business. Only Taiwan Sports Lottery is legal in Taiwan.
  3. Trips are sold, invoiced and collected by a licensed travel agency. The platform only stores inquiries and forwards them (`src/app/trips/actions.ts`).
- **Enforcement:** `/weekly-biz-brief` rules, content checklist in docs/06-design-system.md, footer + /legal/disclaimer.
