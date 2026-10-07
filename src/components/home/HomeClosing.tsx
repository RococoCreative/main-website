import { CtaBand } from "@/components/layout/CtaBand";
import { Flourish } from "@/components/ui/Flourish";

import styles from "./HomeClosing.module.css";

/** The page's single gold flourish, then the closing call to action. */
export function HomeClosing() {
  return (
    <>
      <div className={`container ${styles.flourish}`}>
        <Flourish size={40} />
      </div>
      <CtaBand />
    </>
  );
}
