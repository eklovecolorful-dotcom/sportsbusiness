import { describe, expect, it } from "vitest";
import { formatInZone, taipeiDayRangeUtc, zonedTimeToUtc } from "./time";

// Mirrors features/taiwan-time.feature. P6: DST weeks (Mar & Nov) must always be tested.
describe("Taiwan-time schedule 台灣時間賽程", () => {
  it("converts a US night game across the November DST change", () => {
    const utc = zonedTimeToUtc("2026-11-01 19:10", "America/New_York");
    expect(formatInZone(utc, "Asia/Taipei")).toBe("2026-11-02 08:10");
  });

  it("converts the evening before the DST change (still EDT)", () => {
    const utc = zonedTimeToUtc("2026-10-31 19:10", "America/New_York");
    expect(formatInZone(utc, "Asia/Taipei")).toBe("2026-11-01 07:10");
  });

  it("converts across the March DST change (spring forward)", () => {
    expect(formatInZone(zonedTimeToUtc("2027-03-13 19:05", "America/New_York"), "Asia/Taipei")).toBe(
      "2027-03-14 08:05",
    );
    expect(formatInZone(zonedTimeToUtc("2027-03-14 19:05", "America/New_York"), "Asia/Taipei")).toBe(
      "2027-03-15 07:05",
    );
  });

  it("handles Arizona, which does not observe DST", () => {
    expect(formatInZone(zonedTimeToUtc("2027-07-01 18:40", "America/Phoenix"), "Asia/Taipei")).toBe(
      "2027-07-02 09:40",
    );
  });

  it("builds a UTC range for one Taiwan calendar day", () => {
    const { start, end } = taipeiDayRangeUtc("2026-11-02");
    expect(start.toISOString()).toBe("2026-11-01T16:00:00.000Z");
    expect(end.toISOString()).toBe("2026-11-02T16:00:00.000Z");
  });

  it("rejects malformed input", () => {
    expect(() => zonedTimeToUtc("11/01/2026 7pm", "America/New_York")).toThrow();
  });
});
