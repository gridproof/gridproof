import { TAILWIND_SPACING_SCALE_PX } from "../config/defaults.js";
import type { GridproofConfig, RuleId } from "../config/schema.js";
import type { AuditReport, Violation } from "../report/schema.js";
import {
  isViolationSuppressed,
  suppressedValues,
  type IgnoreSpec,
} from "../util/suppress.js";
import type { CollectedElement } from "./collector.js";
import type { RuleRegistry } from "./rule.js";

/**
 * Pure audit runner (spec §5.1/§6). Given collected geometry + config, run the
 * enabled rules and assemble an {@link AuditReport}: severity-then-DOM-order
 * sort, `maxViolations` cap with `truncated` flag, and summary counts.
 *
 * `suppressedCount` is fixed at 0 this milestone — suppression matching is Day 3.
 */

export interface RunAuditParams {
  url: string;
  viewport: { width: number; height: number };
  elements: readonly CollectedElement[];
  config: GridproofConfig;
  registry: RuleRegistry;
  /** Subset of rules to run; default all registered. Unknown ids are skipped. */
  rules?: readonly RuleId[] | undefined;
  maxViolations: number;
  /** Whether the page uses Tailwind (from the collector's detection). */
  isTailwind?: boolean;
}

function severityRank(s: Violation["severity"]): number {
  return s === "error" ? 0 : s === "warn" ? 1 : 2; // info sorts last / caps last
}

/**
 * Rules that only make sense on Tailwind pages (gated when non-Tailwind).
 * gap-consistency suggests `set gap-N` classes, meaningless off-Tailwind.
 */
const TAILWIND_ONLY_RULES: ReadonlySet<RuleId> = new Set([
  "spacing-scale",
  "arbitrary-value",
  "gap-consistency",
]);

export function runAudit(params: RunAuditParams): AuditReport {
  const { url, viewport, elements, config, registry, rules, maxViolations } =
    params;

  // Tailwind-detection gate: "auto" defers to the collector's detection; true
  // always runs the Tailwind rules; false always skips them.
  const detected = params.isTailwind ?? true;
  const runTailwindRules =
    config.assumeTailwind === true
      ? true
      : config.assumeTailwind === false
        ? false
        : detected;

  const notes: string[] = [];
  let selected = rules ? registry.select(rules) : registry.all();
  if (!runTailwindRules) {
    selected = selected.filter((r) => !TAILWIND_ONLY_RULES.has(r.id));
    notes.push(
      config.assumeTailwind === false
        ? "Tailwind rules disabled by config (assumeTailwind:false); spacing/arbitrary rules skipped. Accessibility rules (canonical-size) still applied."
        : "Non-Tailwind page detected; spacing/arbitrary rules skipped. Accessibility rules (canonical-size) still applied.",
    );
  }

  const ctx = { config, elements, viewport };
  const produced: Violation[] = [];
  for (const rule of selected) {
    produced.push(...rule.check(ctx));
  }

  // Suppression (§8): drop inline/selector-ignored and value-suppressed
  // findings, counting them. Selector-form suppressions are already folded into
  // each element's `ignore` by the collector; value-form is matched here.
  const ignoreBySelector = new Map<string, IgnoreSpec>();
  for (const el of elements) {
    if (!ignoreBySelector.has(el.selector)) {
      ignoreBySelector.set(el.selector, el.ignore);
    }
  }
  const values = suppressedValues(config.suppress);

  const found: Violation[] = [];
  let suppressedCount = 0;
  for (const v of produced) {
    const ignore = ignoreBySelector.get(v.selector) ?? null;
    if (
      isViolationSuppressed({
        ignore,
        ruleId: v.ruleId,
        actual: v.actual,
        values,
      })
    ) {
      suppressedCount++;
    } else {
      found.push(v);
    }
  }

  // DOM order = first occurrence index of a selector in document-ordered elements.
  const domIndex = new Map<string, number>();
  elements.forEach((el, i) => {
    if (!domIndex.has(el.selector)) domIndex.set(el.selector, i);
  });
  const orderOf = (sel: string): number => domIndex.get(sel) ?? Number.MAX_SAFE_INTEGER;

  // Stable sort: severity (error first), then DOM order, then emission order.
  const sorted = found
    .map((v, i) => ({ v, i }))
    .sort(
      (a, b) =>
        severityRank(a.v.severity) - severityRank(b.v.severity) ||
        orderOf(a.v.selector) - orderOf(b.v.selector) ||
        a.i - b.i,
    )
    .map((x) => x.v);

  const total = sorted.length;
  const truncated = total > maxViolations;
  const violations = truncated ? sorted.slice(0, maxViolations) : sorted;

  const byRule: Record<string, number> = {};
  let errors = 0;
  let infos = 0;
  for (const v of sorted) {
    byRule[v.ruleId] = (byRule[v.ruleId] ?? 0) + 1;
    if (v.severity === "error") errors++;
    else if (v.severity === "info") infos++;
  }
  const warns = total - errors - infos;

  return {
    url,
    viewport,
    timestamp: new Date().toISOString(),
    config: {
      baseUnit: config.baseUnit,
      scale: [...TAILWIND_SPACING_SCALE_PX],
      canonicalSizes: config.canonicalSizes,
    },
    summary: { total, byRule, errors, warns, infos },
    violations,
    truncated,
    suppressedCount,
    isTailwind: detected,
    notes,
  };
}
