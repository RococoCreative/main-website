import { Eyebrow } from "@/components/ui/Eyebrow";
import { Placeholder } from "@/components/ui/Placeholder";
import { PullQuote } from "@/components/ui/PullQuote";
import { Section } from "@/components/ui/Section";
import { isTodo } from "@/lib/format";
import type { Testimonial } from "@/lib/types";

import styles from "./CaseStudyTestimonial.module.css";
import { TodoNote, needsContent, stripTodo } from "./Todo";

const TITLE_ID = "case-study-testimonial";

const real = (value: string | null | undefined): value is string => Boolean(value) && !isTodo(value);

/**
 * The client's own words on a forest canvas (the PullQuote's gold rule is
 * allowed here: it only counts toward the flourish budget on light grounds).
 * An unapproved quote never renders as a quote: it shows as a TODO placeholder.
 */
export function CaseStudyTestimonial({ testimonial }: { testimonial: Testimonial }) {
  const role = [testimonial.authorTitle, testimonial.company].filter(real).join(", ");
  const quoteMissing = needsContent(testimonial.quote);
  const authorMissing = !real(testimonial.authorName);
  const attributionNote =
    [testimonial.authorName, testimonial.authorTitle, testimonial.company]
      .map((value) => (value ? stripTodo(value) : ""))
      .filter(Boolean)
      .join(", ") || "Name, title, company";

  return (
    <Section theme="forest" aria-labelledby={TITLE_ID}>
      <div className={styles.layout}>
        <div className={styles.label}>
          <Eyebrow as="h2" id={TITLE_ID}>
            In the client&apos;s words
          </Eyebrow>
        </div>
        <div className={styles.quote}>
          {quoteMissing ? (
            <Placeholder label="TODO: Client quote">
              {stripTodo(testimonial.quote) || "Add an approved client quote."}
              <span className={styles.attribution}>Attribution: {attributionNote}</span>
            </Placeholder>
          ) : (
            <>
              <PullQuote size="lg" author={authorMissing ? undefined : testimonial.authorName} role={authorMissing ? undefined : role || undefined}>
                {testimonial.quote}
              </PullQuote>
              {authorMissing ? (
                <p className={styles.pending}>
                  <TodoNote note="Name, title, and company of the person quoted" size="sm" />
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
