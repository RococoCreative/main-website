import { cacheLife } from "next/cache";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Logo } from "@/components/ui/Logo";
import { cta, footerNav, site } from "@/lib/site";

import styles from "./SiteFooter.module.css";

/** Cached so the current year never makes a page dynamic (Cache Components rule). */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const socials = [
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "Instagram", href: site.social.instagram },
  ].filter((s) => s.href);

  return (
    <footer className={styles.footer} data-theme="dark" data-print-hidden>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand} aria-label="Rococo Creative, home">
              <Logo variant="light" height={48} alt="" />
            </Link>
            <p className={styles.statement}>
              Strategy, design, and AI-driven marketing for the companies that build the places we live and work.
            </p>
            <ButtonLink href={cta.primary.href} variant="primary" arrow>
              {cta.primary.label}
            </ButtonLink>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-labelledby={`footer-${group.heading}`} className={styles.navCol}>
              <Eyebrow as="h2" id={`footer-${group.heading}`}>
                {group.heading}
              </Eyebrow>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={styles.navCol}>
            <Eyebrow as="h2">Contact</Eyebrow>
            <ul className={styles.list}>
              <li>
                <a href={`mailto:${site.contact.email}`} className={styles.link}>
                  {site.contact.email}
                </a>
              </li>
              {site.contact.phone ? (
                <li>
                  <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className={styles.link}>
                    {site.contact.phone}
                  </a>
                </li>
              ) : null}
              <li className={styles.muted}>{site.contact.serviceArea}</li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.small}>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <ul className={styles.legal}>
            <li>
              <Link href="/privacy" className={styles.link}>
                Privacy
              </Link>
            </li>
            {site.clientPortalUrl ? (
              <li>
                <a href={site.clientPortalUrl} className={styles.link}>
                  Client portal
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </footer>
  );
}
