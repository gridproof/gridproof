import type { Rule } from "../rule.js";

/**
 * arbitrary-value (spec §7.3) — STUB / extension point.
 *
 * Day 2 will implement: regex over classList for Tailwind arbitrary spacing/size
 * classes (p-[13px], w-[347px], gap-[7px]); rem→px (×16); off-scale → suggest
 * nearest Tailwind class; on-scale arbitrary → hygiene warn. No logic in Day 1.
 */
export const arbitraryValueRule: Rule = {
  id: "arbitrary-value",
  check() {
    return [];
  },
};
