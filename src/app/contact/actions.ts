"use server";

import { after } from "next/server";

import { getNotificationConfig, sendContactNotification } from "@/lib/contact/notify";
import { storeContactSubmission } from "@/lib/contact/store";
import { detectSpam, echoContactValues, parseContactForm } from "@/lib/contact/validation";
import { site } from "@/lib/site";
import type { ContactFormState } from "@/lib/types";

const SUCCESS_MESSAGE = "We will be in touch using the details you provided. If anything is time-sensitive, email us directly.";

const VALIDATION_MESSAGE = "Some details need attention before we can send your message.";

const UNAVAILABLE_MESSAGE = `Our contact form is unavailable right now. Please email us at ${site.contact.email} and we will pick it up from there.`;

const FAILED_MESSAGE = `We could not send your message just now. Please try again in a moment, or email us at ${site.contact.email}.`;

/** Error with the visitor's input echoed back, so nothing typed is lost. */
function failure(message: string, formData: FormData): ContactFormState {
  let values: Extract<ContactFormState, { status: "error" }>["values"] = {};
  try {
    values = echoContactValues(formData);
  } catch {
    // Unreadable payload: return the message without values.
  }
  return { status: "error", message, fieldErrors: {}, values };
}

/**
 * Contact form Server Action (used with useActionState).
 * Validates every field, quietly discards spam, stores the submission in
 * Supabase, and schedules the optional email notification after the response.
 * Expected failures come back as values; nothing here throws to the client.
 */
export async function submitContact(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  try {
    const parsed = parseContactForm(formData);
    if (!parsed.ok) {
      return { status: "error", message: VALIDATION_MESSAGE, fieldErrors: parsed.fieldErrors, values: parsed.values };
    }

    // Spam gets the same response as a real submission, so bots learn nothing.
    const spam = detectSpam(formData);
    if (spam) {
      console.info(`[contact] Discarded a submission flagged as spam (${spam}).`);
      return { status: "success", message: SUCCESS_MESSAGE };
    }

    const { submission } = parsed;
    const outcome = await storeContactSubmission(submission);
    if (outcome === "unavailable") return failure(UNAVAILABLE_MESSAGE, formData);
    if (outcome === "failed") return failure(FAILED_MESSAGE, formData);

    const notification = getNotificationConfig();
    if (notification) {
      // Runs after the response is sent; failures are logged inside.
      after(() => sendContactNotification(submission, notification));
    }

    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("[contact] Unexpected error while handling a submission:", error instanceof Error ? error.message : error);
    return failure(FAILED_MESSAGE, formData);
  }
}
