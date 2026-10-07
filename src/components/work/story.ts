import type { CaseStudy } from "@/lib/types";

/** The three-part structure every case study follows, in reading order. */
export const STORY_PARTS = [
  { key: "challenge", index: "01", label: "Challenge", summary: "Where the business stood" },
  { key: "approach", index: "02", label: "Approach", summary: "What we built, and why" },
  { key: "outcome", index: "03", label: "Outcome", summary: "What changed, in numbers" },
] as const satisfies readonly { key: keyof Pick<CaseStudy, "challenge" | "approach" | "outcome">; index: string; label: string; summary: string }[];

/** Next study in list order, wrapping to the first. Null when there is nothing else to show. */
export function nextInOrder<T extends { slug: string }>(items: readonly T[], slug: string): T | null {
  if (items.length === 0) return null;
  const at = items.findIndex((item) => item.slug === slug);
  if (at === -1) return items[0];
  const next = items[(at + 1) % items.length];
  return next.slug === slug ? null : next;
}
