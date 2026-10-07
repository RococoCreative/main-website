import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section, type SectionSurface } from "@/components/ui/Section";
import type { Pillar } from "@/content/services";

import styles from "./PillarSection.module.css";
import { PILLAR_SHORT_NAMES } from "./system";

type PillarSectionProps = {
  pillar: Pillar;
  surface?: SectionSurface;
};

/**
 * One service pillar as a Swiss spec sheet: a large mono index, the pillar
 * name (H2), its promise and summary, then a schedule of offerings where each
 * row aligns name, outcome, and deliverables to the same grid lines.
 * The section id ("strategy", "design", "marketing") is linked from the footer
 * and the home page.
 */
export function PillarSection({ pillar, surface = "paper" }: PillarSectionProps) {
  const titleId = `${pillar.id}-title`;
  const ids = pillar.offerings.map((o) => o.id).join(",");

  return (
    <Section id={pillar.id} surface={surface} aria-labelledby={titleId}>
      <header className={styles.head}>
        <p className={styles.numeral}>{pillar.index}</p>
        <div className={styles.intro}>
          <Eyebrow>Practice area</Eyebrow>
          <h2 id={titleId} className={styles.title}>
            {pillar.name}
          </h2>
          <p className={styles.promise}>{pillar.promise}</p>
          <p className={styles.summary}>{pillar.summary}</p>
        </div>
      </header>

      <ul className={styles.schedule} aria-label={`${pillar.name} services`}>
        {pillar.offerings.map((offering, i) => {
          const deliverablesId = `${pillar.id}-${offering.id}-deliverables`;
          return (
            <li key={offering.id} className={styles.offering}>
              <div className={styles.offerHead}>
                <p className={styles.code} aria-hidden="true">
                  {pillar.index}.{i + 1}
                </p>
                <h3 className={styles.name}>{offering.name}</h3>
              </div>
              <p className={styles.outcome}>{offering.outcome}</p>
              <div className={styles.deliverables}>
                <p id={deliverablesId} className={styles.label}>
                  Deliverables
                </p>
                <ul className={styles.list} aria-labelledby={deliverablesId}>
                  {offering.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.foot}>
        <ButtonLink href={`/contact?services=${ids}`} variant="secondary" arrow>
          Discuss {PILLAR_SHORT_NAMES[pillar.id].toLowerCase()}
        </ButtonLink>
        <a href="#builder" className={styles.builderLink}>
          Combine with other services
        </a>
      </div>
    </Section>
  );
}
