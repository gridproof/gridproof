#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAuditTool } from "./tools/audit.js";
import { registerCheckElementTool } from "./tools/check-element.js";
import { registerConfigTool } from "./tools/config.js";
import { registry } from "./engine/rule.js";
import { registerDefaultRules } from "./engine/rules/register.js";
import { shutdownRenderer } from "./engine/renderer.js";

/**
 * Gridproof MCP server entry (spec §4). Stdio transport, three tools:
 * gp_audit, gp_check_element, gp_get_config. Chromium is launched lazily by the
 * renderer on first audit, not at boot — so the server loads instantly in
 * Claude Code even before browsers are installed.
 */

const PACKAGE_NAME = "gridproof";
const PACKAGE_VERSION = "0.1.0";

async function main(): Promise<void> {
  const server = new McpServer({
    name: PACKAGE_NAME,
    version: PACKAGE_VERSION,
  });

  // Populate the rule registry before any audit runs.
  registerDefaultRules(registry);

  registerAuditTool(server);
  registerCheckElementTool(server);
  registerConfigTool(server);

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
