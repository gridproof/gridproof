import { describe, expect, it } from "vitest";
import { renderHtml } from "../src/report/html.js";
import type { AuditReport, Violation } from "../src/report/schema.js";

function mkViolation(o: Partial<Violation> = {}): Violation {
  return {
    ruleId: o.ruleId ?? "spacing-scale",
    severity: o.severity ?? "warn",
    selector: o.selector ?? "#el",
    property: o.property ?? "padding",
    actual: o.actual ?? "13px",
    expected: o.expected ?? "12px",
    fixHint: o.fixHint ?? { kind: "manual", note: "trace padding:13px" },
    ...(o.snippet !== undefined ? { snippet: o.snippet } : {}),
  };
}

function mkReport(o: Partial<AuditReport> = {}): AuditReport {
  const violations = o.violations ?? [];
  return {
    url: o.url ?? "http://localhost:5173/",
    viewport: o.viewport ?? { width: 1440, height: 900 },
    timestamp: o.timestamp ?? "2026-01-01T00:00:00.000Z",
    config: o.config ?? {
      baseUnit: 4,
      scale: [0, 4, 8, 12, 16],
      canonicalSizes: [12, 14, 16, 20, 24, 32, 40, 48],
    },
    summary: o.summary ?? {
      total: violations.length,
      byRule: {},
      errors: 0,
      warns: 0,
      infos: 0,
    },
    violations,
    truncated: o.truncated ?? false,
    suppressedCount: o.suppressedCount ?? 0,
    isTailwind: o.isTailwind ?? true,
    notes: o.notes ?? [],
  };
}

const META = { version: "0.1.0", elementsScanned: 812 };

describe("renderHtml — findings report", () => {
  const report = mkReport({
    violations: [
      mkViolation({
        ruleId: "canonical-size",
        severity: "error",
        selector: "#tap-btn",
        property: "width",
        actual: "32px",
        expected: "44px",
        fixHint: {
          kind: "manual",
          note: "interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px",
        },
      }),
      mkViolation({
        ruleId: "arbitrary-value",
        severity: "warn",
        selector: "#hero-box",
        property: "padding",
        actual: "13px",
        expected: "12px",
        fixHint: { kind: "tailwind-class", from: "p-[13px]", to: "p-3" },
      }),
      mkViolation({
        ruleId: "spacing-scale",
        severity: "info",
        selector: "#lib-el",
        property: "padding",
        actual: "9px",
        expected: "8px",
        fixHint: { kind: "manual", note: "trace padding:9px in stylesheets" },
      }),
    ],
    summary: {
      total: 5,
      byRule: { "canonical-size": 1, "arbitrary-value": 1, "spacing-scale": 1 },
      errors: 1,
      warns: 1,
      infos: 1,
    },
    truncated: true,
    suppressedCount: 2,
  });
  const html = renderHtml(report, META);

  it("is a complete self-contained HTML document", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("</html>");
    expect(html).toContain("<style>");
    // no external resources at all
    expect(html).not.toContain("src=");
    expect(html).not.toContain("href=");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("cdn");
  });

  it("shows the score numbers and the health bar segments", () => {
    // three colored score numbers
    expect(html).toMatch(/score-cell error[\s\S]*?>1</);
    expect(html).toContain("errors");
    expect(html).toContain("warnings");
    // proportional health bar with all three severities
    expect(html).toContain('class="seg error"');
    expect(html).toContain('class="seg warn"');
    expect(html).toContain('class="seg info"');
  });

  it("renders the byRule strip for all four rules", () => {
    for (const id of [
      "spacing-scale",
      "arbitrary-value",
      "gap-consistency",
      "canonical-size",
    ]) {
      expect(html).toContain(id);
    }
  });

  it("renders each violation's selector, issue, and fix", () => {
    expect(html).toContain("#tap-btn");
    expect(html).toContain("#hero-box");
    // from→to colored swap
    expect(html).toContain('class="from">p-[13px]');
    expect(html).toContain('class="to">p-3');
    // tap-target issue + highlighted WCAG note
    expect(html).toContain("tap target 32px, below 44px");
    expect(html).toContain('class="wcag">WCAG 2.5.8');
  });

  it("shows the truncation row and the suppressed footer", () => {
    expect(html).toMatch(/truncated to 3 of 5/);
    expect(html).toContain("2 more");
    expect(html).toContain("2 suppressed");
  });

  it("run-context line includes url, viewport, tailwind, elements", () => {
    expect(html).toContain("localhost:5173");
    expect(html).toContain("1440");
    expect(html).toContain("812 elements");
  });

  it("no gate badge on a Tailwind page", () => {
    expect(html).not.toContain("Non-Tailwind");
  });

  it("footer carries version + tagline", () => {
    expect(html).toContain("Gridproof v0.1.0");
    expect(html).toContain("suggest, don't forbid");
  });

  it("escapes dynamic content (no HTML injection via selector)", () => {
    const injected = renderHtml(
      mkReport({
        violations: [mkViolation({ selector: 'a[x="<b>oops</b>"]' })],
        summary: {
          total: 1,
          byRule: { "spacing-scale": 1 },
          errors: 0,
          warns: 1,
          infos: 0,
        },
      }),
      META,
    );
    expect(injected).toContain("&lt;b&gt;oops&lt;/b&gt;");
    expect(injected).not.toContain("<b>oops</b>");
  });
});

describe("renderHtml — clean report", () => {
  it("shows the No drift detected state", () => {
    const html = renderHtml(mkReport({ violations: [] }), META);
    expect(html).toContain("No drift detected");
    expect(html).toContain("bar-clean");
    expect(html).toContain("Nothing to fix");
  });
});

describe("renderHtml — non-Tailwind page", () => {
  it("shows the gate badge", () => {
    const html = renderHtml(mkReport({ isTailwind: false }), META);
    expect(html).toContain("Non-Tailwind page");
    expect(html).toContain("accessibility checks only");
  });
});
