import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { CONTENT_TAGS } from "@/lib/content";

/**
 * On-demand revalidation for Supabase Database Webhooks.
 *
 * Configure in Supabase: Database > Webhooks > Create
 *   Tables:  posts, case_studies, testimonials (INSERT, UPDATE, DELETE)
 *   Method:  POST
 *   URL:     https://<your-domain>/api/revalidate
 *   Header:  x-revalidate-secret: <REVALIDATE_SECRET>
 *
 * The payload is { type, table, schema, record, old_record }. We expire the
 * list tag plus the specific slug tag(s) so edits appear on the next request.
 */

type WebhookPayload = {
  type?: "INSERT" | "UPDATE" | "DELETE";
  table?: string;
  record?: { slug?: unknown } | null;
  old_record?: { slug?: unknown } | null;
};

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function slugsFrom(payload: WebhookPayload): string[] {
  return [payload.record?.slug, payload.old_record?.slug].filter(
    (slug, i, all): slug is string => typeof slug === "string" && slug.length > 0 && all.indexOf(slug) === i,
  );
}

function tagsFor(payload: WebhookPayload): string[] {
  switch (payload.table) {
    case "posts":
      return [CONTENT_TAGS.posts, ...slugsFrom(payload).map(CONTENT_TAGS.post)];
    case "case_studies":
      // Testimonials embed case study slugs, so refresh them too.
      return [CONTENT_TAGS.caseStudies, CONTENT_TAGS.testimonials, ...slugsFrom(payload).map(CONTENT_TAGS.caseStudy)];
    case "testimonials":
      return [CONTENT_TAGS.testimonials];
    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, error: "REVALIDATE_SECRET is not configured" }, { status: 500 });
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!safeEqual(provided, secret)) {
    return Response.json({ revalidated: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as WebhookPayload | null;
  if (!payload || typeof payload !== "object") {
    return Response.json({ revalidated: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const tags = tagsFor(payload);
  if (tags.length === 0) {
    return Response.json({ revalidated: false, error: `Unknown table: ${String(payload.table)}` }, { status: 400 });
  }

  // Webhooks originate outside a Server Action, so expire immediately.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tags, at: new Date().toISOString() });
}
