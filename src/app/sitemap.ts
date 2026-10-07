import type { MetadataRoute } from "next";

import { getCaseStudies, getPosts } from "@/lib/content";
import { siteUrl } from "@/lib/env";

const staticRoutes: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, studies] = await Promise.all([getPosts(), getCaseStudies()]);

  return [
    ...staticRoutes.map((r) => ({
      url: `${siteUrl}${r.path === "/" ? "" : r.path}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...studies.map((s) => ({
      url: `${siteUrl}/work/${s.slug}`,
      lastModified: s.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
