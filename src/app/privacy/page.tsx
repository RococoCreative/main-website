import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Privacy" };

/** STUB: replaced in the build phase. */
export default function PrivacyPage() {
  return <PageHero eyebrow="Privacy" title="Privacy" />;
}
