import type { Violation } from "../../report/schema.js";
import { nearestInScale } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * canonical-size (spec §7.3, v1.3).
 *  - Icons: a rendered box must be near a canonical size (0.6px tolerance, so
 *    subpixel sizes like 24.5px are not flagged). Icons below `minIconSize`
 *    (default 10) are decorative sprites/glyphs and are skipped. Tap targets are
 *    never treated as icons (handled in the collector).
 *  - Interactive tap targets (mobile viewports only): min(width, height) ≥
 *    `minTapTarget` (44) else `error` with a WCAG 2.5.8 note.
 */

function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(1))}px`;
}

export const canonicalSizeRule: Rule = {
  id: "canonical-size",
  check(ctx: RuleContext): Violation[] {
    const {
      canonicalSizes,
      minTapTarget,
      tapTargetBreakpoint,
      minIconSize,
      iconTolerance,
      iconAspectRatioMax,
    } = ctx.config;
    const interactiveSeverity = ctx.config.rules["canonical-size"] ?? "error";
    const violations: Violation[] = [];

    // Anchor tolerance: an icon size is valid when within ±iconTolerance (default
    // 2px) of ANY canonical anchor. Real icon sets (lucide/heroicons) use 18/22/26
    // routinely, so strict set membership over-flags; tolerance catches true drift
    // (e.g. 37 → 40) without nagging, and also absorbs subpixel rendering. The
    // floor is applied per-dimension so a thin icon's small side isn't flagged.
    const withinAnchor = (v: number): boolean =>
      canonicalSizes.some((a) => Math.abs(v - a) <= iconTolerance); // inclusive ±tol
    const offCanonical = (v: number): boolean =>
      v >= minIconSize && !withinAnchor(v);

    // WCAG 2.5.8 (44px) is a TOUCH criterion — irrelevant for desktop pointer
    // nav. Tap-target checks run only below the mobile breakpoint; icon checks
    // run at every viewport.
    const checkTapTargets = ctx.viewport.width < tapTargetBreakpoint;

    for (const el of ctx.elements) {
      const w = el.rect.width;
      const h = el.rect.height;

      // Icons — dimensions must be near-canonical (per-dimension floor applied).
      // Wordmark guard: a far-from-square icon (e.g. a 62×18 logo) is a wordmark,
      // not a 62px icon — skip the canonical judgment.
      const minSide = Math.min(w, h);
      const isWordmark =
        minSide <= 0 || Math.max(w, h) / minSide > iconAspectRatioMax;
      if (el.isIcon && !isWordmark) {
        const wOff = offCanonical(w);
        const hOff = offCanonical(h);
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

      // Interactive — tap target must meet the minimum (mobile viewports only).
      if (checkTapTargets && el.isTapTarget && w > 0 && h > 0) {
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
