import Link from "next/link";

import type { NavItem } from "@/lib/site";

import styles from "./SiteHeader.module.css";

export function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Pure presentational list; the active state comes from the caller. */
export function NavLinks({
  items,
  pathname,
  variant = "desktop",
  onNavigate,
}: {
  items: NavItem[];
  pathname: string | null;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  return (
    <ul className={variant === "desktop" ? styles.navList : styles.mobileList}>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={variant === "desktop" ? styles.navLink : styles.mobileLink}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
