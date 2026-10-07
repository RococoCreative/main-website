import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";
import { pillars } from "@/content/services";

import styles from "./ServicesJumpNav.module.css";

/** Hero aside: jump links to the three pillar sections and the system builder. */
export function ServicesJumpNav() {
  return (
    <nav className={styles.nav} aria-labelledby="services-jump-title">
      <Eyebrow id="services-jump-title">On this page</Eyebrow>
      <ol className={styles.list}>
        {pillars.map((pillar) => (
          <li key={pillar.id}>
            <a href={`#${pillar.id}`} className={styles.link}>
              <span className={styles.index}>{pillar.index}</span>
              <span className={styles.text}>
                <span className={styles.name}>{pillar.name}</span>
                <span className={styles.promise}>{pillar.promise}</span>
              </span>
              <ArrowRight className={styles.arrow} />
            </a>
          </li>
        ))}
      </ol>
      <a href="#builder" className={styles.builder}>
        Build your growth system
        <ArrowRight className={styles.builderArrow} />
      </a>
    </nav>
  );
}
