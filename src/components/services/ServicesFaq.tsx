import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Minus, Plus } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import { methodPhases } from "@/content/method";
import { cta } from "@/lib/site";

import styles from "./ServicesFaq.module.css";

type Faq = { id: string; question: string; answer: ReactNode };

const [survey, foundation, frame] = methodPhases;

// Durations come from the method so the FAQ and the process timeline never disagree.
const timingSummary = [
  `It depends on scope. As a guide, an audit typically takes ${survey.duration} and strategy ${foundation.duration}.`,
  `Building a brand, website, and lead system typically takes ${frame.duration}.`,
  "Growth work is ongoing and reviewed every month.",
].join(" ");

/**
 * Native <details>/<summary> disclosure: no JavaScript, keyboard and screen
 * reader support built in. The summary text is the question; the section H2
 * names the list. Anything Rococo must confirm is a visible Placeholder.
 */
const faqs: Faq[] = [
  {
    id: "engagements",
    question: "How do engagements work?",
    answer: (
      <>
        <p>There are three ways to work with us.</p>
        <ul>
          <li>
            <strong>Project.</strong> A defined scope, schedule, and fee agreed up front, such as an audit, a brand
            identity, or a website.
          </li>
          <li>
            <strong>Retainer.</strong> A monthly engagement for ongoing search, advertising, automation, content, and
            reporting.
          </li>
          <li>
            <strong>Advisory.</strong> Senior guidance on a schedule that suits you.
          </li>
        </ul>
        <p>Every engagement begins with an audit, so the scope is based on what we find rather than on assumptions.</p>
        <Placeholder>Typical pricing ranges for project, retainer, and advisory engagements.</Placeholder>
      </>
    ),
  },
  {
    id: "timing",
    question: "How long does it take?",
    answer: (
      <>
        <p>{timingSummary}</p>
        <p>Your proposal sets out the schedule before any work starts.</p>
      </>
    ),
  },
  {
    id: "region",
    question: "Do you work with companies outside your region?",
    answer: (
      <>
        <p>
          Most of the work runs well remotely: interviews, workshops, reviews, and reporting all happen by video. When
          photography or time on a jobsite would make the work better, we plan the visit into the scope.
        </p>
        <Placeholder>Confirm the regions Rococo serves and how travel is handled.</Placeholder>
      </>
    ),
  },
  {
    id: "your-team",
    question: "What do you need from our team?",
    answer: (
      <p>
        One person who can make decisions, time for interviews in the first weeks, access to your website, analytics,
        and ad accounts, and a handful of past projects you are proud of, with photos and the story behind them. After
        launch, a monthly review and quick feedback on drafts keep things moving. We keep requests focused so your
        people can stay on the work.
      </p>
    ),
  },
  {
    id: "ai",
    question: "How do you use AI?",
    answer: (
      <>
        <p>
          AI helps us research, draft, and respond faster. People stay accountable for everything that goes out:
          content is reviewed and edited by our team, automated replies use templates you approve, and your data is
          handled under the terms of our agreement with you.
        </p>
        <Placeholder>
          Confirm the exact AI and data policy: tools used, what client data they may process, retention, and approval
          steps.
        </Placeholder>
      </>
    ),
  },
  {
    id: "reporting",
    question: "How do you report results?",
    answer: (
      <p>
        In the terms you run the business by: qualified opportunities, bids, and revenue won, alongside the channel
        numbers that explain them. You get a live dashboard, a monthly review call, and plan updates every quarter.
      </p>
    ),
  },
  {
    id: "existing",
    question: "Can you work with our existing brand, website, or marketing team?",
    answer: (
      <p>
        Yes. We start from what you have. The audit shows what to keep, what to refine, and what to replace, and we work
        alongside in-house staff or other vendors with clear lines of responsibility.
      </p>
    ),
  },
  {
    id: "terms",
    question: "What are your contract terms and minimums?",
    answer: (
      <>
        <p>Every engagement starts with a written proposal that sets scope, schedule, fees, and terms before work begins.</p>
        <Placeholder>Contract structure, minimum term, and notice period for retainers.</Placeholder>
      </>
    ),
  },
];

type ServicesFaqProps = {
  /** id of the H2, for the parent section's aria-labelledby. */
  titleId: string;
  /** Rendered beneath the list (the page passes its single Flourish here). */
  footer?: ReactNode;
};

export function ServicesFaq({ titleId, footer }: ServicesFaqProps) {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <Eyebrow>Questions</Eyebrow>
          <h2 id={titleId} className={styles.title}>
            What owners ask before we start.
          </h2>
          <p className={styles.lead}>
            Straight answers on engagements, timing, AI, and reporting. If yours is not here, ask it directly.
          </p>
          <ButtonLink href={cta.primary.href} variant="ghost" arrow className={styles.cta}>
            {cta.primary.label}
          </ButtonLink>
        </div>
        <div className={styles.list}>
          {faqs.map((faq) => (
            <details key={faq.id} className={styles.item}>
              <summary className={styles.summary}>
                <span className={styles.question}>{faq.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <Plus className={styles.plus} />
                  <Minus className={styles.minus} />
                </span>
              </summary>
              <div className={styles.answer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </>
  );
}
