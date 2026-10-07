import { pillars } from "@/content/services";
import { isContactIntent, type ContactIntent } from "@/lib/contact/constraints";

/**
 * Copy that adapts to the CTA a visitor arrived from (?intent=proposal or
 * ?intent=clarity, see `cta` in src/lib/site.ts). Lengths are kept close so
 * swapping copy after hydration does not shift the layout.
 */
export type IntentCopy = {
  /** Bracketed eyebrow above the form heading. */
  eyebrow: string;
  /** One-line introduction under the form heading. */
  intro: string;
  /** Example text inside the message field. Illustrative only. */
  placeholder: string;
};

const GENERAL: IntentCopy = {
  eyebrow: "Project inquiry",
  intro:
    "Tell us about your company and the work you want more of. The more specific you are, the more useful our first conversation will be.",
  placeholder:
    "For example: We are a commercial general contractor. We want more negotiated work with developers, and our website no longer reflects the projects we deliver.",
};

const BY_INTENT: Record<ContactIntent, IntentCopy> = {
  proposal: {
    eyebrow: "Request for proposal",
    intro:
      "Share the scope you have in mind, your timeline, and any deadline. If there is an RFP document, mention it and we will ask for it.",
    placeholder:
      "For example: We need a new website and a refreshed brand before our next hiring push. Proposals are due at the end of the quarter, and the scope document is ready to share.",
  },
  clarity: {
    eyebrow: "Gain clarity",
    intro:
      "Tell us what is not working as well as it should: leads, website, message, or follow-up. We will help you decide what to fix first.",
    placeholder:
      "For example: Referrals keep us busy, but our website brings in very few qualified inquiries and we are not sure where they are being lost.",
  },
};

export function intentCopy(intent: ContactIntent | null): IntentCopy {
  return intent ? BY_INTENT[intent] : GENERAL;
}

export function parseIntent(value: string | null): ContactIntent | null {
  const normalized = value?.trim().toLowerCase();
  return isContactIntent(normalized) ? normalized : null;
}

/** Offering id (e.g. "website") to the display name used as the checkbox value. */
const OFFERING_NAMES_BY_ID: ReadonlyMap<string, string> = new Map(
  pillars.flatMap((pillar) => pillar.offerings.map((offering) => [offering.id, offering.name] as const)),
);

/**
 * Parses ?services=website,local-seo (repeated keys are accepted too) into the
 * matching offering names. Unknown ids are ignored; order follows the form.
 */
export function parseServiceIds(values: readonly string[]): string[] {
  const names = new Set<string>();
  for (const value of values) {
    for (const id of value.split(",")) {
      const name = OFFERING_NAMES_BY_ID.get(id.trim().toLowerCase());
      if (name) names.add(name);
    }
  }
  return [...OFFERING_NAMES_BY_ID.values()].filter((name) => names.has(name));
}
