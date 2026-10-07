import Image from "next/image";

import { isOptimizable } from "@/lib/images";
import type { CaseStudySummary } from "@/lib/types";

import { BlueprintCover } from "./BlueprintCover";
import styles from "./CaseStudyCover.module.css";

type CaseStudyCoverProps = {
  study: Pick<CaseStudySummary, "slug" | "sector" | "coverImageUrl" | "coverImageAlt">;
  /** Responsive sizes hint for remote photography. */
  sizes: string;
  /** Blueprint density when there is no photograph. */
  detail?: "compact" | "full";
  /** Cards pass true: the title already names the project, so the image is decorative. */
  decorative?: boolean;
  /** Above-the-fold covers load eagerly. */
  eager?: boolean;
  className?: string;
};

/**
 * Case study cover at a fixed 16:10 ratio (no layout shift). Uses the
 * project photograph when one is supplied; otherwise the generative drafting
 * sheet stands in. TODO: Rococo Creative to supply approved project photography
 * (16:10, at least 2400px wide) for each case study.
 */
export function CaseStudyCover({ study, sizes, detail = "compact", decorative = false, eager = false, className }: CaseStudyCoverProps) {
  if (study.coverImageUrl) {
    return (
      <div className={[styles.frame, className].filter(Boolean).join(" ")}>
        <Image
          src={study.coverImageUrl}
          alt={decorative ? "" : (study.coverImageAlt ?? "")}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          unoptimized={!isOptimizable(study.coverImageUrl)}
          className={styles.image}
        />
      </div>
    );
  }
  return <BlueprintCover slug={study.slug} sector={study.sector} detail={detail} className={className} />;
}
