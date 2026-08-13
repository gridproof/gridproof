import type { Rule } from "../rule.js";

/**
 * canonical-size (spec §7.3) — STUB / extension point.
 *
 * Day 3 will implement: icons (svg/img-in-link, .icon) must match
 * config.canonicalSizes; interactive elements need min(width,height) ≥
 * minTapTarget else `error` citing WCAG 2.5.8. No logic in Day 1.
 */
export const canonicalSizeRule: Rule = {
  id: "canonical-size",
  check() {
    return [];
  },
};
