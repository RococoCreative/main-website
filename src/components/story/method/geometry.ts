/**
 * Geometry for the Method elevation drawing.
 *
 * One architectural front elevation, drawn on a 600 x 480 viewBox (1 unit = 1 user px)
 * at an illustrative scale of 5 units to the foot: three 20'-0" bays on grid lines
 * A to D, three 14'-0" storeys, footings below grade, and a cornice with a small
 * ornament at the crown. Every value sits on the same module so strokes align.
 *
 * The drawing is split into four layers that match the four method phases:
 *   1 Survey      ground line, grid lines and stakes, dimension strings, datums
 *   2 Foundation  slab on grade and footings in section, with concrete hatch
 *   3 Frame       columns, beams, and floor plates
 *   4 Finish      walls, windows, entrance, cornice, and the crown ornament
 *
 * Paths are plain strings so the SVG renders on the server with no client cost.
 * Anything that "draws in" is a <path> (pathLength is unreliable on other shapes).
 */

export const VIEWBOX = { width: 600, height: 480 } as const;

export type Weight = "fine" | "regular" | "heavy";
/** Stagger step within a layer, 0 to 4. Each step starts slightly later. */
export type Delay = 0 | 1 | 2 | 3 | 4;

export type StrokeSpec = {
  d: string;
  weight?: Weight;
  /** true: draws in with stroke-dashoffset. false: fades in (used for patterned lines). */
  draw?: boolean;
  /** Line pattern for lines that fade rather than draw. */
  pattern?: "center" | "guide";
  delay?: Delay;
};

export type FillSpec = {
  d: string;
  /** surface: opaque stage colour that masks what lies behind; hatch: concrete section;
   *  tint: faint glazing wash; ink: solid marks (symbols, rebar). */
  tone: "surface" | "hatch" | "tint" | "ink";
  delay?: Delay;
};

export type LabelSpec = {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
  /** Degrees, rotated about (x, y). */
  rotate?: number;
  delay?: Delay;
};

export type LayerSpec = {
  key: "survey" | "foundation" | "frame" | "finish";
  fills: FillSpec[];
  strokes: StrokeSpec[];
  labels: LabelSpec[];
  /** Gold line work. Only the finish layer carries it. */
  ornament?: StrokeSpec[];
};

/* ---------------------------------------------------------------------------
 * Module
 * ------------------------------------------------------------------------- */

const GRID = [150, 250, 350, 450] as const;
const GRID_NAMES = ["A", "B", "C", "D"] as const;
const BAY_CENTERS = [200, 300, 400] as const;

const GRADE = 384;
const PLATE = 6; // floor plate thickness
const BEAM = 8; // beam depth below the plate

const LEVELS = [
  { y: 376, name: "L1", elev: `0'-0"` },
  { y: 306, name: "L2", elev: `14'-0"` },
  { y: 236, name: "L3", elev: `28'-0"` },
  { y: 166, name: "Roof", elev: `42'-0"` },
] as const;

const [L1, L2, L3, ROOF] = LEVELS.map((level) => level.y);
const UPPER_LEVELS = [L2, L3, ROOF];

/* ---------------------------------------------------------------------------
 * Path helpers
 * ------------------------------------------------------------------------- */

