"use client";

import { useEffect } from "react";

import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole
 * document, so it renders its own <html>/<body> and imports global styles.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <title>Something went wrong | Rococo Creative</title>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "var(--space-8) var(--container-pad)",
          }}
        >
          <div style={{ maxWidth: "36rem" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-small)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}
            >
              <span aria-hidden="true">[ </span>Rococo Creative<span aria-hidden="true"> ]</span>
            </p>
            <h1 style={{ marginTop: "var(--space-5)" }}>The site hit an unexpected problem.</h1>
            <p style={{ marginTop: "var(--space-5)", color: "var(--color-text-muted)" }}>
              Please try again. If it keeps happening, email hello@rocococreative.io.
            </p>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                marginTop: "var(--space-6)",
                minHeight: 44,
                padding: "var(--space-3) var(--space-5)",
                border: "1px solid var(--rc-forest)",
                borderRadius: "var(--radius-md)",
                background: "var(--rc-forest)",
                color: "var(--rc-paper)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-label)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
