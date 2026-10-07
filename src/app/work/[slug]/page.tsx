import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/content";

/**
 * The complete page must be static. Known slugs prerender at build; an unknown
 * slug is generated once on first request (and cached), so missing content
 * resolves to notFound() before any HTML is sent: a real HTTP 404.
 */
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Not found" };
  return { title: study.title, description: study.summary };
}

/** STUB: replaced in the build phase. */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();
  return (
    <article className="container">
      <h1>{study.title}</h1>
    </article>
  );
}
