/**
 * Snap-to-scale math (spec §7.3). Pure, deterministic.
 */

/**
 * Nearest integer multiple of `base` to `value`.
 * Ties (value exactly between two multiples) round to the larger multiple
 * (`Math.round` half-up), e.g. `nearestMultiple(14, 4) === 16`.
 *
 * @throws if `base <= 0`.
 */
export function nearestMultiple(value: number, base: number): number {
  if (!(base > 0)) {
    throw new Error(`nearestMultiple: base must be > 0 (got ${base})`);
  }
  return Math.round(value / base) * base;
}

/**
 * Nearest entry in `scale` to `value` by absolute distance.
 * Ties resolve to the SMALLER value (spec test: 13px is equidistant to 12 and
 * 14 → 12 → `p-3`). Order-independent: the scale is compared ascending.
 *
 * @throws if `scale` is empty.
 */
export function nearestInScale(value: number, scale: readonly number[]): number {
  if (scale.length === 0) {
    throw new Error("nearestInScale: scale must be non-empty");
  }
  const ascending = [...scale].sort((a, b) => a - b);
  let best = ascending[0] as number;
  let bestDist = Math.abs(value - best);
  for (let i = 1; i < ascending.length; i++) {
    const v = ascending[i] as number;
    const d = Math.abs(value - v);
    // strict `<` keeps the earlier (smaller, since ascending) entry on a tie
    if (d < bestDist) {
      best = v;
      bestDist = d;
    }
  }
  return best;
}

/**
 * True when `value` is within `tolerance` px of an integer multiple of `base`
 * (subpixel on-grid test, spec §7.2/§7.3). Default tolerance 0.6px.
 */
export function isOnGrid(value: number, base: number, tolerance = 0.6): boolean {
  const m = nearestMultiple(value, base);
  return Math.abs(value - m) < tolerance;
}
