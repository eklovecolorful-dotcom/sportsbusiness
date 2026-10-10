import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicChips } from "@/components/topic-chips";
import { LEAGUES } from "@/lib/catalog";
import { TOPICS, casesByTopic, topicBySlug } from "@/lib/business";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/business/topics/[topic]">): Promise<Metadata> {
  const t = topicBySlug((await params).topic);
  return t ? { title: `${t.id}｜產業商業`, description: t.blurb } : { title: "產業商業" };
}

export default async function TopicPage({ params }: PageProps<"/business/topics/[topic]">) {
  const topic = topicBySlug((await params).topic);
  if (!topic) notFound();
  const cases = casesByTopic(topic.id);

  return (
    <div className="space-y-8">
      <nav className="text-sm">
        <Link href="/business" className="text-slate-500 hover:underline">
          ← 產業商業
        </Link>
      </nav>
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Topic</p>
        <h1 className="mt-1 text-3xl font-black">{topic.id}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{topic.blurb}</p>
      </header>

      <TopicChips active={topic.slug} />

      {cases.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">這個主題的個案分析整理中。</p>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/business/cases/${c.slug}`}
                className="block rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <p className="flex items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${LEAGUES.find((l) => l.id === c.league)?.chip ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {c.league === "ALL" ? "三大聯盟" : c.league}
                  </span>
                  <span className="ml-auto tabular-nums text-slate-400">{c.date}</span>
                </p>
                <h2 className="mt-2 font-bold leading-snug">{c.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{c.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
