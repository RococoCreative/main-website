import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  CheckboxGroup,
  Col,
  Eyebrow,
  Flourish,
  Grid,
  Input,
  Placeholder,
  PullQuote,
  Section,
  SectionHeader,
  Select,
  Textarea,
} from "@/components/ui";

import styles from "./styleguide.module.css";

export const metadata: Metadata = {
  title: "Style guide",
  description: "Living reference for the Rococo Creative web design system.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/styleguide" },
};

const colors = [
  { token: "--rc-forest", name: "Forest", role: "Primary: headings, buttons, structure" },
  { token: "--rc-forest-dark", name: "Forest dark", role: "Hover and pressed" },
  { token: "--rc-sand", name: "Sand", role: "Secondary: warm surfaces" },
  { token: "--rc-cream", name: "Cream", role: "Cards and wells" },
  { token: "--rc-paper-alt", name: "Paper alt", role: "Alternating sections" },
  { token: "--rc-paper", name: "Paper", role: "Primary background" },
  { token: "--rc-gold", name: "Gold", role: "Ornament only. Never text on light." },
  { token: "--rc-ink", name: "Ink", role: "Body text" },
  { token: "--rc-text-muted", name: "Muted", role: "Secondary text on paper (5.6:1)" },
  { token: "--rc-border", name: "Hairline", role: "Dividers and card edges" },
  { token: "--rc-border-strong", name: "Control border", role: "Form controls (3.6:1)" },
];

const typeScale = [
  { label: "Display · hero", className: styles.typeDisplay, sample: "Built on a sound foundation." },
  { label: "H1 · Goldenbook Light", className: styles.typeH1, sample: "Marketing built the way you build." },
  { label: "H2 · Halcom Medium", className: styles.typeH2, sample: "Strategy before style." },
  { label: "H3 · Halcom Medium", className: styles.typeH3, sample: "Know where you win." },
  { label: "H4 · Halcom Regular", className: styles.typeH4, sample: "A clear plan for the work you want." },
  { label: "Lead · Inter", className: styles.typeLead, sample: "Plain, assured sentences about outcomes." },
  {
    label: "Body · Inter 16/1.65",
    className: styles.typeBody,
    sample:
      "Owners hire the builder they trust. Your marketing should earn that trust before the first meeting and keep the pipeline full without adding headcount.",
  },
  { label: "Label · Halcom Medium caps", className: styles.typeLabel, sample: "Discuss a project" },
];

