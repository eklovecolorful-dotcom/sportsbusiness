import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireEnv, supabaseUrl } from "@/lib/env";

/**
 * Service-role client that BYPASSES RLS. Only for trusted server code:
 * Stripe webhooks, the schedule cron, and validated server actions.
 */
export function createAdminClient() {
  return createClient(supabaseUrl, requireEnv("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
