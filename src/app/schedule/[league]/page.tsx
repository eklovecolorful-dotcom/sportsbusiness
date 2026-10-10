import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DataSourceNotice } from "@/components/data-source-notice";
import { GameCard } from "@/components/game-card";
import { KeyDates } from "@/components/key-dates";
import { LeagueTabs } from "@/components/league-tabs";
import { LEAGUES, leagueBySlug } from "@/lib/catalog";
import { getGamesForTaipeiDate, getTaipeiToday, shiftDate } from "@/lib/data/games";
import { scheduleSource } from "@/lib/sports-data/provider";
import { taipeiDayLabel } from "@/lib/time";

export function generateStaticParams() {
  return LEAGUES.map((l) => ({ league: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/schedule/[league]">): Promise<Metadata> {
  const league = leagueBySlug((await params).league);
  return { title: league ? `${league.name} 台灣時間賽程` : "賽程" };
}

export default async function SchedulePage({ params, searchParams }: PageProps<"/schedule/[league]">) {
  const league = leagueBySlug((await params).league);
  if (!league) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">
          {league.name} 賽程 <span className="text-base font-medium text-slate-500">{league.nameZh}</span>
        </h1>
        <p className="text-sm text-slate-500">
          {league.season} · 所有時間皆為台灣時間（UTC+8）·{" "}
          <Link href={`/leagues/${league.slug}`} className="underline">
            {league.name} 入門
          </Link>
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-slate-500">載入賽程中…</p>}>
        <DaySchedule leagueId={league.id} leagueSlug={league.slug} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DaySchedule({
  leagueId,
  leagueSlug,
  searchParams,
}: {
  leagueId: (typeof LEAGUES)[number]["id"];
  leagueSlug: string;
  searchParams: PageProps<"/schedule/[league]">["searchParams"];
}) {
  const { date } = await searchParams;
  const today = await getTaipeiToday();
  const day = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today;
  const games = await getGamesForTaipeiDate(day, leagueId);
  const source = scheduleSource();

  return (
    <section className="space-y-4">
      <LeagueTabs active={leagueId} date={day === today ? undefined : day} />
      <div className="flex items-center justify-between rounded-2xl bg-white p-2">
        <DayLink slug={leagueSlug} date={shiftDate(day, -1)} label="← 前一天" />
        <p className="font-semibold">
          {taipeiDayLabel(`${day}T12:00:00+08:00`)}
          {day === today && <span className="ml-2 text-xs text-rose-600">今天</span>}
        </p>
        <DayLink slug={leagueSlug} date={shiftDate(day, 1)} label="後一天 →" />
      </div>

      <DataSourceNotice source={source} />
      {games.length > 0 && <SourceLabel games={games} />}
      {games.length === 0 ? (
        source === "live" ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">這一天沒有 {leagueId} 比賽。</p>
        ) : (
          <KeyDates fromDate={day} league={leagueId} />
        )
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </section>
  );
}

function SourceLabel({ games }: { games: { source: string }[] }) {
  if (!games.some((g) => g.source === "espn")) return null;
  return <p className="text-xs text-slate-400">資料來源：ESPN（開發預覽，非商用授權資料）</p>;
}

function DayLink({ slug, date, label }: { slug: string; date: string; label: string }) {
  return (
    <Link href={`/schedule/${slug}?date=${date}`} className="rounded-full px-3 py-1 text-sm text-slate-600 hover:bg-slate-100">
      {label}
    </Link>
  );
}
