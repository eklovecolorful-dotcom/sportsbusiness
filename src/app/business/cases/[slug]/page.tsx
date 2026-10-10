import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEAGUES } from "@/lib/catalog";
import { CASES, caseBySlug, topicSlug } from "@/lib/business";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/business/cases/[slug]">): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  return c ? { title: c.title, description: c.summary } : { title: "個案分析" };
}

export default async function CasePage({ params }: PageProps<"/business/cases/[slug]">) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const chip = LEAGUES.find((l) => l.id === c.league)?.chip ?? "bg-slate-100 text-slate-700";
  const related = CASES.filter((x) => x.slug !== c.slug && (x.league === c.league || x.topic === c.topic)).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <nav className="text-sm">
        <Link href="/business" className="text-slate-500 hover:underline">
          ← 產業商業
        </Link>
      </nav>

      <header>
        <p className="flex items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-semibold ${chip}`}>{c.league === "ALL" ? "三大聯盟" : c.league}</span>
          <Link href={`/business/topics/${topicSlug(c.topic)}`} className="font-semibold text-rose-600 hover:underline">
            {c.topic}
          </Link>
          <span className="tabular-nums text-slate-400">最新進展 {c.date}</span>
        </p>
        <h1 className="mt-2 text-2xl font-black leading-snug">{c.title}</h1>
        <p className="mt-3 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-900">{c.summary}</p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-bold">發生什麼：關鍵事實</h2>
        <ul className="space-y-3">
          {c.facts.map((f) => (
            <li key={f.text} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p>{f.text}</p>
              <a href={f.source.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-sky-700 underline">
                來源：{f.source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Section title="錢怎麼流：商業分析" items={c.money} />
      <Section title="對球迷與台灣的影響" items={c.fanImpact} />
      <Section title="接下來要看什麼" items={c.watch} />

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">相關個案</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/business/cases/${r.slug}`} className="font-medium hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-slate-400">
        營收、估值與交易金額為公開報導之估算，非經審計財報；本站不提供投資建議，亦不提供賠率或博弈連結。
      </p>
    </article>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <ul className="list-disc space-y-2 pl-5 text-slate-800">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}
