import { methodPhases, type MethodPhase } from "@/content/method";
import { pillars, type Offering, type Pillar } from "@/content/services";

/**
 * Pure data and logic for the GrowthSystemBuilder. No React, no browser APIs,
 * so it is safe to import from server and client modules alike.
 * Offering ids come from src/content/services.ts; the contact form pre-checks
 * the same ids from /contact?services=<id,id>.
 */

export type PillarId = Pillar["id"];

export type OfferingEntry = Offering & {
  pillarId: PillarId;
  pillarIndex: string;
  pillarName: string;
  /** Swiss sub-index, e.g. "01.2". */
  code: string;
  /** Short label for the schematic modules. */
  short: string;
};

/** Short schematic labels. Full names stay in the form and the summary. */
const SHORT_LABELS: Record<string, string> = {
  audit: "Audit",
  positioning: "Positioning",
  "growth-plan": "Growth plan",
  identity: "Identity",
  website: "Website",
  "sales-materials": "Proposals",
  "local-seo": "Local SEO",
  "paid-search": "Paid search",
  automation: "CRM",
  content: "Content",
  reporting: "Reporting",
};

/** Column headings for the schematic. */
export const PILLAR_SHORT_NAMES: Record<PillarId, string> = {
  strategy: "Strategy",
  design: "Design",
  marketing: "Marketing",
};

export const offeringEntries: OfferingEntry[] = pillars.flatMap((pillar) =>
  pillar.offerings.map((offering, i) => ({
    ...offering,
    pillarId: pillar.id,
    pillarIndex: pillar.index,
    pillarName: pillar.name,
    code: `${pillar.index}.${i + 1}`,
    short: SHORT_LABELS[offering.id] ?? offering.name,
  })),
);

const entryById = new Map(offeringEntries.map((entry) => [entry.id, entry]));

export const TOTAL_OFFERINGS = offeringEntries.length;

/**
 * Every engagement begins with an audit (method phase 01, Survey), so the
 * audit module is the start of every system the visitor assembles.
 */
export const START_ID = entryById.has("audit") ? "audit" : (offeringEntries[0]?.id ?? "audit");

/** Keep ids in the canonical services.ts order and drop anything unknown. */
export function inCanonicalOrder(ids: Iterable<string>): string[] {
  const wanted = new Set(ids);
  return offeringEntries.filter((entry) => wanted.has(entry.id)).map((entry) => entry.id);
}

export function entriesFor(ids: readonly string[]): OfferingEntry[] {
  return inCanonicalOrder(ids).map((id) => entryById.get(id) as OfferingEntry);
}

/* ---------------------------------------------------------------------------
 * Presets: common goals expressed as offering ids.
 * ------------------------------------------------------------------------- */
export type Preset = { id: string; label: string; offeringIds: string[] };

export const presets: Preset[] = [
  {
    id: "larger-bids",
    label: "Win larger bids",
    // A sharper message, a plan aimed at bigger project types, proposals that
    // match the work, and project stories that prove it.
    offeringIds: inCanonicalOrder(["positioning", "growth-plan", "sales-materials", "content"]),
  },
  {
    id: "pipeline",
    label: "Fill the pipeline",
    // Be found, convert the visit, answer fast, and measure what it produced.
    offeringIds: inCanonicalOrder(["website", "local-seo", "paid-search", "automation", "reporting"]),
  },
  {
    id: "brand",
    label: "Modernize the brand",
    // Keep the equity, sharpen the message, and carry it through every touchpoint.
    offeringIds: inCanonicalOrder(["positioning", "identity", "website", "sales-materials"]),
  },
];

export function sameSelection(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
}

/* ---------------------------------------------------------------------------
 * Where we would start: mapped onto the four-phase method (src/content/method.ts).
 * ------------------------------------------------------------------------- */

/** Which method phase each offering belongs to. Unknown ids fall back by pillar. */
const PHASE_BY_OFFERING: Record<string, string> = {
  audit: "01",
  positioning: "02",
  "growth-plan": "02",
  identity: "03",
  website: "03",
  "sales-materials": "03",
  automation: "03",
  "local-seo": "04",
  "paid-search": "04",
  content: "04",
  reporting: "04",
};

const PHASE_BY_PILLAR: Record<PillarId, string> = { strategy: "02", design: "03", marketing: "04" };

const phaseByIndex = new Map(methodPhases.map((phase) => [phase.index, phase]));

/** Phase 01 (Survey). Every engagement starts here. */
export const startPhase: MethodPhase = phaseByIndex.get("01") ?? methodPhases[0];

export type PlanStep = { phase: MethodPhase; names: string[] };

export type StartPlan = {
  reason: string;
  /** Later phases that hold at least one selected offering, in method order. */
  steps: PlanStep[];
};

function startReason(entries: OfferingEntry[]): string {
  const inPlay = new Set(entries.map((entry) => entry.pillarId));
  if (entries.length >= 3) {
    return "With several services in play, the audit sets the order of work, so the first steps go where they will move bids and revenue.";
  }
  if (inPlay.has("strategy")) {
    return "Strategy starts from evidence: how work comes in today, where inquiries slip away, and which projects pay best.";
  }
  if (inPlay.size === 1 && inPlay.has("design")) {
    return "Every engagement begins with an audit, even a single website or identity project, so the design answers what owners need to see.";
  }
  if (inPlay.size === 1 && inPlay.has("marketing")) {
    return "Before adding spend, the audit shows where inquiries come from today and where they slip away, so budget goes where it pays back.";
  }
  return "Every engagement begins with an audit, so the build and the marketing rest on the same evidence.";
}

/** Honest, simple sequencing: always start with 01 Survey, then follow the method. */
export function planFor(selected: readonly string[]): StartPlan | null {
  const entries = entriesFor(selected);
  if (entries.length === 0) return null;

  const grouped = new Map<string, string[]>();
  for (const entry of entries) {
    const index = PHASE_BY_OFFERING[entry.id] ?? PHASE_BY_PILLAR[entry.pillarId];
    if (index === startPhase.index) continue;
    grouped.set(index, [...(grouped.get(index) ?? []), entry.name]);
  }

  const steps = methodPhases
    .filter((phase) => grouped.has(phase.index))
    .map((phase) => ({ phase, names: grouped.get(phase.index) ?? [] }));

  return { reason: startReason(entries), steps };
}

export function contactHref(selected: readonly string[]): string {
  const ids = inCanonicalOrder(selected);
  return ids.length ? `/contact?services=${ids.join(",")}` : "/contact";
}
