import { z } from "zod";

/** UC-02 (waitlist mode): payment intent options — see docs/02-strategy.md §7. */
export const INTENTS = ["monthly_150", "yearly_1500", "would_pay_less", "free_only"] as const;
export type Intent = (typeof INTENTS)[number];

export const INTENT_LABELS: Record<Intent, string> = {
  monthly_150: "願意月訂 NT$150　Monthly NT$150",
  yearly_1500: "願意年訂 NT$1,500　Yearly NT$1,500",
  would_pay_less: "會付費，但希望更便宜　I'd pay less",
  free_only: "先看免費內容就好　Free content only",
};

/** Intents that count toward the "30 paid" secondary metric before payments open. */
export const PAYING_INTENTS: readonly Intent[] = ["monthly_150", "yearly_1500"];

export const INTERESTS = ["brief", "trips", "b2b"] as const;
export type Interest = (typeof INTERESTS)[number];

/** Hidden field that real users never fill. */
export const HONEYPOT_FIELD = "website";

const MSG = {
  email: "Email 格式不正確 Invalid email",
  intent: "請選擇一個選項 Please choose an option",
  consent: "請同意隱私權政策 Please accept the privacy policy",
} as const;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Same-site path only, without query string or hash; null otherwise. */
export function sanitizeLandingPath(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/)[0];
  return path.slice(0, 200) || null;
}

const utm = z
  .string()
  .trim()
  .transform((v) => v.slice(0, 100) || null)
  .nullable()
  .catch(null);

const Schema = z.object({
  email: z.preprocess((v) => (typeof v === "string" ? normalizeEmail(v) : v), z.email({ error: MSG.email }).max(254)),
  intent: z.enum(INTENTS, { error: MSG.intent }),
  consent: z.literal("on", { error: MSG.consent }),
  interests: z.array(z.string()).transform((xs) => {
    const known = INTERESTS.filter((i) => xs.includes(i));
    return known.length ? known : (["brief"] as Interest[]);
  }),
  utm_source: utm,
  utm_medium: utm,
  utm_campaign: utm,
  landing_path: z.string().nullable().transform(sanitizeLandingPath),
});

export type WaitlistInput = z.infer<typeof Schema>;

export type ParseResult =
  | { success: true; data: WaitlistInput }
  | { success: false; errors: Record<string, string[] | undefined> };

export function parseWaitlist(fd: FormData): ParseResult {
  const str = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : null;
  };
  const parsed = Schema.safeParse({
    email: str("email") ?? "",
    intent: str("intent") ?? undefined,
    consent: str("consent") ?? undefined,
    interests: fd.getAll("interests").filter((v): v is string => typeof v === "string"),
    utm_source: str("utm_source"),
    utm_medium: str("utm_medium"),
    utm_campaign: str("utm_campaign"),
    landing_path: str("landing_path"),
  });
  if (parsed.success) return { success: true, data: parsed.data };
  return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
}

export function isBot(fd: FormData): boolean {
  const v = fd.get(HONEYPOT_FIELD);
  return typeof v === "string" && v.trim() !== "";
}

/** Row for public.waitlist_signups (supabase/migrations/0003_waitlist.sql). */
export function toRow(data: WaitlistInput, userId: string | null) {
  const now = new Date().toISOString();
  return {
    email: data.email,
    willing_to_pay: data.intent,
    interests: data.interests,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    landing_path: data.landing_path,
    consent_at: now,
    user_id: userId,
    updated_at: now,
  };
}
