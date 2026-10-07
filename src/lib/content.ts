import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { fallbackCaseStudies, fallbackPosts, fallbackTestimonials } from "@/content/fallback";
import { isSupabaseConfigured } from "@/lib/env";
import { minutesFromWords } from "@/lib/reading-time";
import type { Database, Json } from "@/lib/supabase/database.types";
import { getSupabase } from "@/lib/supabase/client";
import type { CaseStudy, CaseStudyMetric, CaseStudySummary, Post, PostSummary, Testimonial } from "@/lib/types";

/* =============================================================================
 * Content data layer
 *
 * Every public function is a cached scope ('use cache') so pages prerender to
 * static HTML and refresh in the background (cacheLife 'hours'). A Supabase
 * Database Webhook can expire content instantly via /api/revalidate, which
 * calls revalidateTag() with the tags below.
 *
 * Source rules
 *   1. Supabase not configured  -> local fallback content (src/content/fallback.ts)
 *   2. Supabase configured      -> database is the source of truth (empty = empty)
 *   3. Supabase query fails     -> throw. At build time the deploy fails loudly
 *      and the previous deployment stays live. At runtime the last good cached
 *      page keeps serving. Placeholder content never replaces real content.
 * ========================================================================== */

export const CONTENT_TAGS = {
  posts: "posts",
  post: (slug: string) => `post:${slug}`,
  caseStudies: "case-studies",
  caseStudy: (slug: string) => `case-study:${slug}`,
  testimonials: "testimonials",
} as const;

/** generateStaticParams must return at least one entry under Cache Components. */
export const EMPTY_SLUG = "__empty__";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type CaseStudyRow = Database["public"]["Tables"]["case_studies"]["Row"];

const POST_SUMMARY_COLUMNS =
  "slug,title,excerpt,cover_image_url,cover_image_alt,author_name,author_role,tags,reading_minutes,word_count,published_at,updated_at";
const CASE_STUDY_SUMMARY_COLUMNS =
  "slug,client_name,title,summary,sector,location,services,metrics,cover_image_url,cover_image_alt,year,featured,published_at,updated_at";

class ContentError extends Error {
  constructor(what: string, cause: { message: string; code?: string }) {
    super(`[content] Failed to load ${what} from Supabase: ${cause.message}${cause.code ? ` (${cause.code})` : ""}`);
    this.name = "ContentError";
  }
}

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function toMetrics(value: Json): CaseStudyMetric[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const label = typeof item.label === "string" ? item.label : null;
      const metricValue = typeof item.value === "string" || typeof item.value === "number" ? String(item.value) : null;
      if (label && metricValue) {
        return [{ label, value: metricValue, ...(typeof item.note === "string" ? { note: item.note } : {}) }];
      }
    }
    return [];
  });
}

type PostSummaryRow = Pick<
  PostRow,
  | "slug"
  | "title"
  | "excerpt"
  | "cover_image_url"
  | "cover_image_alt"
  | "author_name"
  | "author_role"
  | "tags"
  | "reading_minutes"
  | "word_count"
  | "published_at"
  | "updated_at"
>;

function mapPostSummary(row: PostSummaryRow): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt,
    authorName: row.author_name,
    authorRole: row.author_role,
    tags: row.tags ?? [],
    readingMinutes: row.reading_minutes ?? minutesFromWords(row.word_count),
    publishedAt: row.published_at ?? new Date(0).toISOString(),
    updatedAt: row.updated_at,
  };
}

function mapPost(row: PostRow): Post {
  return {
    ...mapPostSummary(row),
    body: row.body,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

type CaseStudySummaryRow = Pick<
  CaseStudyRow,
  | "slug"
  | "client_name"
  | "title"
  | "summary"
  | "sector"
  | "location"
  | "services"
  | "metrics"
  | "cover_image_url"
  | "cover_image_alt"
  | "year"
  | "featured"
  | "published_at"
  | "updated_at"
>;

function mapCaseStudySummary(row: CaseStudySummaryRow): CaseStudySummary {
  return {
    slug: row.slug,
    clientName: row.client_name,
    title: row.title,
    summary: row.summary,
    sector: row.sector,
    location: row.location,
    services: row.services ?? [],
    metrics: toMetrics(row.metrics),
    coverImageUrl: row.cover_image_url,
    coverImageAlt: row.cover_image_alt,
    year: row.year,
    featured: row.featured,
    publishedAt: row.published_at ?? new Date(0).toISOString(),
    updatedAt: row.updated_at,
  };
}

function mapCaseStudy(row: CaseStudyRow): CaseStudy {
  return {
    ...mapCaseStudySummary(row),
    challenge: row.challenge,
    approach: row.approach,
    outcome: row.outcome,
    websiteUrl: row.website_url,
  };
}

function toPostSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImageUrl: post.coverImageUrl,
    coverImageAlt: post.coverImageAlt,
    authorName: post.authorName,
    authorRole: post.authorRole,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  };
}

