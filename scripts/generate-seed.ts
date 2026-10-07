/**
 * Generates supabase/seed.sql from the local fallback content.
 *
 *   npm run db:seed-sql
 *   (node --experimental-strip-types --no-warnings scripts/generate-seed.ts > supabase/seed.sql)
 *
 * Runs on Node 22.6+ with built-in TypeScript type stripping, so this file and
 * every module it imports at runtime must use relative imports (no "@/" alias)
 * and erasable TypeScript only (no enums, namespaces, or parameter properties).
 *
 * The SQL is written to stdout. Every value is validated against the CHECK
 * constraints in supabase/migrations/20261007000000_init.sql first; on any
 * violation the script prints the problems to stderr and exits with code 1.
 * The output is deterministic (no timestamps), so regenerating without content
 * changes produces no diff.
 */

import { fallbackCaseStudies, fallbackPosts, fallbackTestimonials } from "../src/content/fallback.ts";
import type { CaseStudy, Post, Testimonial } from "../src/lib/types.ts";

/* ---------------------------------------------------------------------------
 * Validation (mirrors the CHECK constraints in the migration)
 * ------------------------------------------------------------------------- */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const problems: string[] = [];

/** Postgres char_length counts characters (code points), not UTF-16 units. */
function charLength(value: string): number {
  return [...value].length;
}

function checkLength(where: string, field: string, value: string | null, min: number, max: number): void {
  if (value === null) return;
  const length = charLength(value);
  if (length < min || length > max) problems.push(`${where}: ${field} must be ${min} to ${max} characters (is ${length})`);
}

function checkSlug(where: string, slug: string, seen: Set<string>): void {
  if (!SLUG_PATTERN.test(slug)) problems.push(`${where}: slug "${slug}" must match ${SLUG_PATTERN}`);
  if (seen.has(slug)) problems.push(`${where}: duplicate slug "${slug}"`);
  seen.add(slug);
}

function checkTimestamp(where: string, field: string, value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value) || Number.isNaN(Date.parse(value))) {
    problems.push(`${where}: ${field} must be an ISO 8601 timestamp (is "${value}")`);
  }
}

function validatePost(item: Post, seen: Set<string>): void {
  const where = `posts[${item.slug}]`;
  checkSlug(where, item.slug, seen);
  checkLength(where, "title", item.title, 1, 200);
  checkLength(where, "excerpt", item.excerpt, 0, 400);
  checkLength(where, "seo_title", item.seoTitle, 0, 70);
  checkLength(where, "seo_description", item.seoDescription, 0, 200);
  checkLength(where, "author_name", item.authorName, 1, Number.POSITIVE_INFINITY);
  checkTimestamp(where, "published_at", item.publishedAt);
  checkTimestamp(where, "updated_at", item.updatedAt);
}

function validateCaseStudy(item: CaseStudy, seen: Set<string>): void {
  const where = `case_studies[${item.slug}]`;
  checkSlug(where, item.slug, seen);
  checkLength(where, "client_name", item.clientName, 1, 160);
  checkLength(where, "title", item.title, 1, 200);
  checkLength(where, "summary", item.summary, 0, 600);
  if (item.year !== null && (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100)) {
    problems.push(`${where}: year must be null or an integer from 2000 to 2100 (is ${item.year})`);
  }
  if (!Array.isArray(item.metrics)) problems.push(`${where}: metrics must be an array`);
  checkTimestamp(where, "published_at", item.publishedAt);
  checkTimestamp(where, "updated_at", item.updatedAt);
}

function validateTestimonial(item: Testimonial, index: number, caseStudySlugs: Set<string>): void {
  const where = `testimonials[${index}]`;
  checkLength(where, "quote", item.quote, 1, 1000);
  checkLength(where, "author_name", item.authorName, 1, 120);
  if (item.caseStudySlug !== null && !caseStudySlugs.has(item.caseStudySlug)) {
    problems.push(`${where}: case study "${item.caseStudySlug}" is not in fallbackCaseStudies`);
  }
}

/* ---------------------------------------------------------------------------
 * SQL literals
 * ------------------------------------------------------------------------- */

function assertSafeText(value: string): void {
  if (value.includes("\u0000")) throw new Error("Text values cannot contain NUL characters.");
}

