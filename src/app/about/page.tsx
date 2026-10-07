import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "About" };

/** STUB: replaced in the build phase. */
export default function AboutPage() {
  return <PageHero eyebrow="About" title="About" />;
}
