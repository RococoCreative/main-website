import "server-only";

import { budgets, companyTypes, serviceInterests, timelines } from "@/content/contact";
import type { ContactFieldName, ContactFormState, ContactSubmission } from "@/lib/types";

import { CONTACT_LIMITS, HONEYPOT_FIELD, MIN_FILL_TIME_MS } from "./constraints";

/* =============================================================================
 * Contact form parsing and validation (server only)
 *
 * Every field is read as text, stripped of control characters, trimmed, and
 * checked against the same limits as the database constraints. Option fields
 * must match a value the form actually offered. Errors are returned as values
 * (never thrown) so the form can show them next to each field.
 * ========================================================================== */

type FieldErrors = Partial<Record<ContactFieldName, string>>;
type EchoValues = Extract<ContactFormState, { status: "error" }>["values"];

export type ContactParseResult =
  | { ok: true; submission: ContactSubmission }
  | { ok: false; fieldErrors: FieldErrors; values: EchoValues };

/** Postgres CHECK: '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' (case-insensitive). */
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Digits, spaces, and + ( ) . - with an optional extension ("x 12" or "ext. 12"). */
const PHONE_PATTERN = /^[\d\s()+.-]+(?:\s*(?:x|ext\.?)\s*\d{1,6})?$/i;
const PHONE_MIN_DIGITS = 7;

/** A same-site path: starts with one slash, URL-safe characters only. */
const SOURCE_PATH_PATTERN = /^\/(?!\/)[A-Za-z0-9\-._~/?=&%]*$/;

/** Control characters except tab, line feed, and carriage return. */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Values echoed back to the form are capped so an oversized payload is never reflected in full. */
const ECHO_CAP = CONTACT_LIMITS.messageMax + 1000;

/** Postgres char_length counts code points, not UTF-16 units. Match it. */
function charLength(value: string): number {
  return Array.from(value).length;
}

function text(formData: FormData, name: string): string {
  const raw = formData.get(name);
  if (typeof raw !== "string") return "";
  return raw.replace(CONTROL_CHARS, "").replace(/\r\n?/g, "\n").trim();
}

function list(formData: FormData, name: string): string[] {
  const seen = new Set<string>();
  for (const raw of formData.getAll(name)) {
    if (typeof raw !== "string") continue;
    const value = raw.replace(CONTROL_CHARS, "").trim();
    if (value) seen.add(value);
  }
  return [...seen];
}

function cap(value: string): string {
  return value.length > ECHO_CAP ? value.slice(0, ECHO_CAP) : value;
}

function formatCount(limit: number): string {
  return limit.toLocaleString("en-US");
}

function oneOf(value: string, options: readonly string[]): boolean {
  return options.includes(value);
}

type RawContact = ReturnType<typeof readRaw>;

function readRaw(formData: FormData) {
  return {
    name: text(formData, "name"),
    email: text(formData, "email"),
    company: text(formData, "company"),
    role: text(formData, "role"),
    phone: text(formData, "phone"),
    companyType: text(formData, "companyType"),
    services: list(formData, "services"),
    budget: text(formData, "budget"),
    timeline: text(formData, "timeline"),
    message: text(formData, "message"),
    consent: text(formData, "consent"),
    sourcePath: text(formData, "sourcePath"),
  };
}

function toEcho(raw: RawContact): EchoValues {
  return {
    name: cap(raw.name),
    email: cap(raw.email),
    company: cap(raw.company),
    role: cap(raw.role),
    phone: cap(raw.phone),
    companyType: cap(raw.companyType),
    services: raw.services.slice(0, CONTACT_LIMITS.services * 2).map(cap),
    budget: cap(raw.budget),
    timeline: cap(raw.timeline),
    message: cap(raw.message),
    consent: raw.consent === "yes" ? "yes" : "",
  };
}

/** Cleaned, capped copy of what the visitor typed, for repopulating the form after any error. */
export function echoContactValues(formData: FormData): EchoValues {
  return toEcho(readRaw(formData));
}

