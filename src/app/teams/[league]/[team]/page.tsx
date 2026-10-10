import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GameCard } from "@/components/game-card";
import { TEAMS, leagueBySlug } from "@/lib/catalog";
import { getTaipeiToday, getUpcomingTeamGames } from "@/lib/data/games";
import { scheduleSource } from "@/lib/sports-data/provider";

// ISR (P5 /gen-team-pages): every team page is prerendered at build time for SEO.
export function generateStaticParams() {
  return TEAMS.map((t) => ({ league: t.leagueId.toLowerCase(), team: t.abbr.toLowerCase() }));
}

function findTeam(leagueSlug: string, abbr: string) {
  const league = leagueBySlug(leagueSlug);
  const team = league && TEAMS.find((t) => t.leagueId === league.id && t.abbr.toLowerCase() === abbr.toLowerCase());
  return league && team ? { league, team } : null;
}

export async function generateMetadata({ params }: PageProps<"/teams/[league]/[team]">): Promise<Metadata> {
  const { league, team } = await params;
  const found = findTeam(league, team);
  if (!found) return { title: "球隊" };
  return {
    title: `${found.team.nameZh} ${found.team.name} 台灣時間賽程`,
    description: `${found.team.nameZh}（${found.league.name}）近期賽程（台灣時間）與商業分析。`,
  };
}

export default async function TeamPage({ params }: PageProps<"/teams/[league]/[team]">) {
  const { league: leagueSlug, team: abbr } = await params;
  const found = findTeam(leagueSlug, abbr);
  if (!found) notFound();
  const { league, team } = found;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        {/* Neutral text chip instead of a team logo (P4 / IP red line). */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-lg font-black text-white">
          {team.abbr}
        </div>
        <div>
          <p className="text-xs text-slate-500">
            <span className={`mr-2 rounded-full px-2 py-0.5 font-semibold ${league.chip}`}>{league.name}</span>
            {team.city}
          </p>
          <h1 className="text-2xl font-black">{team.nameZh}</h1>
          <p className="text-sm text-slate-500">{team.name}</p>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-bold">未來 7 天賽程（台灣時間）</h2>
        <Suspense fallback={<p className="text-sm text-slate-500">載入賽程中…</p>}>
          <UpcomingGames teamId={team.id} />
        </Suspense>
      </section>

      <nav className="text-sm">
        <p className="mb-2 font-semibold">其他 {league.name} 球隊</p>
        <div className="flex flex-wrap gap-2">
          {TEAMS.filter((t) => t.leagueId === league.id && t.id !== team.id).map((t) => (
            <Link
              key={t.id}
              href={`/teams/${league.slug}/${t.abbr.toLowerCase()}`}
              className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {t.nameZh}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

async function UpcomingGames({ teamId }: { teamId: string }) {
  const today = await getTaipeiToday();
  const games = await getUpcomingTeamGames(teamId, today);
  if (games.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">
        {scheduleSource() === "live" ? "未來 7 天沒有比賽（可能為休賽季）。" : "即時賽程尚未連線（授權資料源接上後顯示）。"}
      </p>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {games.map((g) => (
        <GameCard key={g.id} game={g} highlightTeamId={teamId} />
      ))}
    </div>
  );
}
