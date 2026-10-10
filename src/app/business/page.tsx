import type { Metadata } from "next";
import Link from "next/link";
import { KeyDates } from "@/components/key-dates";
import { TopicChips } from "@/components/topic-chips";
import { LEAGUES } from "@/lib/catalog";
import {
  BUSINESS_CALENDAR,
  BUSINESS_REVIEWED_AT,
  CASES,
  KPIS,
  LATEST_NEWS,
  LEAGUE_COMPARISON,
  REVENUE_ENGINES,
} from "@/lib/business";

export const metadata: Metadata = {
  title: "三大職業運動產業商業",
  description: "NFL、NBA、MLB 的營收、轉播權、薪資制度、球隊估值與交易、勞資談判、擴編與國際化：個案分析與最新動態。",
};

const leagueChip = (id: string) => LEAGUES.find((l) => l.id === id)?.chip ?? "bg-slate-100 text-slate-700";

export default function BusinessPage() {
  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Sports Business</p>
        <h1 className="mt-1 text-3xl font-black">三大職業運動產業商業</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          比分背後的錢：轉播權、薪資制度、球隊估值、勞資談判與擴編。所有數字皆附來源；營收與估值為公開報導之估算，非經審計財報。
        </p>
        <p className="mt-1 text-xs text-slate-400">資料更新：{BUSINESS_REVIEWED_AT}</p>
        <div className="mt-4">
          <TopicChips />
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-slate-900 p-4 text-white">
            <p className="text-2xl font-black tabular-nums">{k.value}</p>
            <p className="mt-1 text-xs text-slate-300">{k.label}</p>
            <a href={k.source.url} target="_blank" rel="noreferrer" className="mt-2 block text-[10px] text-slate-400 underline">
              {k.source.label}
            </a>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">最新商業動態</h2>
        <ul className="divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
          {LATEST_NEWS.map((n) => (
            <li key={n.title} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="w-24 shrink-0 text-xs tabular-nums text-slate-500">{n.date}</span>
              <span className="flex-1">
                <span className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${leagueChip(n.league)}`}>{n.league}</span>
                <span className="font-medium">{n.title}</span>
              </span>
              <a href={n.source.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 underline">
                {n.source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">個案分析</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={`/business/cases/${c.slug}`}
              className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${leagueChip(c.league)}`}>
                  {c.league === "ALL" ? "三大聯盟" : c.league}
                </span>
                <span className="font-semibold text-rose-600">{c.topic}</span>
                <span className="ml-auto tabular-nums text-slate-400">{c.date}</span>
              </p>
              <h3 className="mt-2 font-bold leading-snug">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">{c.summary}</p>
              <span className="mt-3 text-sm font-semibold">閱讀分析 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">聯盟比較總表</h2>
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3">項目</th>
                <th className="p-3">NFL</th>
                <th className="p-3">NBA</th>
                <th className="p-3">MLB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 align-top">
              {LEAGUE_COMPARISON.map((r) => (
                <tr key={r.item}>
                  <th className="whitespace-nowrap p-3 font-semibold">{r.item}</th>
                  <td className="p-3">{r.NFL}</td>
                  <td className="p-3">{r.NBA}</td>
                  <td className="p-3">{r.MLB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          來源：
          <a className="underline" href="https://www.nfl.com/news/nfl-salary-cap" target="_blank" rel="noreferrer">NFL.com</a>、
          <a className="underline" href="https://bleacherreport.com/articles/25448479-2026-27-nba-salary-cap-1st-and-2nd-aprons-luxury-tax-levels-revealed-fa" target="_blank" rel="noreferrer">Bleacher Report</a>、
          <a className="underline" href="https://www.cbssports.com/mlb/news/mlb-national-tv-broadcast-nbc-espn-netflix-home-run-derby-sunday-night-baseball-opening-night-field-of-dreams" target="_blank" rel="noreferrer">CBS Sports</a>、
          <a className="underline" href="https://www.nbcnewyork.com/nba/2026-nba-franchise-valuations/6453102/" target="_blank" rel="noreferrer">CNBC</a>
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">錢從哪裡來：五大收入引擎</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REVENUE_ENGINES.map((e) => (
            <div key={e.name} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h3 className="font-bold">{e.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{e.what}</p>
              <p className="mt-3 text-xs font-semibold text-emerald-700">2026 趨勢：{e.trend}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">近期重要活動（美國當地日期）</h2>
        <KeyDates fromDate={BUSINESS_REVIEWED_AT} limit={20} />
      </section>

      <section>
        <h2 className="mb-4 flex items-baseline justify-between text-xl font-bold">
          全年商業內容行事曆
          <Link href="/calendar" className="text-sm font-normal text-slate-500 hover:underline">
            所有重要日期 →
          </Link>
        </h2>
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="p-3">月份</th>
                <th className="p-3">賽事節點</th>
                <th className="p-3">商業主題</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BUSINESS_CALENDAR.map((r) => (
                <tr key={r.month}>
                  <th className="whitespace-nowrap p-3 font-semibold">{r.month}</th>
                  <td className="p-3">{r.events}</td>
                  <td className="p-3">{r.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-bold">每週 5 分鐘，看懂比分背後的錢</h2>
        <p className="mt-2 text-sm text-slate-300">商業週報把本週新聞拆成：發生什麼 → 錢怎麼流 → 對球迷的影響。</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/brief" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900">
            閱讀週報
          </Link>
          <Link href="/insights" className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold">
            深度分析
          </Link>
        </div>
      </section>
    </div>
  );
}
