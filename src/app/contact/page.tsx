import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Contact" };

/** STUB: replaced in the build phase. */
export default function ContactPage() {
  return <PageHero eyebrow="Contact" title="Contact" />;
}
