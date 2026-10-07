import { BlueprintCanvas } from "@/components/story/BlueprintCanvas";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Section } from "@/components/ui/Section";
import { sectors } from "@/content/services";
import { cta } from "@/lib/site";

import styles from "./HomeHero.module.css";

/**
 * Home hero. The H1 and copy are server-rendered text (the LCP element); the
 * drawing sits in columns 8 to 12 on desktop and below the copy on smaller
 * screens, never above the H1.
 */
export function HomeHero() {
  return (
    <Section guides spacing="flush" aria-labelledby="home-title" className={styles.hero}>
      <Grid align="end" rowGap="lg" className={styles.grid}>
        <Col span={{ lg: 7 }} className={styles.copy}>
          <Eyebrow>
            Strategy, design, <span className={styles.nowrap}>AI-driven</span> marketing
          </Eyebrow>
          <h1 id="home-title" className={styles.title}>
            Marketing built the way you build.
          </h1>
          <p className={styles.lead}>
            Rococo Creative is a boutique agency for construction companies. We combine strategy, design, and AI-driven
            marketing so the owners and developers you want to work for trust you before the first meeting, and your
            pipeline stays full without adding headcount.
          </p>
          <div className={styles.actions}>
            <ButtonLink href={cta.primary.href} variant="primary" size="lg" arrow>
              {cta.primary.label}
            </ButtonLink>
            <ButtonLink href="#method" variant="secondary" size="lg">
              See how we work
            </ButtonLink>
          </div>
          <div className={styles.serve}>
            <p id="home-serve" className={styles.serveLabel}>
              Who we serve
            </p>
            <ul className={styles.serveList} aria-labelledby="home-serve">
              {sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </div>
        </Col>
        <Col span={{ md: 8, lg: 5 }} start={{ lg: 8 }} className={styles.visual}>
          <BlueprintCanvas />
        </Col>
      </Grid>
    </Section>
  );
}
