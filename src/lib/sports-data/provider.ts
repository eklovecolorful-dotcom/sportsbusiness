import "server-only";
import type { LeagueId } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/env";
import type { Game } from "@/lib/types";
import { isDemoScheduleEnabled, mockGamesForUsDate } from "./mock";
import { fetchEspnGames } from "./espn";
import { fetchSportsDataIoGames } from "./sportsdataio";

export type ProviderName = "mock" | "sportsdataio" | "espn";

export function activeProvider(): ProviderName {
  const wanted = process.env.SPORTS_DATA_PROVIDER;
  if (wanted === "sportsdataio" && process.env.SPORTSDATAIO_API_KEY) return "sportsdataio";
  // ESPN is an unlicensed dev preview (ADR-0001): never on a Vercel production deployment.
  if (wanted === "espn" && process.env.VERCEL_ENV !== "production") return "espn";
  return "mock";
}

/**
 * Where the schedule shown to visitors comes from:
 * - "live": a licensed provider (directly, or synced into Supabase by the cron)
 * - "demo": random UI fixtures (DEMO_SCHEDULE=true), no scores
 * - "none": nothing connected — show no games rather than wrong ones
 */
export type ScheduleSource = "live" | "demo" | "none";

export function scheduleSource(): ScheduleSource {
  if (activeProvider() !== "mock" || isSupabaseConfigured()) return "live";
  return isDemoScheduleEnabled() ? "demo" : "none";
}

/** Fetch games for one US calendar date from the configured licensed provider. */
export async function fetchGames(league: LeagueId, usDate: string): Promise<Game[]> {
  switch (activeProvider()) {
    case "sportsdataio":
      return fetchSportsDataIoGames(league, usDate);
    case "espn":
      return fetchEspnGames(league, usDate);
    default:
      return mockGamesForUsDate(league, usDate);
  }
}
