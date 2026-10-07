import type { Metadata } from "next";

import { AboutHeroAside } from "@/components/about/AboutHeroAside";
import { AboutName } from "@/components/about/AboutName";
import { Engagements } from "@/components/about/Engagements";
import { Principles } from "@/components/about/Principles";
import { Team } from "@/components/about/Team";
import { WhoWeServe } from "@/components/about/WhoWeServe";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";

import { pageMetadata } from "@/lib/metadata";
export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Rococo Creative is a boutique agency for strategy, design, and AI-driven marketing, built for construction companies. Structure first, refinement last.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A boutique agency for the companies that build."
        lead={
          <>
            <p>
              We bring strategy, design, and AI-driven marketing to construction companies: the general contractors,
              trades, builders, and developers who shape the places people live and work.
            </p>
            <p>Our job is to make your reputation easier to find, easier to trust, and easier to choose.</p>
          </>
        }
        aside={<AboutHeroAside />}
      />
      <AboutName />
      <Principles />
      <WhoWeServe />
      <Engagements />
      <Team />
      <CtaBand />
    </>
  );
}
