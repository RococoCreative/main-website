import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cta } from "@/lib/site";

import styles from "./WorkEmptyState.module.css";

/**
 * Shown when content comes from Supabase and no case study is published yet.
 * Makes no claims about projects; it points to the conversation instead.
 */
export function WorkEmptyState({ headingId }: { headingId: string }) {
  return (
    <div className={styles.empty}>
      <div className={styles.copy}>
        <Eyebrow>In preparation</Eyebrow>
        <h2 id={headingId} className={styles.title}>
          Project write-ups are on the drafting table.
        </h2>
        <p className={styles.body}>
          Until they are published, the fastest way to judge fit is a conversation about your market, your pipeline,
          and the work you want more of. You leave with a clear point of view, whether or not we work together.
        </p>
      </div>
      <div className={styles.actions}>
        <ButtonLink href={cta.primary.href} variant="primary" arrow>
          {cta.primary.label}
        </ButtonLink>
        <ButtonLink href="/services" variant="ghost">
          See how we work
        </ButtonLink>
      </div>
    </div>
  );
}
