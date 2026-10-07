import { createElement } from "react";

import { siteUrl } from "@/lib/env";
import { site } from "@/lib/site";

/**
 * JSON-LD helpers. Rendered as a native <script type="application/ld+json">
 * (not next/script), with "<" escaped per the Next.js JSON-LD guide.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  });
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl).toString();
}

export function organizationJsonLd(): Record<string, unknown> {
  const sameAs = [site.social.linkedin, site.social.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    // Organization until Rococo supplies a postal address and service area
    // (site.contact). ProfessionalService is a LocalBusiness subtype that
    // requires an address; switch back and add address + areaServed then.
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/rococo-horizontal.png"),
    image: absoluteUrl("/opengraph-image"),
    description: site.description,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    knowsAbout: [
      "Construction marketing",
      "Brand strategy",
      "Website design",
      "Local SEO",
      "Marketing automation",
      "AI-driven marketing",
    ],
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  image?: string | null;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { "@type": input.authorName === site.name ? "Organization" : "Person", name: input.authorName },
    publisher: { "@id": absoluteUrl("/#organization") },
    ...(input.image ? { image: input.image } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
