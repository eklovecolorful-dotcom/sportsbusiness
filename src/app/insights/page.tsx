import type { Metadata } from "next";
import Link from "next/link";
import { LEAGUES } from "@/lib/catalog";
import { INSIGHT_CATEGORIES, getInsights } from "@/lib/data/insights";

export const metadata: Metadata = {
  title: "深度分析",
  description: "職業運動延伸出的產業經營、營運模式與商業故事：拆解背後的錢怎麼流，並提出本站觀點。",
};

const CATEGORY_BLURB: Record<(typeof INSIGHT_CATEGORIES)[number], string> = {
  經營模式: "聯盟與球隊怎麼賺錢：收入分享、薪資制度、估值與資本。",
  營運: "轉播、票務、場館與數據：讓比賽變成生意的日常運作。",
  商業故事: "具體球隊、老闆與交易背後的商業案例。",
};

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Analysis</p>
        <h1 className="mt-1 text-3xl font-black">深度分析</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          從職業運動延伸出的產業經營、營運模式與商業故事。每篇都拆成：怎麼運作 → 錢怎麼流 → 本站觀點。事實附來源；「本站觀點」為編輯評論。
        </p>
      </header>

      {INSIGHT_CATEGORIES.map((cat) => {
        const items = insights.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="text-xl font-bold">{cat}</h2>
            <p className="mb-4 text-sm text-slate-500">{CATEGORY_BLURB[cat]}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((i) => (
                <Link
                  key={i.slug}
                  href={`/insights/${i.slug}`}
                  className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${LEAGUES.find((l) => l.id === i.league)?.chip ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {i.league === "ALL" ? "三大聯盟" : i.league}
                    </span>
                    <span className="ml-auto tabular-nums text-slate-400">{i.publishedAt}</span>
                  </p>
                  <h3 className="mt-2 font-bold leading-snug">{i.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{i.excerpt}</p>
                  <span className="mt-3 text-sm font-semibold">閱讀全文 →</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
