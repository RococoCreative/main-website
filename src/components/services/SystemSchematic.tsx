"use client";

import { useEffect, useRef, useState } from "react";

import { Check } from "@/components/ui/icons";

import { PILLAR_SHORT_NAMES, START_ID, TOTAL_OFFERINGS, offeringEntries, type OfferingEntry } from "./system";
import styles from "./SystemSchematic.module.css";

/**
 * Swiss wiring diagram of the visitor's growth system. Purely visual
 * (aria-hidden): the checkboxes, the live count, and the summary panel carry
 * the same information as text.
 *
 * Modules are real HTML (so labels wrap and stay crisp); the connectors are an
 * SVG overlay drawn from measured module positions. Measurement runs in a
 * ResizeObserver callback, so it follows font loading and resizes, and it is
 * skipped while the route is hidden by React <Activity> (zero width).
 * Before measurement (server HTML, no JS) the modules render without wires.
 */

type Column = { id: OfferingEntry["pillarId"]; index: string; label: string; modules: OfferingEntry[] };

const columns: Column[] = offeringEntries.reduce<Column[]>((acc, entry) => {
  const last = acc[acc.length - 1];
  if (last && last.id === entry.pillarId) {
    last.modules.push(entry);
  } else {
    acc.push({ id: entry.pillarId, index: entry.pillarIndex, label: PILLAR_SHORT_NAMES[entry.pillarId], modules: [entry] });
  }
  return acc;
}, []);

type Box = { l: number; r: number; cy: number };
type Geometry = {
  w: number;
  h: number;
  /** Horizontal rail between the column heads and the first modules, used to bridge an empty column. */
  rail: number;
  cols: { l: number; r: number }[];
  boxes: Record<string, Box>;
};

type Wire = { key: string; d: string };
type Joint = { key: string; x: number; y: number };

const round = Math.round;

function buildWiring(geo: Geometry, nodesByCol: string[][], startActive: boolean) {
  const gapX = (col: number) => round((geo.cols[col].r + geo.cols[col + 1].l) / 2);
  const cy = (id: string) => round(geo.boxes[id].cy);

  const active = nodesByCol.map((ids, col) => ({ col, ids })).filter((c) => c.ids.length > 0);
  const stubs: Wire[] = [];
  const buses: Wire[] = [];
  const joints: Joint[] = [];

  for (let k = 0; k < active.length - 1; k++) {
    const a = active[k];
    const b = active[k + 1];
    const xa = gapX(a.col);
    const xb = gapX(b.col - 1);
    const ya = a.ids.map(cy);
    const yb = b.ids.map(cy);

    a.ids.forEach((id, j) => {
      stubs.push({ key: `out-${id}`, d: `M${round(geo.boxes[id].r)} ${ya[j]}H${xa}` });
      joints.push({ key: `jo-${id}`, x: xa, y: ya[j] });
    });
    b.ids.forEach((id, j) => {
      stubs.push({ key: `in-${id}`, d: `M${xb} ${yb[j]}H${round(geo.boxes[id].l)}` });
      joints.push({ key: `ji-${id}`, x: xb, y: yb[j] });
    });

    if (b.col === a.col + 1) {
      buses.push({ key: `bus-${a.col}-${b.col}`, d: `M${xa} ${Math.min(...ya, ...yb)}V${Math.max(...ya, ...yb)}` });
    } else {
      // Bridge an empty column along the rail above the modules.
      const rail = round(geo.rail);
      buses.push({ key: `bus-${a.col}-${b.col}`, d: `M${xa} ${Math.max(...ya)}V${rail}H${xb}V${Math.max(...yb)}` });
    }
  }

  // Gold sequence: the start module, then the first module in each later column.
  const anchors = active.map((c) => (c.col === 0 && startActive ? START_ID : c.ids[0]));
  let trace = "";
  if (anchors.length > 1) {
    anchors.forEach((id, k) => {
      const box = geo.boxes[id];
      if (k === 0) {
        trace += `M${round(box.r)} ${cy(id)}`;
        return;
      }
      const prevId = anchors[k - 1];
      const prevCol = active[k - 1].col;
      const col = active[k].col;
      // Continue through the previous module (hidden beneath it) before routing on.
      if (k > 1) trace += `H${round(geo.boxes[prevId].r)}`;
      if (col === prevCol + 1) {
        trace += `H${gapX(prevCol)}V${cy(id)}H${round(box.l)}`;
      } else {
        trace += `H${gapX(prevCol)}V${round(geo.rail)}H${gapX(col - 1)}V${cy(id)}H${round(box.l)}`;
      }
    });
  }

  return { stubs, buses, joints, trace, traceKey: anchors.join(">") };
}

