"use client";

import type { MethodPhase } from "@/content/method";

/** STUB: replaced in the build phase. Scroll-driven construction story. */
export function MethodScroller({ phases }: { phases: MethodPhase[] }) {
  return (
    <ol>
      {phases.map((p) => (
        <li key={p.index}>
          {p.stage}: {p.name}
        </li>
      ))}
    </ol>
  );
}
