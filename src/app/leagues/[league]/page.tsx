import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { KeyDates } from "@/components/key-dates";
import { CASES, LATEST_NEWS, LEAGUE_COMPARISON } from "@/lib/business";
import { LEAGUES, leagueBySlug, teamsByLeague, type LeagueId } from "@/lib/catalog";
import { getTaipeiToday } from "@/lib/data/games";
import { LEAGUE_GUIDES } from "@/lib/leagues";

export function generateStaticParams() {
  return LEAGUES.map((l) => ({ league: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/leagues/[league]">): Promise<Metadata> {
  const league = leagueBySlug((await params).league);
  return league
    ? { title: `${league.name} 聯盟入門`, description: `${league.nameZh}（${league.name}）賽制、季後賽、薪資制度、重要日期與商業動態。` }
    : { title: "聯盟入門" };
}

export default async function LeaguePage({ params }: PageProps<"/leagues/[league]">) {
  const league = leagueBySlug((await params).league);
  if (!league) notFound();
  const guide = LEAGUE_GUIDES[league.id];
  const cases = CASES.filter((c) => c.league === league.id || c.league === "ALL");
  const news = LATEST_NEWS.filter((n) => n.league === league.id || n.league === "ALL");

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-slate-900 px-6 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-300">{league.name}</p>
        <h1 className="mt-2 text-3xl font-black">{league.nameZh}入門</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-300">{guide.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/schedule/${league.slug}`} className="rounded-full bg-white px-5 py-2 text-slate-900">
            台灣時間賽程
          </Link>
          <Link href="#teams" className="rounded-full border border-white/40 px-5 py-2">
            {teamsByLeague(league.id).length} 支球隊
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Fact title="賽季" body={league.season} />
        <Fact title="聯盟結構" body={guide.structure} />
        <Fact title="季後賽" body={guide.postseason} source={guide.source} />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">看球小提醒</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {guide.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">制度與商業一覽</h2>
        <dl className="divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
          {LEAGUE_COMPARISON.map((r) => (
            <div key={r.item} className="flex gap-4 p-3 text-sm">
              <dt className="w-20 shrink-0 font-semibold">{r.item}</dt>
              <dd className="text-slate-700">{r[league.id as LeagueId]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-slate-400">
          來源與三大聯盟對照見 <Link href="/business" className="underline">產業商業</Link>。
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">重要日期（美國當地日期）</h2>
        <Suspense fallback={<p className="text-sm text-slate-500">載入中…</p>}>
          <LeagueDates leagueId={league.id} />
        </Suspense>
      </section>

      {(cases.length > 0 || news.length > 0) && (
        <section>
          <h2 className="mb-3 text-xl font-bold">商業動態</h2>
          <ul className="space-y-2">
            {cases.map((c) => (
              <li key={c.slug}>
                <Link href={`/business/cases/${c.slug}`} className="font-medium hover:underline">
                  <span className="mr-2 text-xs font-semibold text-rose-600">{c.topic}</span>
                  {c.title}
                </Link>
              </li>
            ))}
            {news.map((n) => (
              <li key={n.title} className="text-sm">
                <span className="mr-2 tabular-nums text-slate-500">{n.date}</span>
                {n.title}
                <a href={n.source.url} target="_blank" rel="noreferrer" className="ml-2 text-xs text-slate-400 underline">
                  {n.source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="teams">
        <h2 className="mb-3 text-xl font-bold">球隊</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {teamsByLeague(league.id).map((t) => (
            <Link
              key={t.id}
              href={`/teams/${league.slug}/${t.abbr.toLowerCase()}`}
              className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <span className="font-semibold">{t.nameZh}</span>
              <span className="block text-xs text-slate-500">{t.abbr}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

async function LeagueDates({ leagueId }: { leagueId: LeagueId }) {
  const today = await getTaipeiToday();
  return <KeyDates fromDate={today} league={leagueId} limit={10} />;
}

function Fact({ title, body, source }: { title: string; body: string; source?: { label: string; url: string } }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-xs font-bold text-rose-600">{title}</h2>
      <p className="mt-1 text-sm text-slate-700">{body}</p>
      {source && (
        <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs text-slate-400 underline">
          來源：{source.label}
        </a>
      )}
    </div>
  );
}
