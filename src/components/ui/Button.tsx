import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./Button.module.css";
import { ArrowRight } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "md" | "lg";

type SharedProps = {
  /**
   * primary: Forest fill, white label (main action).
   * secondary: Outlined in Forest.
   * ghost: Text-only, low emphasis.
   * accent: Gold fill with Ink label. Rare, high-signal moments only.
   * On [data-theme] sections the primary variant follows the theme tokens.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Pill radius for editorial CTAs. */
  pill?: boolean;
  /** Adds a trailing arrow that nudges on hover. */
  arrow?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
};

function classes({ variant = "primary", size = "md", pill, fullWidth }: Omit<SharedProps, "children">, extra?: string) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    pill ? styles.pill : "",
    fullWidth ? styles.fullWidth : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {arrow ? <ArrowRight className={styles.arrow} /> : null}
    </>
  );
}

type ButtonProps = SharedProps & Omit<ComponentPropsWithoutRef<"button">, "children">;

export function Button({ variant, size, pill, arrow, fullWidth, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes({ variant, size, pill, fullWidth }, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

type ButtonLinkProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "href"> & {
    href: string;
  };

/** Internal navigation styled as a button. External URLs render a plain anchor. */
export function ButtonLink({ variant, size, pill, arrow, fullWidth, className, children, href, ...rest }: ButtonLinkProps) {
  const cls = classes({ variant, size, pill, fullWidth }, className);
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(rest as ComponentPropsWithoutRef<"a">)}
      >
        <Inner arrow={arrow}>{children}</Inner>
        {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}
