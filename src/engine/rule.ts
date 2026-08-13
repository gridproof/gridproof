import type { GridproofConfig, RuleId } from "../config/schema.js";
import type { Violation } from "../report/schema.js";
import type { CollectedElement } from "./collector.js";

/**
 * Rule interface + registry (spec §2 v2 note: "the rule engine must be
 * pluggable so [v2 rules] drop in as new Rule implementations").
 *
 * Day 1: the registry exists and is wired, but starts EMPTY. `gp_audit` runs in
 * raw-geometry mode and does not invoke any rule. Day 2+ registers the four v1
 * rules here.
 */

/** Context handed to every rule's `check`. */
export interface RuleContext {
  readonly config: GridproofConfig;
  /** Full set of collected elements for the audited subtree. */
  readonly elements: readonly CollectedElement[];
  /** The audit viewport (rules like canonical-size gate tap targets on width). */
  readonly viewport: { width: number; height: number };
}

export interface Rule {
  readonly id: RuleId;
  /**
   * Inspect collected geometry and return zero or more violations.
   * Pure and synchronous: no DOM/network access here — the collector already
   * gathered everything in a single in-page pass.
   */
  check(ctx: RuleContext): Violation[];
}

/**
 * Ordered rule registry. Insertion order is preserved so reports can be sorted
 * deterministically. Starts empty in Day 1 raw mode.
 */
export class RuleRegistry {
  private readonly rules = new Map<RuleId, Rule>();

  register(rule: Rule): this {
    this.rules.set(rule.id, rule);
    return this;
  }

  get(id: RuleId): Rule | undefined {
    return this.rules.get(id);
  }

  has(id: RuleId): boolean {
    return this.rules.has(id);
  }

  /** All registered rules, in registration order. */
  all(): Rule[] {
    return [...this.rules.values()];
  }

  /** Rules matching `ids` (in registry order), skipping unknown ids. */
  select(ids: readonly RuleId[]): Rule[] {
    const wanted = new Set(ids);
    return this.all().filter((r) => wanted.has(r.id));
  }
}

/**
 * The process-wide registry. Deliberately EMPTY in Day 1 — no rules registered.
 * Day 2 will populate it, e.g.:
 *   registry.register(spacingScaleRule).register(arbitraryValueRule)...
 */
export const registry = new RuleRegistry();
