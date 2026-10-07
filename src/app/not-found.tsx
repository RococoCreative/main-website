import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";

import styles from "./status-page.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

const suggestions = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function NotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <div className="container">
        <Eyebrow>Error 404</Eyebrow>
        <h1 id="not-found-title" className={styles.title}>
          This page is not on the plans.
        </h1>
        <p className={styles.lead}>
          The link may be out of date, or the page has moved. Everything else is where you would expect it.
        </p>
        <div className={styles.actions}>
          <ButtonLink href="/" variant="primary" arrow>
            Back to home
          </ButtonLink>
          <Link href="/contact" className={styles.link}>
            Discuss a project
          </Link>
        </div>
        <nav aria-labelledby="not-found-suggestions" className={styles.suggestions}>
          <Eyebrow as="h2" id="not-found-suggestions">
            Popular pages
          </Eyebrow>
          <ul className={styles.suggestionList}>
            {suggestions.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>
                  {s.label}
                  <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
