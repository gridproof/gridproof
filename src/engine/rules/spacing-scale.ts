import type { CollectedComputed } from "../collector.js";
import { sourceHint } from "../../report/source-hint.js";
import type { Violation } from "../../report/schema.js";
import { isOnGrid, nearestMultiple } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * spacing-scale (spec §7.3). For each computed margin/padding/gap px value
 * v > 0: valid iff it is within 0.6px of a multiple of `baseUnit`, OR within
 * 0.6px of a value in `allowedValues` (default [1, 2] for borders/hairlines).
 * Only concrete px values are judged — 0, `auto`, `%`, and viewport units are
 * ignored (they never reach here as parseable px). Violations carry the nearest
 * valid multiple in `expected`.
 */

const TOLERANCE = 0.6;

/** Computed longhands we judge, mapped to their CSS property labels. */
const JUDGED: ReadonlyArray<readonly [keyof CollectedComputed, string]> = [
  ["marginTop", "margin-top"],
  ["marginRight", "margin-right"],
  ["marginBottom", "margin-bottom"],
  ["marginLeft", "margin-left"],
  ["paddingTop", "padding-top"],
  ["paddingRight", "padding-right"],
  ["paddingBottom", "padding-bottom"],
  ["paddingLeft", "padding-left"],
  ["rowGap", "row-gap"],
  ["columnGap", "column-gap"],
];

/** Parse a concrete `"13px"` value; null for 0, `auto`, `normal`, `%`, vw/vh, etc. */
function parseConcretePx(value: string): number | null {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(value.trim());
  if (m === null) return null;
  const n = Number.parseFloat(m[1] as string);
  return n > 0 ? n : null;
}

function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(3))}px`;
}

export const spacingScaleRule: Rule = {
  id: "spacing-scale",
  check(ctx: RuleContext): Violation[] {
    const { baseUnit, allowedValues } = ctx.config;
    const severity = ctx.config.rules["spacing-scale"] ?? "warn";
    const violations: Violation[] = [];

    for (const el of ctx.elements) {
      for (const [key, label] of JUDGED) {
        const raw = el.computed[key];
        const v = parseConcretePx(raw);
        if (v === null) continue;

        const onScale = isOnGrid(v, baseUnit, TOLERANCE);
        const allowed = allowedValues.some((a) => Math.abs(v - a) < TOLERANCE);
        if (onScale || allowed) continue;

        const expectedPx = nearestMultiple(v, baseUnit);
        const expected = pxStr(expectedPx);
        const actual = pxStr(v);

        violations.push({
          ruleId: "spacing-scale",
          severity,
          selector: el.selector,
          property: label,
          actual,
          expected,
          fixHint: sourceHint(el, label, actual, expected),
          snippet: el.snippet,
        });
      }
    }

    return violations;
  },
};
