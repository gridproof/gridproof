/**
 * Suppression matching (spec §8) — STUB / extension point.
 *
 * Day 3 implements: config `suppress` entries (selector/value based) plus inline
 * `data-gp-ignore` handling. Suppressed findings are counted, never listed.
 * Unused in Day 1 raw mode.
 */

import type { Suppression } from "../config/schema.js";

/**
 * Whether a finding is suppressed by config. Day 3.
 * Present as a typed extension point; body throws until implemented.
 */
export function isSuppressed(
  _suppressions: readonly Suppression[],
  _args: { selector: string; ruleId: string; value: string },
): boolean {
  throw new Error("isSuppressed: not implemented (Day 3)");
}
