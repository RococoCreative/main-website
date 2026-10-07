import { notFound } from "next/navigation";

import { getPostBySlug, getPostSlugs } from "@/lib/content";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Rococo Creative Insights: article title card";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Metadata image routes do not inherit the page's generateStaticParams, so the
 * slugs are listed here too: every card renders at build time. A slug that
 * appears later renders once on first request and is then cached.
 * getPostSlugs() never returns an empty list (Cache Components requirement).
 */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  // Unknown slugs 404 instead of rendering (and caching) a generic card.
  if (!post) notFound();
  return renderOgImage({ eyebrow: post.tags[0] ?? "Insights", title: post.title });
}
