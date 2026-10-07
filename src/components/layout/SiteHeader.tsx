import Link from "next/link";
import { Suspense } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cta, primaryNav } from "@/lib/site";

import { ActiveNav } from "./ActiveNav";
import { MobileMenu, MobileMenuFallback } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header} data-print-hidden>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Rococo Creative, home">
          <Logo height={44} eager className={styles.logo} />
        </Link>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <Suspense fallback={<NavLinks items={primaryNav} pathname={null} />}>
            <ActiveNav items={primaryNav} />
          </Suspense>
        </nav>

        <div className={styles.actions}>
          <ButtonLink href={cta.primary.href} variant="primary" className={styles.headerCta}>
            {cta.primary.label}
          </ButtonLink>
          <Suspense fallback={<MobileMenuFallback />}>
            <MobileMenu items={[...primaryNav, { label: "Contact", href: "/contact" }]} cta={cta.primary} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
