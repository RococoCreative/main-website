"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

import { usePrefersReducedMotion } from "@/lib/motion/hooks";

import ornament from "../../../public/brand/rococo-ornament.png";

import styles from "./BlueprintCanvas.module.css";

/**
 * BlueprintCanvas: the home hero visual.
 *
 * "Structure first, then ornament", told as a drawing: a 12-column drafting
 * grid, dimension strings, registration marks, and a classical elevation
 * (plinth, columns, entablature, pediment) that draws itself from the ground
 * up. The Rococo ornament arrives last, with a gold leader and a note.
 *
 * Rendering and motion strategy
 * - The server HTML contains the complete drawing. Nothing is hidden by default.
 * - The draw-in is a CSS animation gated by `prefers-reduced-motion:
 *   no-preference`. It starts with the first paint of the server HTML, so a
 *   canvas that is in view on load draws in without ever disappearing and
 *   redrawing. It needs no JavaScript: if scripts fail, it still finishes in
 *   its final state.
 * - After hydration, if the canvas is entirely off screen (a phone, where it
 *   sits below the copy), the controller "arms" it while it cannot be seen and
 *   replays the draw-in the first time it scrolls into view.
 * - Reduced motion: the CSS never animates and the controller never arms or
 *   tracks the pointer. The final composition shows immediately.
 * - Pointer: only for (hover: hover) and (pointer: fine). A drafting crosshair
 *   snaps to the nearest grid intersection with a mono coordinate readout, and
 *   the grid column under the pointer takes a faint sand fill. Updates are
 *   rAF-throttled, written as CSS variables (no React re-render), skipped when
 *   idle, and paused while the canvas is off screen.
 *
 * The whole visual is decorative: aria-hidden, no focusable content.
 * Colors come from tokens in the CSS module; strokes are non-scaling hairlines.
 */

/* ---------------------------------------------------------------------------
 * Geometry, in viewBox units. Columns sit on structural grid lines, the way a
 * real column grid is set out.
 * ------------------------------------------------------------------------- */
const W = 480;
const H = 528;
const X0 = 48;
const COL = 32;
const COLS = 12;
const X1 = X0 + COL * COLS; // 432
const Y0 = 64;
const ROW = 32;
const ROWS = 13;
const Y1 = Y0 + ROW * ROWS; // 480
const AXIS = X0 + COL * 6; // 240
const GROUND = Y0 + ROW * 12; // 448

const COLUMN_XS = [1, 3, 5, 7, 9, 11].map((i) => X0 + COL * i);

/* Vertical levels, bottom up. Shafts are about nine diameters tall (Ionic). */
const SHAFT_BASE = 412;
const SHAFT_TOP = 268;
const CAPITAL_TOP = SHAFT_TOP - 12; // architrave soffit
const ARCHITRAVE_TOP = CAPITAL_TOP - 16;
const FRIEZE_TOP = ARCHITRAVE_TOP - 16; // cornice soffit
const CORNICE_TOP = FRIEZE_TOP - 12;
const APEX = CORNICE_TOP - 60;
const EAVE = 54;
/** Run of the raking cornice per unit of rise. */
const RAKE_RUN = (AXIS - EAVE) / (CORNICE_TOP - APEX);

/** Ornament box: 40 units tall at the true aspect of the artwork, centered in the tympanum. */
const ORN_H = 40;
const ORN_W = (ORN_H * ornament.width) / ornament.height;
const ORN_X = AXIS - ORN_W / 2;
const ORN_Y = CORNICE_TOP - 3 - ORN_H;

const LEADER_START: [number, number] = [ORN_X + ORN_W + 4, ORN_Y + 21];
const LEADER_KNEE: [number, number] = [304, LEADER_START[1] - 72];

/* ---------------------------------------------------------------------------
 * Drawing model
 * ------------------------------------------------------------------------- */
