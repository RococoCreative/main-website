import { Reveal } from "@/components/motion/Reveal";
import type { MethodPhase } from "@/content/method";

import styles from "./ProcessTimeline.module.css";

/**
 * The four method phases as a static Swiss schedule: a baseline rule with a
 * tick per phase, then index, construction stage, phase name (H3), summary,
 * deliverable, and typical duration.
 * TODO: Rococo to confirm typical durations against real engagements (see src/content/method.ts).
 */
export function ProcessTimeline({ phases }: { phases: MethodPhase[] }) {
  return (
    <div className={styles.timeline}>
      <Reveal effect="draw" className={styles.baseline}>
        <span aria-hidden="true" />
      </Reveal>
      <ol className={styles.phases}>
        {phases.map((phase) => (
          <li key={phase.index} className={styles.phase}>
            <span className={styles.tick} aria-hidden="true" />
            <p className={styles.meta}>
              <span className={styles.index}>{phase.index}</span>
              <span className={styles.stage}>{phase.stage}</span>
            </p>
            <h3 className={styles.name}>{phase.name}</h3>
            <p className={styles.summary}>{phase.summary}</p>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Deliverable</dt>
                <dd>{phase.deliverable}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Typical duration</dt>
                <dd>{phase.duration}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
      <p className={styles.footnote}>Durations are typical. Your proposal sets the actual schedule.</p>
    </div>
  );
}
