import { afterEach, describe, expect, it, vi } from "vitest";

const getStripe = vi.fn();
vi.mock("@/lib/stripe", () => ({ getStripe, PLANS: { monthly: {}, yearly: {} }, priceIdFor: () => "price_x" }));
vi.mock("@/lib/auth", () => ({ getCurrentUser: async () => ({ id: "u1", email: "fan@example.com" }) }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));

const { POST } = await import("./route");

function post(plan: string) {
  const body = new FormData();
  body.set("plan", plan);
  return new Request("http://localhost:3000/api/stripe/checkout", { method: "POST", body });
}

afterEach(() => {
  vi.unstubAllEnvs();
  getStripe.mockReset();
});

// features/waitlist.feature — "Checkout is closed in waitlist mode"
describe("POST /api/stripe/checkout in waitlist mode", () => {
  it("redirects to the waitlist and never creates a Checkout Session (default mode)", async () => {
    vi.stubEnv("BILLING_MODE", "");
    const res = await POST(post("monthly") as never);
    expect(res.status).toBe(303);
    expect(new URL(res.headers.get("location")!).pathname + new URL(res.headers.get("location")!).hash).toBe(
      "/pricing#waitlist",
    );
    expect(getStripe).not.toHaveBeenCalled();
  });

  it("stays closed for any value other than 'stripe'", async () => {
    vi.stubEnv("BILLING_MODE", "STRIPE ");
    const res = await POST(post("monthly") as never);
    expect(res.status).toBe(303);
    expect(getStripe).not.toHaveBeenCalled();
  });
});
