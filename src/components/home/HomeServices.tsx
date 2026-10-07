import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pillars } from "@/content/services";

import styles from "./HomeServices.module.css";

/** Three service pillars as Swiss columns with large mono index numerals. */
export function HomeServices() {
  return (
    <Section surface="alt" aria-labelledby="services-title">
      <SectionHeader
        eyebrow="Services"
        title="Strategy, design, and marketing, planned as one system."
        titleId="services-title"
        intro={
          <p>
            When each discipline is hired separately, you end up acting as the general contractor. We run all three
            together, so the message, the brand, and the pipeline point at the same work.
          </p>
        }
      />

      <ul className={styles.pillars}>
        {pillars.map((pillar) => (
          <li key={pillar.id} className={styles.pillar}>
            <span className={styles.numeral} aria-hidden="true">
              {pillar.index}
            </span>
            <p className={styles.name}>{pillar.name}</p>
            <h3 className={styles.promise}>{pillar.promise}</h3>
            <p className={styles.summary}>{pillar.summary}</p>
            <ul className={styles.offerings} aria-label={`${pillar.name} services`}>
              {pillar.offerings.map((offering) => (
                <li key={offering.id}>{offering.name}</li>
              ))}
            </ul>
            <ButtonLink href={`/services#${pillar.id}`} variant="ghost" arrow className={styles.explore}>
              Explore {pillar.name}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
