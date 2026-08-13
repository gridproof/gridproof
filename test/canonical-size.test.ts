import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import { canonicalSizeRule } from "../src/engine/rules/canonical-size.js";
import type { Violation } from "../src/report/schema.js";
import { makeElement } from "./helpers.js";

function run(...els: ReturnType<typeof makeElement>[]): Violation[] {
  return canonicalSizeRule.check({ config: DEFAULT_CONFIG, elements: els });
}

describe("canonical-size icons", () => {
  it("14px icon is now canonical → 0 violations", () => {
    expect(
      run(
        makeElement({
          selector: "#i14",
          isIcon: true,
          rect: { width: 14, height: 14 },
        }),
      ),
    ).toHaveLength(0);
  });

  it("12px icon is canonical → 0 violations", () => {
    expect(
      run(makeElement({ isIcon: true, rect: { width: 12, height: 12 } })),
    ).toHaveLength(0);
  });

  it("30px icon → warn snapping to nearest canonical (32px)", () => {
    const v = run(
      makeElement({
        selector: "#i30",
        isIcon: true,
        rect: { width: 30, height: 30 },
      }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.severity).toBe("warn");
    expect(v[0]?.expected).toBe("32px");
  });
});

describe("canonical-size tap targets", () => {
  it("32px tap target → error citing WCAG 2.5.8", () => {
    const v = run(
      makeElement({
        selector: "#btn",
        isTapTarget: true,
        rect: { width: 32, height: 32 },
      }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.severity).toBe("error");
    expect(v[0]?.expected).toBe("44px");
    expect(v[0]?.fixHint.note ?? "").toContain("WCAG 2.5.8");
  });

  it("48px tap target → 0 violations", () => {
    expect(
      run(makeElement({ isTapTarget: true, rect: { width: 48, height: 48 } })),
    ).toHaveLength(0);
  });

  it("a non-tap element (isTapTarget=false) below 44px → 0 violations", () => {
    // e.g. an inline text link the collector excluded from tap targets
    expect(
      run(makeElement({ isTapTarget: false, rect: { width: 80, height: 20 } })),
    ).toHaveLength(0);
  });
});
