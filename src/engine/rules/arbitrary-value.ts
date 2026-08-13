import {
  PX_TO_TAILWIND_KEY,
  TAILWIND_SPACING_PX,
  TAILWIND_SPACING_SCALE_PX,
} from "../../config/defaults.js";
import type { Violation } from "../../report/schema.js";
import { nearestInScale } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * arbitrary-value (spec §7.3). Reads `classList` (NOT computed geometry) for
 * Tailwind arbitrary spacing/size classes like `p-[13px]`, `w-[347px]`,
 * `gap-[7px]`, converts rem→px (×16), and:
 *  - off-scale → `tailwind-class` fix to the nearest standard class
 *  - on-scale (e.g. `p-[16px]`) → hygiene `warn` to the named class (`p-4`)
 */

/** Exact regex from spec §7.3. Groups: 1=prefix, 2=number, 3=unit. */
export const ARBITRARY_CLASS_RE =
  /(?:^|:)(-?(?:[mp][trblxy]?|gap|space-[xy]|w|h|size|inset|top|right|bottom|left|rounded(?:-[a-z]+)?))-\[(\d+(?:\.\d+)?)(px|rem)\]/;

export interface ArbitraryMatch {
  /** The whole class token, e.g. `md:p-[13px]`. */
  token: string;
  /** Utility prefix, e.g. `p`, `py`, `w`, `gap`, `rounded-tl`. */
  prefix: string;
  /** Resolved pixel value (rem already ×16). */
  px: number;
  /** Original unit as written. */
  unit: "px" | "rem";
}

/** A standard (non-arbitrary) Tailwind spacing class, e.g. `p-3` → 12px. */
export interface StandardMatch {
  prefix: string;
  key: string;
  px: number;
}

const STANDARD_CLASS_RE =
  /^(-?(?:[mp][trblxy]?|gap|space-[xy]|w|h|size|inset|top|right|bottom|left))-(px|\d+(?:\.\d+)?)$/;

/** Parse a standard Tailwind spacing class token; null if not one. */
export function parseStandardSpacingClass(token: string): StandardMatch | null {
  const m = STANDARD_CLASS_RE.exec(token);
  if (m === null) return null;
  const prefix = m[1] as string;
  const key = m[2] as string;
  const px = TAILWIND_SPACING_PX[key];
  if (px === undefined) return null;
  return { prefix, key, px };
}

/** Parse a single class token; null if it is not an arbitrary spacing/size class. */
export function parseArbitraryClass(token: string): ArbitraryMatch | null {
  const m = ARBITRARY_CLASS_RE.exec(token);
  if (m === null) return null;
  const prefix = m[1] as string;
  const num = Number.parseFloat(m[2] as string);
  const unit = m[3] as "px" | "rem";
  const px = unit === "rem" ? num * 16 : num;
  return { token, prefix, px, unit };
}

/** Format a px number as a CSS string, dropping trailing `.0`. */
function pxStr(n: number): string {
  return `${Number.isInteger(n) ? n : Number(n.toFixed(3))}px`;
}

/** Map a utility prefix to a human-facing CSS property label. */
function prefixToProperty(prefix: string): string {
  const p = prefix.replace(/^-/, "");
  if (/^m[trblxy]?$/.test(p)) return "margin";
  if (/^p[trblxy]?$/.test(p)) return "padding";
  if (p === "w") return "width";
  if (p === "h") return "height";
  if (p === "size") return "size";
  if (p === "gap") return "gap";
  if (p.startsWith("space-")) return "gap";
  if (p.startsWith("rounded")) return "border-radius";
  if (["inset", "top", "right", "bottom", "left"].includes(p)) return p;
  return p;
}

export const arbitraryValueRule: Rule = {
  id: "arbitrary-value",
  check(ctx: RuleContext): Violation[] {
    const severity = ctx.config.rules["arbitrary-value"] ?? "warn";
    const scale = TAILWIND_SPACING_SCALE_PX;
    const violations: Violation[] = [];

    for (const el of ctx.elements) {
      for (const token of el.classList) {
        const match = parseArbitraryClass(token);
        if (match === null) continue;

        const property = prefixToProperty(match.prefix);
        const onScale = scale.includes(match.px);

        if (onScale) {
          // Style hygiene: value is fine, but a named class is preferred.
          const key = PX_TO_TAILWIND_KEY.get(match.px);
          if (key === undefined) continue;
          violations.push({
            ruleId: "arbitrary-value",
            severity: "warn",
            selector: el.selector,
            property,
            actual: pxStr(match.px),
            expected: pxStr(match.px),
            fixHint: {
              kind: "tailwind-class",
              from: token,
              to: `${match.prefix}-${key}`,
              note: "arbitrary value is on-scale; use the named Tailwind class",
            },
            snippet: el.snippet,
          });
        } else {
          const nearestPx = nearestInScale(match.px, scale);
          const key = PX_TO_TAILWIND_KEY.get(nearestPx);
          if (key === undefined) continue;
          violations.push({
            ruleId: "arbitrary-value",
            severity,
            selector: el.selector,
            property,
            actual: pxStr(match.px),
            expected: pxStr(nearestPx),
            fixHint: {
              kind: "tailwind-class",
              from: token,
              to: `${match.prefix}-${key}`,
            },
            snippet: el.snippet,
          });
        }
      }
    }

    return violations;
  },
};
