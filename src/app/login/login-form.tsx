"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendMagicLink, null);

  if (state?.sent) {
    return <p className="rounded-2xl bg-emerald-50 p-6 text-emerald-900">登入連結已寄出，請到信箱點擊連結完成登入。</p>;
  }

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-1">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {pending ? "寄送中…" : "寄送登入連結"}
      </button>
    </form>
  );
}
