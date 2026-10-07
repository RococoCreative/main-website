import type { Metadata } from "next";

import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { StoryOutline } from "@/components/work/StoryOutline";
import { WorkIndex } from "@/components/work/WorkIndex";
import { getCaseStudies } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const description =
  "Case studies in brand, website, search, and lead system work for construction companies, documented from the starting point to the measured result.";

export const metadata: Metadata = pageMetadata({ title: "Work", description, path: "/work" });

export default async function WorkPage() {
  const studies = await getCaseStudies();

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Proof, measured in bids and booked work."
        lead={
          <p>
            Each case study records where a construction business stood, the work we did, and what changed, in the
            terms owners use to run the company: qualified inquiries, bids, and booked work.
          </p>
        }
        aside={<StoryOutline />}
      />
      <WorkIndex studies={studies} />
      <CtaBand />
    </>
  );
}
