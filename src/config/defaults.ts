import type { GridproofConfig } from "./schema.js";

/**
 * Default configuration (spec §8). Used verbatim when no
 * `gridproof.config.json` is found, and as the merge base otherwise.
 */
export const DEFAULT_CONFIG: GridproofConfig = {
  baseUnit: 4,
  allowedValues: [1, 2],
  canonicalSizes: [16, 20, 24, 32, 40, 48],
  minTapTarget: 44,
  rules: {
    "spacing-scale": "warn",
    "arbitrary-value": "warn",
    "gap-consistency": "warn",
    "canonical-size": "error",
  },
  suppress: [],
};

/**
 * Standard Tailwind spacing scale → px (spec §7.3 arbitrary-value).
 * Extension point for rule work (Day 2); defined here so `arbitrary-value`
 * can snap `p-[13px]` to the nearest named class. Not consumed in Day 1 raw mode.
 */
export const TAILWIND_SPACING_PX: Readonly<Record<string, number>> = {
  "0": 0,
  px: 1,
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "7": 28,
  "8": 32,
  "9": 36,
  "10": 40,
  "11": 44,
  "12": 48,
  "14": 56,
  "16": 64,
  "20": 80,
  "24": 96,
  "28": 112,
  "32": 128,
  "36": 144,
  "40": 160,
  "44": 176,
  "48": 192,
  "52": 208,
  "56": 224,
  "60": 240,
  "64": 256,
  "72": 288,
  "80": 320,
  "96": 384,
};

/** Sorted, de-duplicated px values of the Tailwind spacing scale. */
export const TAILWIND_SPACING_SCALE_PX: readonly number[] = [
  ...new Set(Object.values(TAILWIND_SPACING_PX)),
].sort((a, b) => a - b);

/**
 * Reverse map px → canonical Tailwind class key (e.g. 12 → "3", 2 → "0.5").
 * First key wins if two keys share a px value (none do in the standard scale).
 */
export const PX_TO_TAILWIND_KEY: ReadonlyMap<number, string> = (() => {
  const m = new Map<number, string>();
  for (const [key, px] of Object.entries(TAILWIND_SPACING_PX)) {
    if (!m.has(px)) m.set(px, key);
  }
  return m;
})();
