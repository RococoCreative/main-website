import type { CSSProperties, ElementType, ReactNode } from "react";

import styles from "./Reveal.module.css";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger for sibling reveals: 0 to 4 steps, each starting slightly later in the scroll. */
  stagger?: 0 | 1 | 2 | 3 | 4;
  /** "rise" fades and lifts 16px; "fade" only fades; "draw" scales a rule from the left. */
  effect?: "rise" | "fade" | "draw";
};

/**
 * Zero-JavaScript entrance animation using CSS scroll-driven animations
 * (animation-timeline: view()). Browsers without support, and anyone with
 * prefers-reduced-motion, simply see the content in place: no hidden content,
 * no layout shift, no hydration cost.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = 0, effect = "rise" }: RevealProps) {
  return (
    <Tag
      className={[styles.reveal, styles[effect], className].filter(Boolean).join(" ")}
      style={stagger ? ({ "--reveal-start": `${stagger * 8}%` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
