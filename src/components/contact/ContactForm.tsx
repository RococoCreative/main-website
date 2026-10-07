"use client";

import Link from "next/link";
import { useActionState, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Checkbox, CheckboxGroup, Input, Select, Textarea } from "@/components/ui/Field";
import { budgets, companyTypes, serviceInterests, timelines } from "@/content/contact";
import { CONTACT_LIMITS, HONEYPOT_FIELD, contactSourcePath, type ContactIntent } from "@/lib/contact/constraints";
import { site } from "@/lib/site";
import type { ContactFieldName, ContactFormState } from "@/lib/types";

import styles from "./ContactForm.module.css";
import { ErrorSummary, type SummaryError } from "./ErrorSummary";
import { intentCopy } from "./intent";
import { SuccessPanel } from "./SuccessPanel";

const initialState: ContactFormState = { status: "idle" };

/** Field order drives the error summary order. */
const FIELD_ORDER: ContactFieldName[] = [
  "name",
  "email",
  "phone",
  "company",
  "role",
  "companyType",
  "services",
  "budget",
  "timeline",
  "message",
  "consent",
];

type ContactFormProps = {
  /** From ?intent=. Adjusts the intro line and the message placeholder. */
  intent?: ContactIntent | null;
  /** Offering names to pre-check, from ?services=. */
  defaultServices?: readonly string[];
};

/**
 * Project inquiry form.
 *
 * Reset model: the form body is keyed. "Send another message" bumps the key,
 * which remounts the body with a fresh useActionState. Next.js keeps visited
 * routes alive with React <Activity>, so a successful submission also marks
 * the form as stale; when the route is hidden, the layout-effect cleanup
 * bumps the key so returning visitors see a clean form, not an old success
 * panel. An unsent draft is left alone and survives navigation.
 */
export function ContactForm({ intent = null, defaultServices = [] }: ContactFormProps) {
  const [formKey, setFormKey] = useState(0);
  const [focusOnMount, setFocusOnMount] = useState(false);
  const sentRef = useRef(false);

  useLayoutEffect(() => {
    return () => {
      if (sentRef.current) {
        sentRef.current = false;
        setFocusOnMount(false);
        setFormKey((key) => key + 1);
      }
    };
  }, []);

  const handleSent = useCallback(() => {
    sentRef.current = true;
  }, []);

  const handleReset = useCallback(() => {
    sentRef.current = false;
    setFocusOnMount(true);
    setFormKey((key) => key + 1);
  }, []);

  return (
    <ContactFormBody
      key={formKey}
      intent={intent}
      defaultServices={defaultServices}
      focusOnMount={focusOnMount}
      onSent={handleSent}
      onReset={handleReset}
    />
  );
}

type ContactFormBodyProps = {
  intent: ContactIntent | null;
  defaultServices: readonly string[];
  /** Move focus to the first field after mounting (after "Send another message"). */
  focusOnMount: boolean;
  onSent: () => void;
  onReset: () => void;
};

