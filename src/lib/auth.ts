import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = { id: string; email: string | null };

/** Verified user from the auth cookie, or null. Reads cookies → behind <Suspense>. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: (claims.email as string | undefined) ?? null };
}

export type SubscriptionInfo = {
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
} | null;

export async function getMySubscription(): Promise<SubscriptionInfo> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, cancel_at_period_end")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return {
    status: data.status,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
  };
}

export function isActive(sub: SubscriptionInfo): boolean {
  return sub?.status === "active" || sub?.status === "trialing";
}
