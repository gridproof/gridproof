import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import type {
  CollectedComputed,
  CollectedElement,
} from "../src/engine/collector.js";
import { RuleRegistry } from "../src/engine/rule.js";
import { registerDefaultRules } from "../src/engine/rules/register.js";
import { runAudit } from "../src/engine/runner.js";

/**
 * runAudit-level dedup (§12): an authored arbitrary Tailwind class like
 * `py-[13px]` drives both its own computed CSS (spacing-scale) and its class
 * token (arbitrary-value) — same physical defect, two rules. Verifies the
 * runner collapses that pair to the single, more-actionable arbitrary-value
 * finding instead of reporting both.
 */

const ZERO_COMPUTED: CollectedComputed = {
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  gap: "normal",
  rowGap: "normal",
  columnGap: "normal",
  width: "0px",
  height: "0px",
  display: "block",
  position: "static",
};

function el(
  selector: string,
  classList: string[],
  computed: Partial<CollectedComputed>,
): CollectedElement {
  return {
    selector,
    tagName: "div",
    classList,
    rect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 },
    computed: { ...ZERO_COMPUTED, ...computed },
    parentDisplay: "block",
    parentSelector: null,
    siblingIndex: 0,
    ariaHidden: false,
    gpIgnore: null,
    ignore: null,
    isTapTarget: false,
    isIcon: false,
    autoMarginX: false,
    styleAttr: null,
    snippet: `<div class="${classList.join(" ")}">`,
  };
}

function audit(elements: CollectedElement[]) {
  const registry = new RuleRegistry();
  registerDefaultRules(registry);
  return runAudit({
    url: "https://example.test/",
    viewport: { width: 1440, height: 900 },
    elements,
    config: DEFAULT_CONFIG,
    registry,
    maxViolations: 50,
    isTailwind: true,
  });
}

describe("runner: dedupeSpacingArbitrary", () => {
  it("py-[13px] fires exactly one finding — arbitrary-value, not spacing-scale", () => {
    const report = audit([
      el("#new-project-btn", ["py-[13px]"], { paddingTop: "13px", paddingBottom: "13px" }),
    ]);
    const onSelector = report.violations.filter((v) => v.selector === "#new-project-btn");
    expect(onSelector).toHaveLength(1);
    expect(onSelector[0]?.ruleId).toBe("arbitrary-value");
    expect(onSelector[0]?.fixHint.from).toBe("py-[13px]");
    expect(onSelector[0]?.fixHint.to).toBe("py-3");
    expect(report.summary.byRule["spacing-scale"]).toBeUndefined();
  });

  it("a plain off-scale padding (no arbitrary class) still fires spacing-scale", () => {
    const report = audit([el("#plain-box", [], { paddingTop: "13px" })]);
    const onSelector = report.violations.filter((v) => v.selector === "#plain-box");
    expect(onSelector).toHaveLength(1);
    expect(onSelector[0]?.ruleId).toBe("spacing-scale");
  });

  it("an arbitrary-value finding on one element does not suppress spacing-scale on another", () => {
    const report = audit([
      el("#arb-btn", ["py-[13px]"], { paddingTop: "13px", paddingBottom: "13px" }),
      el("#plain-box", [], { paddingTop: "13px" }),
    ]);
    expect(
      report.violations.some((v) => v.selector === "#plain-box" && v.ruleId === "spacing-scale"),
    ).toBe(true);
    expect(
      report.violations.some((v) => v.selector === "#arb-btn" && v.ruleId === "spacing-scale"),
    ).toBe(false);
  });
});
