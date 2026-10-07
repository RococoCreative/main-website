import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { Section } from "@/components/ui/Section";
import { isTodo } from "@/lib/format";
import type { CaseStudySummary } from "@/lib/types";

import { CaseStudyCard } from "./CaseStudyCard";
import { WorkEmptyState } from "./WorkEmptyState";
import { WorkFilter } from "./WorkFilter";
import styles from "./WorkIndex.module.css";

const HEADING_ID = "work-index-title";

/**
 * The /work project index. Cards render on the server and are handed to the
 * client filter as finished elements, so the filter ships only its own logic.
 * Closes with the page's single gold flourish.
 */
export function WorkIndex({ studies }: { studies: CaseStudySummary[] }) {
  return (
    <Section aria-labelledby={HEADING_ID} spacing="tight">
      {studies.length > 0 ? (
        <WorkFilter
          headingId={HEADING_ID}
          heading={
            <Eyebrow as="h2" id={HEADING_ID} tone="text">
              Project index
            </Eyebrow>
          }
          items={studies.map((study) => ({
            slug: study.slug,
            sector: study.sector && !isTodo(study.sector) ? study.sector : null,
            services: study.services.filter((service) => !isTodo(service)),
            card: <CaseStudyCard study={study} />,
          }))}
        />
      ) : (
        <WorkEmptyState headingId={HEADING_ID} />
      )}
      <Flourish className={styles.flourish} />
    </Section>
  );
}
