import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Work" };

/** STUB: replaced in the build phase. */
export default function WorkPage() {
  return <PageHero eyebrow="Work" title="Work" />;
}
