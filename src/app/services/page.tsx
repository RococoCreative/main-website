import type { Metadata } from "next";

import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { GrowthSystemBuilder } from "@/components/services/GrowthSystemBuilder";
import { PillarSection } from "@/components/services/PillarSection";
import { ProcessTimeline } from "@/components/services/ProcessTimeline";
import { SectorList } from "@/components/services/SectorList";
import { ServicesFaq } from "@/components/services/ServicesFaq";
import { ServicesJumpNav } from "@/components/services/ServicesJumpNav";
import { ButtonLink } from "@/components/ui/Button";
import { Flourish } from "@/components/ui/Flourish";
import { Section, type SectionSurface } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { methodPhases } from "@/content/method";
import { pillars, type Pillar } from "@/content/services";
import { JsonLd, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { cta, site } from "@/lib/site";

import { pageMetadata } from "@/lib/metadata";
const description =
  "Strategy, brand and design, and AI-driven marketing for construction companies, planned and run as one system so every piece works toward winning better work.";

export const metadata: Metadata = pageMetadata({ title: "Services", description, path: "/services" });

/** Paper, alt, cream: each pillar repaints its own canvas. */
const PILLAR_SURFACES: Record<Pillar["id"], SectionSurface> = {
  strategy: "paper",
  design: "alt",
  marketing: "cream",
};

/** Offer catalog with its own @id; services point at the site-wide organization node. */
function servicesJsonLd(): Record<string, unknown> {
  const organization = absoluteUrl("/#organization");
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": absoluteUrl("/services#catalog"),
    name: `${site.name} services`,
    url: absoluteUrl("/services"),
    provider: { "@id": organization },
    itemListElement: pillars.map((pillar) => ({
        "@type": "OfferCatalog",
        name: pillar.name,
        description: pillar.summary,
        url: absoluteUrl(`/services#${pillar.id}`),
        itemListElement: pillar.offerings.map((offering) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: offering.name,
            description: offering.outcome,
            serviceType: pillar.name,
            provider: { "@id": organization },
          },
        })),
      })),
  };
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Strategy, design, and marketing that work as one system."
        lead={
          <p>
            Marketing often arrives in pieces: a logo from one vendor, a website from another, ads from a third. We plan,
            build, and run it as one connected system for construction companies, so every piece works toward the same
            result: more of the work you want, from the clients you want.
          </p>
        }
        aside={<ServicesJumpNav />}
      />

      {pillars.map((pillar) => (
        <PillarSection key={pillar.id} pillar={pillar} surface={PILLAR_SURFACES[pillar.id]} />
      ))}

      <Section id="builder" guides aria-labelledby="builder-title">
        <SectionHeader
          eyebrow="Plan your system"
          title="Build your growth system."
          titleId="builder-title"
          intro={
            <p>
              Choose the services you are weighing, or start from a goal. The schematic shows how the pieces connect;
              the summary shows what the system would do and where we would begin.
            </p>
          }
        />
        <GrowthSystemBuilder />
      </Section>

      <Section id="process" surface="alt" aria-labelledby="process-title">
        <SectionHeader
          eyebrow="How we work"
          title="Four phases, in the order a building goes up."
          titleId="process-title"
          intro={
            <p>
              Survey, foundation, frame, finish. Each phase ends with something you can hold, and nothing is built
              before the ground is measured.
            </p>
          }
          actions={
            <ButtonLink href="/#method" variant="ghost" arrow>
              See the method in motion
            </ButtonLink>
          }
        />
        <ProcessTimeline phases={methodPhases} />
      </Section>

      <Section id="sectors" aria-labelledby="sectors-title">
        <SectionHeader
          eyebrow="Who we serve"
          title="Built for the firms that build."
          titleId="sectors-title"
          intro={
            <p>
              General contractors, trades, builders, and developers each win work differently. The system is shaped
              around how yours comes in.
            </p>
          }
        />
        <SectorList />
      </Section>

      <Section id="faq" surface="sand" aria-labelledby="faq-title">
        <ServicesFaq titleId="faq-title" footer={<Flourish />} />
      </Section>

      <CtaBand
        eyebrow="Next step"
        title="Tell us which part of the system to build first."
        body="Send a request for proposal with your goals and timeline, or start with a conversation about your market and your pipeline. Either way, you leave with a clear recommendation on where to begin."
        primary={cta.proposal}
        secondary={cta.primary}
      />

      <JsonLd data={servicesJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
    </>
  );
}
