import type { CSSProperties, ElementType, ReactNode } from "react";

import styles from "./Grid.module.css";

/**
 * Swiss 12-column grid. Columns collapse to a single column under 768px
 * unless a `base` span is given.
 *
 *   <Grid>
 *     <Col span={{ md: 5 }}>Headline</Col>
 *     <Col span={{ md: 6 }} start={{ md: 7 }}>Body</Col>
 *   </Grid>
 */

type Responsive = { base?: number; md?: number; lg?: number };

type GridProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Vertical gap between rows. */
  rowGap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
};

export function Grid({ children, as: Tag = "div", className, rowGap = "md", align = "start" }: GridProps) {
  return (
    <Tag className={[styles.grid, styles[`gap-${rowGap}`], styles[`align-${align}`], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}

type ColProps = {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  span?: Responsive;
  start?: Responsive;
  id?: string;
};

export function Col({ children, as: Tag = "div", className, span = {}, start = {}, id }: ColProps) {
  const style: Record<string, string | number> = {};
  if (span.base) style["--span"] = span.base;
  if (span.md) style["--span-md"] = span.md;
  if (span.lg) style["--span-lg"] = span.lg;
  if (start.base) style["--start"] = start.base;
  if (start.md) style["--start-md"] = start.md;
  if (start.lg) style["--start-lg"] = start.lg;
  return (
    <Tag id={id} className={[styles.col, className].filter(Boolean).join(" ")} style={style as CSSProperties}>
      {children}
    </Tag>
  );
}
