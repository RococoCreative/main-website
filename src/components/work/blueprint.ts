/**
 * Deterministic drafting-sheet generator for case study covers.
 *
 * The slug is hashed (FNV-1a) into a seeded PRNG, so every build draws the
 * same sheet for the same project: no Math.random(), no dates. The output is
 * plain data (SVG path strings and text runs); BlueprintCover renders it.
 *
 * Sheet anatomy, in drafting order:
 *   1. Paper or sand ground, sheet frame, 12-column Swiss grid
 *   2. A drawing: a building elevation (most sheets) or a floor plan
 *   3. Annotation: column grid bubbles, chain and overall dimensions,
 *      level datums (elevation) or a north arrow (plan)
 *   4. Title block: sector in mono, drawing name, scale, sheet number
 *   5. One small gold accent (the ground datum or the north arrow)
 *
 * Units: the viewBox is 1600 x 1000 and buildings are drawn at 4 units per
 * foot, so proportions read like real construction documents.
 */

export type BlueprintDetail = "compact" | "full";

export type BlueprintText = {
  x: number;
  y: number;
  text: string;
  size: number;
  anchor: "start" | "middle" | "end";
  /** Muted ink for secondary annotation. */
  muted?: boolean;
  /** Hidden when the cover renders narrow (labels would be illegible). */
  minor?: boolean;
  /** Vertically centre on y (grid bubbles). */
  central?: boolean;
  /** Rotation in degrees around (x, y). */
  rotate?: number;
};

export type BlueprintLayers = {
  /** Faint 12-column Swiss grid. */
  grid: string;
  /** Sheet frame and title block rules. */
  frame: string;
  /** Material hatching (earth, panel joints, roof seams). */
  hatch: string;
  /** Ground-coloured fills that mask openings. */
  cut: string;
  /** Glazing tint. */
  glass: string;
  /** Solid forest fills (cut walls, columns, canopies). */
  poche: string;
  /** Ground-coloured fills drawn over the poche (plan openings, stair well). */
  opening: string;
  /** Mullions, windows, doors, slab edges. */
  fine: string;
  /** Building outlines, roofs, grid bubbles. */
  medium: string;
  /** Profile lines (ground line). */
  heavy: string;
  /** Dimension strings, extension lines, datum leaders. */
  dim: string;
  /** Dimension ticks. */
  tick: string;
  /** The single gold accent. */
  accent: string;
};

export type Blueprint = {
  ground: "paper" | "sand";
  kind: "elevation" | "plan";
  layers: BlueprintLayers;
  texts: BlueprintText[];
};

export const BLUEPRINT_WIDTH = 1600;
export const BLUEPRINT_HEIGHT = 1000;

const W = BLUEPRINT_WIDTH;
const H = BLUEPRINT_HEIGHT;
const MARGIN = 40;
const FT = 4; // units per foot

/* ---------------------------------------------------------------------------
 * Hashing and seeded randomness
 * ------------------------------------------------------------------------- */

/** FNV-1a, 32-bit. */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Rng = {
  next: () => number;
  int: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
  chance: (p: number) => boolean;
};

/** mulberry32: small, fast, and fully determined by the seed. */
function createRng(seed: number): Rng {
  let a = seed || 1;
  const next = () => {
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    chance: (p) => next() < p,
  };
}

/* ---------------------------------------------------------------------------
 * Path building
 * ------------------------------------------------------------------------- */

type Point = readonly [number, number];

const fmt = (v: number) => String(Math.round(v * 10) / 10);

function createPath() {
  const parts: string[] = [];
  return {
    line(x1: number, y1: number, x2: number, y2: number) {
      parts.push(`M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`);
    },
    rect(x: number, y: number, w: number, h: number) {
      parts.push(`M${fmt(x)} ${fmt(y)}h${fmt(w)}v${fmt(h)}h${fmt(-w)}z`);
    },
    poly(points: readonly Point[], close = true) {
      parts.push(points.map(([x, y], i) => `${i ? "L" : "M"}${fmt(x)} ${fmt(y)}`).join("") + (close ? "z" : ""));
    },
    circle(cx: number, cy: number, r: number) {
      parts.push(
        `M${fmt(cx - r)} ${fmt(cy)}a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0z`,
      );
    },
    arc(x1: number, y1: number, r: number, x2: number, y2: number, sweep: 0 | 1) {
      parts.push(`M${fmt(x1)} ${fmt(y1)}A${fmt(r)} ${fmt(r)} 0 0 ${sweep} ${fmt(x2)} ${fmt(y2)}`);
    },
    toString() {
      return parts.join("");
    },
  };
}

type Path = ReturnType<typeof createPath>;
type Layers = Record<keyof BlueprintLayers, Path>;

function createLayers(): Layers {
  return {
    grid: createPath(),
    frame: createPath(),
    hatch: createPath(),
    cut: createPath(),
    glass: createPath(),
    poche: createPath(),
    opening: createPath(),
    fine: createPath(),
    medium: createPath(),
    heavy: createPath(),
    dim: createPath(),
    tick: createPath(),
    accent: createPath(),
  };
}

/** 45 degree hatching clipped to an axis-aligned rectangle. */
function hatchRect(p: Path, x0: number, y0: number, x1: number, y1: number, spacing: number) {
  const step = spacing * Math.SQRT2;
  for (let c = x0 + y0 + step / 2; c < x1 + y1; c += step) {
    const xa = Math.max(x0, c - y1);
    const xb = Math.min(x1, c - y0);
    if (xb - xa > 0.5) p.line(xa, c - xa, xb, c - xb);
  }
}

const feet = (units: number) => `${Math.round(units / FT)}'-0"`;

/* ---------------------------------------------------------------------------
 * Annotation helpers
 * ------------------------------------------------------------------------- */

type Ctx = {
  rng: Rng;
  L: Layers;
  T: BlueprintText[];
  compact: boolean;
};

