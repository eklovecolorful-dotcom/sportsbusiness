// Publishes content/brief/<slug>.md to Supabase (briefs + brief_bodies).
// Run ONLY after human fact-check (P5 /weekly-biz-brief → review → publish).
// Usage: node --env-file=.env.local scripts/publish-brief.mjs 2026-41
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const slug = process.argv[2];
if (!slug) throw new Error("Usage: publish-brief.mjs <slug>");

const raw = readFileSync(new URL(`../content/brief/${slug}.md`, import.meta.url), "utf8");
const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
if (!m) throw new Error("Missing frontmatter");
const meta = Object.fromEntries(
  m[1].split("\n").filter((l) => l.includes(":")).map((l) => {
    const i = l.indexOf(":");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"(.*)"$/, "$1")];
  }),
);
if (/\[待查證\]/.test(m[2]) && !process.argv.includes("--force")) {
  throw new Error("Brief still contains [待查證] markers. Verify them or pass --force.");
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const { error: e1 } = await supabase.from("briefs").upsert({
  slug,
  title: meta.title,
  takeaway: meta.takeaway ?? "",
  excerpt: meta.excerpt ?? "",
  is_premium: meta.premium !== "false",
  published_at: meta.published_at || new Date().toISOString(),
});
if (e1) throw e1;
const { error: e2 } = await supabase.from("brief_bodies").upsert({ slug, body: m[2] });
if (e2) throw e2;
console.log(`Published brief ${slug}`);