function toCaseStudySummary(study: CaseStudy): CaseStudySummary {
  return {
    slug: study.slug,
    clientName: study.clientName,
    title: study.title,
    summary: study.summary,
    sector: study.sector,
    location: study.location,
    services: study.services,
    metrics: study.metrics,
    coverImageUrl: study.coverImageUrl,
    coverImageAlt: study.coverImageAlt,
    year: study.year,
    featured: study.featured,
    publishedAt: study.publishedAt,
    updatedAt: study.updatedAt,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function sortByDateDesc<T extends { publishedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/* ---------------------------------------------------------------------------
 * Blog posts
 * ------------------------------------------------------------------------- */
export async function getPosts(options: { limit?: number; tag?: string } = {}): Promise<PostSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.posts);

  const { limit, tag } = options;
  const supabase = getSupabase();
  if (!supabase) {
    const items = sortByDateDesc(fallbackPosts.map(toPostSummary));
    const filtered = tag ? items.filter((p) => p.tags.includes(tag)) : items;
    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }

  let query = supabase
    .from("posts")
    .select(POST_SUMMARY_COLUMNS)
    .eq("status", "published")
    .lte("published_at", nowIso())
    .order("published_at", { ascending: false });
  if (tag) query = query.contains("tags", [tag]);
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new ContentError("posts", error);
  return (data ?? []).map(mapPostSummary);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.posts, CONTENT_TAGS.post(slug));

  const supabase = getSupabase();
  if (!supabase) return fallbackPosts.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", nowIso())
    .maybeSingle();
  if (error) throw new ContentError(`post "${slug}"`, error);
  return data ? mapPost(data) : null;
}

/** Slugs for generateStaticParams. Never empty (Cache Components requirement). */
export async function getPostSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.posts);

  const supabase = getSupabase();
  if (!supabase) return fallbackPosts.map((p) => p.slug);

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published")
    .lte("published_at", nowIso());
  if (error) throw new ContentError("post slugs", error);
  const slugs = (data ?? []).map((r) => r.slug);
  return slugs.length ? slugs : [EMPTY_SLUG];
}

/* ---------------------------------------------------------------------------
 * Case studies
 * ------------------------------------------------------------------------- */
export async function getCaseStudies(options: { featured?: boolean; limit?: number } = {}): Promise<CaseStudySummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.caseStudies);

  const { featured, limit } = options;
  const supabase = getSupabase();
  if (!supabase) {
    let items = fallbackCaseStudies.map(toCaseStudySummary);
    if (featured) items = items.filter((c) => c.featured);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  }

  let query = supabase
    .from("case_studies")
    .select(CASE_STUDY_SUMMARY_COLUMNS)
    .eq("status", "published")
    .lte("published_at", nowIso())
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });
  if (featured) query = query.eq("featured", true);
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new ContentError("case studies", error);
  return (data ?? []).map(mapCaseStudySummary);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.caseStudies, CONTENT_TAGS.caseStudy(slug));

  const supabase = getSupabase();
  if (!supabase) return fallbackCaseStudies.find((c) => c.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", nowIso())
    .maybeSingle();
  if (error) throw new ContentError(`case study "${slug}"`, error);
  return data ? mapCaseStudy(data) : null;
}

/** Slugs for generateStaticParams. Never empty (Cache Components requirement). */
export async function getCaseStudySlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.caseStudies);

  const supabase = getSupabase();
  if (!supabase) return fallbackCaseStudies.map((c) => c.slug);

  const { data, error } = await supabase
    .from("case_studies")
    .select("slug")
    .eq("status", "published")
    .lte("published_at", nowIso());
  if (error) throw new ContentError("case study slugs", error);
  const slugs = (data ?? []).map((r) => r.slug);
  return slugs.length ? slugs : [EMPTY_SLUG];
}

/* ---------------------------------------------------------------------------
 * Testimonials
 * ------------------------------------------------------------------------- */
export async function getTestimonials(options: { featured?: boolean; limit?: number } = {}): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAGS.testimonials);

  const { featured, limit } = options;
  const supabase = getSupabase();
  if (!supabase) {
    const items = featured ? fallbackTestimonials.filter((t) => t.featured) : fallbackTestimonials;
    return typeof limit === "number" ? items.slice(0, limit) : items;
  }

  let query = supabase
    .from("testimonials")
    .select("id,quote,author_name,author_title,company,featured,case_studies(slug)")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });
  if (featured) query = query.eq("featured", true);
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new ContentError("testimonials", error);
  return (data ?? []).map((row) => ({
    id: row.id,
    quote: row.quote,
    authorName: row.author_name,
    authorTitle: row.author_title,
    company: row.company,
    featured: row.featured,
    caseStudySlug: row.case_studies?.slug ?? null,
  }));
}

/** True when content is coming from local fallback data (no Supabase env vars). */
export function isUsingFallbackContent(): boolean {
  return !isSupabaseConfigured;
}
