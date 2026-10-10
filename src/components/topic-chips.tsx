import Link from "next/link";
import { TOPICS } from "@/lib/business";

/** SBJ-style topic channels for the business section. */
export function TopicChips({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {TOPICS.map((t) => (
        <Link
          key={t.slug}
          href={`/business/topics/${t.slug}`}
          className={`rounded-full px-3 py-1 font-semibold ${
            active === t.slug ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {t.id}
        </Link>
      ))}
    </nav>
  );
}
