import { Suspense } from "react";

import { PageHero } from "@/components/layout/PageHero";
import { CaseStudyCard } from "@/components/work/CaseStudyCard";
import { getCaseStudies } from "@/lib/content";

/** STUB: replaced in the build phase. */
async function Work() {
  const studies = await getCaseStudies({ featured: true, limit: 2 });
  return (
    <div>
      {studies.map((s) => (
        <CaseStudyCard key={s.slug} study={s} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <PageHero eyebrow="Rococo Creative" title="Home" />
      <Suspense>
        <Work />
      </Suspense>
    </>
  );
}
