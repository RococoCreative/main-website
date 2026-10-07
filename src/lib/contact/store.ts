import "server-only";

import { getSupabase } from "@/lib/supabase/client";
import type { ContactSubmission } from "@/lib/types";

/**
 * Outcome of saving a contact submission.
 * - stored: inserted into public.contact_submissions.
 * - logged: Supabase is not configured and this is a development server; the
 *   submission was printed to the server console instead.
 * - unavailable: Supabase is not configured in production. Nothing was saved.
 * - failed: the insert was rejected or the request failed. Nothing was saved.
 */
export type StoreOutcome = "stored" | "logged" | "unavailable" | "failed";

/**
 * Inserts a validated submission with the anon key. The anon role may INSERT
 * only the granted columns and can never read the table back, so this must not
 * call .select() (supabase-js then sends Prefer: return=minimal).
 */
export async function storeContactSubmission(submission: ContactSubmission): Promise<StoreOutcome> {
  const supabase = getSupabase();

  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Supabase is not configured. Development submission (not stored):", submission);
      return "logged";
    }
    console.error("[contact] Supabase is not configured in production. A contact submission could not be stored.");
    return "unavailable";
  }

  try {
    const { error } = await supabase.from("contact_submissions").insert({
      name: submission.name,
      email: submission.email,
      company: submission.company,
      role: submission.role,
      phone: submission.phone,
      company_type: submission.companyType,
      services: submission.services,
      budget: submission.budget,
      timeline: submission.timeline,
      message: submission.message,
      source_path: submission.sourcePath,
      consent: submission.consent,
    });
    if (error) {
      // Log the database reason only. The submission itself stays out of the logs.
      console.error(`[contact] Failed to store a contact submission: ${error.message}${error.code ? ` (${error.code})` : ""}`);
      return "failed";
    }
    return "stored";
  } catch (error) {
    console.error("[contact] Failed to store a contact submission:", error instanceof Error ? error.message : error);
    return "failed";
  }
}
