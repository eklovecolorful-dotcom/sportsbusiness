"use client";

import { useActionState } from "react";
import { submitTripInquiry, type InquiryState } from "./actions";

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none";

export function TripForm() {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitTripInquiry, null);

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-emerald-900">
        {state.status === "waitlist" ? (
          <>
            <p className="font-bold">已加入 2027 MLB 候補名單</p>
            <p className="mt-1 text-sm">勞資協議落定後，我們會第一時間通知你並提供行程。</p>
          </>
        ) : (
          <>
            <p className="font-bold">已收到你的觀賽需求！</p>
            <p className="mt-1 text-sm">合作旅行社將於 3 個工作天內以 Email 與你聯繫報價。</p>
          </>
        )}
      </div>
    );
  }

  const err = (k: string) => (state && !state.ok ? state.errors[k]?.[0] : undefined);

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <Field label="姓名" error={err("name")}>
        <input name="name" required className={input} autoComplete="name" />
      </Field>
      <Field label="Email" error={err("email")}>
        <input name="email" type="email" required className={input} autoComplete="email" />
      </Field>
      <Field label="想看的聯盟" error={err("league")}>
        <select name="league" className={input} defaultValue="NBA">
          <option value="NBA">NBA 美國職籃</option>
          <option value="MLB">MLB 美國職棒</option>
          <option value="NFL">NFL 美式足球</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="出發日期" error={err("dateFrom")}>
          <input name="dateFrom" type="date" required className={input} />
        </Field>
        <Field label="回程日期" error={err("dateTo")}>
          <input name="dateTo" type="date" required className={input} />
        </Field>
      </div>
      <Field label="人數" error={err("partySize")}>
        <input name="partySize" type="number" min={1} max={50} defaultValue={2} required className={input} />
      </Field>
      <Field label="想看的球隊、預算或其他需求（選填）" error={err("message")}>
        <textarea name="message" rows={3} className={input} />
      </Field>

      {state && !state.ok && state.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        disabled={pending}
        className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "送出中…" : "送出需求"}
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </label>
  );
}
