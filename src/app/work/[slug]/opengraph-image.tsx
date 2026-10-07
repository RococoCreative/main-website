import { notFound } from "next/navigation";

import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/content";
import { isTodo } from "@/lib/format";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Rococo Creative case study";
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Image routes are Route Handlers and do not inherit the page's params. Without
 * this export every case study image would render per request; with it, one
 * PNG per published slug is generated at build time, matching the page.
 */
export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  // Unknown slugs 404 instead of rendering (and caching) a generic card.
  if (!study) notFound();
  const sector = study.sector && !isTodo(study.sector) ? study.sector : null;

  return renderOgImage({ eyebrow: sector ?? "Case study", title: study.title });
}
