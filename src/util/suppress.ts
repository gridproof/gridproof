/**
 * Suppression matching (spec §8). Two layers:
 *  - inline `data-gp-ignore` on an element → skip its subtree for the listed
 *    rules (or all rules when the attribute is empty). Computed in-page by the
 *    collector (ancestor climb) and delivered as {@link IgnoreSpec} per element.
 *  - config `suppress` list: `{selector, rules?}` (folded into the in-page
 *    `IgnoreSpec` via {@link suppressSelectorsFromConfig}) and `{value, reason?}`
 *    (matched here against a violation's computed value).
 *
 * Suppressed findings are counted, never listed.
 */

import type { RuleId, Suppression } from "../config/schema.js";

/**
 * Effective suppression for an element:
 *  - `null`   → nothing suppressed
 *  - `"all"`  → every rule suppressed
 *  - `RuleId[]` → only the listed rules suppressed
 */
export type IgnoreSpec = null | "all" | string[];

/** A selector-form suppression, flattened for the in-page matcher. */
export interface SuppressSelector {
  selector: string;
  /** true when no `rules` were given (suppress all rules for matches). */
  all: boolean;
  rules: string[];
}

/** Extract selector-form entries from config for in-page matching. */
export function suppressSelectorsFromConfig(
  suppress: readonly Suppression[],
): SuppressSelector[] {
  const out: SuppressSelector[] = [];
  for (const s of suppress) {
    if ("selector" in s) {
      out.push({
        selector: s.selector,
        all: s.rules === undefined,
        rules: s.rules ?? [],
      });
    }
  }
  return out;
}

/** Set of computed values suppressed by config `{value}` entries. */
export function suppressedValues(
  suppress: readonly Suppression[],
): Set<string> {
  const set = new Set<string>();
  for (const s of suppress) {
    if ("value" in s) set.add(s.value);
  }
  return set;
}

/** Whether `ruleId` is covered by an element's {@link IgnoreSpec}. */
export function ruleIgnored(ignore: IgnoreSpec, ruleId: RuleId): boolean {
  if (ignore === null) return false;
  if (ignore === "all") return true;
  return ignore.includes(ruleId);
}

/** Whether a single violation is suppressed (inline/selector ignore OR value). */
export function isViolationSuppressed(args: {
  ignore: IgnoreSpec;
  ruleId: RuleId;
  actual: string;
  values: ReadonlySet<string>;
}): boolean {
  return (
    ruleIgnored(args.ignore, args.ruleId) || args.values.has(args.actual)
  );
}