/** Standard single-quoted literal (standard_conforming_strings is on, so only quotes need escaping). */
function text(value: string): string {
  assertSafeText(value);
  return `'${value.replaceAll("'", "''")}'`;
}

function nullableText(value: string | null | undefined): string {
  return value === null || value === undefined ? "null" : text(value);
}

/**
 * Dollar-quoted literal for long Markdown. The tag is unique to the text: if
 * the text could close the quote early (it contains the tag, or ends in a way
 * that merges with it), a numbered tag is used instead.
 */
function markdown(value: string): string {
  assertSafeText(value);
  for (let n = 0; ; n += 1) {
    const delimiter = `$${n === 0 ? "rococo_md" : `rococo_md_${n}`}$`;
    if ((value + delimiter).indexOf(delimiter) === value.length) return `${delimiter}${value}${delimiter}`;
  }
}

function textArray(values: string[]): string {
  return values.length === 0 ? "'{}'::text[]" : `ARRAY[${values.map(text).join(", ")}]::text[]`;
}

function timestamptz(iso: string): string {
  return `${text(iso)}::timestamptz`;
}

function jsonb(value: unknown): string {
  return `${text(JSON.stringify(value))}::jsonb`;
}

function integer(value: number | null): string {
  return value === null ? "null" : String(Math.trunc(value));
}

function boolean(value: boolean): string {
  return value ? "true" : "false";
}

/** Renders "insert ... values (...) on conflict (slug) do update set ..." for one row. */
function upsertBySlug(table: string, row: [column: string, value: string][], updateExclude: string[]): string {
  const columns = row.map(([column]) => column);
  const updates = columns
    .filter((column) => !updateExclude.includes(column))
    .map((column) => `  ${column} = excluded.${column}`);
  return [
    `insert into ${table} (`,
    `  ${columns.join(", ")}`,
    `) values (`,
    row.map(([, value]) => `  ${value}`).join(",\n"),
    `)`,
    `on conflict (slug) do update set`,
    `${updates.join(",\n")};`,
  ].join("\n");
}

/* ---------------------------------------------------------------------------
 * Rows
 * ------------------------------------------------------------------------- */

/**
 * Columns never updated on conflict: the slug is the conflict key, and
 * created_at keeps its first value. updated_at is stamped by the table's
 * set_updated_at trigger on every update.
 */
const KEEP_ON_CONFLICT = ["slug", "created_at", "updated_at"];

function postSql(item: Post): string {
  return upsertBySlug(
    "public.posts",
    [
      ["slug", text(item.slug)],
      ["title", text(item.title)],
      ["excerpt", text(item.excerpt)],
      ["body", markdown(item.body)],
      ["cover_image_url", nullableText(item.coverImageUrl)],
      ["cover_image_alt", nullableText(item.coverImageAlt)],
      ["author_name", text(item.authorName)],
      ["author_role", nullableText(item.authorRole)],
      ["tags", textArray(item.tags)],
      // Left null on purpose: the site derives reading time from the generated
      // word_count column, so it stays accurate when the body is edited.
      ["reading_minutes", "null"],
      ["seo_title", nullableText(item.seoTitle)],
      ["seo_description", nullableText(item.seoDescription)],
      ["status", text("published")],
      ["published_at", timestamptz(item.publishedAt)],
      ["created_at", timestamptz(item.publishedAt)],
      ["updated_at", timestamptz(item.updatedAt)],
    ],
    KEEP_ON_CONFLICT,
  );
}

function caseStudySql(item: CaseStudy, index: number): string {
  return upsertBySlug(
    "public.case_studies",
    [
      ["slug", text(item.slug)],
      ["client_name", text(item.clientName)],
      ["title", text(item.title)],
      ["summary", text(item.summary)],
      ["sector", nullableText(item.sector)],
      ["location", nullableText(item.location)],
      ["services", textArray(item.services)],
      ["challenge", markdown(item.challenge)],
      ["approach", markdown(item.approach)],
      ["outcome", markdown(item.outcome)],
      ["metrics", jsonb(item.metrics)],
      ["cover_image_url", nullableText(item.coverImageUrl)],
      ["cover_image_alt", nullableText(item.coverImageAlt)],
      ["website_url", nullableText(item.websiteUrl)],
      ["year", integer(item.year)],
      ["featured", boolean(item.featured)],
      // Keeps the fallback order (featured first, then array order).
      ["sort_order", integer((index + 1) * 10)],
      ["status", text("published")],
      ["published_at", timestamptz(item.publishedAt)],
      ["created_at", timestamptz(item.publishedAt)],
      ["updated_at", timestamptz(item.updatedAt)],
    ],
    KEEP_ON_CONFLICT,
  );
}

