import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { isTodo } from "@/lib/format";
import type { CaseStudySummary } from "@/lib/types";

import { CaseStudyCover } from "./CaseStudyCover";
import styles from "./NextProject.module.css";

const TITLE_ID = "next-project-title";

/**
 * Closes a case study: the page's single gold flourish, then the next project
 * in index order (whole block is one link) and a way back to the index.
 */
export function NextProject({ next }: { next: CaseStudySummary | null }) {
  const sector = next?.sector && !isTodo(next.sector) ? next.sector : null;

  return (
    <section className={styles.section} aria-labelledby={TITLE_ID}>
      <div className="container">
        <Flourish className={styles.flourish} />

        <div className={styles.head}>
          <Eyebrow as="h2" id={TITLE_ID} tone="text">
            {next ? "Next project" : "More work"}
          </Eyebrow>
          <Link href="/work" className={styles.all}>
            <ArrowLeft className={styles.allIcon} />
            All projects
          </Link>
        </div>

        {next ? (
          <article className={styles.card}>
            <div className={styles.text}>
              {sector ? <p className={styles.sector}>{sector}</p> : null}
              <h3 className={styles.title}>
                <Link href={`/work/${next.slug}`} className={styles.link}>
                  {next.title}
                </Link>
              </h3>
              <span className={styles.more} aria-hidden="true">
                View case study
                <ArrowRight className={styles.arrow} />
              </span>
            </div>
            <div className={styles.thumb}>
              <CaseStudyCover study={next} sizes="(min-width: 1024px) 480px, 100vw" decorative />
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
