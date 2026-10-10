import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { LEAGUES } from "@/lib/catalog";
import { getInsight, getInsights } from "@/lib/data/insights";

export async function generateStaticParams() {
  return (await getInsights()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const insight = await getInsight((await params).slug);
  return insight ? { title: insight.title, description: insight.excerpt } : { title: "深度分析" };
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();
  const chip = LEAGUES.find((l) => l.id === insight.league)?.chip ?? "bg-slate-100 text-slate-700";
  const related = (await getInsights()).filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <nav className="text-sm">
        <Link href="/insights" className="text-slate-500 hover:underline">
          ← 深度分析
        </Link>
      </nav>

      <header>
        <p className="flex items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-semibold ${chip}`}>
            {insight.league === "ALL" ? "三大聯盟" : insight.league}
          </span>
          <span className="font-semibold text-rose-600">{insight.category}</span>
          <span className="tabular-nums text-slate-400">{insight.publishedAt}</span>
        </p>
        <h1 className="mt-2 text-2xl font-black leading-snug">{insight.title}</h1>
        <p className="mt-3 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-900">{insight.excerpt}</p>
      </header>

      <Markdown source={insight.body} />

      <p className="text-xs text-slate-400">
        營收與估值為公開報導之估算，非經審計財報。「本站觀點」為編輯評論，不構成投資建議。
      </p>

      <section className="rounded-3xl bg-slate-900 p-6 text-white">
        <h2 className="text-lg font-bold">每週 5 分鐘，看懂比分背後的錢</h2>
        <p className="mt-2 text-sm text-slate-300">商業週報每週整理最新交易、轉播與勞資動態。</p>
        <Link href="/brief" className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900">
          閱讀週報
        </Link>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">更多深度分析</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/insights/${r.slug}`} className="font-medium hover:underline">
                  <span className="mr-2 text-xs font-semibold text-rose-600">{r.category}</span>
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
