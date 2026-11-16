import { afterEach, describe, expect, it, vi } from "vitest";
import { isBot, normalizeEmail, parseWaitlist, sanitizeLandingPath, toRow } from "./waitlist";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = { email: "fan@example.com", intent: "monthly_150", consent: "on" };

describe("normalizeEmail", () => {
  it("trims and lowercases so duplicates collapse", () => {
    expect(normalizeEmail("  Fan@Example.COM ")).toBe("fan@example.com");
  });
});

describe("parseWaitlist", () => {
  it("accepts a valid submission (happy path)", () => {
    const r = parseWaitlist(form(valid));
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("fan@example.com");
      expect(r.data.intent).toBe("monthly_150");
      expect(r.data.interests).toEqual(["brief"]);
    }
  });

  it("normalizes the email before validation", () => {
    const r = parseWaitlist(form({ ...valid, email: " Fan@Example.com " }));
    expect(r.success && r.data.email).toBe("fan@example.com");
  });

  it("rejects an invalid email and missing consent with bilingual messages", () => {
    const r = parseWaitlist(form({ email: "not-an-email", intent: "monthly_150" }));
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.errors.email?.[0]).toBe("Email 格式不正確 Invalid email");
      expect(r.errors.consent?.[0]).toBe("請同意隱私權政策 Please accept the privacy policy");
    }
  });

  it("rejects an unknown intent", () => {
    const r = parseWaitlist(form({ ...valid, intent: "free_forever" }));
    expect(r.success).toBe(false);
  });

  it("keeps only known interests", () => {
    const fd = form(valid);
    fd.append("interests", "trips");
    fd.append("interests", "b2b");
    fd.append("interests", "<script>");
    const r = parseWaitlist(fd);
    expect(r.success && r.data.interests).toEqual(["trips", "b2b"]);
  });

  it("captures UTM fields and truncates them", () => {
    const r = parseWaitlist(
      form({ ...valid, utm_source: "threads", utm_medium: "social", utm_campaign: "x".repeat(300) }),
    );
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.utm_source).toBe("threads");
      expect(r.data.utm_medium).toBe("social");
      expect(r.data.utm_campaign).toHaveLength(100);
    }
  });
});

describe("sanitizeLandingPath", () => {
  it("keeps a same-site path without query string", () => {
    expect(sanitizeLandingPath("/insights/mlb-lockout?utm_source=x")).toBe("/insights/mlb-lockout");
  });
  it("drops absolute or protocol-relative URLs", () => {
    expect(sanitizeLandingPath("https://evil.example/x")).toBeNull();
    expect(sanitizeLandingPath("//evil.example/x")).toBeNull();
  });
  it("drops empty input", () => {
    expect(sanitizeLandingPath("")).toBeNull();
    expect(sanitizeLandingPath(undefined)).toBeNull();
  });
});

describe("isBot", () => {
  it("flags submissions that fill the honeypot", () => {
    expect(isBot(form({ ...valid, website: "http://spam.example" }))).toBe(true);
  });
  it("lets real users through", () => {
    expect(isBot(form({ ...valid, website: "" }))).toBe(false);
    expect(isBot(form(valid))).toBe(false);
  });
});

describe("toRow", () => {
  afterEach(() => vi.useRealTimers());
  it("maps parsed data to the waitlist_signups columns with a consent timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-20T01:00:00Z"));
    const r = parseWaitlist(form({ ...valid, landing_path: "/brief/2026-41?x=1" }));
    if (!r.success) throw new Error("expected success");
    expect(toRow(r.data, "user-1")).toEqual({
      email: "fan@example.com",
      willing_to_pay: "monthly_150",
      interests: ["brief"],
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      landing_path: "/brief/2026-41",
      consent_at: "2026-11-20T01:00:00.000Z",
      user_id: "user-1",
      updated_at: "2026-11-20T01:00:00.000Z",
    });
  });
});
