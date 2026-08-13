import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/config/defaults.js";
import { collectGeometry } from "../src/engine/collector.js";
import { withRenderedPage, shutdownRenderer } from "../src/engine/renderer.js";
import { registry } from "../src/engine/rule.js";
import { registerDefaultRules } from "../src/engine/rules/register.js";
import { runAudit } from "../src/engine/runner.js";
import { runCheckElement } from "../src/tools/check-element.js";
import type { AuditReport } from "../src/report/schema.js";

/**
 * End-to-end over self-contained fixtures (no external network): render with
 * Chromium → collect geometry → runAudit. Exercises the exact code path gp_audit
 * uses, minus the MCP transport.
 */

const FIXTURES = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../fixtures",
);

let server: Server;
let base: string;

beforeAll(async () => {
  registerDefaultRules(registry);
  server = createServer(async (req, res) => {
    try {
      const u = new URL(req.url ?? "/", "http://127.0.0.1");
      const file = path.join(FIXTURES, decodeURIComponent(u.pathname));
      if (!file.startsWith(FIXTURES)) throw new Error("bad path");
      const data = await readFile(file);
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (addr === null || typeof addr === "string") throw new Error("no port");
  base = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  await shutdownRenderer();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function auditFixture(
  name: string,
  viewport: { width: number; height: number } = { width: 1440, height: 900 },
  config = DEFAULT_CONFIG,
): Promise<AuditReport> {
  const collection = await withRenderedPage(
    `${base}/${name}`,
    viewport,
    (page) => collectGeometry(page),
  );
  return runAudit({
    url: `${base}/${name}`,
    viewport,
    elements: collection.elements,
    config,
    registry,
    maxViolations: 50,
    isTailwind: collection.isTailwind, // exercise the Tailwind-detection gate
  });
}

describe("integration: spacing-scale on off-scale.html", () => {
  it("detects the 13px padding-top as exactly one violation, expected 12px", async () => {
    const report = await auditFixture("off-scale.html");
    const spacing = report.violations.filter(
      (v) => v.ruleId === "spacing-scale",
    );
    expect(spacing).toHaveLength(1);
    const v = spacing[0]!;
    expect(v.selector).toBe("#off-scale-box");
    expect(v.property).toBe("padding-top");
    expect(v.actual).toBe("13px");
    expect(v.expected).toBe("12px");
    expect(v.severity).toBe("warn");
  });

  it("does NOT flag the 15.68px rem-rounded node (0.6px tolerance)", async () => {
    const report = await auditFixture("off-scale.html");
    const onRem = report.violations.filter(
      (v) => v.selector === "#rem-rounded-box",
    );
    expect(onRem).toHaveLength(0);
  });
});

describe("integration: clean.html", () => {
  it("reports zero violations", async () => {
    const report = await auditFixture("clean.html");
    expect(report.summary.total).toBe(0);
    expect(report.violations).toHaveLength(0);
  });
});

describe("integration: icon detection (icon-detect.html)", () => {
  async function flags(name: string) {
    const c = await withRenderedPage(
      `${base}/${name}`,
      { width: 1440, height: 900 },
      (page) => collectGeometry(page),
    );
    const by = new Map(c.elements.map((e) => [e.selector, e]));
    return by;
  }

  it("token-matches 'icon' and never treats tap targets / substrings as icons", async () => {
    const by = await flags("icon-detect.html");
    // substring "muicontainer" → NOT an icon
    expect(by.get("#mui")?.isIcon).toBe(false);
    // "nav-icon" token → IS an icon
    expect(by.get("#navicon")?.isIcon).toBe(true);
    // bracketed Tailwind variant + tap target → NOT an icon
    expect(by.get("#iconvariant")?.isIcon).toBe(false);
    expect(by.get("#iconvariant")?.isTapTarget).toBe(true);
    // button with icon-ish class → tap target, NOT an icon
    expect(by.get("#btnicon")?.isIcon).toBe(false);
    expect(by.get("#btnicon")?.isTapTarget).toBe(true);
  });
});

describe("integration: Tailwind-detection gate (plain-css.html)", () => {
  it("non-Tailwind page: spacing/arbitrary silent, canonical still runs", async () => {
    // mobile so the tap-target (accessibility) finding is emitted
    const report = await auditFixture("plain-css.html", {
      width: 375,
      height: 812,
    });
    expect(report.isTailwind).toBe(false);
    expect(report.notes.join(" ")).toContain("Non-Tailwind");
    // .panel has 13px padding but spacing-scale is gated → not flagged
    expect(
      report.violations.some((v) => v.ruleId === "spacing-scale"),
    ).toBe(false);
    expect(
      report.violations.some((v) => v.ruleId === "arbitrary-value"),
    ).toBe(false);
    // canonical-size still runs: 32px button is a tap-target error
    const tap = report.violations.find((v) => v.selector === "#tap-bad");
    expect(tap?.ruleId).toBe("canonical-size");
    expect(tap?.severity).toBe("error");
  });

  it("assumeTailwind:true forces spacing rules on the non-Tailwind page", async () => {
    const report = await auditFixture(
      "plain-css.html",
      { width: 1440, height: 900 },
      { ...DEFAULT_CONFIG, assumeTailwind: true },
    );
    // now the 13px padding on #panel is flagged
    expect(
      report.violations.some(
        (v) => v.ruleId === "spacing-scale" && v.selector === "#panel",
      ),
    ).toBe(true);
  });
});

describe("integration: suppression via data-gp-ignore (off-scale.html)", () => {
  it("counts the suppressed node but does not list it", async () => {
    const report = await auditFixture("off-scale.html");
    expect(report.suppressedCount).toBeGreaterThanOrEqual(1);
    expect(
      report.violations.some((v) => v.selector === "#ignored-box"),
    ).toBe(false);
  });
});

describe("integration: gap-consistency (gaps.html)", () => {
  it("fires exactly once on the ragged list, silent on the gap-4 list", async () => {
    const report = await auditFixture("gaps.html");
    const gaps = report.violations.filter(
      (v) => v.ruleId === "gap-consistency",
    );
    expect(gaps).toHaveLength(1);
    expect(gaps[0]?.selector).toBe("#ragged-list");
    expect(gaps[0]?.fixHint.kind).toBe("container-gap");
  });
});

describe("integration: gp_check_element (scoped re-check)", () => {
  it("returns the violation when scoped to the dirty element", async () => {
    const res = await runCheckElement({
      url: `${base}/off-scale.html`,
      selector: "#off-scale-box",
      viewport: { width: 1440, height: 900 },
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const spacing = res.report.violations.filter(
      (v) => v.ruleId === "spacing-scale",
    );
    expect(spacing).toHaveLength(1);
    expect(spacing[0]?.selector).toBe("#off-scale-box");
    expect(spacing[0]?.expected).toBe("12px");
  });

  it("reports clean for a fixed element (0 violations)", async () => {
    const res = await runCheckElement({
      url: `${base}/off-scale.html`,
      selector: "#clean-box",
      viewport: { width: 1440, height: 900 },
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.report.summary.total).toBe(0);
  });

  it("errors actionably when the selector matches nothing", async () => {
    const res = await runCheckElement({
      url: `${base}/off-scale.html`,
      selector: "#does-not-exist",
      viewport: { width: 1440, height: 900 },
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.message).toContain("matched no element");
  });

  it("scopes to the container for gap-consistency", async () => {
    const res = await runCheckElement({
      url: `${base}/gaps.html`,
      selector: "#ragged-list",
      viewport: { width: 1440, height: 900 },
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(
      res.report.violations.some((v) => v.ruleId === "gap-consistency"),
    ).toBe(true);
  });
});

describe("integration: canonical-size (canonical.html)", () => {
  it("flags a 32px tap target as an error citing WCAG 2.5.8 (mobile viewport)", async () => {
    const report = await auditFixture("canonical.html", {
      width: 375,
      height: 812,
    });
    const tap = report.violations.find((v) => v.selector === "#tap-bad");
    expect(tap).toBeDefined();
    expect(tap?.ruleId).toBe("canonical-size");
    expect(tap?.severity).toBe("error");
    expect(tap?.expected).toBe("44px");
    expect(tap?.fixHint.note ?? "").toContain("WCAG 2.5.8");
    // the 48px button is fine
    expect(
      report.violations.some((v) => v.selector === "#tap-ok"),
    ).toBe(false);
  });

  it("does NOT flag the same 32px tap target at desktop (>=768) width", async () => {
    const report = await auditFixture("canonical.html", {
      width: 1440,
      height: 900,
    });
    expect(
      report.violations.some((v) => v.selector === "#tap-bad"),
    ).toBe(false);
  });

  it("flags a 37px icon (outlier) as a warn snapping to nearest anchor (40px)", async () => {
    const report = await auditFixture("canonical.html");
    const icon = report.violations.find((v) => v.selector === "#icon-bad");
    expect(icon).toBeDefined();
    expect(icon?.severity).toBe("warn");
    expect(icon?.expected).toBe("40px");
    // the 24px icon is canonical
    expect(
      report.violations.some((v) => v.selector === "#icon-ok"),
    ).toBe(false);
  });

  it("does NOT flag an inline text link as a tap target (WCAG 2.5.8 exempt)", async () => {
    const report = await auditFixture("canonical.html");
    expect(
      report.violations.some((v) => v.selector === "#link-inline"),
    ).toBe(false);
  });

  it("does NOT flag a 14px icon (now canonical, v1.2)", async () => {
    const report = await auditFixture("canonical.html");
    expect(
      report.violations.some((v) => v.selector === "#icon-14"),
    ).toBe(false);
  });
});
