"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Close, Menu } from "@/components/ui/icons";
import type { NavItem } from "@/lib/site";

import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

type MobileMenuProps = {
  items: NavItem[];
  cta: { label: string; href: string };
};

/**
 * Disclosure-pattern mobile navigation.
 * - Button exposes aria-expanded / aria-controls.
 * - Escape closes and returns focus to the button.
 * - Focus moves to the first link on open; Tab is contained while open.
 * - Page scroll is locked while open.
 */
export function MobileMenu({ items, cta }: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Close whenever the route changes (back/forward included).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        const nodes = [buttonRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    const mql = window.matchMedia("(min-width: 960px)");
    const onResize = () => mql.matches && close(false);
    mql.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      mql.removeEventListener("change", onResize);
    };
  }, [open, close]);

  return (
    <div className={styles.mobile}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <Close className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
        <span className={styles.menuLabel}>{open ? "Close" : "Menu"}</span>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={styles.mobilePanel}
        data-open={open ? "true" : "false"}
        hidden={!open}
      >
        <nav aria-label="Primary">
          <NavLinks items={items} pathname={pathname} variant="mobile" onNavigate={() => close(false)} />
        </nav>
        <div className={styles.mobileCta}>
          <ButtonLink href={cta.href} variant="primary" size="lg" arrow fullWidth onClick={() => close(false)}>
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** Server-rendered placeholder shown while the interactive menu streams in. */
export function MobileMenuFallback() {
  return (
    <div className={styles.mobile}>
      <button type="button" className={styles.menuButton} aria-expanded={false} disabled>
        <Menu className={styles.menuIcon} />
        <span className={styles.menuLabel}>Menu</span>
      </button>
    </div>
  );
}
