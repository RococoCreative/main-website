import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Services" };

/** STUB: replaced in the build phase. */
export default function ServicesPage() {
  return <PageHero eyebrow="Services" title="Services" />;
}
