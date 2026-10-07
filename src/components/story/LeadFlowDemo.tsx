import { Badge } from "@/components/ui/Badge";

import { LeadFlowPlayer } from "./leadflow/LeadFlowPlayer";
import { MODE_ORDER, SCENARIOS, type ModeId } from "./leadflow/scenario";
import styles from "./LeadFlowDemo.module.css";

/*
 * Copy for the static framing. Rendered on the server, so it costs no client
 * JavaScript and reads in full before (or without) hydration.
 * Illustrative only: no real client, no statistics.
 */
const LEAD =
  "Tuesday evening. An owner's representative looking for a commercial contractor finds your website and sends an inquiry for a 12,000 sq ft office build-out. Same inquiry, two outcomes.";

const SUMMARIES: Record<ModeId, string> = {
  without:
    "The inquiry waits overnight in a shared inbox. The callback the next afternoon reaches voicemail, and by Thursday the owner's rep has booked a walkthrough with a competitor who responded first.",
  with: "A reply goes out within a minute with three scoping questions and a booking link. The lead is tagged and routed in the CRM, the estimator starts Wednesday with a summary, and the walkthrough is set for Thursday morning.",
};

const CAPTION = "Illustrative scenario. Response systems are configured for each client.";

/**
 * Interactive demonstration of speed to lead: the same inquiry played without
 * and with a connected response system. Server shell around a small client
 * player (src/components/story/leadflow/LeadFlowPlayer.tsx).
 * Works on dark (forest) and light sections through semantic tokens.
 */
export function LeadFlowDemo({ className }: { className?: string }) {
  return (
    <LeadFlowPlayer
      className={className}
      intro={
        <div className={styles.intro}>
          <Badge tone="outline">Illustrative scenario</Badge>
          <p className={styles.lead}>{LEAD}</p>
        </div>
      }
      summary={
        <ul className={styles.scenarios}>
          {MODE_ORDER.map((id) => {
            const scenario = SCENARIOS[id];
            return (
              <li key={id} className={styles.scenario} data-scenario={id}>
                <p className={styles.name}>
                  <span className={styles.letter} aria-hidden="true">
                    {scenario.letter}
                  </span>
                  <span>{scenario.label}</span>
                </p>
                <p className={styles.text}>{SUMMARIES[id]}</p>
                <p className={styles.result}>
                  <span className={styles.resultLabel}>
                    Outcome<span className="visually-hidden">:</span>
                  </span>{" "}
                  {scenario.outcome}
                </p>
              </li>
            );
          })}
        </ul>
      }
      caption={CAPTION}
    />
  );
}
