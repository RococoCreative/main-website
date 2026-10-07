import { useId, type MouseEvent, type Ref } from "react";

import { AlertCircle } from "@/components/ui/icons";

import styles from "./ContactForm.module.css";

export type SummaryError = {
  /** id of the control to move focus to. */
  targetId: string;
  message: string;
};

type ErrorSummaryProps = {
  message: string;
  errors: SummaryError[];
  email: string;
  summaryRef: Ref<HTMLDivElement>;
};

/** Moves focus to the control and centres it, honouring reduced motion via CSS scroll-behavior. */
function focusField(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
  const target = document.getElementById(targetId);
  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "center" });
}

/**
 * Error summary at the top of the form (GOV.UK pattern). Receives focus after
 * a failed submission; each error links to its field. Errors that are not tied
 * to a field (storage or availability) offer the direct email instead.
 */
export function ErrorSummary({ message, errors, email, summaryRef }: ErrorSummaryProps) {
  const headingId = useId();
  const count = errors.length;
  const title = count === 0 ? "Your message was not sent" : count === 1 ? "1 detail needs attention" : `${count} details need attention`;

  return (
    <div ref={summaryRef} className={styles.summary} role="alert" aria-labelledby={headingId} tabIndex={-1}>
      <div className={styles.summaryHead}>
        <AlertCircle className={styles.summaryIcon} />
        <h3 id={headingId} className={styles.summaryTitle}>
          {title}
        </h3>
      </div>
      <p className={styles.summaryText}>{message}</p>
      {count > 0 ? (
        <ul className={styles.summaryList}>
          {errors.map((error) => (
            <li key={error.targetId}>
              <a href={`#${error.targetId}`} onClick={(event) => focusField(event, error.targetId)}>
                {error.message}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.summaryText}>
          <a href={`mailto:${email}`} className={styles.summaryEmail}>
            {email}
          </a>
        </p>
      )}
    </div>
  );
}
