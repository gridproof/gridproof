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

async function auditFixture(name: string): Promise<AuditReport> {
  const collection = await withRenderedPage(
    `${base}/${name}`,
    { width: 1440, height: 900 },
    (page) => collectGeometry(page),
  );
  return runAudit({
    url: `${base}/${name}`,
    viewport: { width: 1440, height: 900 },
    elements: collection.elements,
    config: DEFAULT_CONFIG,
    registry,
    maxViolations: 50,
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
