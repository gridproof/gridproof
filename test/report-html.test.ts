import { createServer, type Server } from "node:http";
import { readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { registry } from "../src/engine/rule.js";
import { registerDefaultRules } from "../src/engine/rules/register.js";
import { shutdownRenderer } from "../src/engine/renderer.js";
import { runReport } from "../src/tools/report.js";
import { runCli } from "../src/cli.js";

/**
 * End-to-end for the HTML report path: gp_report core (runReport) and the
 * `--report` CLI, against a served fixture. Uses a real browser + real file
 * writes to a temp dir.
 */

const FIXTURES = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../fixtures",
);

let server: Server;
let base: string;
const written: string[] = [];

function tmp(name: string): string {
  const p = path.join(os.tmpdir(), `gp-${Date.now()}-${name}`);
  written.push(p);
  return p;
}

beforeAll(async () => {
  registerDefaultRules(registry);
  server = createServer(async (req, res) => {
    try {
      const u = new URL(req.url ?? "/", "http://127.0.0.1");
      const file = path.join(FIXTURES, decodeURIComponent(u.pathname));
      if (!file.startsWith(FIXTURES)) throw new Error("bad path");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(await readFile(file));
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
  await Promise.all(written.map((p) => rm(p, { force: true })));
});

describe("gp_report (runReport)", () => {
  it("writes an HTML file, returns the path + structuredContent", async () => {
    const out = tmp("report.html");
    const res = await runReport(
      { url: `${base}/off-scale.html`, viewport: { width: 1440, height: 900 }, maxViolations: 50 },
      out,
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.path).toBe(path.resolve(out));
    // structuredContent is the AuditReport
    expect(res.report.url).toContain("/off-scale.html");
    expect(res.report.summary.total).toBeGreaterThanOrEqual(1);

    const html = await readFile(res.path, "utf8");
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain("grid<b>proof</b>");
    // the fixture's off-scale 13px finding appears
    expect(html).toContain("#off-scale-box");
    expect(html).toContain("13px");
    // suppressed node counted in the footer (fixture has one data-gp-ignore)
    expect(html).toContain("suppressed");
  });

  it("surfaces an actionable error for an unreachable URL (no stack)", async () => {
    const res = await runReport(
      { url: "http://127.0.0.1:1/nope.html", viewport: { width: 1440, height: 900 }, maxViolations: 50 },
      tmp("never.html"),
    );
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.message).toMatch(/Could not reach|dev server/i);
    expect(res.message).not.toMatch(/\n\s+at /); // no stack trace
  });
});

describe("--report CLI", () => {
  it("writes the report and returns exit code 0", async () => {
    const out = tmp("cli.html");
    const code = await runCli([
      "--report",
      `${base}/off-scale.html`,
      "--out",
      out,
      "--viewport",
      "1440x900",
    ]);
    expect(code).toBe(0);
    const html = await readFile(path.resolve(out), "utf8");
    expect(html).toContain("Gridproof v");
    expect(html).toContain("#off-scale-box");
  });

  it("returns exit code 1 with usage when --report has no url", async () => {
    expect(await runCli(["--out", "x.html"])).toBe(1);
  });
});