/** Horizontal chain dimension with architectural slash ticks. */
function dimensionH(
  ctx: Ctx,
  xs: number[],
  y: number,
  options: { extFrom?: number; labels?: boolean; overallLabel?: boolean; size: number },
) {
  const { L, T } = ctx;
  const first = xs[0];
  const last = xs[xs.length - 1];
  L.dim.line(first - 14, y, last + 14, y);
  for (const x of xs) {
    L.tick.line(x - 6, y + 6, x + 6, y - 6);
    if (options.extFrom !== undefined) L.dim.line(x, options.extFrom, x, y + 12);
  }
  if (options.labels) {
    for (let i = 0; i < xs.length - 1; i++) {
      const span = xs[i + 1] - xs[i];
      if (span < options.size * 4.2) continue;
      T.push({ x: (xs[i] + xs[i + 1]) / 2, y: y - 9, text: feet(span), size: options.size, anchor: "middle", minor: true });
    }
  }
  if (options.overallLabel) {
    T.push({
      x: (first + last) / 2,
      y: y - 10,
      text: feet(last - first),
      size: options.size,
      anchor: "middle",
      minor: !ctx.compact,
    });
  }
}

/** Vertical chain dimension (plans). Labels read bottom to top. */
function dimensionV(ctx: Ctx, ys: number[], x: number, options: { labels?: boolean; overallLabel?: boolean; size: number }) {
  const { L, T } = ctx;
  const first = ys[0];
  const last = ys[ys.length - 1];
  L.dim.line(x, first - 14, x, last + 14);
  for (const y of ys) L.tick.line(x - 6, y + 6, x + 6, y - 6);
  const label = (yy: number, text: string, minor: boolean) =>
    T.push({ x: x - 10, y: yy, text, size: options.size, anchor: "middle", rotate: -90, minor });
  if (options.labels) {
    for (let i = 0; i < ys.length - 1; i++) {
      const span = ys[i + 1] - ys[i];
      if (span < options.size * 4.2) continue;
      label((ys[i] + ys[i + 1]) / 2, feet(span), true);
    }
  }
  if (options.overallLabel) label((first + last) / 2, feet(last - first), !ctx.compact);
}

/** Structural grid bubble: circle with a label, as on a framing plan. */
function bubble(ctx: Ctx, cx: number, cy: number, r: number, label: string) {
  ctx.L.medium.circle(cx, cy, r);
  ctx.T.push({ x: cx, y: cy, text: label, size: Math.round(r * 0.95), anchor: "middle", central: true, minor: !ctx.compact });
}

/* ---------------------------------------------------------------------------
 * Elevation
 * ------------------------------------------------------------------------- */

type Roof = "flat" | "gable" | "hip" | "shed" | "sawtooth";
type Facade = "curtain" | "ribbon" | "punched" | "industrial" | "residential";
type GroundFloor = "storefront" | "entry" | "industrial" | "same";

type MassSpec = {
  bays: number;
  /** Floor-to-floor heights, ground floor first (units). */
  floors: number[];
  roof: Roof;
  /** Roof rise above the eave (units). */
  rise: number;
  facade: Facade;
  ground: GroundFloor;
  /** For shed roofs: which side is high. */
  highLeft?: boolean;
  /** Rooftop mechanical unit on flat roofs. */
  mech?: { at: number; width: number } | null;
};

type PlacedMass = MassSpec & {
  x: number;
  w: number;
  levels: number[];
  /** Eave or top of wall. */
  topY: number;
  /** Highest point of the mass. */
  peakY: number;
  overhangL: number;
  overhangR: number;
};

function fitMass(m: MassSpec, maxH: number): MassSpec {
  const floors = [...m.floors];
  let rise = m.rise;
  let mech = m.mech;
  const total = () => floors.reduce((s, h) => s + h, 0) + (m.roof === "flat" ? 12 + (mech ? 26 : 0) : rise);
  while (total() > maxH && floors.length > 1) floors.pop();
  if (total() > maxH && m.roof !== "flat") rise = Math.max(24, maxH - floors.reduce((s, h) => s + h, 0));
  if (total() > maxH) mech = null;
  return { ...m, floors, rise, mech };
}

