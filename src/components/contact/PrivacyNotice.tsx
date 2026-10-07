import Link from "next/link";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Col, Grid } from "@/components/ui/Grid";
import { Placeholder } from "@/components/ui/Placeholder";
import { site } from "@/lib/site";

import styles from "./PrivacyNotice.module.css";

/**
 * Plain-language privacy notice for /privacy. It describes what the contact
 * form (src/components/contact/ContactForm.tsx) actually collects and where it
 * goes (src/app/contact/actions.ts). Keep the two in step.
 * TODO: Have this notice reviewed by counsel before launch.
 */

type NoticeSection = { id: string; title: string; body: ReactNode };

const email = site.contact.email;
const mailto = (
  <a href={`mailto:${email}`} className={styles.email}>
    {email}
  </a>
);

const sections: NoticeSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          This website is run by {site.name} (&quot;we&quot; or &quot;us&quot;). This notice explains what happens
          to the information you share with us through the site.
        </p>
        <Placeholder label="TODO: legal entity">
          Legal business name, mailing address, and the places this notice is written for.
        </Placeholder>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <p>
          When you use the <Link href="/contact">contact form</Link>, we collect what you enter:
        </p>
        <ul>
          <li>Your name and email address.</li>
          <li>Your phone number, company, and role, if you add them.</li>
          <li>Your company type, the services you are interested in, a budget range, and a timeline, if you choose them.</li>
          <li>Your message.</li>
          <li>Your confirmation that we may contact you about the inquiry, and the page the form was sent from.</li>
        </ul>
        <p>
          The form also runs two simple spam checks. They do not identify you and are not stored with your inquiry.
          Please do not include payment details, passwords, or other sensitive information in your message.
        </p>
        <p>
          Like most websites, our hosting provider automatically processes technical information such as IP addresses,
          browser type, and the pages requested, so it can deliver the site and protect it from abuse.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use it",
    body: (
      <>
        <p>We use the information you send to:</p>
        <ul>
          <li>Read and respond to your inquiry.</li>
          <li>Prepare for a conversation or proposal you asked for.</li>
          <li>Keep a record of our correspondence with you.</li>
        </ul>
        <p>Sending the form does not add you to a mailing list, and we do not use your details for unrelated marketing.</p>
      </>
    ),
  },
  {
    id: "where-it-is-stored",
    title: "Where it is stored",
    body: (
      <>
        <p>
          Form submissions are stored in a database operated by Supabase, our database provider. The website is hosted
          on Vercel. Both act as service providers that process information on our behalf.
        </p>
        <Placeholder label="TODO: storage region">
          The region where the Supabase project stores data, and links to each provider&apos;s privacy and security
          documentation.
        </Placeholder>
      </>
    ),
  },
  {
    id: "email-notifications",
    title: "Email notifications",
    body: (
      <p>
        When email notifications are enabled, a plain-text copy of each submission is sent to our team through Resend,
        an email delivery provider, so we can reply quickly.
      </p>
    ),
  },
  {
    id: "what-we-do-not-do",
    title: "What we do not do",
    body: (
      <>
        <p>We do not sell your personal information or share it for advertising.</p>
        <p>
          By default, this website sets no advertising cookies and uses no ad-tracking pixels. If we add analytics or
          other tools that change this, we will update this notice first.
        </p>
      </>
    ),
  },
  {
    id: "how-long-we-keep-it",
    title: "How long we keep it",
    body: (
      <Placeholder label="TODO: retention">
        How long contact form submissions are kept (for example, a set number of months after our last correspondence)
        and how they are deleted afterward.
      </Placeholder>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices",
    body: (
      <>
        <p>
          You can ask us to show you, correct, or delete the information you sent through the form, and you can ask us
          to stop contacting you at any time. Email {mailto} from the address you used and tell us what you would like
          us to do.
        </p>
        <p>Depending on where you live, privacy law may give you further rights. We will help you exercise them.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this notice",
    body: <p>If we change how we handle your information, we will update this page and the date at the top.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Questions about this notice or about your information: {mailto}.</p>,
  },
];

const index = (i: number) => String(i + 1).padStart(2, "0");

/** Hero aside: the publication date and legal review, both supplied by Rococo Creative. */
export function PrivacyStatus() {
  return (
    <div className={styles.status}>
      <Placeholder label="TODO: date">Last updated: TODO (set the date this notice is published).</Placeholder>
      <Placeholder label="TODO: legal review">Have this notice reviewed by counsel before launch.</Placeholder>
    </div>
  );
}

export function PrivacyNotice() {
  return (
    <Grid rowGap="lg">
      <Col span={{ lg: 3 }}>
        <nav className={styles.toc} aria-labelledby="privacy-toc-title">
          <Eyebrow as="h2" id="privacy-toc-title">
            On this page
          </Eyebrow>
          <ol className={styles.tocList}>
            {sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.tocLink}>
                  <span className={styles.tocIndex} aria-hidden="true">
                    {index(i)}
                  </span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Col>
      <Col span={{ lg: 8 }} start={{ lg: 5 }}>
        <div className={styles.sections}>
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionIndex} aria-hidden="true">
                  {index(i)}
                </span>
                <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
                  {section.title}
                </h2>
              </div>
              <div className={styles.body}>{section.body}</div>
            </section>
          ))}
        </div>
      </Col>
    </Grid>
  );
}
