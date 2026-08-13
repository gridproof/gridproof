import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import type { GridproofConfig } from "../src/config/schema.js";
import { RuleRegistry } from "../src/engine/rule.js";
import { registerDefaultRules } from "../src/engine/rules/register.js";
import { runAudit } from "../src/engine/runner.js";
import type { CollectedElement } from "../src/engine/collector.js";
import { ruleIgnored } from "../src/util/suppress.js";
import { makeElement } from "./helpers.js";

const registry = new RuleRegistry();
registerDefaultRules(registry);

function audit(
  elements: CollectedElement[],
  config: GridproofConfig = DEFAULT_CONFIG,
) {
  return runAudit({
    url: "http://x/",
    viewport: { width: 1440, height: 900 },
    elements,
    config,
    registry,
    maxViolations: 50,
  });
}

describe("ruleIgnored", () => {
  it("handles null / all / list", () => {
    expect(ruleIgnored(null, "spacing-scale")).toBe(false);
    expect(ruleIgnored("all", "spacing-scale")).toBe(true);
    expect(ruleIgnored(["spacing-scale"], "spacing-scale")).toBe(true);
    expect(ruleIgnored(["gap-consistency"], "spacing-scale")).toBe(false);
  });
});

describe("runAudit suppression", () => {
  it("inline ignore=all: violation absent, suppressedCount increments", () => {
    const report = audit([
      makeElement({
        selector: "#ignored",
        computed: { paddingTop: "13px" },
        ignore: "all",
      }),
    ]);
    expect(report.violations).toHaveLength(0);
    expect(report.suppressedCount).toBe(1);
  });

  it("inline ignore of one rule is selective", () => {
    // spacing-scale suppressed, but arbitrary-value on the same node still fires
    const report = audit([
      makeElement({
        selector: "#partial",
        classList: ["p-[13px]"],
        computed: { paddingTop: "13px" },
        ignore: ["spacing-scale"],
      }),
    ]);
    expect(report.suppressedCount).toBe(1);
    expect(report.violations).toHaveLength(1);
    expect(report.violations[0]?.ruleId).toBe("arbitrary-value");
  });

  it("config suppress by value drops matching findings", () => {
    const config: GridproofConfig = {
      ...DEFAULT_CONFIG,
      suppress: [{ value: "13px", reason: "optical correction" }],
    };
    const report = audit(
      [makeElement({ selector: "#v", computed: { paddingTop: "13px" } })],
      config,
    );
    expect(report.violations).toHaveLength(0);
    expect(report.suppressedCount).toBe(1);
  });

  it("no suppression by default", () => {
    const report = audit([
      makeElement({ selector: "#plain", computed: { paddingTop: "13px" } }),
    ]);
    expect(report.suppressedCount).toBe(0);
    expect(report.violations).toHaveLength(1);
  });
});
