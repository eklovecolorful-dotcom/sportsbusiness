import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { KeyDates } from "@/components/key-dates";
import { BUSINESS_CALENDAR } from "@/lib/business";
import { LEAGUES } from "@/lib/catalog";
import { getTaipeiToday } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "重要日期",
  description: "NFL、NBA、MLB 開季、季後賽、冠軍賽、選秀與勞資協議等重要日期，以及全年賽季節奏。",
};

export default function CalendarPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-black">重要日期</h1>
        <p className="mt-1 text-sm text-slate-500">
          三大聯盟的大日子一次看。日期為美國當地日期；開打時間請以各聯盟賽程頁的台灣時間為準。
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-bold">接下來</h2>
        <Suspense fallback={<p className="text-sm text-slate-500">載入中…</p>}>
          <UpcomingDates />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">賽季節奏</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {LEAGUES.map((l) => (
            <Link
              key={l.id}
              href={`/leagues/${l.slug}`}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.chip}`}>{l.name}</span>
              <p className="mt-2 font-semibold">{l.nameZh}</p>
              <p className="mt-1 text-sm text-slate-600">{l.season}</p>
              <span className="mt-3 block text-sm font-semibold">聯盟入門 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">全年商業看點</h2>
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
    </div>
  );
}

async function UpcomingDates() {
  const today = await getTaipeiToday();
  return <KeyDates fromDate={today} limit={50} />;
}
