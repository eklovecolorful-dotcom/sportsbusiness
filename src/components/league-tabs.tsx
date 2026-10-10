import Link from "next/link";
import { LEAGUES, type LeagueId } from "@/lib/catalog";

/** Switches league while keeping the selected day (?date=). */
export function LeagueTabs({ active, date }: { active?: LeagueId; date?: string }) {
  const query = date ? `?date=${date}` : "";
  return (
    <div className="flex gap-2">
      {LEAGUES.map((l) => (
        <Link
          key={l.id}
          href={`/schedule/${l.slug}${query}`}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            active === l.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {l.name}
        </Link>
      ))}
    </div>
  );
}
