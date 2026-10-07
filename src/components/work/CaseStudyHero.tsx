import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { GridGuides } from "@/components/ui/Section";
import { isTodo } from "@/lib/format";
import type { CaseStudy } from "@/lib/types";

import { CaseStudyFacts } from "./CaseStudyFacts";
import styles from "./CaseStudyHero.module.css";
import { TodoNote, needsContent, stripTodo } from "./Todo";

type CaseStudyHeroProps = {
  study: CaseStudy;
  titleId: string;
};

/** Breadcrumb, sector and location eyebrow, display-serif H1, summary lead, and the Swiss facts table. */
export function CaseStudyHero({ study, titleId }: CaseStudyHeroProps) {
  const eyebrow = [study.sector, study.location].filter((v): v is string => Boolean(v) && !isTodo(v)).join(" · ");

  return (
    <header className={styles.hero}>
      <GridGuides />
      <div className={`container ${styles.inner}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <ol className={styles.crumbs}>
            <li className={styles.crumb}>
              <Link href="/work" className={styles.crumbLink}>
                Work
              </Link>
            </li>
            <li className={styles.crumb}>
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
              <span aria-current="page" className={styles.current}>
                {study.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className={styles.row}>
          <div className={styles.main}>
            <Eyebrow>{eyebrow || "Case study"}</Eyebrow>
            <h1 id={titleId} className={styles.title}>
              {study.title}
            </h1>
          </div>
          <div className={styles.lead}>
            {needsContent(study.summary) ? (
              <p>
                <TodoNote
                  size="lead"
                  note={stripTodo(study.summary) || "One or two sentences on the client, the problem, and the result."}
                />
              </p>
            ) : (
              <p>{study.summary}</p>
            )}
          </div>
        </div>

        <CaseStudyFacts study={study} />
      </div>
    </header>
  );
}
