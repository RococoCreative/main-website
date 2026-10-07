/**
 * LeadFlowDemo scenario data: one illustrative inquiry played two ways.
 *
 * Everything here is a made-up example (no real client, no statistics). The UI
 * labels it "Illustrative scenario" and the caption notes that response systems
 * are configured for each client.
 *
 * TODO: Rococo to confirm the channels (email and text), tools (CRM routing,
 * AI-assisted reply from approved templates), and the monthly scorecard match
 * the response systems it configures before launch.
 */

export const STAGES = [
  { id: "search", label: "Search" },
  { id: "website", label: "Website" },
  { id: "inquiry", label: "Inquiry" },
  { id: "response", label: "First response" },
  { id: "crm", label: "CRM" },
  { id: "walkthrough", label: "Walkthrough" },
  { id: "proposal", label: "Proposal" },
] as const;

export type ModeId = "without" | "with";

/** Visual and textual state of one pipeline stage. */
export type NodeState = "pending" | "done" | "late" | "lost";
/** State of the hairline between stage i and stage i + 1. */
export type LinkState = "idle" | "traced" | "waiting" | "broken" | "dim";
/** live: moving through the pipeline. stalled: waiting. stopped: the lead went nowhere. */
export type TokenKind = "live" | "stalled" | "stopped";

export type NodeView = { state: NodeState; note: string };
export type LinkView = { state: LinkState; note: string };
export type TokenView = { at: number; kind: TokenKind };

export type ScenarioEvent = {
  id: string;
  /** Shown in mono caps in the log, e.g. "Tue 7:42 PM". */
  time: string;
  /** Read by screen readers in place of the abbreviated time. */
  spoken: string;
  text: string;
  /** Milliseconds before this event appears during animated playback. */
  delay: number;
  /** Stage updates, keyed by stage index. */
  nodes?: Record<number, NodeView>;
  /** Link updates, keyed by the index of the stage the link leaves. */
  links?: Record<number, LinkView>;
  token?: TokenView;
};

export type Scenario = {
  id: ModeId;
  letter: string;
  label: string;
  events: ScenarioEvent[];
  outcome: string;
  outcomeTone: "lost" | "won";
  outcomeDelay: number;
};

const done = (note: string): NodeView => ({ state: "done", note });
const traced: LinkView = { state: "traced", note: "" };
const dim: LinkView = { state: "dim", note: "" };

/* The first two steps are identical in both modes: same search, same website. */
const search: ScenarioEvent = {
  id: "search",
  time: "Tue 7:20 PM",
  spoken: "Tuesday, 7:20 PM",
  text: "An owner's rep searches for a commercial contractor for a 12,000 sq ft office build-out.",
  delay: 350,
  nodes: { 0: done("Found") },
  token: { at: 0, kind: "live" },
};

const website: ScenarioEvent = {
  id: "website",
  time: "Tue 7:34 PM",
  spoken: "Tuesday, 7:34 PM",
  text: "They find your website, review your office projects, and open the contact form.",
  delay: 1500,
  nodes: { 1: done("Visited") },
  links: { 0: traced },
  token: { at: 1, kind: "live" },
};