type StrokeKind = "grid" | "frame" | "dim" | "cut" | "ground" | "profile" | "detail" | "leader";
type FadeKind = "tick" | "reg" | "dim" | "mark" | "profile" | "detail" | "leaderDot";
type Origin = "start" | "center" | "end";

/** A straight line drawn by scaling from its origin. `at` and `t` are ms. */
type Segment = { p: readonly [number, number, number, number]; kind: StrokeKind; at: number; from?: Origin; t?: number };
/** A shape that fades in. */
type FadeShape = { d: string; kind: FadeKind; at: number; t?: number };

const circle = (cx: number, cy: number, r: number) =>
  `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}`;

/** Center-out order for the colonnade: inner pair, middle pair, outer pair. */
const ring = (x: number) => Math.floor(Math.abs(x - AXIS) / (COL * 2));

function buildDrawing(): { segments: Segment[]; shapes: FadeShape[] } {
  const segments: Segment[] = [];
  const shapes: FadeShape[] = [];

  // 1. Grid: twelve columns, drawn top to bottom, then the frame.
  for (let i = 0; i <= COLS; i++) {
    const x = X0 + i * COL;
    segments.push({ p: [x, Y0, x, Y1], kind: "grid", at: i * 18, t: 520 });
  }
  segments.push({ p: [X0, Y0, X1, Y0], kind: "frame", at: 40, t: 600 });
  segments.push({ p: [X0, Y1, X1, Y1], kind: "frame", at: 100, t: 600 });

  let ticks = "";
  for (let j = 1; j < ROWS; j++) {
    for (let i = 0; i <= COLS; i++) {
      const x = X0 + i * COL;
      const y = Y0 + j * ROW;
      ticks += `M${x - 3} ${y}H${x + 3}`;
    }
  }
  shapes.push({ d: ticks, kind: "tick", at: 220, t: 480 });

  // 2. Registration marks at the corners of the grid.
  [
    [X0, Y0],
    [X1, Y0],
    [X1, Y1],
    [X0, Y1],
  ].forEach(([x, y], k) => {
    shapes.push({ d: `M${x - 10} ${y}H${x + 10}M${x} ${y - 10}V${y + 10}${circle(x, y, 5)}`, kind: "reg", at: 300 + k * 50, t: 320 });
  });

  // 3. Dimension strings: overall width above, the column module below.
  segments.push({ p: [X0, 30, X0, 58], kind: "dim", at: 320, from: "end", t: 300 });
  segments.push({ p: [X1, 30, X1, 58], kind: "dim", at: 340, from: "end", t: 300 });
  segments.push({ p: [X0, 36, X1, 36], kind: "dim", at: 360, from: "center", t: 520 });
  shapes.push({ d: `M${X0 - 4} 40L${X0 + 4} 32M${X1 - 4} 40L${X1 + 4} 32`, kind: "dim", at: 460, t: 300 });

  segments.push({ p: [X0, Y1 + 6, X0, 512], kind: "dim", at: 380, t: 300 });
  segments.push({ p: [X1, Y1 + 6, X1, 512], kind: "dim", at: 400, t: 300 });
  segments.push({ p: [X0, 504, X1, 504], kind: "dim", at: 400, from: "center", t: 520 });
  let moduleTicks = "";
  for (let i = 0; i <= COLS; i++) {
    const x = X0 + i * COL;
    moduleTicks += `M${x - 4} 508L${x + 4} 500`;
  }
  shapes.push({ d: moduleTicks, kind: "dim", at: 500, t: 360 });

  // 4. Section line A-A through the colonnade.
  shapes.push({ d: `${circle(22, 352, 9)}${circle(458, 352, 9)}`, kind: "dim", at: 480, t: 320 });
  shapes.push({ d: "M16 363H28L22 370ZM452 363H464L458 370Z", kind: "mark", at: 520, t: 320 });
  segments.push({ p: [31, 352, 449, 352], kind: "cut", at: 520, t: 700 });

  // 5. The building, from the ground up.
  segments.push({ p: [24, GROUND, 456, GROUND], kind: "ground", at: 520, from: "center", t: 560 });

  const steps: [number, number][] = [
    [52, 440],
    [60, 432],
    [68, 424],
  ];
  steps.forEach(([x, y], k) => {
    const at = 620 + k * 60;
    const xr = W - x;
    segments.push({ p: [x, y, xr, y], kind: "profile", at, from: "center", t: 480 });
    segments.push({ p: [x, y + 8, x, y], kind: "profile", at, t: 200 });
    segments.push({ p: [xr, y + 8, xr, y], kind: "profile", at, t: 200 });
  });

  for (const cx of COLUMN_XS) {
    const o = ring(cx);
    // Base: plinth and torus.
    shapes.push({
      d: `M${cx - 11} 424V416H${cx + 11}V424M${cx - 9} 416V412H${cx + 9}V416`,
      kind: "profile",
      at: 780 + o * 40,
      t: 320,
    });
    // Shaft: tapered edges drawn upward, with two flutes.
    const at = 820 + o * 60;
    segments.push({ p: [cx - 8, SHAFT_BASE, cx - 6.5, SHAFT_TOP], kind: "profile", at, t: 560 });
    segments.push({ p: [cx + 8, SHAFT_BASE, cx + 6.5, SHAFT_TOP], kind: "profile", at, t: 560 });
    segments.push({ p: [cx - 2.5, SHAFT_BASE - 2, cx - 2, SHAFT_TOP + 2], kind: "detail", at: at + 60, t: 520 });
    segments.push({ p: [cx + 2.5, SHAFT_BASE - 2, cx + 2, SHAFT_TOP + 2], kind: "detail", at: at + 60, t: 520 });
    // Capital: echinus, abacus, volutes.
    const neck = SHAFT_TOP;
    const abacus = CAPITAL_TOP + 6;
    shapes.push({
      d:
        `M${cx - 6.5} ${neck}L${cx - 10} ${abacus}H${cx + 10}L${cx + 6.5} ${neck}Z` +
        `M${cx - 12} ${abacus}V${CAPITAL_TOP}H${cx + 12}V${abacus}` +
        `${circle(cx - 11, abacus + 3, 2.5)}${circle(cx + 11, abacus + 3, 2.5)}`,
      kind: "profile",
      at: 1180 + o * 40,
      t: 320,
    });
  }

  // Entablature: architrave with fascia, frieze, dentils, cornice.
  const fascia = CAPITAL_TOP - 7;
  segments.push({ p: [64, CAPITAL_TOP, 416, CAPITAL_TOP], kind: "profile", at: 1240, from: "center", t: 460 });
  segments.push({ p: [64, fascia, 416, fascia], kind: "detail", at: 1280, from: "center", t: 460 });
  segments.push({ p: [64, ARCHITRAVE_TOP, 416, ARCHITRAVE_TOP], kind: "profile", at: 1320, from: "center", t: 460 });
  segments.push({ p: [64, CAPITAL_TOP, 64, FRIEZE_TOP], kind: "profile", at: 1260, t: 400 });
  segments.push({ p: [416, CAPITAL_TOP, 416, FRIEZE_TOP], kind: "profile", at: 1260, t: 400 });

  let dentils = "";
  for (let x = 68; x <= 408; x += 8) dentils += `M${x} ${FRIEZE_TOP}v4h4v-4`;
  shapes.push({ d: dentils, kind: "detail", at: 1380, t: 400 });

  const fillet = CORNICE_TOP + 6;
  segments.push({ p: [EAVE, FRIEZE_TOP, W - EAVE, FRIEZE_TOP], kind: "profile", at: 1380, from: "center", t: 460 });
  segments.push({ p: [EAVE + 2, fillet, W - EAVE - 2, fillet], kind: "detail", at: 1420, from: "center", t: 460 });
  segments.push({ p: [EAVE, CORNICE_TOP, W - EAVE, CORNICE_TOP], kind: "profile", at: 1460, from: "center", t: 460 });
  segments.push({ p: [EAVE, FRIEZE_TOP, EAVE, CORNICE_TOP], kind: "profile", at: 1480, t: 240 });
  segments.push({ p: [W - EAVE, FRIEZE_TOP, W - EAVE, CORNICE_TOP], kind: "profile", at: 1480, t: 240 });

  // Pediment: outer raking cornice, its fillet, and the tympanum line.
  [
    { inset: 0, kind: "profile" as const, at: 1540 },
    { inset: 5, kind: "detail" as const, at: 1580 },
    { inset: 10, kind: "detail" as const, at: 1620 },
  ].forEach(({ inset, kind, at }) => {
    const top = APEX + inset;
    const run = (CORNICE_TOP - top) * RAKE_RUN;
    segments.push({ p: [AXIS - run, CORNICE_TOP, AXIS, top], kind, at, t: 500 });
    segments.push({ p: [AXIS + run, CORNICE_TOP, AXIS, top], kind, at, t: 500 });
  });

  // 6. Ornament, last: a gold leader to the note.
  shapes.push({ d: circle(LEADER_START[0], LEADER_START[1], 2), kind: "leaderDot", at: 1900, t: 240 });
  segments.push({ p: [...LEADER_START, ...LEADER_KNEE], kind: "leader", at: 1920, t: 240 });
  segments.push({ p: [...LEADER_KNEE, X1, LEADER_KNEE[1]], kind: "leader", at: 2140, t: 260 });

  return { segments, shapes };
}

