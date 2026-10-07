import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Per-page metadata with complete Open Graph and Twitter fields.
 *
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces the
 * layout's whole object (site name, locale, image). This helper rebuilds the
 * shared fields so every page gets its own og:url and title while keeping the
 * site card image.
 *
 * Routes with their own opengraph-image file must pass `images: "file"`: Next
 * only applies the file-based image when the page's openGraph has no `images`
 * key, so the helper then leaves `images` out of openGraph and twitter.
 */

export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Rococo Creative: strategy, design, and AI-driven marketing for construction companies",
};

type PageMetadataInput = {
  /** Page title without the site suffix (the layout template adds it). Omit for the home page. */
  title?: string;
  description: string;
  /** Canonical path, e.g. "/services". */
  path: string;
  type?: "website" | "article";
  /** Image list, or "file" when the route has its own opengraph-image file. Defaults to the site card. */
  images?: { url: string; width?: number; height?: number; alt?: string }[] | "file";
  /** Search engines: index by default. */
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, type = "website", images, noindex }: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Marketing for construction companies`;
  const ogImages = images === "file" ? null : (images ?? [defaultOgImage]);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: fullTitle,
      description,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImages ? { images: ogImages.map((i) => i.url) } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
