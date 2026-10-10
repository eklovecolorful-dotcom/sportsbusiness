import { revalidateTag } from "next/cache";
import type { LeagueId } from "@/lib/catalog";
import { GAMES_TAG, gameToRow, shiftDate } from "@/lib/data/games";
import { isSupabaseConfigured } from "@/lib/env";
import { activeProvider, fetchGames } from "@/lib/sports-data/provider";
import { createAdminClient } from "@/lib/supabase/admin";
import { dateInZone } from "@/lib/time";

// P5 schedule sync (/sync-schedule). Vercel Cron calls this every 15 minutes
// (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
const LEAGUES: LeagueId[] = ["MLB", "NBA", "NFL"];

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return Response.json({ skipped: "Supabase not configured" }, { status: 503 });
  }

  const admin = createAdminClient();
  const usToday = dateInZone(new Date(), "America/New_York");
  const usDates = [shiftDate(usToday, -1), usToday, shiftDate(usToday, 1)];
  const summary: Record<string, number> = {};
  const errors: string[] = [];
  let newlyPostponed = 0;

  for (const league of LEAGUES) {
    for (const usDate of usDates) {
      try {
        const games = await fetchGames(league, usDate);
        if (games.length === 0) continue;

        // Detect transitions to "postponed" before overwriting.
        const { data: existing } = await admin
          .from("games")
          .select("id, status")
          .in("id", games.map((g) => g.id));
        const prev = new Map((existing ?? []).map((r) => [r.id as string, r.status as string]));

        const { error } = await admin.from("games").upsert(games.map(gameToRow));
        if (error) throw new Error(error.message);
        summary[`${league} ${usDate}`] = games.length;

        for (const g of games) {
          if (g.status === "postponed" && prev.get(g.id) !== "postponed") {
            newlyPostponed++;
            await queuePostponedNotifications(admin, g.id, [g.homeId, g.awayId]);
          }
        }
      } catch (err) {
        errors.push(`${league} ${usDate}: ${(err as Error).message}`);
      }
    }
  }

  revalidateTag(GAMES_TAG, "max");

  return Response.json(
    { provider: activeProvider(), synced: summary, newlyPostponed, errors },
    { status: errors.length ? 207 : 200 },
  );
}

/** BDD: followers of either team get exactly ONE notification (unique constraint). */
async function queuePostponedNotifications(
  admin: ReturnType<typeof createAdminClient>,
  gameId: string,
  teamIds: string[],
) {
  const { data: followers } = await admin
    .from("follows")
    .select("user_id")
    .eq("target_type", "team")
    .in("target_id", teamIds);
  const userIds = [...new Set((followers ?? []).map((f) => f.user_id as string))];
  if (userIds.length === 0) return;

  await admin.from("notifications").upsert(
    userIds.map((user_id) => ({ user_id, kind: "game_postponed", ref_id: gameId, payload: { gameId } })),
    { onConflict: "user_id,kind,ref_id", ignoreDuplicates: true },
  );
}
