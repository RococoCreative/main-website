import type { MethodPhase } from "@/content/method";

/**
 * Plain values shared by the server-rendered scroller and the client stage.
 * (Constants exported from a "use client" module would reach server code as client
 * references, not values, so they live here.)
 */

export type MethodStep = {
  /** Panel element id, e.g. "method-survey". */
  id: string;
  /** "01" */
  index: string;
  /** Construction stage, e.g. "Survey". */
  stage: string;
  /** Marketing phase, e.g. "Audit". */
  name: string;
};

/** The drawing has one layer per phase. Phases beyond this reuse the finished drawing. */
export const METHOD_LAYERS = 4;

/** Marks the scroller root (data-method-root) and each text panel (data-method-panel). */
export const METHOD_ROOT_SELECTOR = "[data-method-root]";
export const METHOD_PANEL_SELECTOR = "[data-method-panel]";

/** In-page anchor for a phase panel, e.g. "method-survey". */
export function phaseId(phase: Pick<MethodPhase, "stage">): string {
  const slug = phase.stage
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `method-${slug}`;
}

export function toSteps(phases: MethodPhase[]): MethodStep[] {
  return phases.map((phase) => ({ id: phaseId(phase), index: phase.index, stage: phase.stage, name: phase.name }));
}
