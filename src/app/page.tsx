import Link from "next/link";
import { Suspense } from "react";
import { DataSourceNotice } from "@/components/data-source-notice";
import { GameCard } from "@/components/game-card";
import { KeyDates } from "@/components/key-dates";
import { CASES } from "@/lib/business";
import { getBriefs } from "@/lib/data/briefs";
import { getGamesForTaipeiDate, getTaipeiToday } from "@/lib/data/games";
import { scheduleSource } from "@/lib/sports-data/provider";
import { taipeiDayLabel } from "@/lib/time";

const MLB_CBA_EXPIRY = "2026-12-01";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-slate-900 px-6 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-300">NFL · NBA · MLB</p>
        <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
          美國三大職業運動
          <br />
          台灣時間賽程 × 運動商業情報
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-300">
          早上通勤看球不用再換算時差；每週 5 分鐘看懂交易背後的錢。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/schedule/mlb" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900">
            今日賽程
          </Link>
          <Link href="/brief" className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold">
            免費讀週報
          </Link>
        </div>
        <Suspense fallback={null}>
          <CbaCountdown />
        </Suspense>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">今日賽程（台灣時間）</h2>
          <Link href="/schedule/mlb" className="text-sm text-slate-500 hover:underline">
            全部賽程 →
          </Link>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-500">載入賽程中…</p>}>
          <TodayGames />
        </Suspense>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Tier tag="免費" title="台灣時間賽程 + 球隊與聯盟入門" href="/teams" cta="瀏覽球隊" />
        <Tier tag="付費" title="運動商業週報" href="/pricing" cta="查看方案" />
        <Tier tag="高單價" title="美國觀賽旅遊（合法旅行社承辦）" href="/trips" cta="填寫需求" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold">產業商業分析</h2>
          <Link href="/business" className="text-sm text-slate-500 hover:underline">
            進入專區 →
          </Link>
        </div>
        <ul className="mt-4 space-y-2">
          {CASES.slice(0, 4).map((c) => (
            <li key={c.slug}>
              <Link href={`/business/cases/${c.slug}`} className="font-medium hover:underline">
                <span className="mr-2 text-xs font-semibold text-rose-600">{c.topic}</span>
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">最新商業週報</h2>
        <Suspense fallback={null}>
          <LatestBriefs />
        </Suspense>
      </section>
    </div>
  );
}

async function CbaCountdown() {
  const today = await getTaipeiToday();
  const days = Math.ceil((Date.parse(MLB_CBA_EXPIRY) - Date.parse(today)) / 86400000);
  if (days < 0) return null;
  return (
    <p className="mt-6 inline-block rounded-full bg-amber-400/15 px-4 py-1.5 text-xs font-semibold text-amber-200">
      MLB 勞資協議 12/1 到期：倒數 {days} 天
    </p>
  );
}

async function TodayGames() {
  const today = await getTaipeiToday();
  const games = await getGamesForTaipeiDate(today);
  const source = scheduleSource();
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">{taipeiDayLabel(`${today}T12:00:00+08:00`)}</p>
      <DataSourceNotice source={source} />
      {games.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.slice(0, 9).map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      ) : source === "live" ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">今天沒有比賽。</p>
      ) : null}
      <div>
        <h3 className="mb-2 font-bold">近期重要賽事（美國當地日期）</h3>
        <KeyDates fromDate={today} />
      </div>
    </div>
  );
}

async function LatestBriefs() {
  const briefs = (await getBriefs()).slice(0, 3);
  return (
    <ul className="divide-y divide-slate-200 rounded-2xl bg-white">
      {briefs.map((b) => (
        <li key={b.slug}>
          <Link href={`/brief/${b.slug}`} className="block p-4 hover:bg-slate-50">
            <p className="text-xs text-slate-500">
              {b.slug} {b.isPremium && <span className="ml-1 font-semibold text-amber-700">付費</span>}
            </p>
            <p className="font-semibold">{b.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Tier({ tag, title, href, cta }: { tag: string; title: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <span className="text-xs font-bold text-rose-600">{tag}</span>
      <p className="mt-1 flex-1 font-semibold">{title}</p>
      <Link href={href} className="mt-4 text-sm font-semibold text-slate-900 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}
