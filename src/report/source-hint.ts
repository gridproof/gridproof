/**
 * Source hint (spec §7.4) — STUB / extension point.
 *
 * Day 3 implements best-effort computed→source mapping (arbitrary Tailwind class
 * > standard class > inline style > manual). The server never reads project
 * source files; it only points. Unused in Day 1 raw mode.
 */

import type { FixHint } from "./schema.js";
import type { CollectedElement } from "../engine/collector.js";

/**
 * Map a computed property/value on an element to a likely source fix.
 * Day 3; body throws until implemented.
 */
export function sourceHint(
  _el: CollectedElement,
  _property: string,
  _actual: string,
  _expected: string,
): FixHint {
  throw new Error("sourceHint: not implemented (Day 3)");
}
