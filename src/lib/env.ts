// Central place to read configuration. Every integration is optional in
// development so the app runs with demo data before accounts are set up.

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** UC-03: 2027 MLB trips stay waitlist-only until the CBA is signed. */
export function isMlbCbaSettled(): boolean {
  return process.env.MLB_CBA_SETTLED === "true";
}

/**
 * UC-02: "waitlist" (default) keeps payments closed and shows the waitlist form;
 * "stripe" re-enables Checkout. Decision 2026-11-16 (docs/02-strategy.md §4).
 */
export type BillingMode = "waitlist" | "stripe";
export function billingMode(): BillingMode {
  return process.env.BILLING_MODE === "stripe" ? "stripe" : "waitlist";
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}
