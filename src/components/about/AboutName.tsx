import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { Col, Grid } from "@/components/ui/Grid";
import { Section } from "@/components/ui/Section";

import styles from "./AboutName.module.css";
import { nameTriad } from "./content";

/**
 * Why "Rococo": ornament only earns its place on a sound structure.
 * The page's single gold flourish sits here, at the point where the copy
 * explains ornament, between the idea and how it shapes the work.
 */
export function AboutName() {
  return (
    <Section aria-labelledby="about-name-title">
      <Grid rowGap="md">
        <Col span={{ lg: 5 }} className={styles.lead}>
          <Eyebrow>The name</Eyebrow>
          <h2 id="about-name-title" className={styles.title}>
            Ornament earns its place on a sound structure.
          </h2>
        </Col>
        <Col span={{ lg: 6 }} start={{ lg: 7 }} className={styles.copy}>
          <p>
            Rococo was an era known for ornament: gilded scrollwork, carved detail, rooms that reward a closer look. The
            lesson we take from it is restraint. Ornament only works when the structure beneath it is sound.
          </p>
          <p>
            That is how we work. Strategy and structure come first: the market, the message, and the system that turns
            an inquiry into a bid. Refinement comes last, applied where it makes the work clearer, more credible, and
            easier to remember.
          </p>
        </Col>
      </Grid>

      <Flourish className={styles.flourish} size={40} />

      <ol className={styles.triad}>
        {nameTriad.map((part, index) => (
          <Reveal as="li" key={part.title} className={styles.part} stagger={index as 0 | 1 | 2}>
            <p className={styles.partMeta}>
              <span className={styles.partIndex} aria-hidden="true">
                {part.index}
              </span>
              <span>{part.source}</span>
            </p>
            <h3 className={styles.partTitle}>{part.title}</h3>
            <p className={styles.partBody}>{part.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
