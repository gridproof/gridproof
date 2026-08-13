import {
  PX_TO_TAILWIND_KEY,
  TAILWIND_SPACING_SCALE_PX,
} from "../../config/defaults.js";
import type { Violation } from "../../report/schema.js";
import { nearestInScale } from "../../util/nearest.js";
import type { CollectedElement } from "../collector.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * gap-consistency (spec §7.3, v1.4 — list-vs-layout aware). Targets a real
 * content LIST: a flex/grid container with ≥3 non-text children and no positive
 * gap, whose ragged inter-sibling distances should be unified under one `gap`.
 * Emits ONE container-level violation.
 *
 * Distinguishes lists from layout wrappers with combined signals (a page-section
 * wrapper spaced 200–2066px apart is structure, not a list):
 *  - absolute ceiling: max distance ≤ `maxListGap` (default 96px);
 *  - order-of-magnitude: max distance ≤ SPREAD_RATIO_MAX × min distance;
 *  - text-majority children (content stack) and overlapping/negative distances
 *    are skipped.
 * Runs only on Tailwind-detected pages (gated in the runner) — a `set gap-N`
 * suggestion is meaningless off-Tailwind.
 */

const TOLERANCE = 0.6;
/** A real ragged list's gaps stay within one order of magnitude. */
const SPREAD_RATIO_MAX = 4;

/** Inline / text-level tags: a container of these is a content stack, not a layout list. */
const TEXT_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "span", "a", "small", "label", "strong", "em", "b", "i", "code",
  "figcaption", "blockquote", "time", "abbr",
]);

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
    const maxListGap = ctx.config.maxListGap;
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

      const rawChildren = childrenByParent.get(container.selector);
      if (rawChildren === undefined) continue;

      // Exclude absolutely-positioned overlays (decorative layers skew distances).
      const children = rawChildren.filter(
        (c) => c.computed.position !== "absolute" && c.computed.position !== "fixed",
      );
      if (children.length < 3) continue;

      // Skip content stacks: a majority of text-level children is a typographic
      // rhythm (heading/body/CTA), not a layout list.
      const textCount = children.filter((c) => TEXT_TAGS.has(c.tagName)).length;
      if (textCount * 2 >= children.length) continue;

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

      const minSib = Math.min(...distances);
      const maxSib = Math.max(...distances);

      // Non-positive distances mean children overlap / use negative margins —
      // not a clean list a single `gap` could unify. Skip (layout wrapper).
      if (minSib <= 0) continue;

      // Absolute ceiling: real list gaps are small; large distances are page
      // structure (sections), not a ragged list gap. Kills layout-wrapper FPs.
      if (maxSib > maxListGap) continue;

      // Order-of-magnitude sanity: children spaced e.g. 28px and 689px are
      // structure, not "an inconsistent list". A real ragged list stays within
      // ~one order of magnitude.
      if (maxSib > SPREAD_RATIO_MAX * minSib) continue;

      const spread = maxSib - minSib;
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
