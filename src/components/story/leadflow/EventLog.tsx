import type { ReactNode } from "react";

import { OutcomeLostGlyph, OutcomeWonGlyph } from "./glyphs";
import type { Phase } from "./machine";
import type { Scenario, ScenarioEvent } from "./scenario";
import styles from "./EventLog.module.css";

type EventLogProps = {
  scenario: Scenario;
  phase: Phase;
  step: number;
  /** Follow-up action shown once the scenario completes. */
  action: ReactNode;
  titleId: string;
};

function Entry({ event, ghost, revealed }: { event: ScenarioEvent; ghost?: boolean; revealed?: boolean }) {
  return (
    <li className={styles.entry} data-revealed={revealed || undefined}>
      <span className={styles.time} aria-hidden="true">
        {event.time}
      </span>
      {ghost ? null : <span className="visually-hidden">{event.spoken}. </span>}
      <span className={styles.text}>{event.text}</span>
    </li>
  );
}

function Outcome({ scenario, revealed }: { scenario: Scenario; revealed?: boolean }) {
  const Glyph = scenario.outcomeTone === "won" ? OutcomeWonGlyph : OutcomeLostGlyph;
  return (
    <li className={`${styles.entry} ${styles.outcome}`} data-revealed={revealed || undefined}>
      <span className={styles.time}>
        Outcome<span className="visually-hidden">: </span>
      </span>
      <span className={styles.text}>
        <Glyph className={styles.outcomeGlyph} />
        <span>{scenario.outcome}</span>
      </span>
    </li>
  );
}

/**
 * Timestamped log of the scenario.
 *
 * Two layers share one grid cell:
 * - The ghost layer (aria-hidden) always holds every entry. It reserves the
 *   final height, so appending entries never shifts the page, and before play
 *   it shows the timeline's timestamps as a quiet schedule.
 * - The live layer is the aria-live="polite" ordered list. Entries are appended
 *   as the scenario plays, so each step is announced once.
 */
export function EventLog({ scenario, phase, step, action, titleId }: EventLogProps) {
  const { events } = scenario;
  const total = events.length + 1;
  const shown = events.slice(0, step);
  const outcomeShown = step > events.length;

  let progress: ReactNode;
  if (phase === "idle") progress = "Ready";
  else if (phase === "done") progress = "Complete";
  else
    progress = (
      <>
        <span aria-hidden="true">
          {String(Math.max(step, 1)).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="visually-hidden">
          Step {Math.max(step, 1)} of {total}
        </span>
      </>
    );

  return (
    <div className={styles.log}>
      <div className={styles.bar}>
        <p id={titleId} className={styles.title}>
          Event log
        </p>
        <p className={styles.progress}>{progress}</p>
      </div>

      <div className={styles.stage}>
        <div className={`${styles.layer} ${styles.ghost}`} aria-hidden="true">
          <ol className={styles.list}>
            {events.map((event, i) => (
              <Entry key={event.id} event={event} ghost revealed={i < step} />
            ))}
            <Outcome scenario={scenario} revealed={outcomeShown} />
          </ol>
          <div className={styles.action} />
        </div>

        <div className={`${styles.layer} ${styles.live}`}>
          <ol className={styles.list} role="list" aria-labelledby={titleId} aria-live="polite" aria-relevant="additions">
            {shown.map((event) => (
              <Entry key={`${scenario.id}-${event.id}`} event={event} />
            ))}
            {outcomeShown ? <Outcome key={`${scenario.id}-outcome`} scenario={scenario} /> : null}
          </ol>
          <div className={styles.action}>{phase === "done" ? action : null}</div>
        </div>
      </div>
    </div>
  );
}
