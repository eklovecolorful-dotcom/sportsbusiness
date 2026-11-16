// Waitlist stats → P1 behavioural evidence + 90-day metric (docs/02-strategy.md §7).
// Prints aggregates only (no emails). Paste the output into docs/evidence/waitlist.md.
// Usage: npm run waitlist:stats
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local");

const db = createClient(url, key, { auth: { persistSession: false } });
const rows = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await db
    .from("waitlist_signups")
    .select("willing_to_pay, interests, utm_source, utm_campaign, created_at")
    .is("unsubscribed_at", null)
    .range(from, from + 999);
  if (error) throw error;
  rows.push(...data);
  if (data.length < 1000) break;
}

const count = (f) => rows.reduce((m, r) => [f(r)].flat().reduce((mm, k) => ((mm[k ?? "(direct)"] = (mm[k ?? "(direct)"] ?? 0) + 1), mm), m), {});
const paying = rows.filter((r) => r.willing_to_pay === "monthly_150" || r.willing_to_pay === "yearly_1500").length;
const table = (title, obj) =>
  [`\n### ${title}`, "| 項目 | 人數 |", "|---|---|", ...Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`)].join("\n");

console.log(`## Waitlist ${new Date().toISOString().slice(0, 10)}

- 名單（未退出）：**${rows.length}** / 500（90 天主指標）
- 願意付 NT$150／月或 NT$1,500／年：**${paying}** / 30（次指標）
- P1 行為證據：${rows.length >= 50 ? "✅ 已達 50 人（30 分）" : `❌ ${rows.length} / 50`}
- 金流決策點：${rows.length >= 100 ? "✅ 已破 100，該決定 TapPay／藍新或海外 Stripe" : `${rows.length} / 100`}`);
console.log(table("付費意願", count((r) => r.willing_to_pay)));
console.log(table("興趣", count((r) => r.interests)));
console.log(table("來源 utm_source", count((r) => r.utm_source)));
console.log(table("活動 utm_campaign", count((r) => r.utm_campaign)));
