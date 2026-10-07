import type { Metadata } from "next";

import { HomeClosing } from "@/components/home/HomeClosing";
import { HomeGap } from "@/components/home/HomeGap";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeInsights } from "@/components/home/HomeInsights";
import { HomeMethod } from "@/components/home/HomeMethod";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeSpeedToLead } from "@/components/home/HomeSpeedToLead";
import { HomeTestimonial } from "@/components/home/HomeTestimonial";
import { HomeWork } from "@/components/home/HomeWork";
import { JsonLd, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

import { pageMetadata } from "@/lib/metadata";
/* Title comes from the root layout's default. */
export const metadata: Metadata = pageMetadata({
  description:
    "Strategy, design, and AI-driven marketing for construction companies: a brand owners trust, a website that wins the shortlist, and a full pipeline.",
  path: "/",
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: site.name,
  url: absoluteUrl("/"),
  description: site.description,
  inLanguage: "en-US",
  publisher: { "@id": absoluteUrl("/#organization") },
};

/**
 * The home page is the brand story, in order: who Rococo is (hero), why it
 * matters (the gap), how the work runs (method), what we do (services),
 * proof of the system (speed to lead, selected work, a client's words),
 * thinking (insights), and the next step (closing CTA).
 * Surfaces alternate: paper, alt, paper, alt, forest, paper, cream, paper, forest.
 * Every content call is a cached scope, so the route prerenders fully static.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeGap />
      <HomeMethod />
      <HomeServices />
      <HomeSpeedToLead />
      <HomeWork />
      <HomeTestimonial />
      <HomeInsights />
      <HomeClosing />
      <JsonLd data={websiteJsonLd} />
    </>
  );
}
