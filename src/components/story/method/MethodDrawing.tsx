import { LAYER_COUNT, LAYERS, VIEWBOX, type Delay, type FillSpec, type LabelSpec, type StrokeSpec } from "./geometry";
import styles from "./MethodDrawing.module.css";

/**
 * The method elevation: an architectural drawing that assembles in four layers.
 * Purely decorative (aria-hidden); every fact it illustrates is in the text panels.
 *
 * Renders on the server and is never imported by client code: the geometry stays out
 * of the browser bundle. Which layer is current, settled, or still to come is decided
 * by CSS from attributes on the wrapping <MethodCanvas> (data-step, data-motion), so
 * the client never re-renders the SVG.
 */

const DELAY_CLASS: Record<Delay, string> = {
  0: styles.d0,
  1: styles.d1,
  2: styles.d2,
  3: styles.d3,
  4: styles.d4,
};

function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}

function Fill({ spec, hatchId }: { spec: FillSpec; hatchId: string }) {
  return (
    <path
      d={spec.d}
      className={cx(styles.fade, styles[spec.tone], DELAY_CLASS[spec.delay ?? 0])}
      fill={spec.tone === "hatch" ? `url(#${hatchId})` : undefined}
    />
  );
}

function Stroke({ spec, ornament = false }: { spec: StrokeSpec; ornament?: boolean }) {
  const draws = spec.draw !== false;
  return (
    <path
      d={spec.d}
      // Normalised length lets one dash rule draw every line in, whatever its size.
      pathLength={draws ? 1 : undefined}
      className={cx(
        styles.stroke,
        styles[spec.weight ?? "regular"],
        draws ? styles.draw : styles.fade,
        spec.pattern && styles[spec.pattern],
        ornament && styles.ornament,
        DELAY_CLASS[spec.delay ?? 0],
      )}
    />
  );
}

function Label({ spec }: { spec: LabelSpec }) {
  return (
    <text
      x={spec.x}
      y={spec.y}
      textAnchor={spec.anchor ?? "start"}
      transform={spec.rotate ? `rotate(${spec.rotate} ${spec.x} ${spec.y})` : undefined}
      className={cx(styles.fade, DELAY_CLASS[spec.delay ?? 0])}
    >
      {spec.text}
    </text>
  );
}

type MethodDrawingProps = {
  /** Unique per instance on the page; prefixes the hatch pattern id. */
  idPrefix: string;
  /** How many layers to include (1 to 4). Panels on small screens omit later layers. */
  layers?: number;
  /** Mono dimension labels. Off for small plates, where they would be too small to read. */
  labels?: boolean;
  className?: string;
};

export function MethodDrawing({ idPrefix, layers = LAYER_COUNT, labels = true, className }: MethodDrawingProps) {
  const hatchId = `${idPrefix}-hatch`;
  const count = Math.max(1, Math.min(LAYER_COUNT, layers));

  return (
    <svg
      className={cx(styles.drawing, className)}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      width={VIEWBOX.width}
      height={VIEWBOX.height}
      aria-hidden="true"
      focusable="false"
    >
      {LAYERS.slice(0, count).map((layer, i) => (
        <g key={layer.key} className={styles.layer} data-layer={i + 1}>
          {layer.key === "foundation" ? (
            // Declared inside the layer so the hatch inherits the layer's current ink.
            <pattern id={hatchId} patternUnits="userSpaceOnUse" width={5} height={5} patternTransform="rotate(45)">
              <path d="M0 0V5" className={styles.hatchLine} />
            </pattern>
          ) : null}
          {layer.fills.map((spec, j) => (
            <Fill key={`f${j}`} spec={spec} hatchId={hatchId} />
          ))}
          {layer.strokes.map((spec, j) => (
            <Stroke key={`s${j}`} spec={spec} />
          ))}
          {layer.ornament?.map((spec, j) => (
            <Stroke key={`o${j}`} spec={spec} ornament />
          ))}
          {labels && layer.labels.length ? (
            <g className={styles.labels}>
              {layer.labels.map((spec, j) => (
                <Label key={`l${j}`} spec={spec} />
              ))}
            </g>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
