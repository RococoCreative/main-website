import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

import styles from "./Team.module.css";

/**
 * Team and clients. Everything here must come from Rococo Creative: no names,
 * bios, years, or logos are invented. Replace each <Placeholder> with real
 * content (and next/image for photography) before launch.
 */
export function Team() {
  return (
    <Section aria-labelledby="about-team-title">
      <SectionHeader eyebrow="Team" title="The people behind the work." titleId="about-team-title" />
      <Grid rowGap="lg">
        <Col span={{ md: 5, lg: 5 }}>
          <Placeholder aspectRatio="4 / 5" label="TODO: founder portrait">
            Founder portrait. Natural light, 4:5, at least 1600px tall, with written alt text.
          </Placeholder>
        </Col>
        <Col span={{ md: 7, lg: 6 }} start={{ lg: 7 }} className={styles.people}>
          <div className={styles.block}>
            <h3 className={styles.heading}>Founder</h3>
            <Placeholder label="TODO: founder bio">
              Founder name and title, plus a short bio (80 to 120 words): background, why construction, and what
              clients can expect when they work together.
            </Placeholder>
          </div>
          <div className={styles.block}>
            <h3 className={styles.heading}>Team</h3>
            <Placeholder label="TODO: team details">
              Who clients work with day to day: names, roles, and how the agency is staffed (in-house team, specialist
              partners). Add portraits in the same 4:5 format if available.
            </Placeholder>
          </div>
        </Col>
      </Grid>

      <div className={styles.clients}>
        <Eyebrow as="h3" id="about-clients-title">
          Selected clients
        </Eyebrow>
        <Placeholder label="TODO: client logos" className={styles.logos}>
          Client logos, used only with written permission. Four to eight marks supplied as single-color SVG so they can be
          set in Ink on light grounds.
        </Placeholder>
      </div>
    </Section>
  );
}
