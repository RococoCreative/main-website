import { Eyebrow } from "@/components/ui/Eyebrow";
import { Flourish } from "@/components/ui/Flourish";
import { Mail, MapPin } from "@/components/ui/icons";
import { nextSteps } from "@/content/contact";
import { site } from "@/lib/site";

import styles from "./ContactAside.module.css";

/**
 * Right-hand column on /contact: what happens after an inquiry, the direct
 * email, and the service area. Carries the page's single gold flourish.
 */
export function ContactAside() {
  return (
    <aside className={styles.aside} aria-labelledby="contact-next-steps">
      <div className={styles.block}>
        <Eyebrow as="h2" id="contact-next-steps">
          What happens next
        </Eyebrow>
        {/* TODO: Rococo Creative to confirm these commitments (reply time, call length, written
            recommendation) before launch. The copy lives in src/content/contact.ts (nextSteps). */}
        <ol className={styles.steps}>
          {nextSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.stepCopy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Flourish className={styles.flourish} size={30} />

      <div className={styles.block}>
        <Eyebrow as="h2">Direct email</Eyebrow>
        <a href={`mailto:${site.contact.email}`} className={styles.email}>
          <Mail className={styles.icon} />
          <span>{site.contact.email}</span>
        </a>
        <p className={styles.note}>Write to us directly with anything you would put in the form.</p>
      </div>

      <div className={styles.block}>
        <Eyebrow as="h2">Service area</Eyebrow>
        {/* Shown as given. TODO lives in src/lib/site.ts (site.contact.serviceArea). */}
        <p className={styles.area}>
          <MapPin className={styles.icon} />
          <span>{site.contact.serviceArea}</span>
        </p>
      </div>
    </aside>
  );
}