function buildMasses(rng: Rng, maxW: number): { bayW: number; masses: MassSpec[]; name: string } {
  const archetype = rng.pick(["block", "podium", "hall", "house"] as const);

  if (archetype === "block") {
    const bayW = rng.pick([80, 96, 112]);
    const maxBays = Math.floor(maxW / bayW);
    const bays = rng.int(Math.min(6, maxBays), Math.min(maxBays, 11));
    const typical = rng.pick([52, 56]);
    const floors = [rng.pick([64, 72]), ...Array.from({ length: rng.int(2, 5) }, () => typical)];
    const facade = rng.pick(["curtain", "ribbon", "punched"] as const);
    return {
      bayW,
      name: "South elevation",
      masses: [
        {
          bays,
          floors,
          roof: "flat",
          rise: 0,
          facade,
          ground: facade === "punched" ? "entry" : "storefront",
          mech: rng.chance(0.7) ? { at: rng.pick([0.18, 0.52, 0.64]), width: 0.2 } : null,
        },
      ],
    };
  }

  if (archetype === "podium") {
    const bayW = rng.pick([80, 96]);
    const typical = 52;
    const tower: MassSpec = {
      bays: rng.int(4, 6),
      floors: [72, ...Array.from({ length: rng.int(4, 6) }, () => typical)],
      roof: "flat",
      rise: 0,
      facade: rng.pick(["curtain", "ribbon"] as const),
      ground: "storefront",
      mech: rng.chance(0.8) ? { at: 0.3, width: 0.36 } : null,
    };
    const wing: MassSpec = {
      bays: rng.int(3, 5),
      floors: rng.chance(0.5) ? [72] : [72, typical],
      roof: "flat",
      rise: 0,
      facade: rng.pick(["punched", "ribbon"] as const),
      ground: "storefront",
      mech: null,
    };
    while ((tower.bays + wing.bays) * bayW > maxW && wing.bays > 2) wing.bays -= 1;
    return { bayW, name: "East elevation", masses: rng.chance(0.5) ? [wing, tower] : [tower, wing] };
  }

  if (archetype === "hall") {
    const bayW = rng.pick([96, 112]);
    const roof = rng.pick(["sawtooth", "shed", "gable"] as const);
    const hallBays = rng.int(5, 8);
    const hallW = hallBays * bayW;
    const hall: MassSpec = {
      bays: hallBays,
      floors: [rng.pick([112, 128])],
      roof,
      rise: roof === "sawtooth" ? 46 : roof === "shed" ? 60 : Math.round((hallW / 2) * (2 / 12)),
      facade: "industrial",
      ground: "industrial",
      highLeft: rng.chance(0.5),
    };
    const office: MassSpec = {
      bays: rng.int(2, 3),
      floors: [64, 52],
      roof: "flat",
      rise: 0,
      facade: "punched",
      ground: "entry",
      mech: null,
    };
    while ((hall.bays + office.bays) * bayW > maxW && hall.bays > 4) hall.bays -= 1;
    return { bayW, name: "West elevation", masses: rng.chance(0.5) ? [office, hall] : [hall, office] };
  }

  // house: residential or light civic massing with pitched roofs.
  const bayW = rng.pick([80, 96]);
  const mainBays = rng.int(4, 6);
  const mainW = mainBays * bayW;
  const main: MassSpec = {
    bays: mainBays,
    floors: rng.chance(0.5) ? [48, 44] : [48, 44, 44],
    roof: rng.pick(["gable", "hip"] as const),
    rise: Math.min(Math.round((mainW / 2) * 0.5), 170),
    facade: "residential",
    ground: "entry",
  };
  const masses: MassSpec[] = [main];
  if (rng.chance(0.65)) {
    const wingBays = rng.int(2, 3);
    const wingRoof = rng.pick(["shed", "gable"] as const);
    const wing: MassSpec = {
      bays: wingBays,
      floors: [48],
      roof: wingRoof,
      rise: wingRoof === "shed" ? 40 : Math.round(((wingBays * bayW) / 2) * 0.5),
      facade: "residential",
      ground: "same",
      highLeft: false,
    };
    // A shed wing rises toward the main house.
    if (rng.chance(0.5)) {
      wing.highLeft = false;
      masses.unshift(wing);
    } else {
      wing.highLeft = true;
      masses.push(wing);
    }
  }
  return { bayW, name: "Front elevation", masses };
}

/** Highest drawn point of a mass at x (for stopping grid leaders above the roof). */
function roofYAt(m: PlacedMass, x: number): number {
  const { topY, rise } = m;
  switch (m.roof) {
    case "flat": {
      if (m.mech) {
        const mx = m.x + m.w * m.mech.at;
        if (x >= mx - 2 && x <= mx + m.w * m.mech.width + 2) return topY - 38;
      }
      return topY - 12;
    }
    case "gable": {
      const half = m.w / 2 + Math.max(m.overhangL, m.overhangR);
      const t = Math.max(0, 1 - Math.abs(x - (m.x + m.w / 2)) / half);
      return topY - rise * t;
    }
    case "hip": {
      const a = m.x + m.w * 0.3;
      const b = m.x + m.w * 0.7;
      if (x >= a && x <= b) return topY - rise;
      const t = x < a ? (x - (m.x - m.overhangL)) / (a - (m.x - m.overhangL)) : ((m.x + m.w + m.overhangR) - x) / ((m.x + m.w + m.overhangR) - b);
      return topY - rise * Math.max(0, Math.min(1, t));
    }
    case "shed": {
      const t = (x - m.x) / m.w;
      const hi = topY - rise;
      const lo = topY - rise * 0.12;
      return m.highLeft ? hi + (lo - hi) * t : lo + (hi - lo) * t;
    }
    case "sawtooth":
      return topY - rise;
  }
}

