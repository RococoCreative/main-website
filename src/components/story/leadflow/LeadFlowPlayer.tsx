"use client";

import { useEffect, useId, useReducer, useRef, type ReactNode } from "react";
import { flushSync } from "react-dom";

import { Button, ButtonLink } from "@/components/ui/Button";
import { useInView, usePrefersReducedMotion } from "@/lib/motion/hooks";
import { cta } from "@/lib/site";

import { EventLog } from "./EventLog";
import { PlayGlyph, ReplayGlyph, SkipGlyph } from "./glyphs";
import { deriveView, initialState, reducer, stepDelay } from "./machine";
import { Pipeline } from "./Pipeline";
import { MODE_ORDER, SCENARIOS, type ModeId } from "./scenario";
import { usePageVisible } from "./usePageVisible";
import styles from "./LeadFlowPlayer.module.css";

type LeadFlowPlayerProps = {
  className?: string;
  /** Server-rendered framing: label and scenario setup. */
  intro: ReactNode;
  /** Server-rendered summary of both scenarios (readable without JavaScript). */
  summary: ReactNode;
  caption: ReactNode;
};

/**
 * Interactive leaf of the lead-flow demonstration.
 *
 * Playback is one effect that schedules the next step. It runs only while the
 * scenario is playing, the demo is on screen, and the tab is visible, so its
 * cleanup clears the timer on unmount, on mode change, when the demo scrolls
 * out of view, when the tab is hidden, and when React <Activity> hides the
 * route. Playback resumes from the same step when conditions return.
 * With reduced motion, Play reveals every step at once.
 */
export function LeadFlowPlayer({ className, intro, summary, caption }: LeadFlowPlayerProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [frameRef, inView] = useInView<HTMLDivElement>({ once: false, rootMargin: "0px", threshold: 0 });
  const reduced = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const withButtonRef = useRef<HTMLButtonElement>(null);
  const logTitleId = useId();

  const { mode, phase, step } = state;
  const scenario = SCENARIOS[mode];
  const view = deriveView(scenario, step);
  const running = phase === "playing" && inView && pageVisible;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => dispatch({ type: "advance" }), reduced ? 0 : stepDelay(scenario, step));
    return () => window.clearTimeout(timer);
  }, [running, scenario, step, reduced]);

  function start(nextMode?: ModeId) {
    dispatch(reduced ? { type: "finish", mode: nextMode } : { type: "play", mode: nextMode });
  }

  function onPrimary() {
    if (phase === "playing") dispatch({ type: "finish" });
    else start();
  }

  /** From the "without" outcome straight into the Rococo version. */
  function runWithSystem() {
    flushSync(() => start("with"));
    // The clicked button unmounts; keep focus on the control that now reflects the state.
    withButtonRef.current?.focus();
  }

  const primary =
    phase === "playing"
      ? { label: "Skip to end", icon: <SkipGlyph className={styles.playGlyph} /> }
      : phase === "done"
        ? { label: "Replay", icon: <ReplayGlyph className={styles.playGlyph} /> }
        : { label: "Play scenario", icon: <PlayGlyph className={styles.playGlyph} /> };

  const action =
    mode === "without" ? (
      <Button variant="secondary" arrow onClick={runWithSystem}>
        Run it with a system
      </Button>
    ) : (
      <ButtonLink href={cta.primary.href} variant="secondary" arrow>
        {cta.primary.label}
      </ButtonLink>
    );

  return (
    <div ref={frameRef} className={[styles.frame, className].filter(Boolean).join(" ")}>
      <figure className={styles.figure} data-mode={mode} data-phase={phase}>
        <div className={styles.intro}>{intro}</div>

        <div className={styles.summary}>{summary}</div>

        <div className={styles.controls}>
          <div className={styles.toggle} role="group" aria-label="Scenario">
            {MODE_ORDER.map((id) => {
              const option = SCENARIOS[id];
              return (
                <button
                  key={id}
                  ref={id === "with" ? withButtonRef : undefined}
                  type="button"
                  className={styles.option}
                  aria-pressed={id === mode}
                  onClick={() => dispatch({ type: "select", mode: id })}
                >
                  <span className={styles.indicator} aria-hidden="true" />
                  <span className={styles.letter} aria-hidden="true">
                    {option.letter}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <Button variant="primary" className={styles.play} onClick={onPrimary}>
            <span className={styles.playInner}>
              {primary.icon}
              {primary.label}
            </span>
          </Button>
        </div>

        <div className={styles.pipe}>
          <Pipeline mode={mode} playing={phase === "playing"} nodes={view.nodes} links={view.links} token={view.token} />
        </div>

        <div className={styles.log}>
          <EventLog scenario={scenario} phase={phase} step={step} action={action} titleId={logTitleId} />
        </div>

        <figcaption className={styles.caption}>{caption}</figcaption>
      </figure>
    </div>
  );
}
