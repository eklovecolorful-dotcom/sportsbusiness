import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser, getMySubscription, isActive } from "@/lib/auth";
import { signOut } from "../login/actions";

export const metadata: Metadata = { title: "我的帳號" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-black">我的帳號</h1>
      <Suspense fallback={<p className="text-sm text-slate-500">載入中…</p>}>
        <AccountDetails />
      </Suspense>
    </div>
  );
}

async function AccountDetails() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const sub = await getMySubscription();
  const active = isActive(sub);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <p className="text-xs text-slate-500">Email</p>
        <p className="font-semibold">{user.email}</p>
      </div>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <p className="text-xs text-slate-500">運動商業週報</p>
        {active ? (
          <>
            <p className="font-semibold text-emerald-700">付費訂閱中</p>
            {sub?.currentPeriodEnd && (
              <p className="text-sm text-slate-500">
                {sub.cancelAtPeriodEnd ? "將於" : "下次扣款"} {sub.currentPeriodEnd.slice(0, 10)}
                {sub.cancelAtPeriodEnd && " 到期"}
              </p>
            )}
            <form action="/api/stripe/portal" method="post" className="mt-3">
              <button className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold">管理訂閱</button>
            </form>
          </>
        ) : (
          <>
            <p className="font-semibold">免費版{sub?.status === "past_due" && "（付款失敗，請更新付款方式）"}</p>
            <Link href="/pricing" className="mt-3 inline-block rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white">
              升級付費週報
            </Link>
          </>
        )}
      </div>

      <form action={signOut}>
        <button className="text-sm text-slate-500 hover:underline">登出</button>
      </form>
    </div>
  );
}
