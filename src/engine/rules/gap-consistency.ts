import type { Rule } from "../rule.js";

/**
 * gap-consistency (spec §7.3) — STUB / extension point.
 *
 * Day 3 will implement: for each flex/grid container with ≥3 children on one
 * axis and no computed `gap`, flag ragged inter-sibling distances with a single
 * container-level violation (never per-child). No logic in Day 1.
 */
export const gapConsistencyRule: Rule = {
  id: "gap-consistency",
  check() {
    return [];
  },
};
