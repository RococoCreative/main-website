import type { CaseStudy } from "@/lib/types";

import { CaseStudyCover } from "./CaseStudyCover";
import styles from "./CaseStudyCoverFigure.module.css";

/** Full-width cover under the case study hero: photograph if supplied, otherwise the full drafting sheet. */
export function CaseStudyCoverFigure({ study }: { study: CaseStudy }) {
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.frame}>
        <CaseStudyCover
          study={study}
          detail="full"
          sizes="(min-width: 1328px) 1200px, calc(100vw - 2rem)"
          eager
        />
      </div>
    </div>
  );
}
