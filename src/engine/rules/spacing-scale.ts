import type { CollectedComputed, CollectedElement } from "../collector.js";
import { sourceHint } from "../../report/source-hint.js";
import type { Violation } from "../../report/schema.js";
import { isOnGrid, nearestMultiple } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * spacing-scale (spec §7.3). For each computed margin/padding/gap px value
 * v > 0: valid iff it is within 0.6px of a multiple of `baseUnit`, OR within
 * 0.6px of a value in `allowedValues` (default [1, 2]). Only concrete px values
 * are judged — 0, `auto`, `%`, and viewport units never parse and are ignored.
 *
 * Side-collapse (§12 noise reduction): when ≥2 sides of the same box's
 * padding/margin group share the same off-scale value, emit ONE violation with
 * the shorthand property ("padding"/"margin"). Distinct per-side values stay
 * separate.
 */

const TOLERANCE = 0.6;

/** padding/margin side longhands, in T-R-B-L order, with their CSS labels. */
const PADDING_SIDES: ReadonlyArray<readonly [keyof CollectedComputed, string]> = [
  ["paddingTop", "padding-top"],
  ["paddingRight", "padding-right"],
  ["paddingBottom", "padding-bottom"],
  ["paddingLeft", "padding-left"],
];
const MARGIN_SIDES: ReadonlyArray<readonly [keyof CollectedComputed, string]> = [
  ["marginTop", "margin-top"],
  ["marginRight", "margin-right"],
  ["marginBottom", "margin-bottom"],
  ["marginLeft", "margin-left"],
];
const GAP_PROPS: ReadonlyArray<readonly [keyof CollectedComputed, string]> = [
  ["rowGap", "row-gap"],
  ["columnGap", "column-gap"],
];

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

    const offends = (v: number): boolean => {
      const onGrid = isOnGrid(v, baseUnit, TOLERANCE);
      const allowed = allowedValues.some((a) => Math.abs(v - a) < TOLERANCE);
      return !onGrid && !allowed;
    };

    const push = (
      el: CollectedElement,
      property: string,
      v: number,
    ): void => {
      const actual = pxStr(v);
      const expected = pxStr(nearestMultiple(v, baseUnit));
      violations.push({
        ruleId: "spacing-scale",
        severity,
        selector: el.selector,
        property,
        actual,
        expected,
        fixHint: sourceHint(el, property, actual, expected),
        snippet: el.snippet,
      });
    };

    /** Judge a padding/margin group, collapsing shared off-scale sides. */
    const judgeGroup = (
      el: CollectedElement,
      sides: ReadonlyArray<readonly [keyof CollectedComputed, string]>,
      shorthand: string,
    ): void => {
      // Group offending sides by their (string) value, preserving side order.
      const byValue = new Map<number, string[]>();
      for (const [key, label] of sides) {
        const v = parseConcretePx(el.computed[key]);
        if (v === null || !offends(v)) continue;
        const list = byValue.get(v);
        if (list) list.push(label);
        else byValue.set(v, [label]);
      }
      for (const [v, labels] of byValue) {
        if (labels.length >= 2) {
          push(el, shorthand, v); // collapsed shorthand violation
        } else {
          push(el, labels[0] as string, v);
        }
      }
    };

    for (const el of ctx.elements) {
      judgeGroup(el, PADDING_SIDES, "padding");
      judgeGroup(el, MARGIN_SIDES, "margin");
      for (const [key, label] of GAP_PROPS) {
        const v = parseConcretePx(el.computed[key]);
        if (v !== null && offends(v)) push(el, label, v);
      }
    }

    return violations;
  },
};
