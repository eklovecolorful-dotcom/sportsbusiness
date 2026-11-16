"use server";

import { getCurrentUser } from "@/lib/auth";
import { siteUrl, isSupabaseConfigured } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBot, parseWaitlist, toRow } from "@/lib/waitlist";

export type WaitlistState =
  | { ok: true; already: boolean }
  | { ok: false; errors: Record<string, string[] | undefined>; message?: string; values?: { email: string } }
  | null;

const FAIL: WaitlistState = { ok: false, errors: {}, message: "送出失敗，請稍後再試 Something went wrong, please try again" };

// UC-02 (waitlist mode) · features/waitlist.feature
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // Honeypot: pretend success, store nothing.
  if (isBot(formData)) return { ok: true, already: false };

  const parsed = parseWaitlist(formData);
  if (!parsed.success) {
    const email = formData.get("email");
    return { ok: false, errors: parsed.errors, values: { email: typeof email === "string" ? email.slice(0, 254) : "" } };
  }
  const v = parsed.data;

  if (!isSupabaseConfigured()) {
    console.info("[waitlist:dev]", v.email, v.intent, v.utm_source ?? "-");
    return { ok: true, already: false };
  }

  const user = await getCurrentUser();
  const row = toRow(v, user?.id ?? null);
  const admin = createAdminClient();

  const { data: existing, error: readError } = await admin
    .from("waitlist_signups")
    .select("id")
    .eq("email", v.email)
    .maybeSingle();
  if (readError) return FAIL;

  if (existing) {
    // Keep first-touch UTM; refresh intent, interests and consent.
    const { error } = await admin
      .from("waitlist_signups")
      .update({
        willing_to_pay: row.willing_to_pay,
        interests: row.interests,
        consent_at: row.consent_at,
        unsubscribed_at: null,
        updated_at: row.updated_at,
        ...(row.user_id ? { user_id: row.user_id } : {}),
      })
      .eq("id", existing.id);
    return error ? FAIL : { ok: true, already: true };
  }

  const { data: inserted, error: insertError } = await admin
    .from("waitlist_signups")
    .insert(row)
    .select("id")
    .single();
  if (insertError) {
    // Unique violation = a concurrent submit with the same email won the race.
    return insertError.code === "23505" ? { ok: true, already: true } : FAIL;
  }

  // Welcome email is best-effort: the sign-up already counts even if mail fails.
  try {
    await sendEmail({
      to: v.email,
      subject: "已加入候補｜Sports 運動商業週報 You're on the list",
      text: [
        "謝謝你加入 Sports 運動商業週報候補名單。",
        "付費週報開放時，你會第一個收到通知；在那之前，免費週報與深度分析照常更新：",
        `${siteUrl}/brief`,
        "",
        "Thanks for joining the Sports business brief waitlist. We'll email you first when the paid brief opens.",
        "",
        `不想再收到信？直接回覆這封信告訴我們即可。To unsubscribe, just reply to this email.`,
      ].join("\n"),
    });
    await admin.from("waitlist_signups").update({ welcomed_at: new Date().toISOString() }).eq("id", inserted.id);
  } catch (e) {
    console.error("[waitlist] welcome email failed", e);
  }

  return { ok: true, already: false };
}
