import { Eyebrow } from "@/components/ui/Eyebrow";

import { STORY_PARTS } from "./story";
import styles from "./StoryOutline.module.css";

/** Swiss index of how every case study is structured. Used in the /work hero aside. */
export function StoryOutline() {
  return (
    <div className={styles.outline}>
      <Eyebrow>Every case study</Eyebrow>
      <ol className={styles.list}>
        {STORY_PARTS.map((part) => (
          <li key={part.key} className={styles.item}>
            <span className={styles.index} aria-hidden="true">
              {part.index}
            </span>
            <span className={styles.text}>
              <span className={styles.label}>{part.label}</span>
              <span className={styles.summary}>{part.summary}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
