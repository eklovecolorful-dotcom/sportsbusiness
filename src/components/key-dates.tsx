import { LEAGUES, type LeagueId } from "@/lib/catalog";
import { KEY_DATES } from "@/lib/business";

/** Verified marquee dates from src/lib/business.ts, from `fromDate` onward. */
export function KeyDates({
  fromDate,
  league,
  limit = 6,
}: {
  fromDate: string;
  league?: LeagueId;
  limit?: number;
}) {
  const items = KEY_DATES.filter((d) => d.date >= fromDate && (!league || d.league === league || d.league === "ALL")).slice(
    0,
    limit,
  );
  if (items.length === 0) return null;
  return (
    <ol className="divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
      {items.map((d) => {
        const chip = LEAGUES.find((l) => l.id === d.league)?.chip ?? "bg-slate-100 text-slate-700";
        return (
          <li key={`${d.date}-${d.title}`} className="flex gap-4 p-4">
            <p className="w-14 shrink-0 text-sm font-bold tabular-nums text-slate-900">{d.date.slice(5).replace("-", "/")}</p>
            <div className="min-w-0">
              <p className="font-semibold">
                <span className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${chip}`}>{d.league}</span>
                {d.title}
              </p>
              {d.note && <p className="mt-0.5 text-sm text-slate-500">{d.note}</p>}
              <a href={d.source.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 underline">
                來源：{d.source.label}
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
