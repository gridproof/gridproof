import { describe, expect, it } from "vitest";
import { spacingScaleRule } from "../src/engine/rules/spacing-scale.js";
import type { Violation } from "../src/report/schema.js";
import { makeCtx, makeElement } from "./helpers.js";

function run(...els: ReturnType<typeof makeElement>[]): Violation[] {
  return spacingScaleRule.check(makeCtx(els));
}

describe("spacing-scale side-collapse", () => {
  it("uniform padding:13px collapses to ONE 'padding' violation (not 4)", () => {
    const v = run(
      makeElement({
        selector: "#uniform",
        computed: {
          paddingTop: "13px",
          paddingRight: "13px",
          paddingBottom: "13px",
          paddingLeft: "13px",
        },
      }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.property).toBe("padding");
    expect(v[0]?.actual).toBe("13px");
    expect(v[0]?.expected).toBe("12px");
  });

  it("two matching sides collapse; a third distinct side stays separate", () => {
    const v = run(
      makeElement({
        selector: "#mixed",
        computed: {
          paddingTop: "13px",
          paddingBottom: "13px",
          paddingLeft: "5px", // distinct off-scale
          paddingRight: "16px", // on-scale, ignored
        },
      }),
    );
    // one collapsed "padding" (13px) + one "padding-left" (5px)
    expect(v).toHaveLength(2);
    const props = v.map((x) => x.property).sort();
    expect(props).toEqual(["padding", "padding-left"]);
  });

  it("single off-scale side stays as the longhand property", () => {
    const v = run(
      makeElement({
        selector: "#one",
        computed: { paddingTop: "13px" },
      }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.property).toBe("padding-top");
  });

  it("margins collapse independently of paddings", () => {
    const v = run(
      makeElement({
        selector: "#m",
        computed: { marginTop: "13px", marginBottom: "13px" },
      }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.property).toBe("margin");
  });
});

describe("spacing-scale info tier (systematic vs one-off)", () => {
  it("an off-grid value repeated across 3+ elements → info (library-sourced)", () => {
    const els = [1, 2, 3].map((i) =>
      makeElement({
        selector: `#s${i}`,
        computed: { paddingTop: "9px", paddingBottom: "9px" },
      }),
    );
    const v = run(...els);
    expect(v).toHaveLength(3); // one collapsed "padding" per element
    expect(v.every((x) => x.severity === "info")).toBe(true);
    expect(v.every((x) => x.actual === "9px")).toBe(true);
  });

  it("a one-off off-grid value (py-[13px]) stays warn (authored drift)", () => {
    const v = run(makeElement({ selector: "#one", computed: { paddingTop: "13px" } }));
    expect(v).toHaveLength(1);
    expect(v[0]?.severity).toBe("warn");
  });

  it("two occurrences are not yet systematic → still warn", () => {
    const v = run(
      makeElement({ selector: "#a", computed: { paddingTop: "9px" } }),
      makeElement({ selector: "#b", computed: { paddingTop: "9px" } }),
    );
    expect(v).toHaveLength(2);
    expect(v.every((x) => x.severity === "warn")).toBe(true);
  });
});

describe("spacing-scale core", () => {
  // v1.2: Tailwind half-steps (1.5/2.5/3.5 = 6/10/14px) are valid, not drift.
  it("passes Tailwind half-steps 6/10/14px (py-1.5 etc.)", () => {
    expect(
      run(
        makeElement({
          computed: {
            paddingTop: "6px",
            paddingBottom: "6px",
            marginTop: "10px",
            rowGap: "14px",
          },
        }),
      ),
    ).toHaveLength(0);
  });

  // v1.2: auto-centering horizontal margins (mx-auto) are layout, not spacing.
  it("ignores auto-centering left/right margins when autoMarginX is set", () => {
    expect(
      run(
        makeElement({
          computed: { marginLeft: "290px", marginRight: "290px" },
          autoMarginX: true,
        }),
      ),
    ).toHaveLength(0);
  });

  it("still flags a genuine off-scale margin when NOT auto-centering", () => {
    const v = run(
      makeElement({ computed: { marginLeft: "290px", marginRight: "290px" } }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.property).toBe("margin");
  });

  it("passes rem-rounded 15.68px (0.6px tolerance)", () => {
    expect(
      run(makeElement({ computed: { paddingTop: "15.68px" } })),
    ).toHaveLength(0);
  });

  it("ignores messy subpixel computed values (25.781px, 7.369px)", () => {
    expect(
      run(
        makeElement({
          computed: { marginRight: "25.781px", paddingLeft: "7.369px" },
        }),
      ),
    ).toHaveLength(0);
  });

  it("passes allowedValues (1px, 2px hairlines)", () => {
    expect(
      run(
        makeElement({
          computed: { marginTop: "1px", marginBottom: "2px" },
        }),
      ),
    ).toHaveLength(0);
  });

  it("ignores 0, auto, %, and normal", () => {
    expect(
      run(
        makeElement({
          computed: {
            marginTop: "0px",
            marginLeft: "auto",
            paddingTop: "50%",
            rowGap: "normal",
          },
        }),
      ),
    ).toHaveLength(0);
  });

  it("judges row-gap / column-gap when concrete", () => {
    const v = run(
      makeElement({ computed: { rowGap: "13px", columnGap: "16px" } }),
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.property).toBe("row-gap");
  });
});