/** Facade infill for one floor of one mass. */
function drawFloor(
  ctx: Ctx,
  m: PlacedMass,
  bayW: number,
  yb: number,
  yt: number,
  isGround: boolean,
) {
  const { L } = ctx;
  const h = yb - yt;
  const bays = m.bays;
  const entranceBay = Math.floor(bays / 2);
  const kind: Facade | Exclude<GroundFloor, "same"> = isGround && m.ground !== "same" ? m.ground : m.facade;

  const punched = (bx: number, residential: boolean) => {
    const ww = bayW * (residential ? 0.36 : 0.46);
    const wh = h * (residential ? 0.56 : 0.5);
    const wx = bx + (bayW - ww) / 2;
    const wy = yt + h * (residential ? 0.18 : 0.2);
    L.glass.rect(wx, wy, ww, wh);
    L.fine.rect(wx, wy, ww, wh);
    L.fine.line(wx + ww / 2, wy, wx + ww / 2, wy + wh);
    if (residential) L.hatch.line(wx, wy + wh * 0.32, wx + ww, wy + wh * 0.32);
    L.fine.line(wx - 4, wy + wh + 4, wx + ww + 4, wy + wh + 4);
  };

  const door = (bx: number, double: boolean) => {
    const dw = double ? Math.min(bayW * 0.5, 36) : 16;
    const dh = 34;
    const dx = bx + (bayW - dw) / 2;
    const dy = yb - dh;
    L.cut.rect(dx, dy, dw, dh);
    L.glass.rect(dx, dy, dw, dh);
    L.fine.rect(dx, dy, dw, dh);
    if (double) L.fine.line(dx + dw / 2, dy, dx + dw / 2, yb);
    // Canopy
    L.poche.rect(dx - 14, dy - 12, dw + 28, 5);
  };

  switch (kind) {
    case "curtain": {
      const sp = 10;
      L.glass.rect(m.x + 2, yt + sp, m.w - 4, h - sp);
      L.fine.line(m.x, yt + sp, m.x + m.w, yt + sp);
      for (let k = 1; k < bays * 2; k++) {
        const x = m.x + (k * bayW) / 2;
        (k % 2 === 0 ? L.fine : L.hatch).line(x, yt + sp, x, yb);
      }
      L.hatch.line(m.x, yt + sp + (h - sp) * 0.7, m.x + m.w, yt + sp + (h - sp) * 0.7);
      break;
    }
    case "ribbon": {
      const inset = 16;
      const by = yt + h * 0.22;
      const bh = h * 0.46;
      L.glass.rect(m.x + inset, by, m.w - inset * 2, bh);
      L.fine.rect(m.x + inset, by, m.w - inset * 2, bh);
      for (let k = 1; k < bays * 2; k++) {
        const x = m.x + (k * bayW) / 2;
        (k % 2 === 0 ? L.fine : L.hatch).line(x, by, x, by + bh);
      }
      break;
    }
    case "punched":
    case "residential": {
      for (let b = 0; b < bays; b++) punched(m.x + b * bayW, kind === "residential");
      break;
    }
    case "storefront": {
      const head = yb - 34;
      for (let b = 0; b < bays; b++) {
        const bx = m.x + b * bayW;
        const gx = bx + 6;
        const gw = bayW - 12;
        const gy = yt + 14;
        L.glass.rect(gx, gy, gw, yb - gy - 3);
        L.fine.rect(gx, gy, gw, yb - gy - 3);
        L.hatch.line(gx, head, gx + gw, head);
        if (b === entranceBay) {
          const dw = Math.min(bayW * 0.5, 36);
          const dx = bx + (bayW - dw) / 2;
          L.fine.line(dx, head, dx, yb);
          L.fine.line(dx + dw, head, dx + dw, yb);
          L.fine.line(dx + dw / 2, head, dx + dw / 2, yb);
          L.poche.rect(bx - 10, head - 16, bayW + 20, 5);
        } else {
          L.hatch.line(bx + bayW / 2, gy, bx + bayW / 2, yb - 3);
        }
      }
      break;
    }
    case "entry": {
      for (let b = 0; b < bays; b++) {
        const bx = m.x + b * bayW;
        if (b === entranceBay) door(bx, true);
        else punched(bx, m.facade === "residential");
      }
      break;
    }
    case "industrial": {
      // Insulated metal panel joints
      for (let x = m.x + 16; x < m.x + m.w - 4; x += 16) L.hatch.line(x, yt + 2, x, yb);
      // Clerestory band
      const cy = yt + 16;
      const ch = 22;
      const cx0 = m.x + bayW * 0.25;
      const cw = m.w - bayW * 0.5;
      L.cut.rect(cx0, cy, cw, ch);
      L.glass.rect(cx0, cy, cw, ch);
      L.fine.rect(cx0, cy, cw, ch);
      for (let x = cx0 + bayW / 2; x < cx0 + cw - 2; x += bayW / 2) L.fine.line(x, cy, x, cy + ch);
      // Overhead doors in alternating bays, a personnel door in the first free bay.
      let personnel = false;
      for (let b = 0; b < bays; b++) {
        const bx = m.x + b * bayW;
        if (b % 2 === 1) {
          const dw = bayW * 0.56;
          const dh = Math.min(56, h * 0.5);
          const dx = bx + (bayW - dw) / 2;
          L.cut.rect(dx, yb - dh, dw, dh);
          L.fine.rect(dx, yb - dh, dw, dh);
          for (let y = yb - dh + 8; y < yb - 2; y += 8) L.hatch.line(dx, y, dx + dw, y);
          L.poche.rect(dx - 6, yb - dh - 8, dw + 12, 4);
        } else if (!personnel && b > 0) {
          personnel = true;
          const dx = bx + bayW * 0.3;
          L.cut.rect(dx, yb - 28, 14, 28);
          L.fine.rect(dx, yb - 28, 14, 28);
        }
      }
      break;
    }
  }
}

function drawRoof(ctx: Ctx, m: PlacedMass) {
  const { L } = ctx;
  const { x, w, topY, rise } = m;
  switch (m.roof) {
    case "flat": {
      L.medium.rect(x, topY - 12, w, 12);
      if (m.mech) {
        const mx = x + w * m.mech.at;
        const mw = Math.min(w * m.mech.width, 180);
        L.medium.rect(mx, topY - 38, mw, 26);
        for (let y = topY - 32; y < topY - 14; y += 6) L.hatch.line(mx + 6, y, mx + mw - 6, y);
      }
      break;
    }
    case "gable": {
      const l = x - m.overhangL;
      const r = x + w + m.overhangR;
      const cx = x + w / 2;
      L.medium.poly([
        [l, topY],
        [cx, topY - rise],
        [r, topY],
      ]);
      L.fine.line(l, topY + 6, r, topY + 6);
      for (let sx = l + 14; sx < r - 6; sx += 14) {
        const y = roofYAt(m, sx);
        if (topY - y > 8) L.hatch.line(sx, y + 4, sx, topY - 2);
      }
      break;
    }
    case "hip": {
      const l = x - m.overhangL;
      const r = x + w + m.overhangR;
      L.medium.poly([
        [l, topY],
        [x + w * 0.3, topY - rise],
        [x + w * 0.7, topY - rise],
        [r, topY],
      ]);
      L.fine.line(l, topY + 6, r, topY + 6);
      for (let sx = l + 14; sx < r - 6; sx += 14) {
        const y = roofYAt(m, sx);
        if (topY - y > 8) L.hatch.line(sx, y + 4, sx, topY - 2);
      }
      break;
    }
    case "shed": {
      const hi = topY - rise;
      const lo = topY - rise * 0.12;
      const yl = m.highLeft ? hi : lo;
      const yr = m.highLeft ? lo : hi;
      L.medium.poly([
        [x, topY],
        [x, yl],
        [x + w, yr],
        [x + w, topY],
      ]);
      const slope = (yr - yl) / w;
      const l = x - m.overhangL;
      const r = x + w + m.overhangR;
      L.medium.line(l, yl + slope * (l - x) - 6, r, yl + slope * (r - x) - 6);
      break;
    }
    case "sawtooth": {
      const teeth = m.bays;
      const tw = w / teeth;
      const pts: Point[] = [[x, topY]];
      for (let i = 0; i < teeth; i++) {
        const tx = x + i * tw;
        pts.push([tx, topY - rise], [tx + tw, topY]);
        L.glass.poly([
          [tx, topY],
          [tx, topY - rise],
          [tx + tw * 0.42, topY - rise * 0.58],
          [tx + tw * 0.42, topY],
        ]);
        L.hatch.line(tx + 5, topY - rise + 8, tx + 5, topY - 2);
      }
      L.medium.poly(pts, false);
      break;
    }
  }
}

