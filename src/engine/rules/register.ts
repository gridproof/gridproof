import type { RuleRegistry } from "../rule.js";
import { spacingScaleRule } from "./spacing-scale.js";
import { arbitraryValueRule } from "./arbitrary-value.js";
import { gapConsistencyRule } from "./gap-consistency.js";
import { canonicalSizeRule } from "./canonical-size.js";

/**
 * Register the v1 rule set. As of Day 3 all four rules are live:
 * spacing-scale, arbitrary-value, gap-consistency, canonical-size.
 */
export function registerDefaultRules(reg: RuleRegistry): void {
  reg
    .register(spacingScaleRule)
    .register(arbitraryValueRule)
    .register(gapConsistencyRule)
    .register(canonicalSizeRule);
}