const withoutSystem: Scenario = {
  id: "without",
  letter: "A",
  label: "Without a system",
  outcome: "Lost before the first conversation.",
  outcomeTone: "lost",
  outcomeDelay: 1500,
  events: [
    search,
    website,
    {
      id: "inquiry",
      time: "Tue 7:42 PM",
      spoken: "Tuesday, 7:42 PM",
      text: "The inquiry lands in a shared inbox after hours. No one is assigned to answer it.",
      delay: 1500,
      nodes: { 2: done("Received") },
      links: { 1: traced, 2: { state: "waiting", note: "Waiting in inbox" } },
      token: { at: 2, kind: "live" },
    },
    {
      id: "seen",
      time: "Wed 9:42 AM",
      spoken: "Wednesday, 9:42 AM",
      text: "Someone opens the shared inbox and forwards the inquiry to an estimator, 14 hours after it arrived.",
      delay: 2800,
      nodes: { 3: { state: "late", note: "14 h late" } },
      links: { 2: { state: "broken", note: "Waiting in inbox: 14 hours" } },
      token: { at: 3, kind: "stalled" },
    },
    {
      id: "voicemail",
      time: "Wed 2:30 PM",
      spoken: "Wednesday, 2:30 PM",
      text: "The estimator calls back and gets voicemail. No email follows.",
      delay: 1900,
      nodes: { 3: { state: "late", note: "Voicemail" } },
      token: { at: 3, kind: "stalled" },
    },
    {
      id: "competitor",
      time: "Thu 10:00 AM",
      spoken: "Thursday, 10:00 AM",
      text: "The owner's rep has already scheduled a walkthrough with a competitor who responded first.",
      delay: 2000,
      nodes: { 5: { state: "lost", note: "Lost" }, 6: { state: "lost", note: "Lost" } },
      links: { 3: dim, 4: dim, 5: dim },
      token: { at: 3, kind: "stopped" },
    },
    {
      id: "untracked",
      time: "Month end",
      spoken: "At month end",
      text: "The inquiry was never logged, so it never shows up in a report. No one sees what it cost.",
      delay: 1900,
      nodes: { 4: { state: "lost", note: "Not logged" } },
    },
  ],
};

const withSystem: Scenario = {
  id: "with",
  letter: "B",
  label: "With a Rococo system",
  outcome: "Walkthrough booked. Opportunity tracked to proposal.",
  outcomeTone: "won",
  outcomeDelay: 1500,
  events: [
    search,
    website,
    {
      id: "inquiry",
      time: "Tue 7:42 PM",
      spoken: "Tuesday, 7:42 PM",
      text: "The inquiry is captured with project type, size, location, and timeline.",
      delay: 1500,
      nodes: { 2: done("Captured") },
      links: { 1: traced },
      token: { at: 2, kind: "live" },
    },
    {
      id: "reply",
      time: "Tue 7:43 PM",
      spoken: "Tuesday, 7:43 PM",
      text: "An AI-assisted reply, written from approved templates, goes out by email and text with three scoping questions and a booking link.",
      delay: 1000,
      nodes: { 3: done("1 minute") },
      links: { 2: traced },
      token: { at: 3, kind: "live" },
    },
    {
      id: "crm",
      time: "Tue 7:43 PM",
      spoken: "Tuesday, 7:43 PM",
      text: "The lead is created in the CRM, tagged as an office build-out of 12,000 sq ft, and routed to the estimator.",
      delay: 1000,
      nodes: { 4: done("Routed") },
      links: { 3: traced },
      token: { at: 4, kind: "live" },
    },
    {
      id: "summary",
      time: "Wed 8:00 AM",
      spoken: "Wednesday, 8:00 AM",
      text: "The estimator reviews a one-paragraph summary of the project and the scoping answers.",
      delay: 1800,
      nodes: { 4: done("Reviewed") },
      token: { at: 4, kind: "live" },
    },
    {
      id: "walkthrough",
      time: "Thu 9:00 AM",
      spoken: "Thursday, 9:00 AM",
      text: "Walkthrough on site, booked from the first reply. Reminders went out automatically the day before.",
      delay: 1800,
      nodes: { 5: done("Booked") },
      links: { 4: traced },
      token: { at: 5, kind: "live" },
    },
    {
      id: "scorecard",
      time: "Month end",
      spoken: "At month end",
      text: "Follow-up runs on schedule through the proposal, and the opportunity appears on the monthly scorecard.",
      delay: 1800,
      nodes: { 6: done("Tracked") },
      links: { 5: traced },
      token: { at: 6, kind: "live" },
    },
  ],
};

export const SCENARIOS: Record<ModeId, Scenario> = {
  without: withoutSystem,
  with: withSystem,
};

/** Toggle order: the problem first, then the system that fixes it. */
export const MODE_ORDER: readonly ModeId[] = ["without", "with"];

/**
 * Links that carry a text label in any scenario. The vertical layout reserves
 * a line for these so the label never pushes content down mid-playback.
 */
export const LABELLED_LINKS: readonly boolean[] = STAGES.slice(1).map((_, i) =>
  MODE_ORDER.some((mode) => SCENARIOS[mode].events.some((event) => Boolean(event.links?.[i]?.note))),
);
