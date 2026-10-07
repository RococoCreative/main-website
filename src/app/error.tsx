"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

import styles from "./status-page.module.css";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Surfaces in Vercel runtime logs. Server errors carry only a digest in production.
    console.error(error);
  }, [error]);

  return (
    <section className={styles.page} aria-labelledby="error-title">
      <div className="container">
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 id="error-title" className={styles.title}>
          This page did not load as expected.
        </h1>
        <p className={styles.lead}>
          The problem is on our side. Try again, or head back to the home page. If it keeps happening, email us and we
          will look into it.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => retry()}>
            Try again
          </Button>
          <Link href="/" className={styles.link}>
            Back to home
          </Link>
        </div>
        {error.digest ? <p className={styles.digest}>Reference: {error.digest}</p> : null}
      </div>
    </section>
  );
}
