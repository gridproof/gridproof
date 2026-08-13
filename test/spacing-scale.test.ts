import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import { spacingScaleRule } from "../src/engine/rules/spacing-scale.js";
import type { Violation } from "../src/report/schema.js";
import { makeElement } from "./helpers.js";

function run(...els: ReturnType<typeof makeElement>[]): Violation[] {
  return spacingScaleRule.check({ config: DEFAULT_CONFIG, elements: els });
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

describe("spacing-scale core", () => {
  it("passes rem-rounded 15.68px (0.6px tolerance)", () => {
    expect(
      run(makeElement({ computed: { paddingTop: "15.68px" } })),
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
