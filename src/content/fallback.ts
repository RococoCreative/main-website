/**
 * Local fallback content.
 *
 * Used when Supabase environment variables are not set (local development,
 * CI, or a preview without credentials). The same entries are written to
 * supabase/seed.sql by `npm run db:seed-sql`, so a fresh Supabase project
 * starts with identical starter content.
 *
 * Blog articles are complete, publishable drafts for Rococo Creative to review.
 * Case studies and testimonials are STRUCTURAL PLACEHOLDERS: every client name,
 * quote, and metric is marked TODO and must be replaced with real, approved
 * facts before launch. Nothing here should be presented as a real result.
 */

import { estimateReadingMinutes } from "@/lib/reading-time";
import type { CaseStudy, Post, Testimonial } from "@/lib/types";

type PostInput = Omit<Post, "readingMinutes">;

function post(input: PostInput): Post {
  return { ...input, readingMinutes: estimateReadingMinutes(input.body) };
}

export const fallbackPosts: Post[] = [
  post({
    slug: "your-website-is-a-bid-package",
    title: "Your website is a bid package. Treat it like one.",
    excerpt:
      "Owners and developers read your website the way you read a set of drawings: looking for evidence that you are organized, capable, and safe to hire.",
    coverImageUrl: null,
    coverImageAlt: null,
    authorName: "Rococo Creative",
    authorRole: null,
    tags: ["Strategy", "Websites"],
    seoTitle: null,
    seoDescription: null,
    publishedAt: "2026-09-15T14:00:00.000Z",
    updatedAt: "2026-09-15T14:00:00.000Z",
    body: `Before an owner calls you, they have already reviewed you. TODO: expand this draft.`,
  }),
  post({
    slug: "speed-to-lead-the-first-hour",
    title: "Speed to lead: what happens in the first hour after an inquiry",
    excerpt:
      "Most contractors lose good work before the first conversation. A simple response system closes that gap without adding headcount.",
    coverImageUrl: null,
    coverImageAlt: null,
    authorName: "Rococo Creative",
    authorRole: null,
    tags: ["AI & Automation", "Lead Generation"],
    seoTitle: null,
    seoDescription: null,
    publishedAt: "2026-08-25T14:00:00.000Z",
    updatedAt: "2026-08-25T14:00:00.000Z",
    body: `An inquiry is a perishable asset. TODO: expand this draft.`,
  }),
  post({
    slug: "local-search-for-contractors",
    title: "Local search for contractors: a field guide",
    excerpt:
      "How owners actually find builders in your market, and the handful of fundamentals that decide whether they find you.",
    coverImageUrl: null,
    coverImageAlt: null,
    authorName: "Rococo Creative",
    authorRole: null,
    tags: ["SEO", "Lead Generation"],
    seoTitle: null,
    seoDescription: null,
    publishedAt: "2026-08-04T14:00:00.000Z",
    updatedAt: "2026-08-04T14:00:00.000Z",
    body: `Search is where most commercial and residential projects begin. TODO: expand this draft.`,
  }),
];

export const fallbackCaseStudies: CaseStudy[] = [
  {
    slug: "commercial-gc-brand-and-website",
    clientName: "TODO: Client name",
    title: "A brand and website built to win larger commercial bids",
    summary:
      "TODO: One or two sentences on the client, the problem, and the result. Placeholder structure only.",
    sector: "Commercial general contractor",
    location: "TODO: City, State",
    services: ["Strategy", "Brand & Identity", "Website"],
    metrics: [
      { label: "Qualified inquiries", value: "TODO", note: "Real figure and time period required" },
      { label: "Average project size", value: "TODO", note: "Real figure required" },
    ],
    coverImageUrl: null,
    coverImageAlt: null,
    year: null,
    featured: true,
    publishedAt: "2026-09-01T14:00:00.000Z",
    challenge: "TODO: Describe the starting point in the client's terms.",
    approach: "TODO: Describe what Rococo did and why.",
    outcome: "TODO: Describe verified results.",
    websiteUrl: null,
    updatedAt: "2026-09-01T14:00:00.000Z",
  },
  {
    slug: "design-build-lead-system",
    clientName: "TODO: Client name",
    title: "A lead system that answers every inquiry in minutes",
    summary: "TODO: One or two sentences on the client, the problem, and the result. Placeholder structure only.",
    sector: "Design-build firm",
    location: "TODO: City, State",
    services: ["CRM & Automation", "AI-driven Marketing", "Paid Search"],
    metrics: [
      { label: "Median response time", value: "TODO", note: "Real figure required" },
      { label: "Consultations booked", value: "TODO", note: "Real figure and time period required" },
    ],
    coverImageUrl: null,
    coverImageAlt: null,
    year: null,
    featured: true,
    publishedAt: "2026-08-12T14:00:00.000Z",
    challenge: "TODO: Describe the starting point in the client's terms.",
    approach: "TODO: Describe what Rococo did and why.",
    outcome: "TODO: Describe verified results.",
    websiteUrl: null,
    updatedAt: "2026-08-12T14:00:00.000Z",
  },
  {
    slug: "specialty-trade-local-search",
    clientName: "TODO: Client name",
    title: "Local search visibility for a growing specialty trade",
    summary: "TODO: One or two sentences on the client, the problem, and the result. Placeholder structure only.",
    sector: "Specialty trade contractor",
    location: "TODO: City, State",
    services: ["Local SEO", "Website", "Reporting"],
    metrics: [
      { label: "Map pack visibility", value: "TODO", note: "Real figure required" },
      { label: "Calls from search", value: "TODO", note: "Real figure and time period required" },
    ],
    coverImageUrl: null,
    coverImageAlt: null,
    year: null,
    featured: false,
    publishedAt: "2026-07-20T14:00:00.000Z",
    challenge: "TODO: Describe the starting point in the client's terms.",
    approach: "TODO: Describe what Rococo did and why.",
    outcome: "TODO: Describe verified results.",
    websiteUrl: null,
    updatedAt: "2026-07-20T14:00:00.000Z",
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "placeholder-testimonial-1",
    quote:
      "TODO: Add an approved client quote. The strongest testimonials name the problem, what changed, and a concrete result.",
    authorName: "TODO: Client name",
    authorTitle: "TODO: Title",
    company: "TODO: Company",
    caseStudySlug: "commercial-gc-brand-and-website",
    featured: true,
  },
  {
    id: "placeholder-testimonial-2",
    quote: "TODO: Add a second approved client quote, ideally from a different sector or company size.",
    authorName: "TODO: Client name",
    authorTitle: "TODO: Title",
    company: "TODO: Company",
    caseStudySlug: "design-build-lead-system",
    featured: false,
  },
];