const { segments: SEGMENTS, shapes: SHAPES } = buildDrawing();

type Label = { text: string; x: number; y: number; at: number; variant: "knock" | "bubble" };

const LABELS: Label[] = [
  { text: "1200", x: AXIS, y: 36, at: 560, variant: "knock" },
  { text: "12 col", x: AXIS, y: 504, at: 620, variant: "knock" },
  { text: "A", x: 22, y: 352, at: 560, variant: "bubble" },
  { text: "A", x: 458, y: 352, at: 560, variant: "bubble" },
];

const pctX = (x: number) => `${((x / W) * 100).toFixed(3)}%`;
const pctY = (y: number) => `${((y / H) * 100).toFixed(3)}%`;

function timing(at: number, t?: number): Record<string, string> {
  return t ? { "--d": `${at}ms`, "--t": `${t}ms` } : { "--d": `${at}ms` };
}

function origin([x1, y1, x2, y2]: Segment["p"], from: Origin = "start"): string {
  if (from === "center") return `${(x1 + x2) / 2}px ${(y1 + y2) / 2}px`;
  if (from === "end") return `${x2}px ${y2}px`;
  return `${x1}px ${y1}px`;
}

/* ---------------------------------------------------------------------------
 * Fine-pointer media query (server snapshot: false, so no hover affordances
 * are assumed before hydration).
 * ------------------------------------------------------------------------- */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function subscribeFinePointer(callback: () => void) {
  const mql = window.matchMedia(FINE_POINTER);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const pad = (n: number) => String(n).padStart(2, "0");

export function BlueprintCanvas({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();

  // Replay the draw-in on first view when the canvas was off screen at hydration.
  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root || typeof IntersectionObserver === "undefined") return;
    const rect = root.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (visible) return;

    root.dataset.state = "armed";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          root.dataset.state = "play";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (root.dataset.state === "armed") delete root.dataset.state;
    };
  }, [reduced]);

  // Drafting crosshair: snap to the nearest grid intersection.
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const readout = readoutRef.current;
    if (reduced || !finePointer || !root || !stage || !readout) return;

    let onScreen = true;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let last = "";

    const hide = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      root.dataset.pointer = "off";
    };

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ux = ((pointerX - rect.left) / rect.width) * W;
      const uy = ((pointerY - rect.top) / rect.height) * H;
      const inside = ux >= X0 - COL / 2 && ux <= X1 + COL / 2 && uy >= Y0 - ROW / 2 && uy <= Y1 + ROW / 2;
      if (!inside) {
        root.dataset.pointer = "off";
        return;
      }
      const i = clamp(Math.round((ux - X0) / COL), 0, COLS);
      const j = clamp(Math.round((uy - Y0) / ROW), 0, ROWS);
      const col = clamp(Math.floor((ux - X0) / COL), 0, COLS - 1);
      const key = `${i}:${j}:${col}`;
      if (key !== last) {
        last = key;
        root.style.setProperty("--cx", String(X0 + i * COL));
        root.style.setProperty("--cy", String(Y0 + j * ROW));
        root.style.setProperty("--col", String(col));
        root.dataset.flip = [i >= COLS - 3 ? "x" : "", j <= 1 ? "y" : ""].join(" ").trim();
        readout.textContent = `X ${pad(i)} · Y ${pad(j)}`;
      }
      root.dataset.pointer = "on";
    };

    const onMove = (event: PointerEvent) => {
      if (!onScreen || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (!onScreen) hide();
    });
    observer.observe(stage);
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", hide);
    root.dataset.interactive = "true";

    return () => {
      observer.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", hide);
      hide();
      delete root.dataset.interactive;
    };
  }, [reduced, finePointer]);

  return (
    <div ref={rootRef} className={[styles.sheet, className].filter(Boolean).join(" ")} aria-hidden="true">
      <div ref={stageRef} className={styles.stage}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} focusable="false">
          <rect className={styles.colFill} x={X0} y={Y0} width={COL} height={Y1 - Y0} />

          {SHAPES.map((shape, k) => (
            <path
              key={`s${k}`}
              d={shape.d}
              className={`${styles[shape.kind]} ${styles.fade}`}
              style={timing(shape.at, shape.t) as CSSProperties}
            />
          ))}

          {SEGMENTS.map((seg, k) => (
            <line
              key={`l${k}`}
              x1={seg.p[0]}
              y1={seg.p[1]}
              x2={seg.p[2]}
              y2={seg.p[3]}
              className={`${styles[seg.kind]} ${styles.draw}`}
              style={{ ...timing(seg.at, seg.t), transformOrigin: origin(seg.p, seg.from) } as CSSProperties}
            />
          ))}

          <g className={styles.cursor}>
            <line className={styles.crossV} x1={0} y1={Y0} x2={0} y2={Y1} />
            <line className={styles.crossH} x1={X0} y1={0} x2={X1} y2={0} />
            <rect className={styles.crossBox} x={-4} y={-4} width={8} height={8} />
          </g>
        </svg>

        <Image
          src={ornament}
          alt=""
          width={Math.round(ORN_W)}
          height={ORN_H}
          className={styles.ornament}
          style={{ left: pctX(ORN_X), top: pctY(ORN_Y), width: pctX(ORN_W) }}
          draggable={false}
        />

        {LABELS.map((label, k) => (
          <span
            key={k}
            className={`${styles.label} ${styles[label.variant]} ${styles.fade}`}
            style={{ left: pctX(label.x), top: pctY(label.y), ...timing(label.at, 360) } as CSSProperties}
          >
            {label.text}
          </span>
        ))}

        <span
          className={`${styles.label} ${styles.annotation} ${styles.fade}`}
          style={{ left: pctX(X1), top: pctY(LEADER_KNEE[1] - 4), ...timing(2160, 360) } as CSSProperties}
        >
          Ornament, last
        </span>

        <span ref={readoutRef} className={styles.readout} />
      </div>

      <div className={styles.titleBlock}>
        <span>Elevation A-A</span>
        <span>Structure first</span>
        <span>Sheet 01</span>
      </div>
    </div>
  );
}
