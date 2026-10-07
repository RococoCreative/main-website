import { Markdown } from "@/components/content/Markdown";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/lib/types";

import { STORY_PARTS } from "./story";
import styles from "./CaseStudyStory.module.css";
import { TodoChip, TodoNote } from "./Todo";

const HAS_TODO = /\bTODO\b/;

/**
 * Challenge, Approach, Outcome. Each part is its own section in a two-column
 * Swiss layout: index and label on the left (sticky on wide screens), Markdown
 * prose on the right. Copy that still contains TODO prompts is flagged as a
 * draft template so it cannot pass for finished writing.
 */
export function CaseStudyStory({ study }: { study: Pick<CaseStudy, "challenge" | "approach" | "outcome"> }) {
  return (
    <div className={`container ${styles.story}`}>
      {STORY_PARTS.map((part) => {
        const body = study[part.key]?.trim() ?? "";
        const titleId = `case-study-${part.key}`;
        return (
          <section key={part.key} className={styles.part} aria-labelledby={titleId}>
            <div className={styles.aside}>
              <div className={styles.sticky}>
                <span className={styles.index} aria-hidden="true">
                  {part.index}
                </span>
                <h2 id={titleId} className={styles.heading}>
                  {part.label}
                </h2>
                <p className={styles.kicker}>{part.summary}</p>
              </div>
            </div>
            <Reveal className={styles.body} effect="fade">
              {body ? (
                <>
                  {HAS_TODO.test(body) ? (
                    <p className={styles.draft}>
                      <TodoChip size="sm" />
                      <span>Draft template. Replace each TODO prompt with approved project facts.</span>
                    </p>
                  ) : null}
                  <Markdown size="lg">{body}</Markdown>
                </>
              ) : (
                <TodoNote note={`${part.label} copy: ${part.summary.toLowerCase()}.`} />
              )}
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
