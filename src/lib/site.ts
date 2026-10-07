/**
 * Site-wide copy and navigation. Anything Rococo Creative must supply is
 * marked TODO so it is easy to find before launch (search the repo for "TODO").
 */

export const site = {
  name: "Rococo Creative",
  shortName: "Rococo",
  tagline: "Strategy, design, and AI-driven marketing for construction companies.",
  description:
    "Rococo Creative is a boutique digital agency for construction company owners. We combine strategy, design, and AI-driven marketing to win better work and build brands that last.",
  locale: "en_US",
  // TODO: Confirm the public contact email, phone, and service area.
  contact: {
    email: "hello@rocococreative.io",
    phone: null as string | null,
    serviceArea: "TODO: Service area (e.g. Based in Texas, working with builders nationwide)",
  },
  // TODO: Add profile URLs. Empty values are hidden in the footer.
  social: {
    linkedin: "",
    instagram: "",
  },
  // TODO: Point at the real client portal, or remove.
  clientPortalUrl: "",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
];

/** CTA vocabulary from the brand system. Use these labels verbatim. */
export const cta = {
  primary: { label: "Discuss a project", href: "/contact" },
  proposal: { label: "Request for Proposal", href: "/contact?intent=proposal" },
  clarity: { label: "Gain Clarity Today", href: "/contact?intent=clarity" },
} as const;

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Insights", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "Strategy", href: "/services#strategy" },
      { label: "Brand & Design", href: "/services#design" },
      { label: "AI-driven Marketing", href: "/services#marketing" },
    ],
  },
];
