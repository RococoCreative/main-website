import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CaseStudyCard } from "@/components/work/CaseStudyCard";
import { getCaseStudies } from "@/lib/content";

import cards from "./HomeCards.module.css";

/** Selected work: up to three featured case studies (cached content, prerendered). */
export async function HomeWork() {
  const studies = await getCaseStudies({ featured: true, limit: 3 });

  return (
    <Section aria-labelledby="work-title">
      <SectionHeader
        eyebrow="Selected work"
        title="Brands, websites, and lead systems for builders."
        titleId="work-title"
        actions={
          <ButtonLink href="/work" variant="secondary" arrow>
            View all work
          </ButtonLink>
        }
      />

      {studies.length > 0 ? (
        <ul className={cards.cards} data-count={studies.length}>
          {studies.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} headingLevel={3} />
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder label="TODO: Featured work">
          Featured case studies appear here. Publish at least one case study and mark it as featured.
        </Placeholder>
      )}
    </Section>
  );
}