/** Trim float noise so the markup stays short and stable. */
function n(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function circle(cx: number, cy: number, r: number): string {
  return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
}

/** Two opposite filled quadrants: the survey datum / benchmark symbol. */
function quadrants(cx: number, cy: number, r: number): string {
  return (
    `M${n(cx)} ${n(cy)}V${n(cy - r)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(cy)}Z` +
    `M${n(cx)} ${n(cy)}V${n(cy + r)}A${n(r)} ${n(r)} 0 0 1 ${n(cx - r)} ${n(cy)}Z`
  );
}

function rect(x: number, y: number, w: number, h: number): string {
  return `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`;
}

function join(parts: readonly string[]): string {
  return parts.join("");
}

/* ---------------------------------------------------------------------------
 * 01 Survey
 * ------------------------------------------------------------------------- */

const earthTicks = join(
  [74, 84, 94, 104, 114, 124, 476, 486, 496, 506, 516, 526, 536, 546, 556, 566].map((x) => `M${x} ${GRADE + 2}l-5 6`),
);

const survey: LayerSpec = {
  key: "survey",
  fills: [
    // Benchmark on the grade line, north needle, and level datum symbols.
    { d: quadrants(58, GRADE, 5), tone: "ink", delay: 3 },
    { d: "M56 46L61 69L56 64Z", tone: "ink", delay: 3 },
    { d: join(LEVELS.map((l) => quadrants(502, l.y, 4))), tone: "ink", delay: 3 },
  ],
  strokes: [
    // Grid centre lines run from the bubbles to below the footings.
    { d: join(GRID.map((x) => `M${x} 452V50`)), weight: "fine", draw: false, pattern: "center", delay: 0 },
    // Level guides: where each floor will land.
    { d: join(LEVELS.map((l) => `M92 ${l.y}H498`)), weight: "fine", draw: false, pattern: "guide", delay: 2 },
    // Ground line and earth ticks outside the footprint.
    { d: `M24 ${GRADE}H576`, weight: "heavy", delay: 0 },
    { d: earthTicks, weight: "fine", delay: 1 },
    // Grid bubbles.
    { d: join(GRID.map((x) => circle(x, 38, 10))), delay: 1 },
    // Setting-out stakes where each grid line meets the ground.
    { d: join(GRID.map((x) => `M${x - 3} ${GRADE - 3}l6 6M${x + 3} ${GRADE - 3}l-6 6`)), delay: 2 },
    // Bay dimension string with architectural ticks.
    { d: "M150 84H450", weight: "fine", delay: 2 },
    { d: join(GRID.map((x) => `M${x - 4} 88l8 -8`)), delay: 3 },
    // Storey dimension string on the left.
    { d: `M100 ${L1}V${ROOF}`, weight: "fine", delay: 2 },
    { d: join(LEVELS.map((l) => `M96 ${l.y + 4}l8 -8`)), delay: 3 },
    // Datum circles, benchmark, north point.
    { d: join(LEVELS.map((l) => circle(502, l.y, 4))), delay: 3 },
    { d: circle(58, GRADE, 5) + `M58 ${GRADE - 8}V${GRADE + 8}`, delay: 3 },
    { d: circle(56, 58, 14), weight: "fine", delay: 3 },
    { d: "M56 46L61 69L56 64L51 69Z", delay: 3 },
  ],
  labels: [
    ...GRID.map((x, i) => ({ x, y: 41.5, text: GRID_NAMES[i], anchor: "middle" as const, delay: 2 as const })),
    ...BAY_CENTERS.map((x) => ({ x, y: 79, text: `20'-0"`, anchor: "middle" as const, delay: 3 as const })),
    ...LEVELS.flatMap((l) => [
      { x: 512, y: l.y + 3, text: l.name, delay: 3 as const },
      { x: 578, y: l.y + 3, text: l.elev, anchor: "end" as const, delay: 3 as const },
    ]),
    ...[L1, L2, L3].map((y) => ({ x: 95, y: y - 35, text: `14'-0"`, anchor: "middle" as const, rotate: -90, delay: 3 as const })),
    { x: 58, y: GRADE - 13, text: "BM 100.00", anchor: "middle", delay: 3 },
    { x: 56, y: 37, text: "N", anchor: "middle", delay: 3 },
  ],
};

/* ---------------------------------------------------------------------------
 * 02 Foundation (in section)
 * ------------------------------------------------------------------------- */

const SLAB_TOP = L1;
const SLAB_BOTTOM = L1 + 12;
const slab = rect(136, SLAB_TOP, 328, SLAB_BOTTOM - SLAB_TOP);

/** Inverted-T footing: pedestal under the slab, spread pad below. Open at the top. */
function footing(x: number): string {
  return `M${x - 9} ${SLAB_BOTTOM}V424H${x - 28}V440H${x + 28}V424H${x + 9}V${SLAB_BOTTOM}`;
}

const footingsOutline = join(GRID.map(footing));
const footingsClosed = join(GRID.map((x) => `${footing(x)}Z`));
const rebar = join(GRID.flatMap((x) => [-20, -10, 0, 10, 20].map((dx) => circle(x + dx, 435, 1.1))));

const foundation: LayerSpec = {
  key: "foundation",
  fills: [
    { d: slab + footingsClosed, tone: "surface", delay: 0 },
    { d: slab + footingsClosed, tone: "hatch", delay: 1 },
    { d: rebar, tone: "ink", delay: 3 },
  ],
  strokes: [
    { d: slab, weight: "heavy", delay: 0 },
    { d: footingsOutline, weight: "heavy", delay: 1 },
  ],
  labels: [],
};

/* ---------------------------------------------------------------------------
 * 03 Frame
 * ------------------------------------------------------------------------- */

/** Column sides for one storey, drawn upward from floor to the plate above. */
function columns(bottom: number, top: number): string {
  return join(GRID.map((x) => `M${x - 6} ${bottom}V${top}M${x + 6} ${bottom}V${top}`));
}

/** Floor plate edge with the beam soffits between columns. */
function floorPlate(y: number): string {
  const plate = rect(140, y, 320, PLATE);
  const beams = join(GRID.slice(0, -1).map((x, i) => `M${x + 6} ${y + PLATE + BEAM}H${GRID[i + 1] - 6}`));
  return plate + beams;
}

const frame: LayerSpec = {
  key: "frame",
  fills: [],
  strokes: [
    // Base plates on the slab.
    { d: join(GRID.map((x) => `M${x - 10} ${L1}V${L1 - 3}H${x + 10}V${L1}`)), delay: 0 },
    // The frame rises a storey at a time.
    { d: columns(L1, L2 + PLATE), delay: 0 },
    { d: floorPlate(L2), delay: 1 },
    { d: columns(L2, L3 + PLATE), delay: 1 },
    { d: floorPlate(L3), delay: 2 },
    { d: columns(L3, ROOF + PLATE), delay: 2 },
    { d: floorPlate(ROOF), delay: 3 },
  ],
  labels: [],
};

/* ---------------------------------------------------------------------------
 * 04 Finish
 * ------------------------------------------------------------------------- */

const WALL_LEFT = 134;
const WALL_RIGHT = 466;
const PLINTH_TOP = L1 - 8;
const CORNICE_TOP = 142;

// Ground floor: two side windows and the entrance in the centre bay.
const groundWindows = [BAY_CENTERS[0], BAY_CENTERS[2]];
const groundGlass = join(groundWindows.map((cx) => rect(cx - 20, 330, 40, 30)));
const groundFrames = join(
  groundWindows.map(
    (cx) => rect(cx - 20, 330, 40, 30) + `M${cx} 360V330M${cx - 20} 340H${cx + 20}M${cx - 24} 363H${cx + 24}`,
  ),
);

const DOOR_X = BAY_CENTERS[1];
const doorGlass = `M${DOOR_X - 16} ${L1}V344A16 16 0 0 1 ${DOOR_X + 16} 344V${L1}Z`;
const fanlightSpokes = join(
  [45, 90, 135].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M${n(DOOR_X - Math.cos(a) * 6)} ${n(344 - Math.sin(a) * 6)}L${n(DOOR_X - Math.cos(a) * 16)} ${n(344 - Math.sin(a) * 16)}`;
  }),
);
const entrance =
  // Surround (also returns the plinth), door leaves, fanlight.
  `M${DOOR_X - 20} ${L1}V344A20 20 0 0 1 ${DOOR_X + 20} 344V${L1}` +
  `M${DOOR_X - 16} ${L1}V344A16 16 0 0 1 ${DOOR_X + 16} 344V${L1}` +
  `M${DOOR_X} ${L1}V344M${DOOR_X - 16} 344H${DOOR_X + 16}` +
  `M${DOOR_X - 6} 344A6 6 0 0 1 ${DOOR_X + 6} 344` +
  fanlightSpokes;

// Second floor: square-headed windows with a sill and a double head moulding.
const midGlass = join(BAY_CENTERS.map((cx) => rect(cx - 20, 262, 40, 34)));
const midFrames = join(
  BAY_CENTERS.map(
    (cx) =>
      rect(cx - 20, 262, 40, 34) +
      `M${cx} 296V262M${cx - 20} 273H${cx + 20}` +
      `M${cx - 24} 296V300H${cx + 24}V296` +
      `M${cx - 24} 258H${cx + 24}M${cx - 26} 255H${cx + 26}`,
  ),
);

// Top floor: round-headed windows.
function archWindow(cx: number): string {
  return `M${cx - 18} 228V206A18 18 0 0 1 ${cx + 18} 206V228Z`;
}
const topGlass = join(BAY_CENTERS.map(archWindow));
const topFrames = join(
  BAY_CENTERS.map(
    (cx) =>
      archWindow(cx) +
      `M${cx} 228V188M${cx - 18} 206H${cx + 18}` +
      `M${cx - 22} 228V232H${cx + 22}V228` +
      `M${cx - 22} 206A22 22 0 0 1 ${cx + 22} 206`,
  ),
);

// Band courses tie the facade to the floor plates.
const bandCourses = join(UPPER_LEVELS.map((y) => `M${WALL_LEFT} ${y}H${WALL_RIGHT}M${WALL_LEFT} ${y + PLATE}H${WALL_RIGHT}`));

// Cornice: frieze, dentil course, corona, crowning moulding.
const dentils = join(
  Array.from({ length: 41 }, (_, i) => WALL_LEFT + 4 + i * 8).map((x) => `M${x} 158V154H${x + 4}V158`),
);
const cornice =
  `M${WALL_LEFT} 158H${WALL_RIGHT}` +
  rect(126, 146, 348, 8) +
  `M122 146V${CORNICE_TOP}H478V146`;

// Crown ornament: a shell and paired C-scrolls on a small pedestal, centred on the roof.
const ORN_X = 300;
const ORN_Y = CORNICE_TOP;
function o(dx: number, dy: number): string {
  return `${n(ORN_X + dx)} ${n(ORN_Y + dy)}`;
}
const shellRibs = join(
  [30, 60, 90, 120, 150].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M${o(Math.cos(a) * 3.5, -3 - Math.sin(a) * 3.5)}L${o(Math.cos(a) * 12, -3 - Math.sin(a) * 12)}`;
  }),
);
function scroll(side: 1 | -1): string {
  const s = (v: number) => v * side;
  return (
    `M${o(s(12), -3)}C${o(s(19), -3)} ${o(s(25), -7)} ${o(s(25), -13)}` +
    `C${o(s(25), -19)} ${o(s(19), -21)} ${o(s(16.5), -17.5)}` +
    `C${o(s(14.5), -14.5)} ${o(s(17.5), -12)} ${o(s(19.5), -14.5)}`
  );
}
function leaf(side: 1 | -1): string {
  const s = (v: number) => v * side;
  return `M${o(s(15), 0)}C${o(s(20), -1)} ${o(s(27), 0)} ${o(s(32), -4)}C${o(s(27), -6)} ${o(s(21), -4)} ${o(s(17), -1)}`;
}
const ornament: StrokeSpec[] = [
  { d: `M${o(-15, 0)}V${n(ORN_Y - 3)}H${n(ORN_X + 15)}V${n(ORN_Y)}`, delay: 2 },
  { d: `M${o(-12, -3)}A12 12 0 0 1 ${o(12, -3)}` + shellRibs, delay: 3 },
  { d: scroll(1) + scroll(-1) + leaf(1) + leaf(-1), delay: 3 },
  {
    d: `M${o(0, -15)}C${o(2.6, -18.5)} ${o(2.6, -22.5)} ${o(0, -26)}C${o(-2.6, -22.5)} ${o(-2.6, -18.5)} ${o(0, -15)}` + circle(ORN_X, ORN_Y - 29.5, 1.4),
    delay: 4,
  },
];

const finish: LayerSpec = {
  key: "finish",
  fills: [{ d: groundGlass + doorGlass + midGlass + topGlass, tone: "tint", delay: 2 }],
  strokes: [
    // Walls rise from the plinth to the frieze.
    { d: `M${WALL_LEFT} ${PLINTH_TOP}V158M${WALL_RIGHT} ${PLINTH_TOP}V158`, delay: 0 },
    {
      d: `M128 ${L1}V${PLINTH_TOP}H${DOOR_X - 20}M${DOOR_X + 20} ${PLINTH_TOP}H472V${L1}`,
      delay: 0,
    },
    { d: bandCourses, delay: 1 },
    { d: groundFrames + entrance, delay: 1 },
    { d: midFrames, delay: 2 },
    { d: topFrames, delay: 2 },
    { d: cornice, delay: 3 },
    { d: dentils, weight: "fine", delay: 3 },
  ],
  labels: [],
  ornament,
};

export const LAYERS: readonly LayerSpec[] = [survey, foundation, frame, finish];
export const LAYER_COUNT = LAYERS.length;
