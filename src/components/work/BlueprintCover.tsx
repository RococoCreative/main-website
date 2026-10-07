import { BLUEPRINT_HEIGHT, BLUEPRINT_WIDTH, createBlueprint, type BlueprintDetail, type BlueprintLayers } from "./blueprint";
import styles from "./BlueprintCover.module.css";

type BlueprintCoverProps = {
  /** Seeds the drawing. The same slug always produces the same sheet. */
  slug: string;
  /** Printed in the title block, in mono. Placeholder (TODO) values fall back to "Case study". */
  sector?: string | null;
  /**
   * "compact" (cards, thumbnails): larger type, fewer annotations.
   * "full" (case study cover): dimension strings, level labels, room numbers.
   * Either way, minor labels hide when the cover renders narrower than 560px.
   */
  detail?: BlueprintDetail;
  className?: string;
};

/** Paint order, back to front. */
const LAYERS: readonly (keyof BlueprintLayers)[] = [
  "grid",
  "frame",
  "hatch",
  "cut",
  "glass",
  "poche",
  "opening",
  "fine",
  "medium",
  "heavy",
  "dim",
  "tick",
  "accent",
];

/**
 * Generative cover art for case studies without photography: a drafting
 * sheet (elevation or plan) derived deterministically from the slug, so every
 * build is identical. Forest linework on paper or sand, a faint 12-column
 * grid, dimension strings, and one small gold accent. Pure SVG, server
 * rendered, decorative (aria-hidden), fixed 16:10 so it never shifts layout.
 */
export function BlueprintCover({ slug, sector, detail = "compact", className }: BlueprintCoverProps) {
  const sheet = createBlueprint(slug, sector, detail);
  return (
    <div
      className={[styles.cover, styles[sheet.ground], className].filter(Boolean).join(" ")}
      data-sheet={sheet.kind}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${BLUEPRINT_WIDTH} ${BLUEPRINT_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        aria-hidden="true"
      >
        <rect className={styles.ground} width={BLUEPRINT_WIDTH} height={BLUEPRINT_HEIGHT} />
        {LAYERS.map((layer) =>
          sheet.layers[layer] ? <path key={layer} className={styles[layer]} d={sheet.layers[layer]} /> : null,
        )}
        <g className={styles.text}>
          {sheet.texts.map((t, i) => (
            <text
              key={`${i}-${t.text}`}
              x={t.x}
              y={t.y}
              fontSize={t.size}
              textAnchor={t.anchor}
              dominantBaseline={t.central ? "central" : undefined}
              transform={t.rotate ? `rotate(${t.rotate} ${t.x} ${t.y})` : undefined}
              className={[t.muted ? styles.muted : "", t.minor ? styles.minor : ""].filter(Boolean).join(" ") || undefined}
            >
              {t.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
