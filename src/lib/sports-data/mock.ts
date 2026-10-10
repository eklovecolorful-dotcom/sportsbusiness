import { teamsByLeague, type LeagueId } from "@/lib/catalog";
import { zonedTimeToUtc } from "@/lib/time";
import type { Game } from "@/lib/types";

// UI-only DEMO fixtures for layout work. Disabled by default (DEMO_SCHEDULE=true
// to enable). Matchups are random, so demo games NEVER carry scores or results —
// a fabricated "Final 13–0" is worse than showing nothing.

export function isDemoScheduleEnabled(): boolean {
  return process.env.DEMO_SCHEDULE === "true";
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Regular seasons only — postseason matchups can't be faked.
function inRegularSeason(league: LeagueId, month: number): boolean {
  if (league === "MLB") return month >= 4 && month <= 9;
  if (league === "NBA") return month >= 11 || month <= 3;
  return month >= 9 || month === 12 || month === 1;
}

function slate(league: LeagueId, weekday: number): { count: number; times: string[] } {
  if (league === "MLB") return { count: 6, times: ["13:05", "19:05", "19:10", "18:40"] };
  if (league === "NBA") return { count: 5, times: ["19:00", "19:30", "20:00"] };
  if (weekday === 0) return { count: 8, times: ["13:00", "16:05", "16:25", "20:20"] };
  if (weekday === 1 || weekday === 4) return { count: 1, times: ["20:15"] };
  return { count: 0, times: [] };
}

/** Demo fixtures for one US calendar date (YYYY-MM-DD). Always "scheduled", never scored. */
export function mockGamesForUsDate(league: LeagueId, usDate: string): Game[] {
  if (!isDemoScheduleEnabled()) return [];
  const [y, m, d] = usDate.split("-").map(Number);
  if (!inRegularSeason(league, m)) return [];
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const { count, times } = slate(league, weekday);
  const rand = rng(hash(`${league}:${usDate}`));
  const teams = [...teamsByLeague(league)].sort(() => rand() - 0.5);

  const games: Game[] = [];
  for (let i = 0; i < count && i * 2 + 1 < teams.length; i++) {
    const home = teams[i * 2];
    const away = teams[i * 2 + 1];
    games.push({
      id: `${league}-mock-${usDate}-${home.abbr}-${away.abbr}`,
      leagueId: league,
      season: league === "NBA" && m < 7 ? y - 1 : y,
      homeId: home.id,
      awayId: away.id,
      startUtc: zonedTimeToUtc(`${usDate} ${times[i % times.length]}`, home.venueTz).toISOString(),
      venueTz: home.venueTz,
      status: "scheduled",
      homeScore: null,
      awayScore: null,
      source: "mock",
    });
  }
  return games;
}
