import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/layout/CtaBand";
import { CaseStudyCoverFigure } from "@/components/work/CaseStudyCoverFigure";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { CaseStudyMetrics } from "@/components/work/CaseStudyMetrics";
import { CaseStudyStory } from "@/components/work/CaseStudyStory";
import { CaseStudyTestimonial } from "@/components/work/CaseStudyTestimonial";
import { NextProject } from "@/components/work/NextProject";
import { nextInOrder } from "@/components/work/story";
import { getCaseStudies, getCaseStudyBySlug, getCaseStudySlugs, getTestimonials } from "@/lib/content";
import { isTodo } from "@/lib/format";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import type { CaseStudy } from "@/lib/types";

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

/** Placeholder summaries never reach search results or link previews. */
function describe(study: CaseStudy): string {
  return isTodo(study.summary) || !study.summary.trim() ? `${study.title}. A case study from ${site.name}.` : study.summary;
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Not found", robots: { index: false, follow: false } };

  const path = `/work/${study.slug}`;
  const description = describe(study);
  const sector = study.sector && !isTodo(study.sector) ? study.sector : undefined;

  return {
    title: study.title,
    description,
    alternates: { canonical: path },
    // No `images` here: the per-slug card from ./opengraph-image.tsx applies only when the page leaves images unset.
    openGraph: {
      type: "article",
      url: path,
      siteName: site.name,
      locale: site.locale,
      title: study.title,
      description,
      publishedTime: study.publishedAt,
      modifiedTime: study.updatedAt,
      section: sector,
      tags: study.services,
    },
    twitter: { card: "summary_large_image", title: study.title, description },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const [studies, testimonials] = await Promise.all([getCaseStudies(), getTestimonials()]);
  const testimonial = testimonials.find((t) => t.caseStudySlug === study.slug) ?? null;
  const next = nextInOrder(studies, study.slug);

  return (
    <>
      <article aria-labelledby="case-study-title">
        <CaseStudyHero study={study} titleId="case-study-title" />
        <CaseStudyCoverFigure study={study} />
        <CaseStudyMetrics metrics={study.metrics} />
        <CaseStudyStory study={study} />
        {testimonial ? <CaseStudyTestimonial testimonial={testimonial} /> : null}
      </article>
      <NextProject next={next} />
      <CtaBand />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: study.title, path: `/work/${study.slug}` },
        ])}
      />
    </>
  );
}
