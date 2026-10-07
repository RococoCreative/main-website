import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Blog" };

/** STUB: replaced in the build phase. */
export default function BlogPage() {
  return <PageHero eyebrow="Blog" title="Blog" />;
}
