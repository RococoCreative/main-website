import { offeringNames } from "./services";

/**
 * Contact form options. Shared by the form UI and the server-side validator,
 * so a value can only be stored if it was offered.
 */

export const companyTypes = [
  "General contractor",
  "Design-build firm",
  "Specialty trade contractor",
  "Home builder or remodeler",
  "Developer or owner's rep",
  "Other",
] as const;

export const serviceInterests = offeringNames;

// TODO: Confirm budget bands with Rococo Creative before launch.
export const budgets = [
  "Under $5,000 per month",
  "$5,000 to $10,000 per month",
  "$10,000 to $25,000 per month",
  "$25,000+ per month",
  "Project-based (one-time)",
  "Not sure yet",
] as const;

export const timelines = ["As soon as possible", "Within 3 months", "3 to 6 months", "Planning for next year"] as const;

/** Copy for the "what happens next" panel on the contact page. */
export const nextSteps = [
  { title: "We reply within one business day", body: "A real person reads every inquiry. No automated sales sequence." },
  {
    title: "A 30-minute conversation",
    body: "We ask about your market, your best projects, and where work comes from today.",
  },
  {
    title: "A clear recommendation",
    body: "You get a short written point of view on what to fix first, whether or not we work together.",
  },
] as const;
