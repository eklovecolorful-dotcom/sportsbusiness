import "server-only";
import { TEAMS, type LeagueId } from "@/lib/catalog";
import { zonedTimeToUtc } from "@/lib/time";
import type { Game, GameStatus } from "@/lib/types";

// SportsDataIO adapter (ADR-0001: licensed provider only).
// Docs: https://sportsdata.io/developers/getting-started
// ⚠️ Verify endpoint paths and field names against YOUR plan's API docs
//    before going live — they differ slightly per league and per plan.

const BASE = "https://api.sportsdata.io/v3";

const ENDPOINT: Record<LeagueId, (date: string) => string> = {
  MLB: (d) => `${BASE}/mlb/scores/json/GamesByDate/${d}`,
  NBA: (d) => `${BASE}/nba/scores/json/GamesByDate/${d}`,
  NFL: (d) => `${BASE}/nfl/scores/json/ScoresByDate/${d}`,
};

// Provider abbreviations that differ from src/lib/catalog.ts.
const ABBR_ALIASES: Record<string, string> = {
  "MLB:CHW": "CWS",
  "MLB:OAK": "ATH",
  "MLB:WAS": "WSH",
  "NBA:PHO": "PHX",
  "NBA:GS": "GSW",
  "NBA:NO": "NOP",
  "NBA:NY": "NYK",
  "NBA:SA": "SAS",
};

type RawGame = {
  GameID?: number;
  GameKey?: string;
  ScoreID?: number;
  Season: number;
  Status: string;
  DateTime?: string | null; // US Eastern, no offset
  DateTimeUTC?: string | null;
  HomeTeam: string;
  AwayTeam: string;
  HomeTeamRuns?: number | null;
  AwayTeamRuns?: number | null;
  HomeTeamScore?: number | null;
  AwayTeamScore?: number | null;
  HomeScore?: number | null;
  AwayScore?: number | null;
};

function mapStatus(s: string): GameStatus {
  if (s === "InProgress") return "live";
  if (s.startsWith("F")) return "final"; // Final, F/OT, F/SO
  if (s === "Postponed" || s === "Canceled" || s === "Suspended") return "postponed";
  return "scheduled";
}

function teamId(league: LeagueId, abbr: string): string | undefined {
  const normalized = ABBR_ALIASES[`${league}:${abbr}`] ?? abbr;
  return TEAMS.find((t) => t.leagueId === league && t.abbr === normalized)?.id;
}

export async function fetchSportsDataIoGames(league: LeagueId, usDate: string): Promise<Game[]> {
  const key = process.env.SPORTSDATAIO_API_KEY;
  if (!key) throw new Error("SPORTSDATAIO_API_KEY is not set");

  const res = await fetch(ENDPOINT[league](usDate), {
    headers: { "Ocp-Apim-Subscription-Key": key },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`SportsDataIO ${league} ${usDate}: HTTP ${res.status}`);
  const raw = (await res.json()) as RawGame[];

  const games: Game[] = [];
  for (const g of raw) {
    const homeId = teamId(league, g.HomeTeam);
    const awayId = teamId(league, g.AwayTeam);
    if (!homeId || !awayId) {
      console.warn(`[sportsdataio] unknown team ${g.AwayTeam}@${g.HomeTeam} — add to ABBR_ALIASES`);
      continue;
    }
    const venueTz = TEAMS.find((t) => t.id === homeId)!.venueTz;
    const startUtc = g.DateTimeUTC
      ? new Date(`${g.DateTimeUTC}Z`).toISOString()
      : g.DateTime
        ? zonedTimeToUtc(g.DateTime.slice(0, 16).replace("T", " "), "America/New_York").toISOString()
        : null;

    games.push({
      id: `${league}-${g.GameID ?? g.ScoreID ?? g.GameKey}`,
      leagueId: league,
      season: g.Season,
      homeId,
      awayId,
      startUtc,
      venueTz,
      status: mapStatus(g.Status),
      homeScore: g.HomeTeamRuns ?? g.HomeTeamScore ?? g.HomeScore ?? null,
      awayScore: g.AwayTeamRuns ?? g.AwayTeamScore ?? g.AwayScore ?? null,
      source: "sportsdataio",
    });
  }
  return games;
}
