import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type { LeagueId } from "@/lib/catalog";
import { parseFrontmatter } from "@/lib/frontmatter";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

export const INSIGHT_CATEGORIES = ["經營模式", "營運", "商業故事"] as const;
export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export type Insight = {
  slug: string;
  title: string;
  category: InsightCategory;
  league: LeagueId | "ALL";
  excerpt: string;
  publishedAt: string;
  body: string;
};

/** Free long-form analysis pieces from content/insights/*.md, newest first. */
export async function getInsights(): Promise<Insight[]> {
  "use cache";
  cacheTag("insights");
  cacheLife("hours");

  const files = await fs.readdir(CONTENT_DIR).catch(() => [] as string[]);
  const insights = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (f): Promise<Insight> => {
        const { meta, body } = parseFrontmatter(await fs.readFile(path.join(CONTENT_DIR, f), "utf8"));
        return {
          slug: f.replace(/\.md$/, ""),
          title: meta.title ?? f,
          category: (INSIGHT_CATEGORIES as readonly string[]).includes(meta.category)
            ? (meta.category as InsightCategory)
            : "經營模式",
          league: (meta.league as LeagueId | "ALL") ?? "ALL",
          excerpt: meta.excerpt ?? "",
          publishedAt: meta.published_at ?? "",
          body,
        };
      }),
  );
  return insights.filter((i) => i.publishedAt).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getInsight(slug: string): Promise<Insight | undefined> {
  return (await getInsights()).find((i) => i.slug === slug);
}
