import { TAILWIND_SPACING_SCALE_PX } from "../../config/defaults.js";
import type { CollectedComputed, CollectedElement } from "../collector.js";
import { sourceHint } from "../../report/source-hint.js";
import type { Violation } from "../../report/schema.js";
import { isNearAny, isOnGrid, nearestMultiple } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * spacing-scale (spec §7.3, v1.2). For each computed margin/padding/gap px value
 * v > 0: valid iff within 0.6px of a multiple of `baseUnit`, OR on the standard
 * Tailwind spacing scale (so half-steps 6/10/14px pass), OR within 0.6px of a
 * value in `allowedValues` (default [1, 2]). Only concrete px values are judged
 * — 0, `auto`, `%`, and viewport units never parse. Auto-centering horizontal
 * margins (mx-auto) are ignored (spec §7.2 "ignore auto").
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

/**
 * Parse a concrete positive px value. Rejects messy subpixel values that don't
 * land on the 0.5px device grid (e.g. 25.781px, 7.369px from rem-with-nonstandard
 * -root / % / transforms) — those are computed layout artifacts, not authored
 * spacing (spec §7.2 intent).
 */
function parseConcretePx(value: string): number | null {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(value.trim());
  if (m === null) return null;
  const n = Number.parseFloat(m[1] as string);
  if (n <= 0) return null;
  const nearestHalf = Math.round(n * 2) / 2;
  if (Math.abs(n - nearestHalf) >= 0.12) return null; // subpixel noise → skip
  return n;
}

function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(3))}px`;
}

export const spacingScaleRule: Rule = {
  id: "spacing-scale",
  check(ctx: RuleContext): Violation[] {
    const { baseUnit, allowedValues } = ctx.config;
    const severity = ctx.config.rules["spacing-scale"] ?? "warn";

    const offends = (v: number): boolean => {
      const valid =
        isOnGrid(v, baseUnit, TOLERANCE) ||
        isNearAny(v, TAILWIND_SPACING_SCALE_PX, TOLERANCE) ||
        isNearAny(v, allowedValues, TOLERANCE);
      return !valid;
    };

    interface Candidate {
      el: CollectedElement;
      property: string;
      actual: string;
      expected: string;
    }
    const candidates: Candidate[] = [];

    const push = (
      el: CollectedElement,
      property: string,
      v: number,
    ): void => {
      candidates.push({
        el,
        property,
        actual: pxStr(v),
        expected: pxStr(nearestMultiple(v, baseUnit)),
      });
    };

    /** Judge a padding/margin group, collapsing shared off-scale sides. */
    const judgeGroup = (
      el: CollectedElement,
      sides: ReadonlyArray<readonly [keyof CollectedComputed, string]>,
      shorthand: string,
      skipKeys?: ReadonlySet<keyof CollectedComputed>,
    ): void => {
      // Group offending sides by their (string) value, preserving side order.
      const byValue = new Map<number, string[]>();
      for (const [key, label] of sides) {
        if (skipKeys?.has(key)) continue;
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

    const CENTERING_SIDES: ReadonlySet<keyof CollectedComputed> = new Set([
      "marginLeft",
      "marginRight",
    ]);

    for (const el of ctx.elements) {
      judgeGroup(el, PADDING_SIDES, "padding");
      judgeGroup(
        el,
        MARGIN_SIDES,
        "margin",
        el.autoMarginX ? CENTERING_SIDES : undefined,
      );
      for (const [key, label] of GAP_PROPS) {
        const v = parseConcretePx(el.computed[key]);
        if (v !== null && offends(v)) push(el, label, v);
      }
    }

    // Systematic downgrade to "info": an off-grid/off-scale value repeated across
    // ≥3 distinct elements is library-sourced (component-lib tokens the user
    // didn't author and can't fix without forking) — true, but not actionable as
    // a warn. A one-off off-grid value (e.g. authored py-[13px]) stays a warn.
    const SYSTEMATIC_THRESHOLD = 3;
    const elementsByValue = new Map<string, Set<string>>();
    for (const c of candidates) {
      let set = elementsByValue.get(c.actual);
      if (set === undefined) {
        set = new Set<string>();
        elementsByValue.set(c.actual, set);
      }
      set.add(c.el.selector);
    }

    const violations: Violation[] = [];
    for (const c of candidates) {
      const systematic =
        (elementsByValue.get(c.actual)?.size ?? 0) >= SYSTEMATIC_THRESHOLD;
      violations.push({
        ruleId: "spacing-scale",
        severity: systematic ? "info" : severity,
        selector: c.el.selector,
        property: c.property,
        actual: c.actual,
        expected: c.expected,
        fixHint: sourceHint(c.el, c.property, c.actual, c.expected),
        snippet: c.el.snippet,
      });
    }

    return violations;
  },
};
