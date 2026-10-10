import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured } from "@/lib/env";
import { parseFrontmatter } from "@/lib/frontmatter";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Brief } from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "brief");

export function parseBriefFile(slug: string, raw: string): Brief & { body: string } {
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: meta.title ?? slug,
    takeaway: meta.takeaway ?? "",
    excerpt: meta.excerpt ?? "",
    isPremium: meta.premium !== "false",
    publishedAt: meta.published_at ?? "",
    body,
  };
}

async function readLocalBriefs() {
  const files = await fs.readdir(CONTENT_DIR).catch(() => [] as string[]);
  const briefs = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (f) => parseBriefFile(f.replace(/\.md$/, ""), await fs.readFile(path.join(CONTENT_DIR, f), "utf8"))),
  );
  return briefs.filter((b) => b.publishedAt).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBriefs(): Promise<Brief[]> {
  "use cache";
  cacheTag("briefs");
  cacheLife("hours");

  if (!isSupabaseConfigured()) {
    return (await readLocalBriefs()).map(({ slug, title, takeaway, excerpt, isPremium, publishedAt }) => ({
      slug,
      title,
      takeaway,
      excerpt,
      isPremium,
      publishedAt,
    }));
  }

  const { data, error } = await createPublicClient()
    .from("briefs")
    .select("slug, title, takeaway, excerpt, is_premium, published_at")
    .order("published_at", { ascending: false });
  if (error) throw new Error(`briefs query failed: ${error.message}`);

  return data.map((r) => ({
    slug: r.slug,
    title: r.title,
    takeaway: r.takeaway,
    excerpt: r.excerpt,
    isPremium: r.is_premium,
    publishedAt: r.published_at,
  }));
}

export async function getBrief(slug: string): Promise<Brief | undefined> {
  return (await getBriefs()).find((b) => b.slug === slug);
}

/**
 * Full body, or null when the visitor is not entitled. In Supabase mode the
 * decision is made by RLS ("brief body by entitlement"), not by this code.
 * Reads cookies → render behind <Suspense>.
 */
export async function getBriefBody(slug: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    const brief = (await readLocalBriefs()).find((b) => b.slug === slug);
    return brief && !brief.isPremium ? brief.body : null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("brief_bodies").select("body").eq("slug", slug).maybeSingle();
  return data?.body ?? null;
}
