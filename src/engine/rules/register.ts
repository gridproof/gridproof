import type { RuleRegistry } from "../rule.js";
import { spacingScaleRule } from "./spacing-scale.js";
import { arbitraryValueRule } from "./arbitrary-value.js";

/**
 * Register the rules enabled for this milestone. Day 2: spacing-scale and
 * arbitrary-value. gap-consistency and canonical-size remain no-op stubs and
 * are intentionally NOT registered yet (Day 3).
 */
export function registerDefaultRules(reg: RuleRegistry): void {
  reg.register(spacingScaleRule).register(arbitraryValueRule);
}
