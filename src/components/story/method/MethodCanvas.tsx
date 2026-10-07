import type { ReactNode } from "react";

import styles from "./MethodDrawing.module.css";

type MethodCanvasProps = {
  /** Current phase, 1-based. Earlier layers settle; the current layer is emphasised. */
  step: number;
  /** "static": every included layer drawn. "build": later layers wait to be drawn. */
  motion?: "static" | "build";
  /** Enable transitions (set only after the first client frame to avoid replaying hydration). */
  animate?: boolean;
  /** Draw the current layer in as this canvas scrolls into view (CSS only, no JS). */
  scrollDraw?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * State wrapper for <MethodDrawing>. Kept apart from the drawing so the client stage
 * can import it without pulling the geometry into the browser bundle.
 */
export function MethodCanvas({ step, motion = "static", animate = false, scrollDraw = false, className, children }: MethodCanvasProps) {
  return (
    <div
      className={[styles.canvas, className].filter(Boolean).join(" ")}
      data-step={step}
      data-motion={motion}
      data-animate={animate ? "" : undefined}
      data-scroll-draw={scrollDraw ? "" : undefined}
    >
      {children}
    </div>
  );
}
