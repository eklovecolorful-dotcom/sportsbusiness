import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { PaywallCard } from "@/components/paywall-card";
import { getCurrentUser } from "@/lib/auth";
import { getBrief, getBriefBody, getBriefs } from "@/lib/data/briefs";

export async function generateStaticParams() {
  const slugs = (await getBriefs()).map((b) => b.slug);
  // Cache Components rejects an empty list (e.g. no brief published yet); the placeholder just 404s.
  return (slugs.length > 0 ? slugs : ["latest"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/brief/[slug]">): Promise<Metadata> {
  const brief = await getBrief((await params).slug);
  return brief ? { title: brief.title, description: brief.excerpt } : { title: "週報" };
}

export default async function BriefPage({ params }: PageProps<"/brief/[slug]">) {
  const { slug } = await params;
  const brief = await getBrief(slug);
  if (!brief) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs text-slate-500">第 {brief.slug} 週 · 運動商業週報</p>
        <h1 className="mt-1 text-2xl font-black leading-snug">{brief.title}</h1>
        <p className="mt-3 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-900">{brief.takeaway}</p>
      </header>

      {/* Body depends on the visitor's entitlement (cookies) → streams in. */}
      <Suspense fallback={<p className="text-sm text-slate-500">載入內文…</p>}>
        <BriefBody slug={slug} excerpt={brief.excerpt} />
      </Suspense>
    </article>
  );
}

async function BriefBody({ slug, excerpt }: { slug: string; excerpt: string }) {
  const [body, user] = await Promise.all([getBriefBody(slug), getCurrentUser()]);
  if (body) return <Markdown source={body} />;
  return (
    <div className="space-y-6">
      <p className="text-slate-700">{excerpt}</p>
      <PaywallCard signedIn={Boolean(user)} />
    </div>
  );
}
