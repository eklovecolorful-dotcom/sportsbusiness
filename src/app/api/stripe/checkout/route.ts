import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { siteUrl } from "@/lib/env";
import { getStripe, PLANS, priceIdFor, type PlanKey } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// UC-02: Subscribe → Stripe Checkout. Entitlement is granted by the webhook, never here.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/login?next=/pricing", siteUrl), 303);

  const form = await request.formData();
  const plan = String(form.get("plan")) as PlanKey;
  if (!(plan in PLANS)) return NextResponse.json({ error: "invalid plan" }, { status: 400 });

  const stripe = getStripe();
  const admin = createAdminClient();

  // Reuse one Stripe customer per user.
  const { data: profile } = await admin.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
  let customerId = profile?.stripe_customer_id as string | null | undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceIdFor(plan), quantity: 1 }],
    subscription_data: { metadata: { user_id: user.id } },
    allow_promotion_codes: true,
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
  });

  return NextResponse.redirect(session.url!, 303);
}
