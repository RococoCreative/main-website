"use client";

import { Fragment, useEffect, useMemo, type CSSProperties, type RefObject } from "react";

import { segment, usePrefersReducedMotion, useScrollProgress } from "@/lib/motion/hooks";

import styles from "./KineticStatement.module.css";

type KineticStatementProps = {
  /** The statement, as one plain string. */
  children: string;
  as?: "p" | "h2";
  className?: string;
};

/** Scroll window (0 to 1 of the block's travel) over which the words fill in. */
const START = 0.12;
const END = 0.5;

/**
 * A large Swiss typographic moment in the display serif. As the block travels
 * through the viewport, words move from muted to heading color, left to right.
 *
 * - Progress comes from useScrollProgress and is written to a CSS variable on
 *   the element; the word spans are memoized, so a scroll frame re-renders one
 *   element with unchanged children, and the color math runs in CSS.
 * - The text stays one readable string: plain inline spans, no aria-hidden.
 * - Server HTML, no-JS, and reduced motion all show every word in full color
 *   (the CSS default). Both the muted and full states clear 4.5:1 on every
 *   light surface, and so does every blend in between.
 */
export function KineticStatement({ children, as = "p", className }: KineticStatementProps) {
  const [ref, progress] = useScrollProgress<HTMLElement>("through");
  const reduced = usePrefersReducedMotion();

  const words = useMemo(() => children.trim().split(/\s+/), [children]);
  const content = useMemo(
    () =>
      words.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word} style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      )),
    [words],
  );
  const style = useMemo(() => ({ "--n": words.length }) as CSSProperties, [words.length]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.style.removeProperty("--p");
      return;
    }
    node.style.setProperty("--p", segment(progress, START, END).toFixed(4));
  }, [ref, progress, reduced]);

  const classes = [styles.statement, className].filter(Boolean).join(" ");

  if (as === "h2") {
    return (
      <h2 ref={ref as RefObject<HTMLHeadingElement | null>} className={classes} style={style}>
        {content}
      </h2>
    );
  }
  return (
    <p ref={ref as RefObject<HTMLParagraphElement | null>} className={classes} style={style}>
      {content}
    </p>
  );
}
