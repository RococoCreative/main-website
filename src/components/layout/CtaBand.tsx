import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cta as ctaCopy } from "@/lib/site";

import styles from "./CtaBand.module.css";

type CtaBandProps = {
  eyebrow?: string;
  title?: ReactNode;
  body?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

/** Closing call to action on a forest canvas. Used at the foot of most pages. */
export function CtaBand({
  eyebrow = "Next step",
  title = "Tell us what you are building next.",
  body = "A 30-minute conversation about your market, your pipeline, and where marketing should carry more of the load. You leave with a clear point of view, whether or not we work together.",
  primary = ctaCopy.primary,
  secondary = ctaCopy.proposal,
}: CtaBandProps) {
  return (
    <section className={styles.band} data-theme="forest" aria-labelledby="cta-band-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="cta-band-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.body}>{body}</p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={primary.href} variant="primary" size="lg" arrow>
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink href={secondary.href} variant="secondary" size="lg">
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
