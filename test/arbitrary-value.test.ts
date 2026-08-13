import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import type {
  CollectedComputed,
  CollectedElement,
} from "../src/engine/collector.js";
import { arbitraryValueRule } from "../src/engine/rules/arbitrary-value.js";
import type { Violation } from "../src/report/schema.js";

/**
 * arbitrary-value operates purely on `classList`, so it is unit-tested over
 * constructed elements — deterministic, no browser, no network. The classes
 * mirror fixtures/arbitrary.html.
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

function el(selector: string, classList: string[]): CollectedElement {
  return {
    selector,
    tagName: "div",
    classList,
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    computed: ZERO_COMPUTED,
    parentDisplay: "block",
    siblingIndex: 0,
    ariaHidden: false,
    gpIgnore: null,
    styleAttr: null,
    snippet: `<${"div"} class="${classList.join(" ")}">`,
  };
}

function run(elements: CollectedElement[]): Violation[] {
  return arbitraryValueRule.check({ config: DEFAULT_CONFIG, elements });
}

describe("arbitrary-value rule", () => {
  it("off-scale p-[13px] → p-3", () => {
    const v = run([el("#arb-off-scale", ["p-[13px]", "bg-indigo-100"])]);
    expect(v).toHaveLength(1);
    expect(v[0]?.ruleId).toBe("arbitrary-value");
    expect(v[0]?.fixHint.kind).toBe("tailwind-class");
    expect(v[0]?.fixHint.from).toBe("p-[13px]");
    expect(v[0]?.fixHint.to).toBe("p-3");
    expect(v[0]?.actual).toBe("13px");
    expect(v[0]?.expected).toBe("12px");
    expect(v[0]?.severity).toBe("warn");
  });

  it("on-scale p-[16px] → hygiene warn to p-4", () => {
    const v = run([el("#arb-on-scale", ["p-[16px]", "bg-emerald-100"])]);
    expect(v).toHaveLength(1);
    expect(v[0]?.severity).toBe("warn");
    expect(v[0]?.fixHint.to).toBe("p-4");
    expect(v[0]?.actual).toBe("16px");
    expect(v[0]?.expected).toBe("16px");
  });

  it("off-scale width w-[347px] → w-80", () => {
    const v = run([el("#arb-width", ["w-[347px]"])]);
    expect(v).toHaveLength(1);
    expect(v[0]?.fixHint.to).toBe("w-80");
  });

  it("converts rem→px: p-[1rem] is on-scale → p-4", () => {
    const v = run([el("#rem", ["p-[1rem]"])]);
    expect(v).toHaveLength(1);
    expect(v[0]?.fixHint.to).toBe("p-4");
    expect(v[0]?.actual).toBe("16px");
  });

  it("handles variant prefixes: md:p-[13px] → p-3", () => {
    const v = run([el("#variant", ["md:p-[13px]"])]);
    expect(v).toHaveLength(1);
    expect(v[0]?.fixHint.from).toBe("md:p-[13px]");
    expect(v[0]?.fixHint.to).toBe("p-3");
  });

  it("ignores non-arbitrary classes", () => {
    expect(run([el("#clean", ["p-4", "flex", "gap-2"])])).toHaveLength(0);
  });
});
