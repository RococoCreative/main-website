import type { Ref } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckCircle } from "@/components/ui/icons";

import styles from "./ContactForm.module.css";

type SuccessPanelProps = {
  message: string;
  email: string;
  headingRef: Ref<HTMLHeadingElement>;
  onReset: () => void;
};

/** Replaces the form after a successful submission. The heading receives focus. */
export function SuccessPanel({ message, email, headingRef, onReset }: SuccessPanelProps) {
  return (
    <div className={styles.success} role="status">
      <div className={styles.successMark}>
        <CheckCircle className={styles.successIcon} />
        <Eyebrow>Message received</Eyebrow>
      </div>
      <h2 ref={headingRef} className={styles.successTitle} tabIndex={-1}>
        Thank you. Your message is with us.
      </h2>
      <p className={styles.successText}>{message}</p>
      <p className={styles.successText}>
        <a href={`mailto:${email}`} className={styles.successEmail}>
          {email}
        </a>
      </p>
      <div className={styles.successActions}>
        <Button variant="secondary" onClick={onReset}>
          Send another message
        </Button>
        <ButtonLink href="/work" variant="ghost" arrow>
          See our work
        </ButtonLink>
      </div>
    </div>
  );
}
