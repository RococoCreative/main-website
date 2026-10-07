/**
 * Domain types used by pages and components.
 * Database rows (snake_case) are mapped to these shapes in src/lib/content.ts.
 * Dates are ISO 8601 strings so values stay serializable across the
 * server/client boundary and inside cached functions.
 */

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  authorName: string;
  authorRole: string | null;
  tags: string[];
  readingMinutes: number;
  publishedAt: string;
};

export type Post = PostSummary & {
  /** Markdown (GitHub-flavored). */
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
};

export type CaseStudyMetric = {
  label: string;
  /** Display value, e.g. "+40%". Placeholders use a value beginning with "TODO". */
  value: string;
  note?: string;
};

export type CaseStudySummary = {
  slug: string;
  clientName: string;
  title: string;
  summary: string;
  sector: string | null;
  location: string | null;
  services: string[];
  metrics: CaseStudyMetric[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  year: number | null;
  featured: boolean;
  publishedAt: string;
};

export type CaseStudy = CaseStudySummary & {
  /** Markdown */
  challenge: string;
  /** Markdown */
  approach: string;
  /** Markdown */
  outcome: string;
  websiteUrl: string | null;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string | null;
  company: string | null;
  caseStudySlug: string | null;
  featured: boolean;
};

/** Values accepted by the contact form. Mirrors public.contact_submissions. */
export type ContactSubmission = {
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  phone: string | null;
  companyType: string | null;
  services: string[];
  budget: string | null;
  timeline: string | null;
  message: string;
  sourcePath: string | null;
  consent: boolean;
};

export type ContactFieldName =
  | "name"
  | "email"
  | "company"
  | "role"
  | "phone"
  | "companyType"
  | "services"
  | "budget"
  | "timeline"
  | "message"
  | "consent";

export type ContactFormState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors: Partial<Record<ContactFieldName, string>>;
      /** Echo of submitted values so the form can repopulate without JS state. */
      values: Partial<Record<ContactFieldName, string | string[]>>;
    }
  | { status: "success"; message: string };
