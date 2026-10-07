"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/* ---------------------------------------------------------------------------
 * prefers-reduced-motion
 * Server snapshot is `true` so the first paint is the calm, static state;
 * motion is added only after hydration confirms the user allows it.
 * ------------------------------------------------------------------------- */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(callback: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true,
  );
}

/* ---------------------------------------------------------------------------
 * useInView: IntersectionObserver wrapper. `once` keeps it true after first entry.
 * ------------------------------------------------------------------------- */
export function useInView<T extends Element>(
  options: { rootMargin?: string; threshold?: number | number[]; once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = "0px 0px -10% 0px", threshold = 0, once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}

/* ---------------------------------------------------------------------------
 * useScrollProgress: 0 → 1 as an element travels through the viewport.
 *   0 = element top reaches the viewport bottom (or top, for "sticky" mode)
 *   1 = element bottom reaches the viewport top (or bottom, for "sticky" mode)
 * "sticky" mode suits tall wrappers around a position: sticky stage:
 * progress spans the scroll distance during which the stage is pinned.
 * rAF-throttled; passive listeners; no work when off-screen.
 * ------------------------------------------------------------------------- */
export function useScrollProgress<T extends HTMLElement>(
  mode: "through" | "sticky" = "through",
): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    frame.current = null;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    let value: number;
    if (mode === "sticky") {
      const distance = rect.height - vh;
      value = distance > 0 ? -rect.top / distance : rect.top <= 0 ? 1 : 0;
    } else {
      value = (vh - rect.top) / (vh + rect.height);
    }
    const clamped = Math.min(1, Math.max(0, value));
    setProgress((prev) => (Math.abs(prev - clamped) < 0.001 ? prev : clamped));
  }, [mode]);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current == null) frame.current = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current != null) window.cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  return [ref, progress];
}

/** Map progress within [start, end] to 0..1, clamped. */
export function segment(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

/** Gentle ease for scroll-linked values. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
