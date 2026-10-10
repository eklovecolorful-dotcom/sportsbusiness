import type { LeagueId, Team } from "@/lib/catalog";

export type GameStatus = "scheduled" | "live" | "final" | "postponed";

export type Game = {
  id: string;
  leagueId: LeagueId;
  season: number;
  homeId: string;
  awayId: string;
  /** ISO string in UTC; null while TBD. */
  startUtc: string | null;
  venueTz: string;
  status: GameStatus;
  homeScore: number | null;
  awayScore: number | null;
  source: string;
  /** Display label, e.g. "季後賽 · ALCS - Game 1" or "NFL London Games". Not persisted. */
  note?: string | null;
  /** Date known but start time not announced (startUtc is an estimate for day bucketing). */
  timeTbd?: boolean;
};

export type GameWithTeams = Game & { home: Team; away: Team };

export type Brief = {
  slug: string;
  title: string;
  takeaway: string;
  excerpt: string;
  isPremium: boolean;
  publishedAt: string;
};
