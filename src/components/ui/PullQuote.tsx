import type { ReactNode } from "react";

import styles from "./PullQuote.module.css";

type PullQuoteProps = {
  children: ReactNode;
  /** Person quoted. Omit for manifesto lines. */
  author?: string;
  /** Role and company, e.g. "Owner, Example Builders". */
  role?: string;
  size?: "md" | "lg";
  /** Vertical rule beside the quote. */
  rule?: boolean;
  /** "accent" draws the rule in gold; "structure" uses a forest hairline so the page's gold budget stays free. */
  ruleTone?: "accent" | "structure";
  className?: string;
};

/** Display serif in Forest with generous margins, for testimonials and manifesto lines. */
export function PullQuote({ children, author, role, size = "md", rule = true, ruleTone = "accent", className }: PullQuoteProps) {
  return (
    <figure
      className={[styles.figure, styles[size], rule ? styles.withRule : "", rule && ruleTone === "structure" ? styles.structure : "", className]
        .filter(Boolean)
        .join(" ")}
    >
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