function testimonialSql(item: Testimonial, index: number): string {
  const caseStudyId =
    item.caseStudySlug === null
      ? "null::uuid"
      : `(select id from public.case_studies where slug = ${text(item.caseStudySlug)})`;
  const values: [column: string, value: string][] = [
    ["quote", text(item.quote)],
    ["author_name", text(item.authorName)],
    ["author_title", nullableText(item.authorTitle)],
    ["company", nullableText(item.company)],
    ["case_study_id", caseStudyId],
    ["featured", boolean(item.featured)],
    ["sort_order", integer((index + 1) * 10)],
    ["status", text("published")],
  ];
  // "where not exists" keeps real (non-TODO) quotes from being inserted twice on a re-run.
  return [
    `insert into public.testimonials (${values.map(([column]) => column).join(", ")})`,
    `select`,
    values.map(([column, value]) => `  ${value} as ${column}`).join(",\n"),
    `where not exists (`,
    `  select 1 from public.testimonials t`,
    `  where t.quote = ${text(item.quote)} and t.author_name = ${text(item.authorName)}`,
    `);`,
  ].join("\n");
}

/* ---------------------------------------------------------------------------
 * Output
 * ------------------------------------------------------------------------- */

const HEADER = `-- =============================================================================
-- Rococo Creative: starter content
--
-- GENERATED FILE. Do not edit by hand.
--   Source:      src/content/fallback.ts
--   Regenerate:  npm run db:seed-sql   (scripts/generate-seed.ts)
--
-- Run it AFTER the schema migration (supabase/migrations/20261007000000_init.sql):
--   * Supabase dashboard: SQL Editor > New query, paste this whole file, Run.
--   * Supabase CLI with a local stack: npx supabase db reset
--     (re-creates the LOCAL database, applies migrations, then runs this file).
--     Never reset a linked production project: it deletes all data.
--
-- What it does (one transaction; safe to run more than once)
--   * Blog posts and case studies are upserted by slug. Re-running OVERWRITES
--     rows with these slugs, including edits made in the dashboard.
--   * Placeholder testimonials (quote beginning with 'TODO:') are deleted and
--     re-inserted, linked to their case study by slug.
--   * Everything is inserted as published so a new project matches the local
--     fallback content. Case studies and testimonials are PLACEHOLDERS: replace
--     them with real, approved content (or set status = 'draft') before launch.
-- =============================================================================`;

function generate(): string {
  const postSlugs = new Set<string>();
  const caseStudySlugs = new Set<string>();
  fallbackPosts.forEach((item) => validatePost(item, postSlugs));
  fallbackCaseStudies.forEach((item) => validateCaseStudy(item, caseStudySlugs));
  fallbackTestimonials.forEach((item, index) => validateTestimonial(item, index, caseStudySlugs));

  if (problems.length > 0) {
    throw new Error(`Seed content violates the database constraints:\n  - ${problems.join("\n  - ")}`);
  }

  // Featured case studies first, matching how the site orders them.
  const orderedCaseStudies = [
    ...fallbackCaseStudies.filter((item) => item.featured),
    ...fallbackCaseStudies.filter((item) => !item.featured),
  ];

  return [
    HEADER,
    "",
    "begin;",
    "",
    `-- Blog posts (${fallbackPosts.length})`,
    ...fallbackPosts.map((item) => `${postSql(item)}\n`),
    `-- Case studies (${orderedCaseStudies.length}): PLACEHOLDERS`,
    ...orderedCaseStudies.map((item, index) => `${caseStudySql(item, index)}\n`),
    `-- Testimonials (${fallbackTestimonials.length}): PLACEHOLDERS`,
    "delete from public.testimonials where quote like 'TODO:%';",
    "",
    ...fallbackTestimonials.map((item, index) => `${testimonialSql(item, index)}\n`),
    "commit;",
    "",
  ].join("\n");
}

try {
  process.stdout.write(generate());
} catch (error) {
  process.stderr.write(`[generate-seed] ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
