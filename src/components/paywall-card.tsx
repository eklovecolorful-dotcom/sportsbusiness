import Link from "next/link";

/** P4 core component: shown in place of a premium body. */
export function PaywallCard({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">付費週報 Premium</p>
      <h3 className="mt-2 text-xl font-bold">訂閱解鎖全文</h3>
      <p className="mt-2 text-sm text-slate-300">
        每週 5 分鐘：發生什麼 → 錢怎麼流 → 對球迷的影響。每個數字都附來源。
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/pricing" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
          查看方案
        </Link>
        {!signedIn && (
          <Link href="/login" className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold hover:bg-white/10">
            已訂閱？登入
          </Link>
        )}
      </div>
    </div>
  );
}
