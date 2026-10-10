import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { teamById, type LeagueId, type Team } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import { fetchGames } from "@/lib/sports-data/provider";
import { createPublicClient } from "@/lib/supabase/public";
import { dateInZone, taipeiDayRangeUtc } from "@/lib/time";
import type { Game, GameWithTeams } from "@/lib/types";

export const GAMES_TAG = "games";

type GameRow = {
  id: string;
  league_id: LeagueId;
  season: number;
  home_id: string;
  away_id: string;
  start_utc: string | null;
  venue_tz: string;
  status: Game["status"];
  home_score: number | null;
  away_score: number | null;
  source: string;
};

export function rowToGame(r: GameRow): Game {
  return {
    id: r.id,
    leagueId: r.league_id,
    season: r.season,
    homeId: r.home_id,
    awayId: r.away_id,
    startUtc: r.start_utc,
    venueTz: r.venue_tz,
    status: r.status,
    homeScore: r.home_score,
    awayScore: r.away_score,
    source: r.source,
  };
}

export function gameToRow(g: Game): GameRow & { updated_at: string } {
  return {
    id: g.id,
    league_id: g.leagueId,
    season: g.season,
    home_id: g.homeId,
    away_id: g.awayId,
    start_utc: g.startUtc,
    venue_tz: g.venueTz,
    status: g.status,
    home_score: g.homeScore,
    away_score: g.awayScore,
    source: g.source,
    updated_at: new Date().toISOString(),
  };
}

function tbdTeam(id: string): Team | undefined {
  if (!id.endsWith("-TBD")) return undefined;
  const leagueId = id.slice(0, 3) as LeagueId;
  return { id, leagueId, abbr: "TBD", name: "TBD", nameZh: "待定", city: "", venueTz: "America/New_York" };
}

function withTeams(games: Game[]): GameWithTeams[] {
  return games.flatMap((g) => {
    const home = teamById(g.homeId) ?? tbdTeam(g.homeId);
    const away = teamById(g.awayId) ?? tbdTeam(g.awayId);
    return home && away ? [{ ...g, home, away }] : [];
  });
}

const byStart = (a: Game, b: Game) => (a.startUtc ?? "").localeCompare(b.startUtc ?? "");

function shiftDate(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Today's date in Taiwan, cached briefly so pages can prerender. */
export async function getTaipeiToday(): Promise<string> {
  "use cache";
  cacheLife("minutes");
  return dateInZone(new Date());
}

/** All games whose start falls on `taipeiDate` (Asia/Taipei calendar day). */
export async function getGamesForTaipeiDate(taipeiDate: string, league?: LeagueId): Promise<GameWithTeams[]> {
  "use cache";
  cacheTag(GAMES_TAG);
  cacheLife("minutes");

  const { start, end } = taipeiDayRangeUtc(taipeiDate);

  if (!isSupabaseConfigured()) {
    // No database: read straight from the provider. A Taiwan day overlaps the
    // previous and current US calendar dates.
    const leagues: LeagueId[] = league ? [league] : ["MLB", "NBA", "NFL"];
    const batches = await Promise.all(
      leagues.flatMap((l) =>
        [shiftDate(taipeiDate, -1), taipeiDate].map((d) =>
          fetchGames(l, d).catch((err: Error) => {
            console.error(`[games] ${l} ${d}: ${err.message}`);
            return [];
          }),
        ),
      ),
    );
    const games = batches
      .flat()
      .filter((g) => g.startUtc && g.startUtc >= start.toISOString() && g.startUtc < end.toISOString());
    return withTeams(games.sort(byStart));
  }

  let query = createPublicClient()
    .from("games")
    .select("*")
    .gte("start_utc", start.toISOString())
    .lt("start_utc", end.toISOString())
    .order("start_utc");
  if (league) query = query.eq("league_id", league);

  const { data, error } = await query;
  if (error) throw new Error(`games query failed: ${error.message}`);
  return withTeams((data as GameRow[]).map(rowToGame));
}

/** Upcoming games for one team over the next `days` Taiwan days. */
export async function getUpcomingTeamGames(teamId: string, fromTaipeiDate: string, days = 7): Promise<GameWithTeams[]> {
  "use cache";
  cacheTag(GAMES_TAG, `team:${teamId}`);
  cacheLife("minutes");

  const team = teamById(teamId);
  if (!team) return [];

  const dates = Array.from({ length: days }, (_, i) => shiftDate(fromTaipeiDate, i));
  const perDay = await Promise.all(dates.map((d) => getGamesForTaipeiDate(d, team.leagueId)));
  return perDay.flat().filter((g) => g.homeId === teamId || g.awayId === teamId);
}

export { shiftDate };
