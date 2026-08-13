import {
  PX_TO_TAILWIND_KEY,
  TAILWIND_SPACING_SCALE_PX,
} from "../../config/defaults.js";
import type { Violation } from "../../report/schema.js";
import { nearestInScale } from "../../util/nearest.js";
import type { CollectedElement } from "../collector.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * gap-consistency (spec §7.3). For each flex/grid container with ≥3 children on
 * one axis and NO computed `gap`, compute inter-sibling distances from rects. If
 * they differ by more than tolerance AND the spread exceeds `baseUnit`, emit ONE
 * container-level violation (never per-child) suggesting a unified `gap`.
 */

const TOLERANCE = 0.6;

function parsePx(value: string): number | null {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(value.trim());
  return m === null ? null : Number.parseFloat(m[1] as string);
}

function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))}px`;
}

/** True when the container already sets a positive gap (systematic → skip). */
function hasPositiveGap(el: CollectedElement): boolean {
  for (const key of ["gap", "rowGap", "columnGap"] as const) {
    const v = parsePx(el.computed[key]);
    if (v !== null && v > 0) return true;
  }
  return false;
}

export const gapConsistencyRule: Rule = {
  id: "gap-consistency",
  check(ctx: RuleContext): Violation[] {
    const severity = ctx.config.rules["gap-consistency"] ?? "warn";
    const baseUnit = ctx.config.baseUnit;
    const violations: Violation[] = [];

    // Group children by their parent's stable selector.
    const childrenByParent = new Map<string, CollectedElement[]>();
    for (const el of ctx.elements) {
      if (el.parentSelector === null) continue;
      const list = childrenByParent.get(el.parentSelector);
      if (list) list.push(el);
      else childrenByParent.set(el.parentSelector, [el]);
    }

    for (const container of ctx.elements) {
      const display = container.computed.display;
      if (!/flex|grid/.test(display)) continue;
      if (hasPositiveGap(container)) continue;

      const children = childrenByParent.get(container.selector);
      if (children === undefined || children.length < 3) continue;

      const ordered = [...children].sort(
        (a, b) => a.siblingIndex - b.siblingIndex,
      );

      // Infer the main axis from where the children actually spread out.
      const tops = ordered.map((c) => c.rect.top);
      const lefts = ordered.map((c) => c.rect.left);
      const spreadTop = Math.max(...tops) - Math.min(...tops);
      const spreadLeft = Math.max(...lefts) - Math.min(...lefts);
      const axisColumn = spreadTop >= spreadLeft;

      const distances: number[] = [];
      for (let i = 0; i < ordered.length - 1; i++) {
        const cur = ordered[i] as CollectedElement;
        const next = ordered[i + 1] as CollectedElement;
        const d = axisColumn
          ? next.rect.top - cur.rect.bottom
          : next.rect.left - cur.rect.right;
        distances.push(Math.round(d * 2) / 2);
      }

      const spread = Math.max(...distances) - Math.min(...distances);
      if (spread <= TOLERANCE || spread <= baseUnit) continue;

      const mean =
        distances.reduce((s, d) => s + d, 0) / distances.length;
      const suggestedPx = nearestInScale(mean, TAILWIND_SPACING_SCALE_PX);
      const key = PX_TO_TAILWIND_KEY.get(suggestedPx);
      const list = distances.map(pxStr).join(", ");
      const gapClass = key !== undefined ? `gap-${key}` : `gap-[${suggestedPx}px]`;

      violations.push({
        ruleId: "gap-consistency",
        severity,
        selector: container.selector,
        property: "gap",
        actual: list,
        expected: `${suggestedPx}px`,
        fixHint: {
          kind: "container-gap",
          to: gapClass,
          note: `children spaced ${list}; set ${gapClass} on container and remove child margins`,
        },
        snippet: container.snippet,
      });
    }

    return violations;
  },
};
