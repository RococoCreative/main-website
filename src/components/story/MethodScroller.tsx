import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import type { MethodPhase } from "@/content/method";

import { MethodCanvas } from "./method/MethodCanvas";
import { MethodDrawing } from "./method/MethodDrawing";
import { MethodStage } from "./method/MethodStage";
import { METHOD_LAYERS, phaseId, toSteps } from "./method/shared";
import styles from "./MethodScroller.module.css";

/** View-timeline names for the rail's fine progress fill (see MethodStage.module.css). */
const TRACK_CLASS = [styles.track1, styles.track2, styles.track3, styles.track4];

/**
 * The Rococo method as a construction story. As the visitor reads the four phase
 * panels, an elevation drawing assembles beside them: survey, foundation, frame,
 * finish.
 *
 * Rendering: this component and the panels render on the server. The only client
 * code is <MethodStage> (sticky drawing, counter, progress rail), which watches the
 * panels with an IntersectionObserver. The drawing itself is decorative and
 * server-rendered; all information lives in the panels, in reading order.
 *
 * Layout: 1024px and up, a sticky stage in columns 1 to 6 and tall panels in
 * columns 8 to 12. Below 1024px, no sticky: each panel carries its own compact
 * plate showing the build up to that phase.
 *
 * Expects to sit inside the page's <section id="method"> under its H2 (panels use H3).
 */
export function MethodScroller({ phases }: { phases: MethodPhase[] }) {
  if (phases.length === 0) return null;
  const total = String(phases.length).padStart(2, "0");

  return (
    <div className={styles.root} data-method-root="">
      <Grid>
        <Col span={{ lg: 6 }} className={styles.stageCol}>
          <MethodStage steps={toSteps(phases)} drawing={<MethodDrawing idPrefix="method-stage" />} />
        </Col>

        <Col span={{ lg: 5 }} start={{ lg: 8 }}>
          <ol className={styles.panels} role="list">
            {phases.map((phase, i) => {
              const id = phaseId(phase);
              const step = Math.min(i + 1, METHOD_LAYERS);
              const section = Number.parseInt(phase.index, 10) || i + 1;
              return (
                <li key={id} id={id} className={[styles.panel, TRACK_CLASS[i]].filter(Boolean).join(" ")} data-method-panel="">
                  {/* Compact plate for small screens. Decorative: the panel text says it all. */}
                  <div className={styles.plate} aria-hidden="true">
                    <div className={styles.plateHead}>
                      <span>{`${phase.index} / ${total}`}</span>
                      {/* Progress through the method: no rail on small screens. */}
                      <span className={styles.plateTicks}>
                        {phases.map((other, k) => (
                          <span key={other.index} className={styles.plateTick} data-reached={k <= i ? "" : undefined} />
                        ))}
                      </span>
                    </div>
                    <MethodCanvas className={styles.plateCanvas} step={step} scrollDraw>
                      <MethodDrawing idPrefix={`${id}-plate`} layers={step} labels={false} />
                    </MethodCanvas>
                  </div>

                  <div className={styles.copy}>
                    <Eyebrow index={phase.index}>{phase.stage}</Eyebrow>
                    <h3 className={styles.title}>{phase.name}</h3>
                    <p className={styles.summary}>{phase.summary}</p>

                    <dl className={styles.spec}>
                      <div className={styles.specRow}>
                        <dt className={styles.specLabel}>Activities</dt>
                        <dd className={styles.specValue}>
                          <ul className={styles.activities} role="list">
                            {phase.activities.map((activity, j) => (
                              <li key={activity} className={styles.activity}>
                                {/* Spec-sheet numbering, e.g. 2.3. Decorative. */}
                                <span className={styles.code} aria-hidden="true">
                                  {`${section}.${j + 1}`}
                                </span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className={styles.specRow}>
                        <dt className={styles.specLabel}>Deliverable</dt>
                        <dd className={[styles.specValue, styles.deliverable].join(" ")}>{phase.deliverable}</dd>
                      </div>
                      <div className={styles.specRow}>
                        <dt className={styles.specLabel}>Typical duration</dt>
                        {/* TODO: Rococo to confirm durations against real engagements (src/content/method.ts). */}
                        <dd className={styles.specValue}>{phase.duration}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>
        </Col>
      </Grid>
    </div>
  );
}
