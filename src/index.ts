#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAuditTool } from "./tools/audit.js";
import { registerCheckElementTool } from "./tools/check-element.js";
import { registerConfigTool } from "./tools/config.js";
import { registerReportTool } from "./tools/report.js";
import { registry } from "./engine/rule.js";
import { registerDefaultRules } from "./engine/rules/register.js";
import { shutdownRenderer } from "./engine/renderer.js";
import { runCli } from "./cli.js";
import { VERSION } from "./version.js";

/**
 * Gridproof entry. Default: MCP server over stdio (tools gp_audit,
 * gp_check_element, gp_get_config, gp_report). With `--report <url>` it runs a
 * one-shot CLI audit that writes an HTML report instead of starting the server.
 * Chromium is launched lazily by the renderer on first audit, not at boot.
 */

const PACKAGE_NAME = "gridproof";

async function main(): Promise<void> {
  // Populate the rule registry before any audit runs (both modes need it).
  registerDefaultRules(registry);

  // CLI mode: --report <url> [--out <path>] [--viewport WxH].
  const argv = process.argv.slice(2);
  if (argv.includes("--report")) {
    const code = await runCli(argv);
    process.exit(code);
  }

  const server = new McpServer({ name: PACKAGE_NAME, version: VERSION });

  registerAuditTool(server);
  registerCheckElementTool(server);
  registerConfigTool(server);
  registerReportTool(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // stdio servers stay alive on the transport; ensure Chromium is torn down.
  const shutdown = (): void => {
    void shutdownRenderer().finally(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  // Never leak a stack trace over stdio to the client; log to stderr and exit.
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`gridproof: fatal: ${msg}\n`);
  process.exit(1);
});
