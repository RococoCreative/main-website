import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pillars } from "@/content/services";

import { engagements } from "./content";
import styles from "./Engagements.module.css";

const offeringName = new Map(pillars.flatMap((p) => p.offerings.map((o) => [o.id, o.name] as const)));

/** Project, Retainer, Advisory in general terms. Pricing is a visible TODO. */
export function Engagements() {
  return (
    <Section surface="alt" aria-labelledby="about-engage-title">
      <SectionHeader
        eyebrow="How we engage"
        title="Three ways to work together."
        titleId="about-engage-title"
        intro="Every engagement starts with a conversation and a clear recommendation. From there, the work takes one of three shapes."
        actions={
          <ButtonLink href="/services" variant="ghost" arrow>
            Explore services
          </ButtonLink>
        }
      />
      <ol className={styles.list}>
        {engagements.map((engagement) => (
          <li key={engagement.name} className={styles.item}>
            <p className={styles.index} aria-hidden="true">
              {engagement.index}
            </p>
            <h3 className={styles.name}>{engagement.name}</h3>
            <p className={styles.summary}>{engagement.summary}</p>
            <p className={styles.body}>{engagement.body}</p>
            <div className={styles.examples}>
              <p className={styles.examplesLabel} id={`engage-${engagement.index}-examples`}>
                Typical work
              </p>
              <ul className={styles.tags} aria-labelledby={`engage-${engagement.index}-examples`}>
                {engagement.offeringIds.map((id) => {
                  const name = offeringName.get(id);
                  return name ? (
                    <li key={id}>
                      <Badge tone="outline">{name}</Badge>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <Placeholder className={styles.pricing} label="TODO: pricing">
        Typical investment for each engagement type (for example a starting price for projects and a monthly range for
        retainers and advisory), plus minimum terms if any. Confirm the three engagement models above at the same time.
      </Placeholder>
    </Section>
  );
}
