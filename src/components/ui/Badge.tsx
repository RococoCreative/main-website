import type { ReactNode } from "react";

import styles from "./Badge.module.css";
import { AlertCircle, CheckCircle } from "./icons";

type BadgeProps = {
  children: ReactNode;
  /** Status tones always pair color with an icon so meaning never relies on color alone. */
  tone?: "neutral" | "outline" | "success" | "error" | "warning";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  const icon =
    tone === "success" ? <CheckCircle className={styles.icon} /> : tone === "error" || tone === "warning" ? <AlertCircle className={styles.icon} /> : null;
  return (
    <span className={[styles.badge, styles[tone], className].filter(Boolean).join(" ")}>
      {icon}
      {children}
    </span>
  );
}
