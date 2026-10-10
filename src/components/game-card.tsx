import Link from "next/link";
import { LEAGUES } from "@/lib/catalog";
import { formatInZone, timeInZone } from "@/lib/time";
import type { GameWithTeams } from "@/lib/types";

const STATUS_LABEL: Record<GameWithTeams["status"], string> = {
  scheduled: "未開賽",
  live: "進行中 LIVE",
  final: "終場 Final",
  postponed: "延賽 Postponed",
};

/** P4 core component: Taiwan time large, venue-local time small. No logos. */
export function GameCard({ game, highlightTeamId }: { game: GameWithTeams; highlightTeamId?: string }) {
  const league = LEAGUES.find((l) => l.id === game.leagueId)!;
  const postponed = game.status === "postponed";
  const showScore = game.status === "live" || game.status === "final";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between text-xs">
        <span className={`rounded-full px-2 py-0.5 font-semibold ${league.chip}`}>{league.name}</span>
        <span className={game.status === "live" ? "font-semibold text-red-600" : "text-slate-500"}>
          {STATUS_LABEL[game.status]}
        </span>
      </header>

      {game.note && <p className="-mt-1 mb-2 text-xs font-semibold text-slate-600">{game.note}</p>}

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <TeamLine name={game.away.nameZh} sub={game.away.abbr} href={teamHref(game.away.leagueId, game.away.abbr)} bold={game.awayId === highlightTeamId} score={showScore ? game.awayScore : null} />
          <TeamLine name={game.home.nameZh} sub={`${game.home.abbr} · 主`} href={teamHref(game.home.leagueId, game.home.abbr)} bold={game.homeId === highlightTeamId} score={showScore ? game.homeScore : null} />
        </div>

        <div className="shrink-0 text-right">
          {postponed ? (
            <p className="text-base font-bold text-amber-700">延賽 Postponed</p>
          ) : game.timeTbd && game.startUtc ? (
            <>
              <p className="text-base font-semibold text-slate-500">時間未定</p>
              <p className="mt-1 text-[11px] tabular-nums text-slate-400">
                當地 {formatInZone(game.startUtc, game.venueTz).slice(5, 10)}
              </p>
            </>
          ) : game.startUtc ? (
            <>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{timeInZone(game.startUtc)}</p>
              <p className="text-[11px] text-slate-500">台灣時間</p>
              <p className="mt-1 text-[11px] tabular-nums text-slate-400">
                當地 {formatInZone(game.startUtc, game.venueTz).slice(5)}
              </p>
            </>
          ) : (
            <p className="text-base font-semibold text-slate-500">時間未定 TBD</p>
          )}
        </div>
      </div>

      {game.source === "mock" && <p className="mt-3 text-[10px] text-slate-400">示範資料 — 隨機對戰組合，非真實賽程</p>}
    </article>
  );
}

function teamHref(leagueId: string, abbr: string) {
  return `/teams/${leagueId.toLowerCase()}/${abbr.toLowerCase()}`;
}

function TeamLine({ name, sub, href, bold, score }: { name: string; sub: string; href: string; bold?: boolean; score: number | null }) {
  const label = (
    <>
      {name} <span className="text-xs font-normal text-slate-400">{sub}</span>
    </>
  );
  return (
    <div className="flex items-baseline justify-between gap-2">
      {href.endsWith("/tbd") ? (
        <span className="truncate font-medium text-slate-500">{label}</span>
      ) : (
        <Link href={href} className={`truncate hover:underline ${bold ? "font-bold" : "font-medium"}`}>
          {label}
        </Link>
      )}
      {score !== null && <span className="text-lg font-bold tabular-nums">{score}</span>}
    </div>
  );
}
