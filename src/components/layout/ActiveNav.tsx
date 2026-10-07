"use client";

import { usePathname } from "next/navigation";

import type { NavItem } from "@/lib/site";

import { NavLinks } from "./NavLinks";

/** Desktop navigation with aria-current. Rendered inside <Suspense> (usePathname). */
export function ActiveNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return <NavLinks items={items} pathname={pathname} />;
}
