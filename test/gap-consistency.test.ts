import { describe, expect, it } from "vitest";
import { RuleRegistry } from "../src/engine/rule.js";
import { registerDefaultRules } from "../src/engine/rules/register.js";
import { gapConsistencyRule } from "../src/engine/rules/gap-consistency.js";
import { runAudit } from "../src/engine/runner.js";
import type { CollectedElement } from "../src/engine/collector.js";
import type { Violation } from "../src/report/schema.js";
import { makeCtx, makeElement } from "./helpers.js";

/**
 * Build a flex column list: a container + N children whose consecutive
 * inter-sibling distances match `distances` (child height 20px, left-aligned).
 */
function list(distances: number[]): CollectedElement[] {
  const container = makeElement({
    selector: "#list",
    computed: { display: "flex" },
    rect: { top: 0, left: 0, width: 200, height: 400 },
  });
  const children: CollectedElement[] = [];
  let top = 0;
  for (let i = 0; i <= distances.length; i++) {
    if (i > 0) top += (distances[i - 1] as number);
    children.push(
      makeElement({
        selector: `#c${i}`,
        parentSelector: "#list",
        siblingIndex: i,
        rect: { top, bottom: top + 20, left: 0, right: 100, width: 100, height: 20 },
      }),
    );
    top += 20;
  }
  return [container, ...children];
}

function run(els: CollectedElement[]): Violation[] {
  return gapConsistencyRule.check(makeCtx(els));
}

describe("gap-consistency list vs layout wrapper", () => {
  it("real ragged list (12/16/20px) → 1 container violation", () => {
    const v = run(list([12, 16, 20]));
    expect(v).toHaveLength(1);
    expect(v[0]?.selector).toBe("#list");
    expect(v[0]?.fixHint.kind).toBe("container-gap");
  });

  it("page wrapper (children spaced 28/689/2066px) → 0 violations", () => {
    expect(run(list([28, 689, 2066]))).toHaveLength(0);
  });

  it("a gap exceeding maxListGap (240px) → 0 violations (ceiling)", () => {
    // ratio 240/200 = 1.2 and spread 40 > baseUnit, so only the ceiling skips it
    expect(run(list([200, 240, 200]))).toHaveLength(0);
  });

  it("order-of-magnitude difference (16/16/80px) → 0 violations", () => {
    // 80 = 5× 16 (> SPREAD_RATIO_MAX 4) → structural, not a ragged list
    expect(run(list([16, 16, 80]))).toHaveLength(0);
  });
});

describe("gap-consistency Tailwind gate", () => {
  const registry = new RuleRegistry();
  registerDefaultRules(registry);

  function audit(isTailwind: boolean): Violation[] {
    return runAudit({
      url: "http://x/",
      viewport: { width: 1440, height: 900 },
      elements: list([12, 16, 20]),
      config: makeCtx([]).config,
      registry,
      maxViolations: 50,
      isTailwind,
    }).violations.filter((v) => v.ruleId === "gap-consistency");
  }

  it("Tailwind page → fires", () => {
    expect(audit(true)).toHaveLength(1);
  });

  it("non-Tailwind page → silent", () => {
    expect(audit(false)).toHaveLength(0);
  });
});
