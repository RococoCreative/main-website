import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/lib/env";

/** Production allows crawling; preview and local builds stay out of search indexes. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
