"use client";

import Link from "next/link";
import { useActionState, useSyncExternalStore } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/waitlist/actions";
import { HONEYPOT_FIELD, INTENT_LABELS, INTENTS } from "@/lib/waitlist";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

// Location never changes while the form is mounted; server snapshot is empty.
const noop = () => () => {};
const useLocationPart = (part: "search" | "pathname") =>
  useSyncExternalStore(noop, () => window.location[part], () => "");

/**
 * UC-02 waitlist form (features/waitlist.feature).
 * UTM + landing path are read in the browser so host pages stay static, and are
 * rendered as controlled hidden inputs so React's post-action form reset keeps them.
 */
export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, null);
  const search = useLocationPart("search");
  const pathname = useLocationPart("pathname");
  const params = new URLSearchParams(search);

  if (state?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-emerald-50 p-5 text-emerald-900">
        <p className="font-bold">{state.already ? "你已在名單中 You're already on the list" : "已加入候補 You're on the list"}</p>
        <p className="mt-1 text-sm">
          {state.already
            ? "我們已更新你的選擇。付費週報開放時會第一個通知你。"
            : "付費週報開放時，你會第一個收到通知。在那之前，免費週報照常更新。"}
        </p>
      </div>
    );
  }

  const err = (k: string) => (state && !state.ok ? state.errors[k]?.[0] : undefined);

  return (
    <form action={action} noValidate className="space-y-4 rounded-2xl bg-white p-5 text-slate-900 ring-1 ring-slate-200">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">候補名單 Waitlist</p>
        <p className="mt-1 font-bold">付費週報即將開放，先加入候補</p>
        {!compact && <p className="mt-1 text-sm text-slate-500">免費加入，不需付款。開放時第一個通知你。</p>}
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state && !state.ok ? state.values?.email : undefined}
          className={input} aria-invalid={Boolean(err("email"))} />
        {err("email") && <span className="block text-xs text-red-600">{err("email")}</span>}
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">付費週報開放時，你會？</legend>
        {INTENTS.map((intent, i) => (
          <label key={intent} className="flex items-center gap-2 text-sm">
            <input type="radio" name="intent" value={intent} defaultChecked={i === 0} required />
            {INTENT_LABELS[intent]}
          </label>
        ))}
        {err("intent") && <span className="block text-xs text-red-600">{err("intent")}</span>}
      </fieldset>

      {!compact && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">也有興趣（選填）</legend>
          <input type="hidden" name="interests" value="brief" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="interests" value="trips" />
            美國觀賽旅遊 US game trips
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="interests" value="b2b" />
            企業講座、品牌合作 Talks & partnerships
          </label>
        </fieldset>
      )}

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          我同意依
          <Link href="/legal/privacy" className="underline">
            隱私權政策
          </Link>
          蒐集我的 Email 與上述選擇，用於候補通知。I agree to the privacy policy.
        </span>
      </label>
      {err("consent") && <span className="block text-xs text-red-600">{err("consent")}</span>}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} value={params.get(k) ?? ""} />
      ))}
      <input type="hidden" name="landing_path" value={pathname} />

      {state && !state.ok && state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        disabled={pending}
        className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? "送出中… Sending…" : "加入候補 Join the waitlist"}
      </button>
    </form>
  );
}
