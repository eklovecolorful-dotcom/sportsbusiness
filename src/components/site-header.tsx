import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";

const NAV = [
  { href: "/schedule/mlb", label: "賽程" },
  { href: "/teams", label: "球隊" },
  { href: "/calendar", label: "重要日期" },
  { href: "/business", label: "產業商業" },
  { href: "/insights", label: "深度分析" },
  { href: "/brief", label: "商業週報" },
  { href: "/trips", label: "觀賽旅遊" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-black tracking-tight">
          Sports<span className="text-rose-600">.</span>
          <span className="ml-1 hidden text-xs font-medium text-slate-500 sm:inline">台灣時間 × 運動商業</span>
        </Link>
        <Suspense fallback={<span className="h-8 w-14" />}>
          <AccountLink />
        </Suspense>
      </div>
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2 text-sm">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3 py-1 text-slate-700 hover:bg-slate-100">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

async function AccountLink() {
  const user = await getCurrentUser();
  return (
    <Link
      href={user ? "/account" : "/login"}
      className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-50"
    >
      {user ? "我的帳號" : "登入"}
    </Link>
  );
}
