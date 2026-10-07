import type { Metadata } from "next";
import { Suspense } from "react";

import { ContactAside } from "@/components/contact/ContactAside";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormFromParams } from "@/components/contact/ContactFormFromParams";
import { PageHero } from "@/components/layout/PageHero";
import { Col, Grid } from "@/components/ui/Grid";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

import { pageMetadata } from "@/lib/metadata";
export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Discuss a project with Rococo Creative. Tell us about your company and the work you want more of, and we will reply with a clear next step.",
  path: "/contact",
});

/**
 * /contact is fully static. Query parameters (?intent=, ?services=) are read
 * on the client inside <Suspense>; the prerendered fallback is the same form
 * with default copy, so there is no layout shift for most visitors.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Discuss a project."
        lead={
          <>
            {/* TODO: Rococo Creative to confirm the reply commitment before launch. */}
            <p>
              A short note is enough to start. We read every inquiry and reply with a clear next step, whether or not we
              turn out to be the right fit.
            </p>
            <p>
              Prefer email? Write to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
            </p>
          </>
        }
      />

      <Section spacing="default">
        <Grid rowGap="lg" align="stretch">
          <Col span={{ lg: 7 }}>
            <Suspense fallback={<ContactForm />}>
              <ContactFormFromParams />
            </Suspense>
          </Col>
          <Col span={{ lg: 4 }} start={{ lg: 9 }}>
            <ContactAside />
          </Col>
        </Grid>
      </Section>
    </>
  );
}
