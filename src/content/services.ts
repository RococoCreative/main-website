/**
 * Service architecture. Shared by the home page, services page, contact form,
 * and interactive demos so naming stays consistent everywhere.
 * Voice: plain, assured, outcome-first. No hype, no exclamation marks.
 */

export type Offering = {
  id: string;
  name: string;
  /** One sentence, outcome first. */
  outcome: string;
  /** What the client actually receives. */
  deliverables: string[];
};

export type Pillar = {
  id: "strategy" | "design" | "marketing";
  index: string;
  name: string;
  /** Short promise, used as the pillar headline. */
  promise: string;
  summary: string;
  offerings: Offering[];
};

export const pillars: Pillar[] = [
  {
    id: "strategy",
    index: "01",
    name: "Strategy",
    promise: "Know where you win.",
    summary:
      "We study your market, your competitors, and your best past projects, then define the work you should pursue and the message that wins it.",
    offerings: [
      {
        id: "audit",
        name: "Marketing audit",
        outcome: "A clear view of what is working, what is leaking, and what to fix first.",
        deliverables: ["Brand, website, and search review", "Lead-handling review", "Prioritized findings report"],
      },
      {
        id: "positioning",
        name: "Positioning & messaging",
        outcome: "A message owners and developers remember when they shortlist builders.",
        deliverables: ["Competitive landscape", "Positioning statement", "Messaging framework by audience"],
      },
      {
        id: "growth-plan",
        name: "Growth plan",
        outcome: "A focused plan tied to the project types and margins you want more of.",
        deliverables: ["Ideal project and client profile", "Channel plan and budget", "KPIs tied to bids and revenue"],
      },
    ],
  },
  {
    id: "design",
    index: "02",
    name: "Brand & Design",
    promise: "Look like the firm you are becoming.",
    summary:
      "Identity, website, and sales materials that carry the same precision you bring to the jobsite, so your reputation arrives before you do.",
    offerings: [
      {
        id: "identity",
        name: "Brand identity",
        outcome: "A modern identity that keeps the equity you have already earned.",
        deliverables: ["Logo refinement or redesign", "Color, type, and usage system", "Jobsite, fleet, and signage applications"],
      },
      {
        id: "website",
        name: "Website",
        outcome: "A fast, credible website that turns qualified visitors into conversations.",
        deliverables: ["Strategy-led sitemap and copy", "Project portfolio system", "Conversion and tracking setup"],
      },
      {
        id: "sales-materials",
        name: "Sales & proposal materials",
        outcome: "Qualification packages and proposals that read as well as your work performs.",
        deliverables: ["Statement of qualifications", "Proposal and pitch templates", "Capability one-pagers"],
      },
    ],
  },
  {
    id: "marketing",
    index: "03",
    name: "AI-driven Marketing",
    promise: "Keep the pipeline full without adding headcount.",
    summary:
      "Search, advertising, and automation that bring in the right inquiries, answer them in minutes, and report results in terms of bids and revenue.",
    offerings: [
      {
        id: "local-seo",
        name: "Local SEO",
        outcome: "Show up when owners in your market search for a builder like you.",
        deliverables: ["Google Business Profile management", "Service and location pages", "Review generation system"],
      },
      {
        id: "paid-search",
        name: "Paid search",
        outcome: "Qualified inquiries from owners searching now, with spend judged by booked work.",
        deliverables: ["Google Ads and Local Services Ads", "Landing pages", "Call and form tracking"],
      },
      {
        id: "automation",
        name: "CRM & automation",
        outcome: "Every inquiry answered quickly, qualified, and followed up until it is won or ruled out.",
        deliverables: ["CRM pipeline setup", "AI-assisted first response", "Automated follow-up sequences"],
      },
      {
        id: "content",
        name: "AI-assisted content",
        outcome: "Consistent project stories and insights, produced efficiently and edited by people.",
        deliverables: ["Project case studies", "Articles and social content", "Email updates to past clients"],
      },
      {
        id: "reporting",
        name: "Reporting",
        outcome: "One monthly scorecard that connects marketing to opportunities, bids, and wins.",
        deliverables: ["Live dashboard", "Monthly review call", "Quarterly plan updates"],
      },
    ],
  },
];

/** Flat list of offering names, used by the contact form and filters. */
export const offeringNames: string[] = pillars.flatMap((p) => p.offerings.map((o) => o.name));

/** Who we serve. Used for sector chips and the contact form. */
export const sectors = [
  "General contractors",
  "Design-build firms",
  "Specialty trades",
  "Home builders & remodelers",
  "Developers & owner's reps",
] as const;