function ContactFormBody({ intent, defaultServices, focusOnMount, onSent, onReset }: ContactFormBodyProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const titleId = id("title");

  const summaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const elapsedRef = useRef<HTMLInputElement>(null);
  const mountedAtRef = useRef<number | null>(null);
  const handledState = useRef<ContactFormState>(state);
  const didFocusOnMount = useRef(false);

  // Spam timer: note when the form became usable (monotonic, browser-only clock)
  // and send the elapsed time on submit. Measuring on one clock avoids treating
  // a visitor whose device clock is ahead of the server's as "too fast". Stamped
  // once, so an <Activity> re-show or a restored draft does not restart it.
  useEffect(() => {
    if (mountedAtRef.current === null) mountedAtRef.current = performance.now();
  }, []);

  const stampElapsed = () => {
    const input = elapsedRef.current;
    if (input && mountedAtRef.current !== null) {
      input.value = String(Math.round(performance.now() - mountedAtRef.current));
    }
  };

  const nameId = id("name");
  useEffect(() => {
    if (focusOnMount && !didFocusOnMount.current) {
      didFocusOnMount.current = true;
      document.getElementById(nameId)?.focus();
    }
  }, [focusOnMount, nameId]);

  // Focus management runs once per new result. Effects re-run when <Activity>
  // re-shows the route; the ref check stops that from stealing focus again.
  useEffect(() => {
    if (handledState.current === state) return;
    handledState.current = state;
    if (state.status === "error") {
      summaryRef.current?.focus();
    } else if (state.status === "success") {
      onSent();
      successHeadingRef.current?.focus();
    }
  }, [state, onSent]);

  if (state.status === "success") {
    return (
      <SuccessPanel message={state.message} email={site.contact.email} headingRef={successHeadingRef} onReset={onReset} />
    );
  }

  const copy = intentCopy(intent);
  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  const text = (field: ContactFieldName) => {
    const value = values[field];
    return typeof value === "string" ? value : undefined;
  };
  const checkedServices =
    state.status === "error" ? (Array.isArray(values.services) ? values.services : []) : defaultServices;

  const targetId = (field: ContactFieldName) => (field === "services" ? `${id("services")}-0` : id(field));
  const summaryErrors: SummaryError[] = FIELD_ORDER.flatMap((field) => {
    const message = fieldErrors[field];
    return message ? [{ targetId: targetId(field), message }] : [];
  });

  // React resets uncontrolled fields to their defaults after every form action,
  // and the echoed values become those defaults in the same commit. <select>
  // ignores defaultValue updates after mount, so each Select is keyed by its
  // echoed value and remounts with it.
  const companyType = text("companyType") ?? "";
  const budget = text("budget") ?? "";
  const timeline = text("timeline") ?? "";

  return (
    <form
      action={formAction}
      onSubmit={stampElapsed}
      className={styles.form}
      aria-labelledby={titleId}
      aria-busy={pending}
      noValidate
    >
      <header className={styles.header}>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h2 id={titleId} className={styles.title}>
          Start with a few details.
        </h2>
        <p className={styles.intro}>{copy.intro}</p>
        <p className={styles.requiredNote}>Required fields are marked with an asterisk (*).</p>
      </header>

      {state.status === "error" ? (
        <ErrorSummary message={state.message} errors={summaryErrors} email={site.contact.email} summaryRef={summaryRef} />
      ) : null}

      <div className={styles.group} role="group" aria-labelledby={id("group-you")}>
        <div className={styles.groupHead}>
          <span className={styles.groupIndex} aria-hidden="true">
            01
          </span>
          <h3 id={id("group-you")} className={styles.groupTitle}>
            Your details
          </h3>
        </div>
        <div className={styles.row}>
          <Input
            id={nameId}
            name="name"
            label="Name"
            required
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            defaultValue={text("name")}
            error={fieldErrors.name}
          />
          <Input
            id={id("email")}
            name="email"
            type="email"
            label="Email"
            required
            autoComplete="email"
            spellCheck={false}
            maxLength={CONTACT_LIMITS.email}
            defaultValue={text("email")}
            error={fieldErrors.email}
          />
        </div>
        <div className={styles.row}>
          <Input
            id={id("phone")}
            name="phone"
            type="tel"
            label="Phone"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            defaultValue={text("phone")}
            error={fieldErrors.phone}
          />
        </div>
      </div>

      <div className={styles.group} role="group" aria-labelledby={id("group-company")}>
        <div className={styles.groupHead}>
          <span className={styles.groupIndex} aria-hidden="true">
            02
          </span>
          <h3 id={id("group-company")} className={styles.groupTitle}>
            Your company
          </h3>
        </div>
        <div className={styles.row}>
          <Input
            id={id("company")}
            name="company"
            label="Company"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company}
            defaultValue={text("company")}
            error={fieldErrors.company}
          />
          <Input
            id={id("role")}
            name="role"
            label="Your role"
            autoComplete="organization-title"
            maxLength={CONTACT_LIMITS.role}
            defaultValue={text("role")}
            error={fieldErrors.role}
          />
        </div>
        <div className={styles.row}>
          <Select
            key={`companyType:${companyType}`}
            id={id("companyType")}
            name="companyType"
            label="Company type"
            options={companyTypes}
            defaultValue={companyType}
            error={fieldErrors.companyType}
          />
        </div>
      </div>

      <div className={styles.group} role="group" aria-labelledby={id("group-project")}>
        <div className={styles.groupHead}>
          <span className={styles.groupIndex} aria-hidden="true">
            03
          </span>
          <h3 id={id("group-project")} className={styles.groupTitle}>
            The project
          </h3>
        </div>
        {/* Uncontrolled checkboxes only read defaultChecked on mount. Keying on the
            pre-selection remounts the group when ?services= changes during in-app
            navigation (the route stays mounted under <Activity>). */}
        <CheckboxGroup
          key={`services:${checkedServices.join("|")}`}
          id={id("services")}
          name="services"
          legend="Services you are interested in"
          hint="Choose any that apply."
          options={serviceInterests}
          defaultValues={checkedServices}
          error={fieldErrors.services}
        />
        <div className={styles.row}>
          <Select
            key={`budget:${budget}`}
            id={id("budget")}
            name="budget"
            label="Budget"
            options={budgets}
            defaultValue={budget}
            error={fieldErrors.budget}
          />
          <Select
            key={`timeline:${timeline}`}
            id={id("timeline")}
            name="timeline"
            label="Timeline"
            options={timelines}
            defaultValue={timeline}
            error={fieldErrors.timeline}
          />
        </div>
        <Textarea
          id={id("message")}
          name="message"
          label="How can we help?"
          hint="A few sentences is plenty: the work you want more of, where you build, and anything time-sensitive."
          placeholder={copy.placeholder}
          required
          rows={7}
          minLength={CONTACT_LIMITS.messageMin}
          maxLength={CONTACT_LIMITS.messageMax}
          defaultValue={text("message")}
          error={fieldErrors.message}
        />
      </div>

      <div className={styles.footer}>
        <Checkbox
          id={id("consent")}
          name="consent"
          required
          defaultChecked={values.consent === "yes"}
          error={fieldErrors.consent}
          label={
            <>
              I agree to Rococo Creative contacting me about this inquiry.
              <span className={styles.asterisk} aria-hidden="true">
                {" "}
                *
              </span>
            </>
          }
        />
        <p className={styles.privacyNote}>
          We use your details only to respond to this inquiry. Read our <Link href="/privacy">privacy notice</Link>.
        </p>

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
        <div className="visually-hidden" aria-hidden="true">
          <label htmlFor={id(HONEYPOT_FIELD)}>Website (leave this empty)</label>
          <input id={id(HONEYPOT_FIELD)} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </div>
        <input ref={elapsedRef} type="hidden" name="elapsedMs" />
        <input type="hidden" name="sourcePath" value={contactSourcePath(intent)} />

        <div className={styles.actions}>
          <Button type="submit" variant="primary" size="lg" arrow={!pending} disabled={pending}>
            {pending ? "Sending" : "Send message"}
          </Button>
        </div>
        <p className="visually-hidden" role="status">
          {pending ? "Sending your message." : ""}
        </p>
      </div>
    </form>
  );
}
