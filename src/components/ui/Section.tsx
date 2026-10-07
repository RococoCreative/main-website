import type { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./Section.module.css";

export type SectionSurface = "paper" | "alt" | "cream" | "sand";
export type SectionTheme = "forest" | "dark";

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  children: ReactNode;
  /** Light canvases. Alternate paper and alt between sections. */
  surface?: SectionSurface;
  /** Dark canvases. Overrides surface. Logo, buttons, and focus rings adapt automatically. */
  theme?: SectionTheme;
  spacing?: "default" | "tight" | "flush";
  /** Draw the faint 12-column Swiss guide lines behind the content. */
  guides?: boolean;
  /** Skip the inner .container (for full-bleed compositions). */
  bleed?: boolean;
  /** Hairline rule at the top edge. */
  rule?: boolean;
};

export function Section({
  children,
  surface = "paper",
  theme,
  spacing = "default",
  guides = false,
  bleed = false,
  rule = false,
  className,
  ...rest
}: SectionProps) {
  const dataAttrs: Record<string, string> = {};
  if (theme) dataAttrs["data-theme"] = theme;
  else if (surface !== "paper") dataAttrs["data-surface"] = surface;

  return (
    <section
      className={[styles.section, styles[spacing], rule ? styles.rule : "", className].filter(Boolean).join(" ")}
      {...dataAttrs}
      {...rest}
    >
      {guides ? <GridGuides /> : null}
      {bleed ? children : <div className={`container ${styles.inner}`}>{children}</div>}
    </section>
  );
}

/** Decorative 12-column guide lines. Hidden from assistive tech. */
export function GridGuides({ className }: { className?: string }) {
  return (
    <div className={[styles.guides, className].filter(Boolean).join(" ")} aria-hidden="true">
      <div className={`container ${styles.guidesInner}`}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={styles.guideCol} />
        ))}
      </div>
    </div>
  );
}
