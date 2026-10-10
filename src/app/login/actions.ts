"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { sent?: boolean; error?: string } | null;

function safeNext(next: FormDataEntryValue | null): string {
  const n = typeof next === "string" ? next : "/account";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}

/** Passwordless email (magic link) sign-in. */
export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured()) return { error: "尚未設定 Supabase（開發模式）。" };

  const email = z.email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Email 格式不正確" };

  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) return { error: error.message };
  return { sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
