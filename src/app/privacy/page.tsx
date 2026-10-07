import type { Metadata } from "next";

import { PrivacyNotice, PrivacyStatus } from "@/components/contact/PrivacyNotice";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";

import { pageMetadata } from "@/lib/metadata";
export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Rococo Creative handles the information you share through this website: what the contact form collects, why, where it is stored, and your choices.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy notice."
        lead="What this website collects, why, where it is kept, and the choices you have, in plain language."
        aside={<PrivacyStatus />}
      />
      <Section spacing="default">
        <PrivacyNotice />
      </Section>
    </>
  );
}
