import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";
import { isTodo } from "@/lib/format";
import type { CaseStudySummary } from "@/lib/types";

import styles from "./CaseStudyCard.module.css";
import { CaseStudyCover } from "./CaseStudyCover";
import { TodoAwareText, TodoChip, needsContent, stripTodo } from "./Todo";

/** Three columns from 1100px, two from 640px, one below. */
const DEFAULT_SIZES = "(min-width: 1100px) 400px, (min-width: 640px) 50vw, 100vw";

type CaseStudyCardProps = {
  study: CaseStudySummary;
  headingLevel?: 2 | 3;
  /** Responsive sizes hint for a remote cover photo. Override when the card sits in a different grid. */
  sizes?: string;
  /** Load the cover eagerly when the card renders above the fold. */
  eager?: boolean;
  className?: string;
};

/**
 * Project card: cover, sector eyebrow, title (stretched link), three-line
 * summary, service tags, and the lead metric. The whole card is the hit area;
 * only the title is the link name. Placeholder values render as TODO chips.
 */
export function CaseStudyCard({ study, headingLevel = 3, sizes = DEFAULT_SIZES, eager = false, className }: CaseStudyCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const sector = study.sector && !isTodo(study.sector) ? study.sector : null;
  const metric = study.metrics[0];
  const metricTodo = metric ? needsContent(metric.value) : false;
  const summaryIsTodo = needsContent(study.summary);

  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.media}>
        <CaseStudyCover study={study} sizes={sizes} decorative eager={eager} />
      </div>

      <div className={styles.body}>
        {sector ? <Eyebrow className={styles.eyebrow}>{sector}</Eyebrow> : null}

        <Heading className={styles.title}>
          <Link href={`/work/${study.slug}`} className={styles.link}>
            {study.title}
          </Link>
        </Heading>

        <p className={styles.summary}>
          {summaryIsTodo ? (
            <>
              <TodoChip size="sm" className={styles.inlineChip} />{" "}
              {stripTodo(study.summary) || "Project summary: the client, the problem, and the result."}
            </>
          ) : (
            study.summary
          )}
        </p>

        {study.services.length ? (
          <ul className={styles.services} aria-label="Services">
            {study.services.map((service) => (
              <li key={service}>
                <Badge tone="outline">{service}</Badge>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.footer}>
          {metric ? (
            <dl className={styles.metric}>
              <div>
                <dt className={styles.metricLabel}>{metric.label}</dt>
                <dd className={styles.metricValue}>{metricTodo ? <TodoChip size="md" /> : metric.value}</dd>
                {metric.note ? (
                  <dd className={styles.metricNote}>
                    <TodoAwareText value={metric.note} alreadyMarked={metricTodo} />
                  </dd>
                ) : null}
              </div>
            </dl>
          ) : null}
          <span className={styles.arrow} aria-hidden="true">
            <ArrowRight />
          </span>
        </div>
      </div>
    </article>
  );
}