const spaces = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function StyleGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Design system"
        title="Rococo Creative style guide."
        lead="A living reference for the web build of Design System v1.2. Every component reads tokens from src/styles/tokens.css. This page is excluded from search."
      />

      <Section aria-labelledby="sg-color">
        <SectionHeader eyebrow="Color" index="01" title="Palette" titleId="sg-color" intro="About 60% paper and neutrals, 30% forest, 10% gold." />
        <ul className={styles.swatches}>
          {colors.map((c) => (
            <li key={c.token} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(${c.token})` }} aria-hidden="true" />
              <span className={styles.swatchName}>{c.name}</span>
              <code className={styles.code}>{c.token}</code>
              <span className={styles.swatchRole}>{c.role}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="alt" aria-labelledby="sg-type">
        <SectionHeader eyebrow="Typography" index="02" title="Type scale" titleId="sg-type" />
        <dl className={styles.typeList}>
          {typeScale.map((t) => (
            <div key={t.label} className={styles.typeRow}>
              <dt className={styles.typeMeta}>{t.label}</dt>
              <dd className={t.className}>{t.sample}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.eyebrows}>
          <Eyebrow>Areas of expertise</Eyebrow>
          <Eyebrow index="01">Services of distinction</Eyebrow>
          <Eyebrow tone="text">Signature projects</Eyebrow>
        </div>
      </Section>

      <Section aria-labelledby="sg-space">
        <SectionHeader eyebrow="Space and grid" index="03" title="8pt spacing and 12 columns" titleId="sg-space" />
        <ul className={styles.spaces}>
          {spaces.map((s) => (
            <li key={s} className={styles.space}>
              <span className={styles.spaceBar} style={{ width: `var(--space-${s})` }} aria-hidden="true" />
              <code className={styles.code}>--space-{s}</code>
            </li>
          ))}
        </ul>
        <Grid rowGap="sm" className={styles.gridDemo}>
          {Array.from({ length: 12 }, (_, i) => (
            <Col key={i} span={{ base: 3, md: 1 }}>
              <span className={styles.gridCell}>{String(i + 1).padStart(2, "0")}</span>
            </Col>
          ))}
          <Col span={{ md: 5 }}>
            <span className={styles.gridCell}>Cols 1 to 5</span>
          </Col>
          <Col span={{ md: 6 }} start={{ md: 7 }}>
            <span className={styles.gridCell}>Cols 7 to 12</span>
          </Col>
        </Grid>
      </Section>

      <Section surface="cream" aria-labelledby="sg-buttons">
        <SectionHeader eyebrow="Actions" index="04" title="Buttons" titleId="sg-buttons" />
        <div className={styles.row}>
          <Button variant="primary" arrow>
            Discuss a project
          </Button>
          <Button variant="secondary">Request for Proposal</Button>
          <Button variant="ghost">Gain Clarity Today</Button>
          <Button variant="accent">Accent, rare</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className={styles.row}>
          <ButtonLink href="/contact" variant="primary" size="lg" pill arrow>
            Editorial pill
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary" size="lg" pill>
            Large outlined
          </ButtonLink>
        </div>
      </Section>

      <Section theme="forest" aria-labelledby="sg-forest">
        <SectionHeader
          eyebrow="Forest canvas"
          index="05"
          title="Themed sections flip automatically"
          titleId="sg-forest"
          intro="Primary buttons become gold with ink text; links and focus rings turn gold; muted text lifts to stay AA."
        />
        <div className={styles.row}>
          <Button variant="primary" arrow>
            Discuss a project
          </Button>
          <Button variant="secondary">Request for Proposal</Button>
          <Button variant="ghost">Gain Clarity Today</Button>
        </div>
      </Section>

      <Section aria-labelledby="sg-cards">
        <SectionHeader eyebrow="Containers" index="06" title="Cards, badges, quotes" titleId="sg-cards" />
        <Grid>
          <Col span={{ md: 6, lg: 4 }}>
            <Card eyebrow="Strategy" title="Know where you win." href="/services#strategy" linkLabel="Explore strategy">
              <p>We define the work you should pursue and the message that wins it.</p>
            </Card>
          </Col>
          <Col span={{ md: 6, lg: 4 }}>
            <Card eyebrow="Outline" title="Hairline variant" variant="outline">
              <p>For dense listings where a filled surface is too heavy.</p>
            </Card>
          </Col>
          <Col span={{ md: 12, lg: 4 }}>
            <div className={styles.badges}>
              <Badge>Website</Badge>
              <Badge tone="outline">Local SEO</Badge>
              <Badge tone="success">Published</Badge>
              <Badge tone="warning">Needs review</Badge>
              <Badge tone="error">Failed</Badge>
            </div>
          </Col>
        </Grid>
        <div className={styles.quote}>
          <PullQuote author="Manifesto" role="Rococo Creative">
            Ornament only earns its place on a sound structure.
          </PullQuote>
        </div>
      </Section>

      <Section surface="alt" aria-labelledby="sg-forms">
        <SectionHeader eyebrow="Inputs" index="07" title="Form controls" titleId="sg-forms" />
        <form className={styles.form} aria-label="Form control examples">
          <Input id="sg-name" name="name" label="Full name" required autoComplete="off" />
          <Input id="sg-email" name="email" type="email" label="Email" hint="We reply within one business day." />
          <Input id="sg-error" name="company" label="Company" error="Enter your company name." defaultValue="" />
          <Select id="sg-select" name="type" label="Company type" options={["General contractor", "Design-build firm"]} />
          <Textarea id="sg-message" name="message" label="Project details" rows={4} />
          <CheckboxGroup id="sg-services" name="services" legend="Services" options={["Website", "Local SEO", "CRM & automation"]} />
          <Checkbox id="sg-consent" name="consent" label="I agree to be contacted about this inquiry." />
        </form>
      </Section>

      <Section aria-labelledby="sg-misc">
        <SectionHeader eyebrow="Markers" index="08" title="Placeholder and flourish" titleId="sg-misc" />
        <Placeholder>Use for anything Rococo must supply: photography, client logos, real metrics.</Placeholder>
        <div className={styles.flourish}>
          <Flourish />
        </div>
      </Section>
    </>
  );
}
