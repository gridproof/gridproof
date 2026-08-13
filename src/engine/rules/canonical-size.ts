import type { Violation } from "../../report/schema.js";
import { nearestInScale } from "../../util/nearest.js";
import type { CollectedElement } from "../collector.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * canonical-size (spec §7.3).
 *  - Icons (svg, img inside button/link, class /icon/i): width & height must be
 *    in `canonicalSizes`; else `warn`, snap to the nearest canonical size.
 *  - Interactive elements (button, a[href], input, [role=button]):
 *    min(width, height) ≥ `minTapTarget` (44); else `error` — the only
 *    default-error rule — with a WCAG 2.5.8 note.
 */

function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))}px`;
}

export const canonicalSizeRule: Rule = {
  id: "canonical-size",
  check(ctx: RuleContext): Violation[] {
    const { canonicalSizes, minTapTarget } = ctx.config;
    // Interactive tap-target severity follows config (default "error").
    const interactiveSeverity = ctx.config.rules["canonical-size"] ?? "error";
    const violations: Violation[] = [];

    const canonicalSet = new Set(canonicalSizes);

    for (const el of ctx.elements) {
      const w = el.rect.width;
      const h = el.rect.height;

      // Icons — dimensions must be canonical.
      if (el.isIcon && (w > 0 || h > 0)) {
        const wOff = w > 0 && !canonicalSet.has(w);
        const hOff = h > 0 && !canonicalSet.has(h);
        if (wOff || hOff) {
          const collapse = wOff && hOff && w === h;
          const primary = wOff ? w : h;
          const property = collapse ? "size" : wOff ? "width" : "height";
          const nearest = nearestInScale(primary, canonicalSizes);
          const detail =
            wOff && hOff && w !== h
              ? ` (width ${pxStr(w)}→${pxStr(nearestInScale(w, canonicalSizes))}, height ${pxStr(h)}→${pxStr(nearestInScale(h, canonicalSizes))})`
              : "";
          violations.push({
            ruleId: "canonical-size",
            severity: "warn",
            selector: el.selector,
            property,
            actual: pxStr(primary),
            expected: pxStr(nearest),
            fixHint: {
              kind: "manual",
              note: `icon ${property} ${pxStr(primary)} is off the canonical scale {${canonicalSizes.join(", ")}}; snap to ${pxStr(nearest)}${detail}`,
            },
            snippet: el.snippet,
          });
        }
      }

      // Interactive — tap target must meet the minimum.
      if (el.isInteractive && w > 0 && h > 0) {
        const min = Math.min(w, h);
        if (min < minTapTarget) {
          const property = w <= h ? "width" : "height";
          violations.push({
            ruleId: "canonical-size",
            severity: interactiveSeverity,
            selector: el.selector,
            property,
            actual: pxStr(min),
            expected: pxStr(minTapTarget),
            fixHint: {
              kind: "manual",
              note: `interactive target is ${pxStr(min)}, below the ${pxStr(minTapTarget)} minimum tap size (WCAG 2.5.8); enlarge to at least ${pxStr(minTapTarget)}`,
            },
            snippet: el.snippet,
          });
        }
      }
    }

    return violations;
  },
};
