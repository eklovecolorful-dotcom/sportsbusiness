import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser, getMySubscription, isActive } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/env";
import { PLANS, type PlanKey } from "@/lib/stripe";

export const metadata: Metadata = { title: "訂閱方案" };

const FEATURES = [
  "每週 5 分鐘運動商業懶人包（中文為主、英文對照）",
  "三則商業新聞：發生什麼 → 錢怎麼流 → 對球迷的影響",
  "下週重要賽事與台灣時間行事曆",
  "所有數字附原始來源連結",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black">運動商業週報</h1>
        <p className="mt-2 text-slate-500">看懂比分背後的錢。隨時可取消。</p>
      </div>

      <ul className="mx-auto max-w-md space-y-2 text-sm">
        {FEATURES.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-emerald-600">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <div className="grid gap-4 sm:grid-cols-2">
        {(Object.keys(PLANS) as PlanKey[]).map((key) => (
          <div key={key} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-500">{PLANS[key].label}</p>
            {/* Display price is a placeholder — keep in sync with the Stripe Price. */}
            <p className="mt-2 text-3xl font-black">{PLANS[key].price}</p>
            <Suspense fallback={<div className="mt-6 h-10" />}>
              <PlanAction plan={key} />
            </Suspense>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400">
        付款由 Stripe 安全處理。付款失敗時仍可繼續閱讀免費版內容。詳見訂閱退款政策。
      </p>
    </div>
  );
}

async function PlanAction({ plan }: { plan: PlanKey }) {
  if (!isStripeConfigured()) {
    return <p className="mt-6 rounded-full bg-slate-100 py-2 text-center text-sm text-slate-500">尚未設定 Stripe（開發模式）</p>;
  }
  const user = await getCurrentUser();
  if (!user) {
    return (
      <a href="/login?next=/pricing" className="mt-6 block rounded-full bg-slate-900 py-2 text-center text-sm font-semibold text-white">
        登入後訂閱
      </a>
    );
  }
  if (isActive(await getMySubscription())) {
    return (
      <form action="/api/stripe/portal" method="post" className="mt-6">
        <button className="w-full rounded-full border border-slate-300 py-2 text-sm font-semibold">管理訂閱</button>
      </form>
    );
  }
  return (
    <form action="/api/stripe/checkout" method="post" className="mt-6">
      <input type="hidden" name="plan" value={plan} />
      <button className="w-full rounded-full bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700">
        訂閱
      </button>
    </form>
  );
}
