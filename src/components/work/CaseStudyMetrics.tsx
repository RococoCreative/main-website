import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { CaseStudyMetric } from "@/lib/types";

import styles from "./CaseStudyMetrics.module.css";
import { TodoAwareText, TodoChip, needsContent } from "./Todo";

const TITLE_ID = "case-study-results";

/**
 * Results band: large mono numerals on sand, separated by hairlines.
 * A placeholder value shows a TODO chip and its note instead of a number.
 */
export function CaseStudyMetrics({ metrics }: { metrics: CaseStudyMetric[] }) {
  if (metrics.length === 0) return null;

  return (
    <Section surface="sand" spacing="tight" aria-labelledby={TITLE_ID}>
      <div className={styles.head}>
        <Eyebrow as="h2" id={TITLE_ID} tone="text">
          Results
        </Eyebrow>
      </div>
      <dl className={styles.metrics}>
        {metrics.map((metric, i) => {
          const todo = needsContent(metric.value);
          return (
            <Reveal key={`${metric.label}-${i}`} className={styles.metric} stagger={Math.min(i, 4) as 0 | 1 | 2 | 3 | 4}>
              <dt className={styles.label}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {metric.label}
              </dt>
              <dd className={todo ? styles.valueTodo : styles.value}>{todo ? <TodoChip size="numeral" /> : metric.value}</dd>
              {metric.note ? (
                <dd className={styles.note}>
                  <TodoAwareText value={metric.note} alreadyMarked={todo} />
                </dd>
              ) : null}
            </Reveal>
          );
        })}
      </dl>
    </Section>
  );
}
