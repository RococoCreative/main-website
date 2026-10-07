/**
 * Deterministic formatting helpers. They parse ISO strings from content
 * (never the current time), so they are safe in prerendered components.
 * UTC keeps the build machine's timezone out of the output.
 */

const longDate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", timeZone: "UTC" });

/** "September 15, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : longDate.format(date);
}

/** "September 2026" */
export function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : monthYear.format(date);
}

/** Value for <time dateTime>: "2026-09-15" */
export function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

/** "5 min read" */
export function readingTime(minutes: number): string {
  return `${minutes} min read`;
}

/** True for placeholder values that Rococo Creative must replace before launch. */
export function isTodo(value: string | null | undefined): boolean {
  return typeof value === "string" && /^\s*TODO\b/i.test(value);
}
