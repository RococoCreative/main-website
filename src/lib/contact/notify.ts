import "server-only";

import type { ContactSubmission } from "@/lib/types";

import { CONTACT_LIMITS } from "./constraints";

/* =============================================================================
 * New-inquiry email notification via the Resend REST API (no SDK).
 *
 * Optional. Sends only when RESEND_API_KEY and CONTACT_NOTIFICATION_TO are set
 * (CONTACT_NOTIFICATION_FROM must be an address on a domain verified in
 * Resend). Called from after() so it never delays the visitor's response, and
 * failures are logged, never surfaced: the submission is already stored.
 * ========================================================================== */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RECIPIENTS = 10;
const SUBJECT_MAX = 150;
const BODY_MAX = 10_000;

export type NotificationConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Returns the Resend settings, or null when notifications are not configured. */
export function getNotificationConfig(): NotificationConfig | null {
  const apiKey = env("RESEND_API_KEY");
  const toRaw = env("CONTACT_NOTIFICATION_TO");
  if (!apiKey || !toRaw) return null;

  const from = env("CONTACT_NOTIFICATION_FROM");
  if (!from) {
    console.warn(
      "[contact] RESEND_API_KEY and CONTACT_NOTIFICATION_TO are set but CONTACT_NOTIFICATION_FROM is missing. Notification skipped.",
    );
    return null;
  }

  const to = toRaw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
    .slice(0, MAX_RECIPIENTS);
  return to.length ? { apiKey, from, to } : null;
}

/** Single-line value: no line breaks (header safety), capped. */
function line(value: string | null | undefined, max: number): string {
  if (!value) return "Not provided";
  const flat = value.replace(/[\r\n]+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 3)}...` : flat;
}

function buildSubject(submission: ContactSubmission): string {
  const who = submission.company ? `${submission.name}, ${submission.company}` : submission.name;
  return line(`New website inquiry: ${who}`, SUBJECT_MAX);
}

function buildText(submission: ContactSubmission): string {
  const message =
    submission.message.length > CONTACT_LIMITS.messageMax
      ? `${submission.message.slice(0, CONTACT_LIMITS.messageMax)}...`
      : submission.message;

  const body = [
    "A new inquiry arrived through the website contact form.",
    "",
    `Name: ${line(submission.name, CONTACT_LIMITS.name)}`,
    `Email: ${line(submission.email, CONTACT_LIMITS.email)}`,
    `Phone: ${line(submission.phone, CONTACT_LIMITS.phone)}`,
    `Company: ${line(submission.company, CONTACT_LIMITS.company)}`,
    `Role: ${line(submission.role, CONTACT_LIMITS.role)}`,
    `Company type: ${line(submission.companyType, CONTACT_LIMITS.companyType)}`,
    `Services: ${line(submission.services.join(", "), 600)}`,
    `Budget: ${line(submission.budget, CONTACT_LIMITS.budget)}`,
    `Timeline: ${line(submission.timeline, CONTACT_LIMITS.timeline)}`,
    `Sent from: ${line(submission.sourcePath, CONTACT_LIMITS.sourcePath)}`,
    "",
    "Message:",
    message,
    "",
    "Reply to this email to respond directly. The submission is also stored in Supabase (contact_submissions).",
  ].join("\n");

  return body.length > BODY_MAX ? `${body.slice(0, BODY_MAX - 3)}...` : body;
}

/** Sends the plain-text notification. Never throws. */
export async function sendContactNotification(submission: ContactSubmission, config: NotificationConfig): Promise<void> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        reply_to: submission.email,
        subject: buildSubject(submission),
        text: buildText(submission),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      const detail = (await response.text().catch(() => "")).slice(0, 300);
      console.error(`[contact] Notification email failed with status ${response.status}. ${detail}`.trim());
    }
  } catch (error) {
    console.error("[contact] Notification email failed:", error instanceof Error ? error.message : error);
  }
}
