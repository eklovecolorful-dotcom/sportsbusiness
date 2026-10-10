import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  stripe ??= new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  return stripe;
}

export const PLANS = {
  monthly: { env: "STRIPE_PRICE_BRIEF_MONTHLY", label: "月訂閱 Monthly", price: "NT$150 / 月" },
  yearly: { env: "STRIPE_PRICE_BRIEF_YEARLY", label: "年訂閱 Yearly", price: "NT$1,500 / 年" },
} as const;

export type PlanKey = keyof typeof PLANS;

export function priceIdFor(plan: PlanKey): string {
  return requireEnv(PLANS[plan].env);
}