function drawElevation(ctx: Ctx, frame: { x0: number; y0: number; x1: number; y1: number }): string {
  const { rng, L, T, compact } = ctx;
  const lowestGround = frame.y1 - (compact ? 152 : 172);
  const dimsDepth = compact ? 128 : 116; // ground line to the overall dimension
  const bubbleGap = compact ? 150 : 132; // highest roof point to the bubble centres
  const bubbleR = compact ? 30 : 21;
  const bubbleMin = frame.y0 + (compact ? 64 : 70);
  const maxH = lowestGround - (bubbleMin + bubbleR + 44);
  const zone = { x0: 250, x1: W - 110 };
  const maxW = zone.x1 - zone.x0;

  const { bayW, masses: specs, name } = buildMasses(rng, maxW);
  const fitted = specs.map((m) => fitMass(m, maxH));

  // Centre the whole composition (bubbles to dimensions) vertically in the field.
  const tallestH = Math.max(
    ...fitted.map((m) => m.floors.reduce((s, h) => s + h, 0) + (m.roof === "flat" ? 12 + (m.mech ? 26 : 0) : m.rise)),
  );
  const centre = (frame.y0 + frame.y1) / 2;
  const groundY = Math.min(lowestGround, Math.round(centre + (tallestH + bubbleGap + bubbleR - dimsDepth) / 2));

  const totalW = fitted.reduce((s, m) => s + m.bays * bayW, 0);
  let x = Math.round(zone.x0 + (maxW - totalW) / 2);

  const placed: PlacedMass[] = fitted.map((m) => {
    const w = m.bays * bayW;
    const levels = [groundY];
    let y = groundY;
    for (const fh of m.floors) {
      y -= fh;
      levels.push(y);
    }
    const p: PlacedMass = { ...m, x, w, levels, topY: y, peakY: y - (m.roof === "flat" ? 12 : m.rise), overhangL: 12, overhangR: 12 };
    x += w;
    return p;
  });

  // Pitched roofs only overhang free sides (not into a taller neighbour).
  placed.forEach((m, i) => {
    const left = placed[i - 1];
    const right = placed[i + 1];
    if (left && left.peakY < m.topY + 4) m.overhangL = 0;
    if (right && right.peakY < m.topY + 4) m.overhangR = 0;
    if (m.roof === "shed") {
      m.overhangL = left ? 0 : 10;
      m.overhangR = right ? 0 : 10;
    }
  });

  const minX = placed[0].x;
  const maxX = placed[placed.length - 1].x + placed[placed.length - 1].w;

  // Earth, ground line
  hatchRect(L.hatch, minX - 64, groundY + 2, maxX + 64, groundY + 24, 11);
  L.heavy.line(Math.max(frame.x0 + 24, minX - 150), groundY, Math.min(frame.x1 - 24, maxX + 110), groundY);

  // Masses
  for (const m of placed) {
    L.medium.line(m.x, groundY, m.x, m.topY);
    L.medium.line(m.x + m.w, groundY, m.x + m.w, m.topY);
    if (m.roof !== "flat" && m.roof !== "shed") L.medium.line(m.x, m.topY, m.x + m.w, m.topY);
    for (let i = 1; i < m.levels.length - 1; i++) L.fine.line(m.x, m.levels[i], m.x + m.w, m.levels[i]);
    for (let i = 0; i < m.floors.length; i++) drawFloor(ctx, m, bayW, m.levels[i], m.levels[i + 1], i === 0);
    drawRoof(ctx, m);
  }

  // Structural grid: bubbles above, leaders down to the roof.
  const highest = Math.min(...placed.map((m) => Math.min(m.peakY, m.mech ? m.topY - 38 : m.peakY)));
  const bubbleY = Math.max(bubbleMin, highest - bubbleGap);
  const gridXs: number[] = [];
  for (let gx = minX; gx <= maxX + 0.5; gx += bayW) gridXs.push(gx);
  gridXs.forEach((gx, i) => {
    bubble(ctx, gx, bubbleY, bubbleR, String(i + 1));
    const covering = placed.filter((m) => gx >= m.x - m.overhangL - 0.5 && gx <= m.x + m.w + m.overhangR + 0.5);
    const roofTop = Math.min(...covering.map((m) => roofYAt(m, gx)));
    const end = roofTop - 14;
    if (end - (bubbleY + bubbleR) > 10) L.fine.line(gx, bubbleY + bubbleR, gx, end);
  });

  // Dimensions below grade
  const textSize = compact ? 30 : 15;
  dimensionH(ctx, gridXs, groundY + 54, { extFrom: groundY + 30, labels: !compact, size: textSize });
  dimensionH(ctx, [minX, maxX], groundY + (compact ? 112 : 104), { extFrom: groundY + 64, overallLabel: true, size: compact ? 30 : 17 });

  // Level datums on the tallest mass. The ground datum is the sheet's single gold accent.
  const tallest = placed.reduce((a, b) => (b.topY < a.topY ? b : a));
  const markerX = compact ? 170 : 176;
  tallest.levels.forEach((ly, i) => {
    const isTop = i === tallest.levels.length - 1;
    L.dim.line(markerX - 6, ly, minX - 18, ly);
    const tri: Point[] = [
      [markerX, ly],
      [markerX - 10, ly - 15],
      [markerX + 10, ly - 15],
    ];
    if (i === 0) L.accent.poly(tri);
    else L.medium.poly(tri);
    if (!compact) {
      const label = isTop ? (tallest.roof === "flat" ? "ROOF" : "EAVE") : `LEVEL ${String(i + 1).padStart(2, "0")}`;
      T.push({ x: 64, y: ly - 26, text: label, size: 14, anchor: "start", minor: true });
      T.push({ x: 64, y: ly - 9, text: `+${Math.round((groundY - ly) / FT)}'-0"`, size: 14, anchor: "start", muted: true, minor: true });
    }
  });

  return name;
}

