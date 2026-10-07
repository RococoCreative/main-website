import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Placeholder } from "@/components/ui/Placeholder";
import { PullQuote } from "@/components/ui/PullQuote";
import { Section } from "@/components/ui/Section";
import { getTestimonials } from "@/lib/content";
import { isTodo } from "@/lib/format";

import styles from "./HomeTestimonial.module.css";

/**
 * One featured testimonial. Renders nothing when none is published.
 * The gold quote rule is off: the page's single gold flourish is the
 * <Flourish /> above the closing call to action.
 */
export async function HomeTestimonial() {
  const [testimonial] = await getTestimonials({ featured: true, limit: 1 });
  if (!testimonial) return null;

  const role = [testimonial.authorTitle, testimonial.company].filter(Boolean).join(", ");
  const needsRealQuote = isTodo(testimonial.quote);

  return (
    <Section surface="cream" aria-labelledby="testimonial-title">
      <Grid rowGap="sm">
        <Col span={{ lg: 3 }} className={styles.label}>
          <Eyebrow as="h2" id="testimonial-title">
            Client perspective
          </Eyebrow>
        </Col>
        <Col span={{ lg: 9 }} start={{ lg: 4 }} className={styles.body}>
          <PullQuote size="lg" rule={false} author={testimonial.authorName} role={role || undefined}>
            {testimonial.quote}
          </PullQuote>
          {needsRealQuote ? (
            // TODO: Replace the fallback testimonial with a real, approved client quote.
            <Placeholder label="TODO: Testimonial" className={styles.note}>
              This quote is a placeholder. Publish a real, approved client testimonial before launch: the strongest
              ones name the problem, what changed, and a concrete result.
            </Placeholder>
          ) : null}
          {testimonial.caseStudySlug ? (
            <ButtonLink
              href={`/work/${testimonial.caseStudySlug}`}
              variant="ghost"
              arrow
              className={styles.link}
            >
              Read the case study
            </ButtonLink>
          ) : null}
        </Col>
      </Grid>
    </Section>
  );
}
