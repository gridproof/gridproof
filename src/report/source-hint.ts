/**
 * Source hint (spec §7.4) — best-effort computed→source mapping. The server
 * never reads project files; it only points.
 *
 * Day 2 implements the two branches the current rules need:
 *   (1) an arbitrary Tailwind class on the element explains the value →
 *       `tailwind-class` fix
 *   (4) fallback → `kind: "manual"` with a trace note
 * Branches (2) standard-class-skip and (3) inline-style are minimal but never
 * throw. Full inline-style/standard-class handling lands with later work.
 */

import {
  PX_TO_TAILWIND_KEY,
  TAILWIND_SPACING_SCALE_PX,
} from "../config/defaults.js";
import type { CollectedElement } from "../engine/collector.js";
import {
  parseArbitraryClass,
  parseStandardSpacingClass,
} from "../engine/rules/arbitrary-value.js";
import { nearestInScale } from "../util/nearest.js";
import type { FixHint } from "./schema.js";

const TOLERANCE = 0.6;

/** Parse a `"13px"` computed string to a number, or null. */
function parsePx(value: string): number | null {
  const m = /^(-?\d+(?:\.\d+)?)px$/.exec(value.trim());
  return m === null ? null : Number.parseFloat(m[1] as string);
}

/** CSS family of a property, e.g. "padding-top" → "padding". */
function propertyFamily(property: string): string {
  if (property.startsWith("padding")) return "padding";
  if (property.startsWith("margin")) return "margin";
  if (property.endsWith("gap")) return "gap";
  if (property === "width") return "width";
  if (property === "height") return "height";
  return property;
}

/** Whether an arbitrary-class prefix could plausibly set `property`. */
function prefixExplainsProperty(prefix: string, property: string): boolean {
  const p = prefix.replace(/^-/, "");
  const family = propertyFamily(property);
  switch (family) {
    case "padding":
      return /^p[trblxy]?$/.test(p);
    case "margin":
      return /^m[trblxy]?$/.test(p);
    case "gap":
      return p === "gap" || p.startsWith("space-");
    case "width":
      return p === "w" || p === "size";
    case "height":
      return p === "h" || p === "size";
    default:
      return false;
  }
}

/**
 * Map a computed property/value on an element to a likely source fix.
 * `actual` and `expected` are computed strings like `"13px"` / `"12px"`.
 */
export function sourceHint(
  el: CollectedElement,
  property: string,
  actual: string,
  expected: string,
): FixHint {
  const actualPx = parsePx(actual);

  // (1) An arbitrary Tailwind class on the element explains this value.
  if (actualPx !== null) {
    for (const token of el.classList) {
      const match = parseArbitraryClass(token);
      if (match === null) continue;
      if (
        Math.abs(match.px - actualPx) < TOLERANCE &&
        prefixExplainsProperty(match.prefix, property)
      ) {
        const nearestPx = nearestInScale(match.px, TAILWIND_SPACING_SCALE_PX);
        const key = PX_TO_TAILWIND_KEY.get(nearestPx);
        return {
          kind: "tailwind-class",
          from: token,
          ...(key !== undefined ? { to: `${match.prefix}-${key}` } : {}),
        };
      }
    }
  }

  // (2) A standard Tailwind class explains the value → point at that class
  // instead of proposing an arbitrary/inline change (no extra noise).
  if (actualPx !== null) {
    for (const token of el.classList) {
      const std = parseStandardSpacingClass(token);
      if (std === null) continue;
      if (
        Math.abs(std.px - actualPx) < TOLERANCE &&
        prefixExplainsProperty(std.prefix, property)
      ) {
        return {
          kind: "manual",
          from: token,
          note: `${property} is set by the standard class "${token}"; change that class to reach ${expected}`,
        };
      }
    }
  }

  // (3) Inline style declares the property → css-value fix on the inline style.
  const family = propertyFamily(property);
  if (
    el.styleAttr !== null &&
    (el.styleAttr.includes(property) || el.styleAttr.includes(family))
  ) {
    return {
      kind: "css-value",
      note: `update ${property} in the inline style from ${actual} to ${expected}`,
    };
  }

  // (4) Fallback — the agent greps the codebase itself.
  return {
    kind: "manual",
    note: `trace ${property}:${actual} in stylesheets`,
  };
}
