import {
  STAGES,
  SCENARIOS,
  type LinkView,
  type ModeId,
  type NodeView,
  type Scenario,
  type TokenView,
} from "./scenario";

/**
 * A small state machine for the demo.
 *   idle     the pipeline is drawn and nothing has happened yet
 *   playing  events are revealed one at a time (`step` = events shown so far)
 *   done     every event and the outcome are shown
 * The outcome counts as the final step, so a scenario has events.length + 1 steps.
 */
export type Phase = "idle" | "playing" | "done";

export type DemoState = { mode: ModeId; phase: Phase; step: number };

export type DemoAction =
  | { type: "select"; mode: ModeId }
  | { type: "play"; mode?: ModeId }
  | { type: "advance" }
  | { type: "finish"; mode?: ModeId };

/**
 * Default to "Without a system": the story reads problem first, matches the
 * left-to-right toggle order, and its outcome offers a one-click run of the
 * Rococo version. Both outcomes are summarised before play, so nothing is lost
 * if a visitor only plays once.
 */
export const DEFAULT_MODE: ModeId = "without";

export const initialState: DemoState = { mode: DEFAULT_MODE, phase: "idle", step: 0 };

export function totalSteps(mode: ModeId): number {
  return SCENARIOS[mode].events.length + 1;
}

export function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "select":
      return action.mode === state.mode ? state : { mode: action.mode, phase: "idle", step: 0 };
    case "play":
      return { mode: action.mode ?? state.mode, phase: "playing", step: 0 };
    case "advance": {
      if (state.phase !== "playing") return state;
      const step = state.step + 1;
      return step >= totalSteps(state.mode) ? { ...state, phase: "done", step } : { ...state, step };
    }
    case "finish": {
      const mode = action.mode ?? state.mode;
      return { mode, phase: "done", step: totalSteps(mode) };
    }
    default:
      return state;
  }
}

/** Pause before the next step appears. The outcome uses its own delay. */
export function stepDelay(scenario: Scenario, step: number): number {
  return step < scenario.events.length ? scenario.events[step].delay : scenario.outcomeDelay;
}

export type ScenarioView = {
  nodes: NodeView[];
  links: LinkView[];
  token: TokenView | null;
};

/** Fold the events shown so far into the pipeline's current picture. */
export function deriveView(scenario: Scenario, step: number): ScenarioView {
  const nodes: NodeView[] = STAGES.map(() => ({ state: "pending", note: "" }));
  const links: LinkView[] = STAGES.slice(1).map(() => ({ state: "idle", note: "" }));
  let token: TokenView | null = null;
  const count = Math.min(step, scenario.events.length);

  for (let i = 0; i < count; i += 1) {
    const event = scenario.events[i];
    if (event.nodes) {
      for (const [index, node] of Object.entries(event.nodes)) nodes[Number(index)] = node;
    }
    if (event.links) {
      for (const [index, link] of Object.entries(event.links)) links[Number(index)] = link;
    }
    if (event.token) token = event.token;
  }

  return { nodes, links, token };
}
