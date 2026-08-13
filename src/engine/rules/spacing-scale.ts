import type { Rule } from "../rule.js";

/**
 * spacing-scale (spec §7.3) — STUB / extension point.
 *
 * Day 2 will implement: for each computed margin/padding/gap px value v > 0,
 * valid iff (v % baseUnit === 0 after tolerance) OR v ∈ config.allowedValues;
 * violations carry the nearest multiple. No logic in Day 1 raw mode.
 */
export const spacingScaleRule: Rule = {
  id: "spacing-scale",
  check() {
    return [];
  },
};
