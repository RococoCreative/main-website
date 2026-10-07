import Link from "next/link";

import { ArrowRight } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectors } from "@/content/services";
import { cta } from "@/lib/site";

import { sectorFocus } from "./content";
import styles from "./WhoWeServe.module.css";

/** Sectors as a hairline cell grid; the sixth cell invites firms not listed. */
export function WhoWeServe() {
  return (
    <Section aria-labelledby="about-sectors-title">
      <SectionHeader
        eyebrow="Who we serve"
        title="Built around how builders win work."
        titleId="about-sectors-title"
        intro="We focus on construction. Our strategy, design, and marketing are shaped by what wins work in this industry: reputation, relationships, and bids."
      />
      <ul className={styles.grid}>
        {sectors.map((sector, index) => (
          <li key={sector} className={styles.cell}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.name}>{sector}</h3>
            <p className={styles.focus}>{sectorFocus[sector]}</p>
          </li>
        ))}
        <li className={`${styles.cell} ${styles.invite}`}>
          <p className={styles.inviteText}>Building something that does not fit a label?</p>
          <Link href={cta.primary.href} className={styles.inviteLink}>
            {cta.primary.label}
            <ArrowRight className={styles.arrow} />
          </Link>
        </li>
      </ul>
    </Section>
  );
}
