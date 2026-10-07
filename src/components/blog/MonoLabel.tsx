import type { ReactNode } from "react";

import styles from "./MonoLabel.module.css";

type MonoLabelProps = {
  children: ReactNode;
  as?: "p" | "h2";
  id?: string;
  /** Optional mono index before the label, e.g. "01". */
  index?: string;
  className?: string;
};

/**
 * The bracketed mono eyebrow, set as running inline text so a long label
 * (several topics, a topic name, or a narrow rail) wraps with its closing
 * bracket still attached to the last word. Brackets are decorative.
 * Write the label in sentence case; CSS sets the uppercase.
 */
export function MonoLabel({ children, as: Tag = "p", id, index, className }: MonoLabelProps) {
  return (
    <Tag id={id} className={[styles.label, className].filter(Boolean).join(" ")}>
      {index ? (
        <span className={styles.index}>
          {index}
          <span className="visually-hidden">. </span>
        </span>
      ) : null}
      <span aria-hidden="true">[&nbsp;</span>
      {children}
      <span aria-hidden="true">&nbsp;]</span>
    </Tag>
  );
}
