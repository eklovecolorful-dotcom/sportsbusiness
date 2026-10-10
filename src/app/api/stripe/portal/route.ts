import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe Customer Portal: update card, switch plan, cancel.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login?next=/account", siteUrl), 303);

  const { data: profile } = await createAdminClient()
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();
  if (!profile?.stripe_customer_id) return NextResponse.redirect(new URL("/pricing", siteUrl), 303);

  const session = await getStripe().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/account`,
  });
  return NextResponse.redirect(session.url, 303);
}
