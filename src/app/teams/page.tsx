import type { Metadata } from "next";
import Link from "next/link";
import { LEAGUES, teamsByLeague } from "@/lib/catalog";

export const metadata: Metadata = { title: "球隊列表" };

export default function TeamsIndex() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black">球隊列表</h1>
      {LEAGUES.map((l) => (
        <section key={l.id}>
          <h2 className="mb-3 flex items-baseline gap-2 text-lg font-bold">
            {l.name} <span className="text-sm font-medium text-slate-500">{l.nameZh}</span>
            <Link href={`/leagues/${l.slug}`} className="ml-auto text-sm font-normal text-slate-500 hover:underline">
              聯盟入門 →
            </Link>
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {teamsByLeague(l.id).map((t) => (
              <Link
                key={t.id}
                href={`/teams/${l.slug}/${t.abbr.toLowerCase()}`}
                className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <span className="font-semibold">{t.nameZh}</span>
                <span className="block text-xs text-slate-500">{t.abbr}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
