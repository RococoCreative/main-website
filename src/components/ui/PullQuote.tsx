import type { ReactNode } from "react";

import styles from "./PullQuote.module.css";

type PullQuoteProps = {
  children: ReactNode;
  /** Person quoted. Omit for manifesto lines. */
  author?: string;
  /** Role and company, e.g. "Owner, Example Builders". */
  role?: string;
  size?: "md" | "lg";
  /** Gold vertical rule. Counts toward the one-flourish-per-page budget only on light canvases. */
  rule?: boolean;
  className?: string;
};

/** Display serif in Forest with generous margins, for testimonials and manifesto lines. */
export function PullQuote({ children, author, role, size = "md", rule = true, className }: PullQuoteProps) {
  return (
    <figure className={[styles.figure, styles[size], rule ? styles.withRule : "", className].filter(Boolean).join(" ")}>
      <blockquote className={styles.quote}>
        <p>{children}</p>
      </blockquote>
      {author ? (
        <figcaption className={styles.caption}>
          <span className={styles.author}>{author}</span>
          {role ? <span className={styles.role}>{role}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
