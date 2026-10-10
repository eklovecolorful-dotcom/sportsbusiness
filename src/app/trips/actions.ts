"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMlbCbaRisk } from "@/lib/trips";

const InquirySchema = z
  .object({
    name: z.string().trim().min(1, "請填寫姓名").max(80),
    email: z.email("Email 格式不正確"),
    league: z.enum(["MLB", "NBA", "NFL"]),
    dateFrom: z.iso.date("請選擇出發日期"),
    dateTo: z.iso.date("請選擇回程日期"),
    partySize: z.coerce.number().int().min(1, "至少 1 人").max(50, "超過 50 人請直接來信"),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((v) => v.dateTo >= v.dateFrom, { message: "回程日期不可早於出發日期", path: ["dateTo"] });

export type InquiryState =
  | { ok: true; status: "new" | "waitlist" }
  | { ok: false; errors: Record<string, string[] | undefined>; message?: string }
  | null;

export async function submitTripInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = InquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };

  const v = parsed.data;
  const status = isMlbCbaRisk(v.league, v.dateTo) ? "waitlist" : "new";

  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    const { error } = await createAdminClient().from("trip_inquiries").insert({
      user_id: user?.id ?? null,
      name: v.name,
      email: v.email,
      league_id: v.league,
      date_from: v.dateFrom,
      date_to: v.dateTo,
      party_size: v.partySize,
      message: v.message ?? null,
      status,
    });
    if (error) return { ok: false, errors: {}, message: "送出失敗，請稍後再試。" };
  }

  // Hand off to the licensed partner agency (they quote, sell and collect payment).
  const agency = process.env.PARTNER_AGENCY_EMAIL;
  if (agency && status === "new") {
    await sendEmail({
      to: agency,
      subject: `[Sports] 觀賽詢價：${v.league} ${v.dateFrom}~${v.dateTo}（${v.partySize} 人）`,
      text: [
        `姓名：${v.name}`,
        `Email：${v.email}`,
        `聯盟：${v.league}`,
        `日期：${v.dateFrom} ~ ${v.dateTo}`,
        `人數：${v.partySize}`,
        `備註：${v.message ?? "-"}`,
      ].join("\n"),
    });
  }

  return { ok: true, status };
}
