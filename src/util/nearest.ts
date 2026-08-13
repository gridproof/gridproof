/**
 * Snap-to-scale math (spec §7.3) — STUB / extension point.
 *
 * Day 2+ implements nearest-multiple and nearest-canonical snapping used by the
 * rules. Deliberately unused in Day 1 raw mode. Signatures are sketched so the
 * rule work has a stable home; bodies intentionally throw until implemented.
 */

/** Nearest multiple of `base` to `value` (Day 2). */
export function nearestMultiple(_value: number, _base: number): number {
  throw new Error("nearestMultiple: not implemented (Day 2)");
}

/** Nearest entry in `scale` to `value` (Day 2/3). */
export function nearestInScale(_value: number, _scale: readonly number[]): number {
  throw new Error("nearestInScale: not implemented (Day 2)");
}
