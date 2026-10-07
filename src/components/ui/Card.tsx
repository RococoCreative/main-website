import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./Card.module.css";
import { Eyebrow } from "./Eyebrow";
import { ArrowRight } from "./icons";

type CardProps = {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  /**
   * When set, the whole card is clickable via a stretched link on the title.
   * Only the title is the accessible link name; the rest stays readable text.
   */
  href?: string;
  linkLabel?: string;
  media?: ReactNode;
  footer?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  variant?: "surface" | "outline" | "plain";
  className?: string;
};

/** Cream surface, radius-lg, hairline border, restrained shadow. Eyebrow, H3, body, link. */
export function Card({
  eyebrow,
  title,
  children,
  href,
  linkLabel,
  media,
  footer,
  headingLevel = 3,
  variant = "surface",
  className,
}: CardProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <article
      className={[styles.card, styles[variant], href ? styles.interactive : "", className].filter(Boolean).join(" ")}
    >
      {media ? <div className={styles.media}>{media}</div> : null}
      <div className={styles.body}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading className={styles.title}>
          {href ? (
            <Link href={href} className={styles.link}>
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        {children ? <div className={styles.content}>{children}</div> : null}
        {href && linkLabel ? (
          <span className={styles.more} aria-hidden="true">
            {linkLabel}
            <ArrowRight className={styles.arrow} />
          </span>
        ) : null}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </article>
  );
}
