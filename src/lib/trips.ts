import { isMlbCbaSettled } from "@/lib/env";

/** UC-03 alt flow: 2027 MLB trips go to the waitlist until the CBA is signed. */
export function isMlbCbaRisk(league: string, dateTo: string): boolean {
  return league === "MLB" && dateTo >= "2027-01-01" && !isMlbCbaSettled();
}
