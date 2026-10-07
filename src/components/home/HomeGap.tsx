import { KineticStatement } from "@/components/story/KineticStatement";
import { ButtonLink } from "@/components/ui/Button";
import { Col, Grid } from "@/components/ui/Grid";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cta } from "@/lib/site";

import styles from "./HomeGap.module.css";

const gaps = [
  {
    index: "01",
    title: "Strong work, uneven pipeline",
    body: "Referrals and repeat clients keep crews busy until that work slows down. Without a steady source of qualified inquiries, every quarter starts with the same question: where is the next job coming from?",
  },
  {
    index: "02",
    title: "A brand behind the build",
    body: "Owners look you up before they return your call. When the website looks a decade older than the projects you deliver, you are discounted before you are ever called.",
  },
  {
    index: "03",
    title: "Inquiries that go cold",
    body: "A form arrives on Friday afternoon and gets an answer on Tuesday. By then the owner has spoken with two other builders. Slow or uneven follow-up quietly costs good work.",
  },
] as const;

/** The problem, named in the owner's terms, then the manifesto line. */
export function HomeGap() {
  return (
    <Section surface="alt" aria-labelledby="gap-title">
      <SectionHeader
        eyebrow="The gap"
        title="Strong work does not fill a pipeline on its own."
        titleId="gap-title"
        intro={
          <p>
            Three gaps keep capable firms from the work they should be winning. None of them are about the quality of
            the build.
          </p>
        }
      />

      <ol className={styles.gaps}>
        {gaps.map((gap) => (
          <li key={gap.index} className={styles.gap}>
            <span className={styles.index} aria-hidden="true">
              {gap.index}
            </span>
            <h3 className={styles.title}>{gap.title}</h3>
            <p className={styles.body}>{gap.body}</p>
          </li>
        ))}
      </ol>

      <div className={styles.clarity}>
        <p className={styles.clarityText}>Not sure which gap is costing you most?</p>
        <ButtonLink href={cta.clarity.href} variant="ghost" arrow>
          {cta.clarity.label}
        </ButtonLink>
      </div>

      <Grid className={styles.manifesto} rowGap="sm">
        <Col span={{ lg: 3 }}>
          <p className={styles.manifestoLabel}>Why it matters</p>
        </Col>
        <Col span={{ lg: 9 }} start={{ lg: 4 }}>
          <KineticStatement>
            Owners hire the builder they trust to finish on time, on budget, and without surprises. Your marketing should
            earn that trust before the first meeting.
          </KineticStatement>
        </Col>
      </Grid>
    </Section>
  );
}
