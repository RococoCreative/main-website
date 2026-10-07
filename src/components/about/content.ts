import type { sectors } from "@/content/services";

/**
 * Copy for /about. Voice: plain, assured, outcome-first. Nothing here states a
 * fact about Rococo Creative's history, clients, team, or results; anything of
 * that kind is a visible <Placeholder> in the page instead.
 */

/** The name, told in three parts. Construction stages mirror src/content/method.ts. */
export const nameTriad = [
  {
    index: "01",
    title: "Structure",
    source: "Swiss discipline",
    body: "A grid, a hierarchy, and a reason for every element. The plan comes before the finish.",
  },
  {
    index: "02",
    title: "Refinement",
    source: "Rococo detail",
    body: "Craft applied last, with restraint, only where it earns trust.",
  },
  {
    index: "03",
    title: "Construction",
    source: "Your trade's logic",
    body: "Survey, foundation, frame, finish. We sequence marketing the way you sequence a build.",
  },
] as const;

export const principles = [
  {
    index: "01",
    title: "Strategy before style.",
    body: "We start with your market, your competitors, and the work you want more of. Design follows the plan, so every decision has a reason behind it.",
  },
  {
    index: "02",
    title: "Clarity over volume.",
    body: "Fewer, sharper messages. Owners and developers shortlist the firms they understand quickly, not the ones that say the most.",
  },
  {
    index: "03",
    title: "Measure what matters.",
    body: "Opportunities, bids, and revenue. We report marketing in the terms you already use to run the business, not in clicks and impressions alone.",
  },
  {
    index: "04",
    title: "Built to last.",
    body: "Brand systems, websites, and processes designed to hold up for years and simple enough for your team to run after launch.",
  },
  {
    index: "05",
    title: "Modernize without losing identity.",
    body: "The reputation you have earned stays. What holds it back goes.",
  },
] as const;

/** One line per sector on what marketing should do for that kind of firm. */
export const sectorFocus: Record<(typeof sectors)[number], string> = {
  "General contractors": "More shortlists and negotiated work, with a reputation that reaches owners before the bid.",
  "Design-build firms": "A clear case for a single point of responsibility, made to owners early in the process.",
  "Specialty trades": "Steady relationships with GCs and a pipeline that does not hang on one account.",
  "Home builders & remodelers": "Qualified local inquiries, answered quickly and followed up until they close.",
  "Developers & owner's reps": "A credible presence with partners, lenders, and the teams you hire to deliver.",
};

/**
 * Engagement models in general terms. Offering ids refer to src/content/services.ts.
 * TODO: Rococo Creative to confirm the engagement models and supply pricing.
 */
export const engagements = [
  {
    index: "01",
    name: "Project",
    summary: "A defined scope with a clear finish line.",
    body: "For work with a start and an end. Scope, milestones, and deliverables are agreed up front, and the work is handed over ready for your team to use.",
    offeringIds: ["audit", "identity", "website", "sales-materials"],
  },
  {
    index: "02",
    name: "Retainer",
    summary: "Ongoing marketing, measured monthly.",
    body: "For companies that want the pipeline managed month to month, with search, advertising, automation, and content reviewed against one scorecard.",
    offeringIds: ["local-seo", "paid-search", "automation", "reporting"],
  },
  {
    index: "03",
    name: "Advisory",
    summary: "Senior guidance on a schedule that suits you.",
    body: "For owners and in-house teams who run their own marketing and want a second opinion: strategy sessions, plan reviews, and guidance before big decisions.",
    offeringIds: ["audit", "positioning", "growth-plan"],
  },
] as const;
