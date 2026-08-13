import { describe, expect, it } from "vitest";
import { canonicalSizeRule } from "../src/engine/rules/canonical-size.js";
import type { Violation } from "../src/report/schema.js";
import { makeCtx, makeElement } from "./helpers.js";

const MOBILE = { width: 375, height: 812 };
const DESKTOP = { width: 1440, height: 900 };

/** Icons run at any viewport; default to mobile so tap-target tests fire. */
function run(...els: ReturnType<typeof makeElement>[]): Violation[] {
  return canonicalSizeRule.check(makeCtx(els, { viewport: MOBILE }));
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

  it("subpixel icon 24.5px is within tolerance of 24 → 0 violations", () => {
    expect(
      run(makeElement({ isIcon: true, rect: { width: 24.5, height: 24.5 } })),
    ).toHaveLength(0);
  });

  it("subpixel icon 11.5px is within tolerance of 12 → 0 violations", () => {
    expect(
      run(makeElement({ isIcon: true, rect: { width: 11.5, height: 11.5 } })),
    ).toHaveLength(0);
  });

  it("tiny 6px sprite is below the icon floor → 0 violations", () => {
    expect(
      run(makeElement({ isIcon: true, rect: { width: 6, height: 6 } })),
    ).toHaveLength(0);
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

  it("viewport-aware: a 36px button is flagged at 375 but NOT at 1440", () => {
    const btn = makeElement({
      selector: "#b36",
      isTapTarget: true,
      rect: { width: 120, height: 36 },
    });
    const mobile = canonicalSizeRule.check(
      makeCtx([btn], { viewport: MOBILE }),
    );
    expect(mobile).toHaveLength(1);
    expect(mobile[0]?.severity).toBe("error");

    const desktop = canonicalSizeRule.check(
      makeCtx([btn], { viewport: DESKTOP }),
    );
    expect(desktop).toHaveLength(0);
  });
});
