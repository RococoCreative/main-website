import Link from "next/link";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { pillars } from "@/content/services";

import styles from "./AboutHeroAside.module.css";

/** Hero aside: the three disciplines as an indexed list linking into /services. */
export function AboutHeroAside() {
  return (
    <div className={styles.aside}>
      <Eyebrow>What we do</Eyebrow>
      <ul className={styles.list}>
        {pillars.map((pillar) => (
          <li key={pillar.id}>
            <Link href={`/services#${pillar.id}`} className={styles.link}>
              <span className={styles.index} aria-hidden="true">
                {pillar.index}
              </span>
              <span className={styles.name}>{pillar.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
