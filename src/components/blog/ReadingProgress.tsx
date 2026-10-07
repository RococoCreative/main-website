"use client";

import { useEffect, useRef } from "react";

import styles from "./ReadingProgress.module.css";

/**
 * Thin reading-progress bar pinned under the site header. Decorative
 * (aria-hidden): the scroll position is already available to assistive tech.
 *
 * Progress runs from 0 when the top of the article body reaches the bottom of
 * the header to 1 when the end of the body is in view. Updates are written
 * straight to the bar's transform (rAF-throttled, passive listeners), so
 * scrolling never re-renders React. There is no transition, so reduced-motion
 * users see the bar track the page directly with no animated movement.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;

    let frame: number | null = null;
    const headerOffset = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 72;
    let top = headerOffset();

    const measure = () => {
      frame = null;
      const rect = target.getBoundingClientRect();
      const viewport = window.innerHeight - top;
      const distance = rect.height - viewport;
      const raw = distance > 0 ? (top - rect.top) / distance : rect.bottom <= window.innerHeight ? 1 : 0;
      const progress = Math.min(1, Math.max(0, raw));
      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (frame == null) frame = window.requestAnimationFrame(measure);
    };

    const onResize = () => {
      top = headerOffset();
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // Images and fonts loading late change the article height.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(target);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      if (frame != null) window.cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div className={styles.track} aria-hidden="true" data-print-hidden>
      <div ref={barRef} className={styles.bar} />
    </div>
  );
}