/* ---------------------------------------------------------------------------
 * Plan
 * ------------------------------------------------------------------------- */

function drawPlan(ctx: Ctx, frame: { x0: number; y0: number; x1: number; y1: number }): string {
  const { rng, L, T, compact } = ctx;
  const bubbleR = compact ? 30 : 21;
  // Distances from the plan edge to the bubble centres, overall and chain dimensions.
  const bubbleOff = compact ? 186 : 150;
  const overallOff = compact ? 110 : 84;
  const chainOff = compact ? 50 : 42;
  const north = { r: compact ? 40 : 30 };

  const areaX0 = frame.x0 + 28 + bubbleOff + bubbleR;
  const areaY0 = frame.y0 + 24 + bubbleOff + bubbleR;
  const areaX1 = frame.x1 - (compact ? 190 : 160);
  const areaY1 = frame.y1 - 40;

  // Compact sheets draw at a larger scale so the plan reads at card size.
  let colW = rng.pick(compact ? [128, 144, 160] : [96, 112, 128, 144]);
  let nx = rng.int(4, 7);
  while (nx * colW > areaX1 - areaX0 && nx > 3) nx -= 1;
  while (nx * colW > areaX1 - areaX0) colW -= 16;
  let rowH = rng.pick(compact ? [112, 128] : [96, 112, 128]);
  let ny = rng.int(3, 4);
  while (ny * rowH > areaY1 - areaY0 && ny > 2) ny -= 1;
  while (ny * rowH > areaY1 - areaY0) rowH -= 16;

  const planW = nx * colW;
  const planH = ny * rowH;
  const ox = Math.round(areaX0 + (areaX1 - areaX0 - planW) / 2);
  const oy = Math.round(areaY0 + (areaY1 - areaY0 - planH) / 2);
  const gx = (i: number) => ox + i * colW;
  const gy = (j: number) => oy + j * rowH;

  // Footprint: rectangle, L, or a recessed entry court on the south side.
  const occupied: boolean[][] = Array.from({ length: nx }, () => Array.from({ length: ny }, () => true));
  const shape = rng.pick(["rect", "ell", "ell", "court"] as const);
  if (shape === "ell") {
    const a = rng.int(1, Math.max(1, Math.floor(nx / 2)));
    const b = rng.int(1, Math.max(1, ny - 2));
    const top = rng.chance(0.5);
    for (let i = nx - a; i < nx; i++) for (let j = 0; j < b; j++) occupied[i][top ? j : ny - 1 - j] = false;
  } else if (shape === "court" && nx >= 5) {
    const start = Math.floor((nx - 1) / 2);
    occupied[start][ny - 1] = false;
    if (nx >= 6) occupied[start + 1][ny - 1] = false;
  }
  const occ = (i: number, j: number) => i >= 0 && j >= 0 && i < nx && j < ny && occupied[i][j];

  const t = compact ? 16 : 12; // exterior wall thickness
  const ti = compact ? 7 : 5; // partition thickness

  // Column grid lines and bubbles (letters across, numbers down).
  const letters = "ABCDEFGHJK";
  const bubbleTop = oy - bubbleOff;
  const bubbleLeft = ox - bubbleOff;
  for (let i = 0; i <= nx; i++) {
    L.fine.line(gx(i), bubbleTop + bubbleR, gx(i), gy(ny) + 26);
    bubble(ctx, gx(i), bubbleTop, bubbleR, letters[i] ?? String(i + 1));
  }
  for (let j = 0; j <= ny; j++) {
    L.fine.line(bubbleLeft + bubbleR, gy(j), gx(nx) + 26, gy(j));
    bubble(ctx, bubbleLeft, gy(j), bubbleR, String(j + 1));
  }

  // Exterior walls along the footprint boundary, with openings.
  type Edge = { x1: number; y1: number; x2: number; y2: number; horizontal: boolean; outside: "n" | "s" | "e" | "w" };
  const edges: Edge[] = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j <= ny; j++) {
      const above = occ(i, j - 1);
      const below = occ(i, j);
      if (above !== below) edges.push({ x1: gx(i), y1: gy(j), x2: gx(i + 1), y2: gy(j), horizontal: true, outside: below ? "n" : "s" });
    }
  }
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j < ny; j++) {
      const left = occ(i - 1, j);
      const right = occ(i, j);
      if (left !== right) edges.push({ x1: gx(i), y1: gy(j), x2: gx(i), y2: gy(j + 1), horizontal: false, outside: right ? "w" : "e" });
    }
  }
  for (const e of edges) {
    if (e.horizontal) L.poche.rect(e.x1 - t / 2, e.y1 - t / 2, e.x2 - e.x1 + t, t);
    else L.poche.rect(e.x1 - t / 2, e.y1 - t / 2, t, e.y2 - e.y1 + t);
  }

  // Main entrance: the south-facing edge closest to the middle.
  const south = edges.filter((e) => e.outside === "s");
  const mid = ox + planW / 2;
  const entrance = south.reduce<Edge | null>(
    (best, e) => (!best || Math.abs((e.x1 + e.x2) / 2 - mid) < Math.abs((best.x1 + best.x2) / 2 - mid) ? e : best),
    null,
  );

  for (const e of edges) {
    const len = e.horizontal ? e.x2 - e.x1 : e.y2 - e.y1;
    if (e === entrance) {
      const dw = 40;
      const cx = (e.x1 + e.x2) / 2;
      const y = e.y1;
      L.opening.rect(cx - dw / 2, y - t / 2 - 1, dw, t + 2);
      L.fine.line(cx - dw / 2, y - t / 2, cx - dw / 2, y + t / 2);
      L.fine.line(cx + dw / 2, y - t / 2, cx + dw / 2, y + t / 2);
      // Double doors swing out
      L.medium.line(cx - dw / 2, y + t / 2, cx - dw / 2, y + t / 2 + dw / 2);
      L.medium.line(cx + dw / 2, y + t / 2, cx + dw / 2, y + t / 2 + dw / 2);
      L.fine.arc(cx - dw / 2, y + t / 2 + dw / 2, dw / 2, cx, y + t / 2, 0);
      L.fine.arc(cx + dw / 2, y + t / 2 + dw / 2, dw / 2, cx, y + t / 2, 1);
      continue;
    }
    if (!rng.chance(0.78)) continue;
    const ow = len * rng.pick([0.4, 0.5, 0.6]);
    if (e.horizontal) {
      const x0 = (e.x1 + e.x2) / 2 - ow / 2;
      const y = e.y1;
      L.opening.rect(x0, y - t / 2 - 1, ow, t + 2);
      L.fine.line(x0, y - t / 2, x0 + ow, y - t / 2);
      L.fine.line(x0, y + t / 2, x0 + ow, y + t / 2);
      L.fine.line(x0, y, x0 + ow, y);
      L.fine.line(x0, y - t / 2, x0, y + t / 2);
      L.fine.line(x0 + ow, y - t / 2, x0 + ow, y + t / 2);
    } else {
      const y0 = (e.y1 + e.y2) / 2 - ow / 2;
      const x = e.x1;
      L.opening.rect(x - t / 2 - 1, y0, t + 2, ow);
      L.fine.line(x - t / 2, y0, x - t / 2, y0 + ow);
      L.fine.line(x + t / 2, y0, x + t / 2, y0 + ow);
      L.fine.line(x, y0, x, y0 + ow);
      L.fine.line(x - t / 2, y0, x + t / 2, y0);
      L.fine.line(x - t / 2, y0 + ow, x + t / 2, y0 + ow);
    }
  }

  // Interior partitions with single doors.
  const stairCell = (() => {
    const candidates: [number, number][] = [];
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) if (occ(i, j) && j < ny - 1) candidates.push([i, j]);
    return candidates.length ? rng.pick(candidates) : null;
  })();
  const partition = (x1: number, y1: number, x2: number, y2: number, withDoor: boolean, flip: boolean) => {
    const horizontal = y1 === y2;
    const len = horizontal ? x2 - x1 : y2 - y1;
    if (!withDoor) {
      if (horizontal) L.poche.rect(x1, y1 - ti / 2, len, ti);
      else L.poche.rect(x1 - ti / 2, y1, ti, len);
      return;
    }
    const dw = 30;
    const at = len * 0.22;
    if (horizontal) {
      L.poche.rect(x1, y1 - ti / 2, at, ti);
      L.poche.rect(x1 + at + dw, y1 - ti / 2, len - at - dw, ti);
      const hx = x1 + at;
      const dir = flip ? -1 : 1;
      L.medium.line(hx, y1, hx, y1 + dir * dw);
      L.fine.arc(hx, y1 + dir * dw, dw, hx + dw, y1, flip ? 1 : 0);
    } else {
      L.poche.rect(x1 - ti / 2, y1, ti, at);
      L.poche.rect(x1 - ti / 2, y1 + at + dw, ti, len - at - dw);
      const hy = y1 + at;
      const dir = flip ? -1 : 1;
      L.medium.line(x1, hy, x1 + dir * dw, hy);
      L.fine.arc(x1 + dir * dw, hy, dw, x1, hy + dw, flip ? 0 : 1);
    }
  };
  for (let j = 1; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      if (occ(i, j - 1) && occ(i, j) && rng.chance(0.42)) partition(gx(i), gy(j), gx(i + 1), gy(j), rng.chance(0.7), rng.chance(0.5));
    }
  }
  for (let i = 1; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      if (occ(i - 1, j) && occ(i, j) && rng.chance(0.36)) partition(gx(i), gy(j), gx(i), gy(j + 1), rng.chance(0.7), rng.chance(0.5));
    }
  }

  // Stair: two flights with treads, in one bay.
  if (stairCell) {
    const [si, sj] = stairCell;
    const sx = gx(si) + 16;
    const sy = gy(sj) + 16;
    const sw = colW - 32;
    const sh = rowH - 32;
    L.opening.rect(sx, sy, sw, sh);
    L.fine.rect(sx, sy, sw, sh);
    L.medium.line(sx + sw / 2, sy, sx + sw / 2, sy + sh * 0.78);
    for (let y = sy + 9; y < sy + sh * 0.78; y += 9) {
      L.hatch.line(sx, y, sx + sw / 2, y);
      L.hatch.line(sx + sw / 2, y, sx + sw, y);
    }
    if (!compact) T.push({ x: sx + sw / 4, y: sy + sh - 8, text: "UP", size: 12, anchor: "middle", minor: true, muted: true });
  }

  // Columns at every grid intersection that touches the footprint.
  const cs = compact ? 16 : 12;
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= ny; j++) {
      if (occ(i - 1, j - 1) || occ(i, j - 1) || occ(i - 1, j) || occ(i, j)) L.poche.rect(gx(i) - cs / 2, gy(j) - cs / 2, cs, cs);
    }
  }

  // Room numbers (full sheets only).
  if (!compact) {
    let room = 101;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        if (!occ(i, j) || (stairCell && stairCell[0] === i && stairCell[1] === j)) continue;
        if ((i + j) % 2 === 0) {
          T.push({ x: gx(i) + colW / 2, y: gy(j) + rowH / 2 + 5, text: String(room), size: 14, anchor: "middle", minor: true, muted: true });
        }
        room += 1;
      }
    }
  }

  // Dimensions above and to the left.
  const xs = Array.from({ length: nx + 1 }, (_, i) => gx(i));
  const ys = Array.from({ length: ny + 1 }, (_, j) => gy(j));
  const dimSize = compact ? 30 : 15;
  dimensionH(ctx, xs, oy - chainOff, { labels: !compact, size: dimSize });
  dimensionH(ctx, [xs[0], xs[nx]], oy - overallOff, { overallLabel: true, size: compact ? 30 : 17 });
  dimensionV(ctx, ys, ox - chainOff, { labels: !compact, size: dimSize });
  dimensionV(ctx, [ys[0], ys[ny]], ox - overallOff, { overallLabel: true, size: compact ? 30 : 17 });

  // North arrow: the sheet's single gold accent.
  const nx0 = frame.x1 - (compact ? 96 : 84);
  const ny0 = frame.y1 - (compact ? 100 : 84);
  L.medium.circle(nx0, ny0, north.r);
  L.accent.poly([
    [nx0, ny0 - north.r * 0.86],
    [nx0 + north.r * 0.36, ny0 + north.r * 0.5],
    [nx0, ny0 + north.r * 0.22],
    [nx0 - north.r * 0.36, ny0 + north.r * 0.5],
  ]);
  L.fine.line(nx0, ny0 - north.r, nx0, ny0 - north.r - 10);
  T.push({ x: nx0, y: ny0 - north.r - 18, text: "N", size: compact ? 30 : 18, anchor: "middle" });

  return rng.chance(0.5) ? "Ground floor plan" : "Level 01 plan";
}

