import Link from "next/link";

import type { CaseStudySummary } from "@/lib/types";

/** STUB: replaced in the build phase. */
export function CaseStudyCard({ study, headingLevel = 3 }: { study: CaseStudySummary; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article>
      <Heading>
        <Link href={`/work/${study.slug}`}>{study.title}</Link>
      </Heading>
    </article>
  );
}