export function parseContactForm(formData: FormData): ContactParseResult {
  const raw = readRaw(formData);

  const errors: FieldErrors = {};

  // Name (required)
  if (!raw.name) errors.name = "Enter your name.";
  else if (charLength(raw.name) > CONTACT_LIMITS.name)
    errors.name = `Shorten your name to ${formatCount(CONTACT_LIMITS.name)} characters or fewer.`;

  // Email (required)
  if (!raw.email) errors.email = "Enter your email address.";
  else if (
    charLength(raw.email) < CONTACT_LIMITS.emailMin ||
    charLength(raw.email) > CONTACT_LIMITS.email ||
    !EMAIL_PATTERN.test(raw.email)
  )
    errors.email = "Enter an email address in the format name@company.com.";

  // Phone (optional)
  if (raw.phone) {
    const digits = raw.phone.replace(/\D/g, "").length;
    if (charLength(raw.phone) > CONTACT_LIMITS.phone)
      errors.phone = `Shorten the phone number to ${formatCount(CONTACT_LIMITS.phone)} characters or fewer.`;
    else if (!PHONE_PATTERN.test(raw.phone) || digits < PHONE_MIN_DIGITS)
      errors.phone = "Enter a phone number using digits, spaces, and + ( ) - only.";
  }

  // Company and role (optional free text)
  if (charLength(raw.company) > CONTACT_LIMITS.company)
    errors.company = `Shorten the company name to ${formatCount(CONTACT_LIMITS.company)} characters or fewer.`;
  if (charLength(raw.role) > CONTACT_LIMITS.role)
    errors.role = `Shorten your role to ${formatCount(CONTACT_LIMITS.role)} characters or fewer.`;

  // Option fields (optional, but only values the form offered)
  if (raw.companyType && !oneOf(raw.companyType, companyTypes))
    errors.companyType = "Choose a company type from the list.";
  if (raw.services.length > CONTACT_LIMITS.services || raw.services.some((s) => !oneOf(s, serviceInterests)))
    errors.services = "Choose services from the list.";
  if (raw.budget && !oneOf(raw.budget, budgets)) errors.budget = "Choose a budget range from the list.";
  if (raw.timeline && !oneOf(raw.timeline, timelines)) errors.timeline = "Choose a timeline from the list.";

  // Message (required)
  const messageLength = charLength(raw.message);
  if (!raw.message) errors.message = "Tell us a little about the project.";
  else if (messageLength < CONTACT_LIMITS.messageMin)
    errors.message = `Add a little more detail (at least ${CONTACT_LIMITS.messageMin} characters).`;
  else if (messageLength > CONTACT_LIMITS.messageMax)
    errors.message = `Shorten your message to ${formatCount(CONTACT_LIMITS.messageMax)} characters or fewer.`;

  // Consent (required)
  if (raw.consent !== "yes") errors.consent = "Confirm that we may contact you about this inquiry.";

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      fieldErrors: errors,
      values: toEcho(raw),
    };
  }

  const sourcePath =
    raw.sourcePath && charLength(raw.sourcePath) <= CONTACT_LIMITS.sourcePath && SOURCE_PATH_PATTERN.test(raw.sourcePath)
      ? raw.sourcePath
      : null;

  return {
    ok: true,
    submission: {
      name: raw.name,
      email: raw.email,
      company: raw.company || null,
      role: raw.role || null,
      phone: raw.phone || null,
      companyType: raw.companyType || null,
      services: raw.services,
      budget: raw.budget || null,
      timeline: raw.timeline || null,
      message: raw.message,
      sourcePath,
      consent: true,
    },
  };
}

/**
 * Spam signals, checked only after a submission is otherwise valid (so a
 * person who presses Send on an empty form still sees what is missing).
 * - honeypot: the hidden "website" field has a value.
 * - too-fast: submitted within MIN_FILL_TIME_MS of the form mounting, measured
 *   entirely in the browser (elapsedMs), so clock differences cannot misfire.
 * A missing or unreadable value (no JavaScript) is not treated as spam.
 */
export function detectSpam(formData: FormData): "honeypot" | "too-fast" | null {
  if (text(formData, HONEYPOT_FIELD)) return "honeypot";
  const raw = text(formData, "elapsedMs");
  const elapsed = raw ? Number(raw) : Number.NaN;
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) return "too-fast";
  return null;
}
