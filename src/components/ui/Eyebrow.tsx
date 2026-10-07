import type { ElementType, ReactNode } from "react";

import styles from "./Eyebrow.module.css";

type EyebrowProps = {
  children: ReactNode;
  /** Optional section index rendered before the label, e.g. "01". */
  index?: string;
  as?: ElementType;
  /** "muted" (default) or "text". On themed (dark/forest) sections the brackets turn gold. */
  tone?: "muted" | "text";
  className?: string;
  id?: string;
};

/**
 * The brand signature: a bracketed, uppercase, mono section label.
 * Write the label in sentence case; CSS sets the uppercase so screen readers
 * read words, not letters. Brackets are decorative and hidden from AT. They are
 * inline with non-breaking spaces so they stay attached when a label wraps.
 */
export function Eyebrow({ children, index, as: Tag = "p", tone = "muted", className, id }: EyebrowProps) {
  return (
    <Tag id={id} className={[styles.eyebrow, styles[tone], className].filter(Boolean).join(" ")}>
      {index ? (
        <span className={styles.index}>
          {index}
          <span className="visually-hidden">. </span>
        </span>
      ) : null}
      <span className={styles.label}>
        <span className={styles.bracket} aria-hidden="true">
          {"[ "}
        </span>
        {children}
        <span className={styles.bracket} aria-hidden="true">
          {" ]"}
        </span>
      </span>
    </Tag>
  );
}
