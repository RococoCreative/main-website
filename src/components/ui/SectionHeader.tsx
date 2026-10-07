import type { ReactNode } from "react";

import { Eyebrow } from "./Eyebrow";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  /** Supporting paragraph (H4 role in the brand section pattern). */
  intro?: ReactNode;
  /** "split": Swiss asymmetric layout (title left, intro right). "stack": single column. */
  layout?: "split" | "stack";
  /** id for the heading so the parent <section> can use aria-labelledby. */
  titleId?: string;
  headingLevel?: 2 | 3;
  actions?: ReactNode;
  className?: string;
};

/** Brand section pattern: Eyebrow, H2, supporting copy. */
export function SectionHeader({
  eyebrow,
  index,
  title,
  intro,
  layout = "split",
  titleId,
  headingLevel = 2,
  actions,
  className,
}: SectionHeaderProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <header className={[styles.header, styles[layout], className].filter(Boolean).join(" ")}>
      <div className={styles.lead}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <Heading id={titleId} className={styles.title}>
          {title}
        </Heading>
      </div>
      {intro || actions ? (
        <div className={styles.aside}>
          {intro ? <div className={styles.intro}>{intro}</div> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
