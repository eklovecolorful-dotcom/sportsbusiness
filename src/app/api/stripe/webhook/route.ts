import type Stripe from "stripe";
import { requireEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Source of truth for entitlement: mirrors Stripe subscriptions into Supabase.
// Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("missing signature", { status: 400 });
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (err) {
    return new Response(`invalid signature: ${(err as Error).message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode === "subscription" && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(sub, session.client_reference_id);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await upsertSubscription(event.data.object);
      break;
    // invoice.payment_failed: Stripe moves the subscription to past_due and
    // emits customer.subscription.updated — the user falls back to free tier.
  }

  return Response.json({ received: true });
}

async function upsertSubscription(sub: Stripe.Subscription, fallbackUserId?: string | null) {
  const userId = sub.metadata?.user_id || fallbackUserId;
  if (!userId) {
    console.error(`[stripe] subscription ${sub.id} has no user_id metadata`);
    return;
  }
  const item = sub.items.data[0];
  const { error } = await createAdminClient()
    .from("subscriptions")
    .upsert({
      id: sub.id,
      user_id: userId,
      status: sub.status,
      price_id: item?.price.id ?? null,
      current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    });
  // Throwing returns 500 so Stripe retries.
  if (error) throw new Error(`subscriptions upsert failed: ${error.message}`);
}
