import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabasePublishableKey, supabaseUrl } from "@/lib/env";

/**
 * Cookie-less anonymous client for public data (games, teams, players,
 * brief metadata). Safe to call inside `'use cache'` functions.
 */
export function createPublicClient() {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
