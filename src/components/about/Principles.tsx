import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

import { principles } from "./content";
import styles from "./Principles.module.css";

/** Five numbered principles, set as a Swiss index: number, statement, explanation. */
export function Principles() {
  return (
    <Section surface="alt" aria-labelledby="about-principles-title">
      <SectionHeader
        eyebrow="Principles"
        title="Five principles we work by."
        titleId="about-principles-title"
        intro="They shape every engagement, whatever its size, and they are how we expect to be judged."
      />
      <ol className={styles.list}>
        {principles.map((principle) => (
          <Reveal as="li" key={principle.index} className={styles.item}>
            <span className={styles.index} aria-hidden="true">
              {principle.index}
            </span>
            <h3 className={styles.title}>{principle.title}</h3>
            <p className={styles.body}>{principle.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
