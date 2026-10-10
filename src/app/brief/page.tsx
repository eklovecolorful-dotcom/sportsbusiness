import type { Metadata } from "next";
import Link from "next/link";
import { getBriefs } from "@/lib/data/briefs";

export const metadata: Metadata = {
  title: "運動商業週報",
  description: "每週 5 分鐘：發生什麼 → 錢怎麼流 → 對球迷的影響。",
};

export default async function BriefIndex() {
  const briefs = await getBriefs();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">運動商業週報</h1>
        <p className="text-sm text-slate-500">每週 5 分鐘：發生什麼 → 錢怎麼流 → 對球迷的影響。所有數字附來源。</p>
      </div>
      <ul className="space-y-3">
        {briefs.map((b) => (
          <li key={b.slug}>
            <Link href={`/brief/${b.slug}`} className="block rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:bg-slate-50">
              <p className="text-xs text-slate-500">
                第 {b.slug} 週
                {b.isPremium ? (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">付費</span>
                ) : (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">免費</span>
                )}
              </p>
              <h2 className="mt-1 text-lg font-bold">{b.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{b.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
