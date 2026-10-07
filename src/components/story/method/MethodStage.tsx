"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/motion/hooks";

import { MethodCanvas } from "./MethodCanvas";
import styles from "./MethodStage.module.css";
import { METHOD_LAYERS, METHOD_PANEL_SELECTOR, METHOD_ROOT_SELECTOR, type MethodStep } from "./shared";

type MethodStageProps = {
  steps: MethodStep[];
  /** Server-rendered <MethodDrawing>. */
  drawing: ReactNode;
};

/**
 * The top half of the viewport. A panel's top crossing the middle line flips its
 * intersection with this zone, as does any jump that changes which panels sit in it.
 */
const UPPER_HALF = "0px 0px -50% 0px";

/**
 * Sticky stage for desktop (1024px and up): the drawing, a phase counter, and a
 * progress rail of in-page links. The active phase is the panel crossing the middle
 * of the viewport, found with IntersectionObservers, so there is no per-frame scroll
 * work in JavaScript. The fine progress fill on the rail is a CSS scroll-driven
 * animation.
 */
export function MethodStage({ steps, drawing }: MethodStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // True on the server and during hydration: the first paint is the complete drawing.
  const reduced = usePrefersReducedMotion();
  const motion = !reduced;
  // Transitions start one frame after build mode is applied, so hydration never
  // plays the drawing backwards from its complete server state.
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const scope = rootRef.current?.closest(METHOD_ROOT_SELECTOR);
    if (!scope || typeof IntersectionObserver === "undefined") return;
    const panels = Array.from(scope.querySelectorAll<HTMLElement>(METHOD_PANEL_SELECTOR));
    if (panels.length === 0) return;

    // Active phase = the last panel whose top has passed the middle of the viewport
    // (0 above the section, the last phase below it). Measured only when an
    // observer reports a crossing, never on every scroll frame.
    const update = () => {
      const line = window.innerHeight / 2;
      let next = 0;
      panels.forEach((panel, i) => {
        if (panel.getBoundingClientRect().top <= line) next = i;
      });
      setActive(next);
    };

    // A panel crosses the middle line...
    const upper = new IntersectionObserver(update, { rootMargin: UPPER_HALF, threshold: 0 });
    panels.forEach((panel) => upper.observe(panel));
    // ...or the section comes into view from either direction (covers jumps past it,
    // and state kept by <Activity> when the route is shown again).
    const view = new IntersectionObserver(update, { threshold: 0 });
    view.observe(scope);

    // Disconnects when the route is hidden by <Activity> and reconnects when shown.
    return () => {
      upper.disconnect();
      view.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!motion) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [motion]);

  const current = steps[active] ?? steps[0];
  if (!current) return null;
  const total = String(steps.length).padStart(2, "0");

  return (
    <div ref={rootRef} className={styles.stage}>
      <div className={styles.head} aria-hidden="true">
        <span className={styles.counter}>
          <span className={styles.counterCurrent}>{current.index}</span>
          <span className={styles.counterSep}>/</span>
          {total}
        </span>
        <span key={current.id} className={styles.stageName}>
          {current.stage}
        </span>
        <span className={styles.phaseName}>{current.name}</span>
      </div>

      <MethodCanvas
        className={styles.canvas}
        step={Math.min(active + 1, METHOD_LAYERS)}
        motion={motion ? "build" : "static"}
        animate={motion && animate}
      >
        {drawing}
      </MethodCanvas>

      <nav className={styles.rail} aria-label="Method phases">
        <ol className={styles.railList} role="list">
          {steps.map((step, i) => {
            const state = i < active ? "done" : i === active ? "current" : "next";
            return (
              <li key={step.id} className={styles.railItem} data-state={state}>
                <a href={`#${step.id}`} className={styles.railLink} aria-current={i === active ? "step" : undefined}>
                  <span className={styles.railTrack} aria-hidden="true">
                    <span className={[styles.railFill, styles[`fill${i + 1}`]].filter(Boolean).join(" ")} />
                  </span>
                  {/* Explicit space keeps the accessible name readable: "01 Survey (Audit)". */}
                  <span className={styles.railIndex}>{step.index}</span>{" "}
                  <span className={styles.railName}>{step.stage}</span>
                  <span className="visually-hidden">{` (${step.name})`}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
