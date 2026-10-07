import { CheckGlyph, ClockGlyph, CrossGlyph } from "./glyphs";
import { LABELLED_LINKS, STAGES, type LinkView, type ModeId, type NodeState, type NodeView, type TokenView } from "./scenario";
import styles from "./Pipeline.module.css";

type PipelineProps = {
  mode: ModeId;
  playing: boolean;
  nodes: NodeView[];
  links: LinkView[];
  token: TokenView | null;
};

function MarkerGlyph({ state }: { state: NodeState }) {
  if (state === "done") return <CheckGlyph />;
  if (state === "late") return <ClockGlyph />;
  if (state === "lost") return <CrossGlyph />;
  return null;
}

/**
 * Swiss pipeline: seven stages joined by hairlines. Vertical by default,
 * horizontal once its own width reaches 720px (container query).
 *
 * Each stage states its status in text; markers, hairlines, and the travelling
 * token are decorative reinforcement and hidden from assistive tech. A traced
 * hairline mounts a `.trace` element whose CSS animation draws the line with a
 * dot at its head, which is the token moving from one stage to the next.
 */
export function Pipeline({ mode, playing, nodes, links, token }: PipelineProps) {
  return (
    <div className={styles.frame}>
      <ol className={styles.pipeline} role="list" aria-label="Lead pipeline" data-mode={mode} data-playing={playing || undefined}>
        {STAGES.map((stage, i) => {
          const node = nodes[i];
          const link = i < links.length ? links[i] : null;
          const current = token && token.at === i ? token.kind : undefined;
          return (
            <li
              key={stage.id}
              className={styles.node}
              data-state={node.state}
              data-current={current}
              data-labelled={LABELLED_LINKS[i] || undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                <MarkerGlyph state={node.state} />
              </span>
              {link ? (
                <span className={styles.connector} data-state={link.state} aria-hidden="true">
                  {link.state === "traced" || link.state === "broken" ? <span className={styles.trace} /> : null}
                </span>
              ) : null}
              <span className={styles.head}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.label}>{stage.label}</span>
              </span>
              <span className={styles.status}>
                {node.note ? (
                  <>
                    <span className="visually-hidden">: </span>
                    {node.note}
                  </>
                ) : null}
              </span>
              <span className={styles.annot}>
                {link?.note ? (
                  <>
                    <span className="visually-hidden">. </span>
                    <ClockGlyph className={styles.annotGlyph} />
                    {link.note}
                  </>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
