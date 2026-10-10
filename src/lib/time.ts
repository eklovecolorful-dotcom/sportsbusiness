// Times are stored in UTC (see supabase/migrations/0001_core.sql) and
// converted to Asia/Taipei for display. Taiwan has no DST, but US venues do,
// so every conversion must go through the IANA database — never a fixed offset.

export const TAIPEI_TZ = "Asia/Taipei";

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

function partsInZone(date: Date, timeZone: string): Parts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const get = (type: string) => Number(fmt.formatToParts(date).find((p) => p.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** Offset of `timeZone` from UTC at `date`, in minutes (e.g. -300 for EST). */
function offsetMinutes(date: Date, timeZone: string): number {
  const p = partsInZone(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

/**
 * Convert a wall-clock time at a venue ("2026-11-01 19:10" in
 * "America/New_York") to a UTC Date. Handles DST transitions.
 */
export function zonedTimeToUtc(local: string, timeZone: string): Date {
  const m = local.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) throw new Error(`Invalid local time: "${local}" (expected YYYY-MM-DD HH:mm)`);
  const [, y, mo, d, h, mi, s] = m;
  const naive = Date.UTC(+y, +mo - 1, +d, +h, +mi, +(s ?? 0));
  // Two passes converge even when the first guess lands on the other side of a DST switch.
  let utc = naive - offsetMinutes(new Date(naive), timeZone) * 60000;
  utc = naive - offsetMinutes(new Date(utc), timeZone) * 60000;
  return new Date(utc);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD HH:mm" in the given zone (default Asia/Taipei). */
export function formatInZone(date: Date | string, timeZone: string = TAIPEI_TZ): string {
  const p = partsInZone(new Date(date), timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)} ${pad(p.hour)}:${pad(p.minute)}`;
}

/** "YYYY-MM-DD" calendar date in the given zone. */
export function dateInZone(date: Date | string, timeZone: string = TAIPEI_TZ): string {
  return formatInZone(date, timeZone).slice(0, 10);
}

/** "HH:mm" in the given zone. */
export function timeInZone(date: Date | string, timeZone: string = TAIPEI_TZ): string {
  return formatInZone(date, timeZone).slice(11);
}

/** Localised weekday + date label for Taiwan, e.g. "11/2（一）". */
export function taipeiDayLabel(date: Date | string): string {
  const d = new Date(date);
  const md = new Intl.DateTimeFormat("zh-TW", { timeZone: TAIPEI_TZ, month: "numeric", day: "numeric" }).format(d);
  const wd = new Intl.DateTimeFormat("zh-TW", { timeZone: TAIPEI_TZ, weekday: "narrow" }).format(d);
  return `${md}（${wd}）`;
}

/** UTC range [start, end) covering one Taiwan calendar day. */
export function taipeiDayRangeUtc(taipeiDate: string): { start: Date; end: Date } {
  const start = zonedTimeToUtc(`${taipeiDate} 00:00`, TAIPEI_TZ);
  return { start, end: new Date(start.getTime() + 24 * 3600 * 1000) };
}
