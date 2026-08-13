import {
  PX_TO_TAILWIND_KEY,
  TAILWIND_SPACING_PX,
  TAILWIND_SPACING_SCALE_PX,
} from "../../config/defaults.js";
import type { Violation } from "../../report/schema.js";
import { isNearAny, isOnGrid, nearestInScale } from "../../util/nearest.js";
import type { Rule, RuleContext } from "../rule.js";

/**
 * arbitrary-value (spec §7.3, v1.3 — SPACING only). Reads `classList` for
 * Tailwind arbitrary SPACING classes (m/p/gap/space/inset/top/right/bottom/left),
 * rem→px (×16), and flags only genuine drift:
 *  - off-grid AND off-scale → warn with the nearest Tailwind class;
 *  - on a named step → quiet hygiene rename (same value);
 *  - on-grid but unnamed → nothing.
 *
 * SIZE props (w, h, size, min-w/max-w, min-h/max-h) are OUT of scope: a concrete
 * dimension like `w-[350px]` or `h-[62px]` is a deliberate choice, never drift
 * (generalization: the single biggest FP source, 458). border-radius is also out
 * of scope. Never emits a fixHint.to that isn't a real Tailwind class.
 */

/** Groups: 1=prefix, 2=number, 3=unit. SIZE + rounded prefixes intentionally excluded. */
export const ARBITRARY_CLASS_RE =
  /(?:^|:)(-?(?:[mp][trblxy]?|gap|space-[xy]|inset|top|right|bottom|left))-\[(\d+(?:\.\d+)?)(px|rem)\]/;

const SPACING_PREFIX_RE =
  /^-?(?:[mp][trblxy]?|gap|space-[xy]|inset|top|right|bottom|left)$/;

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
  if (p.startsWith("min-")) return p === "min-w" ? "min-width" : "min-height";
  if (p.startsWith("max-")) return p === "max-w" ? "max-width" : "max-height";
  if (["inset", "top", "right", "bottom", "left"].includes(p)) return p;
  return p;
}

/** True only for real Tailwind spacing class keys (guards fixHint.to). */
function isKnownTailwindKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(TAILWIND_SPACING_PX, key);
}

export const arbitraryValueRule: Rule = {
  id: "arbitrary-value",
  check(ctx: RuleContext): Violation[] {
    const severity = ctx.config.rules["arbitrary-value"] ?? "warn";
    const baseUnit = ctx.config.baseUnit;
    const scale = TAILWIND_SPACING_SCALE_PX;
    const violations: Violation[] = [];

    for (const el of ctx.elements) {
      for (const token of el.classList) {
        const match = parseArbitraryClass(token);
        if (match === null) continue;

        const prefix = match.prefix;
        const property = prefixToProperty(prefix);
        const px = match.px;

        // SIZE / rounded prefixes never reach here (excluded from the regex);
        // guard anyway so only spacing is judged.
        if (!SPACING_PREFIX_RE.test(prefix)) continue;

        const onGrid = isOnGrid(px, baseUnit);
        const onScale = isNearAny(px, scale);

        if (!onGrid && !onScale) {
          // Genuine off-grid, off-scale drift → suggest nearest named class.
          const nearestPx = nearestInScale(px, scale);
          const key = PX_TO_TAILWIND_KEY.get(nearestPx);
          const valid = key !== undefined && isKnownTailwindKey(key);
          violations.push({
            ruleId: "arbitrary-value",
            severity,
            selector: el.selector,
            property,
            actual: pxStr(px),
            expected: pxStr(nearestPx),
            fixHint: valid
              ? { kind: "tailwind-class", from: token, to: `${prefix}-${key}` }
              : {
                  kind: "manual",
                  from: token,
                  note: `off-scale spacing ${pxStr(px)}; nearest scale value ${pxStr(nearestPx)}`,
                },
            snippet: el.snippet,
          });
          continue;
        }

        // On a named step → quiet hygiene rename (same value, no size change).
        const selfKey = PX_TO_TAILWIND_KEY.get(px);
        if (selfKey !== undefined && isKnownTailwindKey(selfKey)) {
          violations.push({
            ruleId: "arbitrary-value",
            severity: "warn",
            selector: el.selector,
            property,
            actual: pxStr(px),
            expected: pxStr(px),
            fixHint: {
              kind: "tailwind-class",
              from: token,
              to: `${prefix}-${selfKey}`,
              note: "arbitrary value is on-scale; use the named Tailwind class",
            },
            snippet: el.snippet,
          });
        }
        // on-grid but not a named step (e.g. p-[60px]) → no finding.
      }
    }

    return violations;
  },
};
