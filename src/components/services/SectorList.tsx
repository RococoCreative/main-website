import { sectors } from "@/content/services";

import styles from "./SectorList.module.css";

type Sector = (typeof sectors)[number];

/**
 * General observations about what each kind of firm usually needs from
 * marketing. No client claims. Typed against the sector list so a renamed
 * sector fails the type check instead of rendering an empty row.
 */
const NEEDS: Record<Sector, string> = {
  "General contractors":
    "A reputation that holds up at prequalification, proposals that read as well as the work performs, and a pipeline weighted toward the project types with the best margins.",
  "Design-build firms":
    "A clear story about single-point accountability, told early enough that owners call before the design is set and the job goes out to bid.",
  "Specialty trades":
    "Visibility with the general contractors and owners who award the work, and fast, consistent follow-up on every bid invitation and inquiry.",
  "Home builders & remodelers":
    "Strong local search, steady reviews, and quick replies, because homeowners often contact several firms at once and remember who answered clearly.",
  "Developers & owner's reps":
    "Project branding and sites that support leasing, sales, and investor confidence, with reporting that ties spend to results.",
};

export function SectorList() {
  return (
    <ul className={styles.list}>
      {sectors.map((sector, i) => (
        <li key={sector} className={styles.row}>
          <span className={styles.index} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.name}>{sector}</h3>
          <p className={styles.need}>{NEEDS[sector]}</p>
        </li>
      ))}
    </ul>
  );
}
