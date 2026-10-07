import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridGuides } from "@/components/ui/Section";

import styles from "./PageHero.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Right-hand column content (stat, list, CTA). Sits in columns 8 to 12 on desktop. */
  aside?: ReactNode;
  /** Content below the headline row (filters, meta, breadcrumbs). */
  children?: ReactNode;
  titleId?: string;
};

/**
 * Interior page opener: Swiss guides, bracketed eyebrow, display-serif H1,
 * and an asymmetric lead. One H1 per page lives here.
 */
export function PageHero({ eyebrow, title, lead, aside, children, titleId = "page-title" }: PageHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <GridGuides />
      <div className={`container ${styles.inner}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className={styles.row}>
          <div className={styles.main}>
            <h1 id={titleId} className={styles.title}>
              {title}
            </h1>
            {lead ? <div className={styles.lead}>{lead}</div> : null}
          </div>
          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </div>
        {children ? <div className={styles.extra}>{children}</div> : null}
      </div>
    </section>
  );
}
