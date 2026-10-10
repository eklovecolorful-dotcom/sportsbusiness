import "server-only";
import { TEAMS, type LeagueId } from "@/lib/catalog";
import { dateInZone, zonedTimeToUtc } from "@/lib/time";
import type { Game, GameStatus } from "@/lib/types";

// ESPN public scoreboard — DEVELOPMENT PREVIEW ONLY.
// Undocumented and not licensed for commercial use, so it does not satisfy
// ADR-0001. provider.ts refuses it on Vercel production deployments; switch
// to a licensed provider (SportsDataIO / Sportradar / TheSportsDB paid) before launch.

const PATH: Record<LeagueId, string> = {
  MLB: "baseball/mlb",
  NBA: "basketball/nba",
  NFL: "football/nfl",
};

// ESPN abbreviations that differ from src/lib/catalog.ts.
const ABBR_ALIASES: Record<string, string> = {
  "MLB:CHW": "CWS",
  "MLB:OAK": "ATH",
  "MLB:WAS": "WSH",
  "NBA:GS": "GSW",
  "NBA:NO": "NOP",
  "NBA:NY": "NYK",
  "NBA:SA": "SAS",
  "NBA:UTAH": "UTA",
  "NBA:WSH": "WAS",
  "NFL:WSH": "WAS",
};

// Neutral-site venues abroad (NFL international games etc.).
const COUNTRY_TZ: Record<string, string> = {
  England: "Europe/London",
  "United Kingdom": "Europe/London",
  Ireland: "Europe/Dublin",
  Germany: "Europe/Berlin",
  Spain: "Europe/Madrid",
  France: "Europe/Paris",
  Mexico: "America/Mexico_City",
  Brazil: "America/Sao_Paulo",
  Australia: "Australia/Melbourne",
  Japan: "Asia/Tokyo",
  "South Korea": "Asia/Seoul",
  Canada: "America/Toronto",
};

const SEASON_TYPE_LABEL: Record<number, string> = { 1: "季前賽", 3: "季後賽" };

type EspnCompetitor = { homeAway: "home" | "away"; score?: string; team: { abbreviation: string } };
type EspnEvent = {
  id: string;
  date: string; // ISO UTC, e.g. "2026-10-11T13:30Z"
  season: { year: number; type: number };
  status: { type: { name: string; state: "pre" | "in" | "post" } };
  competitions: {
    timeValid?: boolean;
    neutralSite?: boolean;
    venue?: { address?: { city?: string; country?: string } };
    notes?: { headline?: string }[];
    competitors: EspnCompetitor[];
  }[];
};

function teamId(league: LeagueId, abbr: string): string | undefined {
  if (abbr === "TBD") return `${league}-TBD`; // e.g. World Series before the LCS ends
  const normalized = ABBR_ALIASES[`${league}:${abbr}`] ?? abbr;
  return TEAMS.find((t) => t.leagueId === league && t.abbr === normalized)?.id;
}

function mapStatus(e: EspnEvent): GameStatus {
  const { name, state } = e.status.type;
  if (name === "STATUS_POSTPONED" || name === "STATUS_CANCELED" || name === "STATUS_SUSPENDED") return "postponed";
  if (state === "in") return "live";
  if (state === "post") return "final";
  return "scheduled";
}

/** Games for one US calendar date (YYYY-MM-DD). */
export async function fetchEspnGames(league: LeagueId, usDate: string): Promise<Game[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${PATH[league]}/scoreboard?dates=${usDate.replaceAll("-", "")}&limit=100`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ESPN ${league} ${usDate}: HTTP ${res.status}`);
  const { events = [] } = (await res.json()) as { events?: EspnEvent[] };

  const games: Game[] = [];
  for (const e of events) {
    const comp = e.competitions[0];
    const home = comp?.competitors.find((c) => c.homeAway === "home");
    const away = comp?.competitors.find((c) => c.homeAway === "away");
    if (!home || !away) continue;
    const homeId = teamId(league, home.team.abbreviation);
    const awayId = teamId(league, away.team.abbreviation);
    if (!homeId || !awayId) {
      // e.g. preseason exhibitions vs. non-league clubs
      continue;
    }

    const country = comp.venue?.address?.country;
    const venueTz =
      (comp.neutralSite && country && COUNTRY_TZ[country]) ||
      TEAMS.find((t) => t.id === homeId)?.venueTz ||
      "America/New_York";
    // Unannounced start time: ESPN uses midnight ET. Bucket it as a US evening game.
    const timeTbd = comp.timeValid === false;
    const startUtc = timeTbd
      ? zonedTimeToUtc(`${dateInZone(e.date, "America/New_York")} 20:00`, "America/New_York").toISOString()
      : new Date(e.date).toISOString();
    const status = mapStatus(e);
    const scored = status === "live" || status === "final";
    const headline = comp.notes?.find((n) => n.headline)?.headline;
    const note = [SEASON_TYPE_LABEL[e.season.type], headline].filter(Boolean).join(" · ") || null;

    games.push({
      id: `${league}-espn-${e.id}`,
      leagueId: league,
      season: e.season.year,
      homeId,
      awayId,
      startUtc,
      timeTbd,
      venueTz,
      status,
      homeScore: scored && home.score != null ? Number(home.score) : null,
      awayScore: scored && away.score != null ? Number(away.score) : null,
      source: "espn",
      note,
    });
  }
  return games;
}
