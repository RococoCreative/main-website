import Image from "next/image";

import ornament from "../../../public/brand/rococo-ornament.png";

import styles from "./Flourish.module.css";

type FlourishProps = {
  className?: string;
  /** Rendered height in px. The painterly ornament is never recolored or flattened. */
  size?: number;
};

/**
 * The page's single gold flourish: the logo ornament set between two hairlines.
 * Brand rule: one per page. Purely decorative.
 */
export function Flourish({ className, size = 36 }: FlourishProps) {
  const width = Math.round((ornament.width / ornament.height) * size);
  return (
    <div className={[styles.flourish, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.line} />
      <Image src={ornament} alt="" width={width} height={size} className={styles.ornament} />
      <span className={styles.line} />
    </div>
  );
}