export function SystemSchematic({ selected }: { selected: readonly string[] }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || typeof ResizeObserver === "undefined") return;
    let signature = "";

    const measure = () => {
      const origin = field.getBoundingClientRect();
      // Hidden by <Activity> (display: none) or not laid out yet: keep the last geometry.
      if (origin.width === 0) return;
      const cols = Array.from(field.querySelectorAll<HTMLElement>("[data-col]")).map((el) => {
        const r = el.getBoundingClientRect();
        return { l: round(r.left - origin.left), r: round(r.right - origin.left) };
      });
      const boxes: Record<string, Box> = {};
      let top = Number.POSITIVE_INFINITY;
      field.querySelectorAll<HTMLElement>("[data-module]").forEach((el) => {
        const id = el.dataset.module;
        if (!id) return;
        const r = el.getBoundingClientRect();
        boxes[id] = {
          l: round(r.left - origin.left),
          r: round(r.right - origin.left),
          cy: round(r.top - origin.top + r.height / 2),
        };
        top = Math.min(top, r.top - origin.top);
      });
      const next: Geometry = {
        w: round(origin.width),
        h: round(origin.height),
        rail: round(top - 12),
        cols,
        boxes,
      };
      const nextSignature = JSON.stringify(next);
      if (nextSignature !== signature) {
        signature = nextSignature;
        setGeo(next);
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(field);
    field.querySelectorAll("[data-module]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const selectedSet = new Set(selected);
  const startActive = selected.length > 0;
  const nodesByCol = columns.map((col) =>
    col.modules.filter((m) => selectedSet.has(m.id) || (startActive && m.id === START_ID)).map((m) => m.id),
  );
  const wiring = geo && geo.cols.length === columns.length ? buildWiring(geo, nodesByCol, startActive) : null;

  return (
    <div className={styles.sheet} aria-hidden="true">
      <div className={styles.titleRow}>
        <span>Schematic</span>
        <span className={styles.count}>
          {String(selected.length).padStart(2, "0")} / {String(TOTAL_OFFERINGS).padStart(2, "0")} modules
        </span>
      </div>

      <div ref={fieldRef} className={styles.field}>
        {geo && wiring ? (
          <svg
            className={styles.wires}
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            focusable="false"
          >
            <g className={styles.hairlines} transform="translate(0.5 0.5)">
              {wiring.buses.map((w) => (
                <path key={w.key} d={w.d} className={styles.wire} />
              ))}
              {wiring.stubs.map((w) => (
                <path key={w.key} d={w.d} className={styles.wire} />
              ))}
            </g>
            {wiring.trace ? (
              <path key={wiring.traceKey} d={wiring.trace} pathLength={1} className={styles.trace} />
            ) : null}
            {wiring.joints.map((j) => (
              <rect key={j.key} x={j.x - 2} y={j.y - 2} width={5} height={5} className={styles.joint} />
            ))}
          </svg>
        ) : null}

        {columns.map((col, ci) => (
          <div key={col.id} className={styles.column} data-col={ci}>
            <p className={styles.colHead}>
              <span className={styles.colIndex}>{col.index}</span>
              <span className={styles.colLabel}>{col.label}</span>
            </p>
            <div className={styles.modules}>
              {col.modules.map((m) => {
                const isSelected = selectedSet.has(m.id);
                const isStart = startActive && m.id === START_ID;
                return (
                  <div
                    key={m.id}
                    className={styles.module}
                    data-module={m.id}
                    data-selected={isSelected ? "true" : "false"}
                    data-start={isStart ? "true" : "false"}
                  >
                    <span className={styles.code}>{isStart ? "Start" : m.code}</span>
                    <Check className={styles.check} />
                    <span className={styles.label}>{m.short}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ul className={styles.legend}>
        <li>
          <span className={`${styles.key} ${styles.keySelected}`} />
          Selected
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyStart}`} />
          Start
        </li>
        <li>
          <span className={`${styles.key} ${styles.keyTrace}`} />
          Sequence
        </li>
      </ul>
    </div>
  );
}
