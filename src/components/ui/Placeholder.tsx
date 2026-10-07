import type { ReactNode } from "react";

import styles from "./Placeholder.module.css";

type PlaceholderProps = {
  /** What Rococo Creative needs to supply, e.g. "Team portrait, 4:5, natural light". */
  children: ReactNode;
  label?: string;
  /** Reserve layout space for media. */
  aspectRatio?: string;
  className?: string;
};

/**
 * Visible TODO marker for assets and facts that must come from Rococo Creative
 * (photography, logos, real metrics). Intentionally obvious so nothing ships
 * unfinished. Search the codebase for "TODO" to find every instance.
 */
export function Placeholder({ children, label = "TODO", aspectRatio, className }: PlaceholderProps) {
  return (
    <div
      className={[styles.placeholder, aspectRatio ? styles.media : "", className].filter(Boolean).join(" ")}
      style={aspectRatio ? { aspectRatio } : undefined}
      role="note"
    >
      <span className={styles.label}>[ {label} ]</span>
      <span className={styles.text}>{children}</span>
    </div>
  );
}
