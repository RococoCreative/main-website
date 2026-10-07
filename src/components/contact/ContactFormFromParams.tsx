"use client";

import { useSearchParams } from "next/navigation";

import { ContactForm } from "./ContactForm";
import { parseIntent, parseServiceIds } from "./intent";

/**
 * Reads ?intent= and ?services= on the client so /contact stays a fully
 * static page. Render inside <Suspense fallback={<ContactForm />}>: the
 * prerendered HTML carries the default form and this swaps in after hydration.
 */
export function ContactFormFromParams() {
  const searchParams = useSearchParams();
  const intent = parseIntent(searchParams.get("intent"));
  const services = parseServiceIds(searchParams.getAll("services"));
  return <ContactForm intent={intent} defaultServices={services} />;
}