/* ---------------------------------------------------------------------------
 * Sheet
 * ------------------------------------------------------------------------- */

function fitSize(text: string, maxWidth: number, size: number): number {
  // Fragment Mono advances about 0.6em; tracking adds roughly 0.08em.
  const width = text.length * size * 0.68;
  return width > maxWidth ? Math.floor((maxWidth / (text.length * 0.68)) * 10) / 10 : size;
}

export function createBlueprint(slug: string, sector: string | null | undefined, detail: BlueprintDetail = "compact"): Blueprint {
  const seed = hashString(slug || "rococo");
  const rng = createRng(seed);
  const compact = detail === "compact";
  const L = createLayers();
  const T: BlueprintText[] = [];
  const ctx: Ctx = { rng, L, T, compact };

  const ground = seed % 2 === 0 ? "paper" : "sand";
  const kind = Math.floor(seed / 2) % 3 === 0 ? "plan" : "elevation";

  // Frame and title block
  const tbH = compact ? 128 : 96;
  const tbY = H - MARGIN - tbH;
  const frame = { x0: MARGIN, y0: MARGIN, x1: W - MARGIN, y1: tbY };
  L.frame.rect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);
  L.frame.line(MARGIN, tbY, W - MARGIN, tbY);

  // Swiss grid: 12 columns, 8 rows across the drawing field.
  for (let i = 1; i < 12; i++) {
    const gx = MARGIN + (i * (W - MARGIN * 2)) / 12;
    L.grid.line(gx, MARGIN, gx, tbY);
  }
  for (let j = 1; j < 8; j++) {
    const gy = MARGIN + (j * (tbY - MARGIN)) / 8;
    L.grid.line(MARGIN, gy, W - MARGIN, gy);
  }

  const drawingName = kind === "plan" ? drawPlan(ctx, frame) : drawElevation(ctx, frame);
  const sheet = `A-${kind === "plan" ? 1 : 2}${rng.int(0, 4)}${rng.int(1, 9)}`;
  const sectorLabel = (sector && !/^\s*TODO\b/i.test(sector) ? sector : "Case study").toUpperCase();

  if (compact) {
    const split = W - MARGIN - 360;
    L.frame.line(split, tbY, split, H - MARGIN);
    T.push({ x: MARGIN + 28, y: tbY + 30, text: "SECTOR", size: 15, anchor: "start", muted: true, minor: true });
    T.push({ x: MARGIN + 28, y: tbY + 92, text: sectorLabel, size: fitSize(sectorLabel, split - MARGIN - 56, 44), anchor: "start" });
    T.push({ x: split + 28, y: tbY + 30, text: "SHEET", size: 15, anchor: "start", muted: true, minor: true });
    T.push({ x: split + 28, y: tbY + 92, text: sheet, size: 44, anchor: "start" });
  } else {
    const cells = [MARGIN, 780, 1080, 1340, W - MARGIN];
    for (let i = 1; i < cells.length - 1; i++) L.frame.line(cells[i], tbY, cells[i], H - MARGIN);
    const cell = (i: number, label: string, value: string, size: number) => {
      T.push({ x: cells[i] + 22, y: tbY + 28, text: label, size: 13, anchor: "start", muted: true, minor: true });
      T.push({ x: cells[i] + 22, y: tbY + 72, text: value, size: fitSize(value, cells[i + 1] - cells[i] - 44, size), anchor: "start", minor: i === 1 || i === 2 });
    };
    cell(0, "SECTOR", sectorLabel, 30);
    cell(1, "DRAWING", drawingName.toUpperCase(), 19);
    cell(2, "SCALE", `1/16" = 1'-0"`, 19);
    cell(3, "SHEET", sheet, 30);
  }

  return {
    ground,
    kind,
    layers: {
      grid: L.grid.toString(),
      frame: L.frame.toString(),
      hatch: L.hatch.toString(),
      cut: L.cut.toString(),
      glass: L.glass.toString(),
      poche: L.poche.toString(),
      opening: L.opening.toString(),
      fine: L.fine.toString(),
      medium: L.medium.toString(),
      heavy: L.heavy.toString(),
      dim: L.dim.toString(),
      tick: L.tick.toString(),
      accent: L.accent.toString(),
    },
    texts: T,
  };
}
