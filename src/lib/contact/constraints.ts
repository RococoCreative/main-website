/**
 * Contact form limits, shared by the form UI (maxLength hints) and the
 * server-side validator. They mirror the CHECK constraints on
 * public.contact_submissions (supabase/migrations/20261007000000_init.sql),
 * so a value that passes validation can always be stored.
 *
 * Safe to import from client components: constants only, no server logic.
 */
export const CONTACT_LIMITS = {
  name: 120,
  emailMin: 3,
  email: 254,
  company: 160,
  role: 120,
  phone: 40,
  companyType: 80,
  services: 12,
  budget: 60,
  timeline: 60,
  messageMin: 10,
  messageMax: 5000,
  sourcePath: 300,
} as const;

/** Name of the honeypot input. People never see it; simple bots fill it in. */
export const HONEYPOT_FIELD = "website";

/** Submissions completed faster than this (ms after the form mounted) are treated as automated. */
export const MIN_FILL_TIME_MS = 3000;

/** Query-string intents that tailor the form copy (see src/lib/site.ts cta). */
export const CONTACT_INTENTS = ["proposal", "clarity"] as const;
export type ContactIntent = (typeof CONTACT_INTENTS)[number];

export function isContactIntent(value: unknown): value is ContactIntent {
  return typeof value === "string" && (CONTACT_INTENTS as readonly string[]).includes(value);
}

/** The page the form was sent from. Includes the intent so the studio can see RFPs at a glance. */
export function contactSourcePath(intent: ContactIntent | null): string {
  return intent ? `/contact?intent=${intent}` : "/contact";
}
