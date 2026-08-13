import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/loader.js";
import { collectGeometry } from "../engine/collector.js";
import { RenderError, withRenderedPage } from "../engine/renderer.js";
import { registry } from "../engine/rule.js";
import { runAudit } from "../engine/runner.js";
import type { AuditReport } from "../report/schema.js";
import { suppressSelectorsFromConfig } from "../util/suppress.js";

/**
 * gp_check_element (spec §5.2) — post-fix verification of a single element
 * without re-running the full audit. Renders the URL, scopes collection to the
 * element's subtree, runs the enabled rules over just that subtree, and returns
 * the violations found there. This closes the fix→verify loop cheaply.
 */

const viewportSchema = z
  .object({
    width: z.number().int().min(320).max(3840),
    height: z.number().int().min(480).max(2160),
  })
  .default({ width: 1440, height: 900 })
  .describe("Viewport for this check. Defaults to 1440×900.");

export const checkElementInputShape = {
  url: z
    .string()
    .url()
    .describe("URL of the running frontend, e.g. http://localhost:5173"),
  selector: z
    .string()
    .describe("CSS selector of the single element (subtree) to re-check."),
  viewport: viewportSchema,
} as const;

const checkElementInputObject = z.object(checkElementInputShape);
export type CheckElementInput = z.infer<typeof checkElementInputObject>;

// Re-checks are scoped and small; never truncate them.
const CHECK_MAX_VIOLATIONS = 500;

export type CheckElementResult =
  | { ok: true; report: AuditReport }
  | { ok: false; message: string };

/**
 * Core of gp_check_element, decoupled from the MCP transport for testing.
 * Returns a discriminated result rather than throwing on known conditions
 * (invalid config, unreachable URL, selector-not-found).
 */
export async function runCheckElement(
  args: CheckElementInput,
): Promise<CheckElementResult> {
  let config;
  try {
    ({ config } = await loadConfig());
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }

  let collection;
  try {
    collection = await withRenderedPage(args.url, args.viewport, (page) =>
      collectGeometry(page, {
        selector: args.selector,
        suppressSelectors: suppressSelectorsFromConfig(config.suppress),
      }),
    );
  } catch (err) {
    if (err instanceof RenderError) return { ok: false, message: err.message };
    return {
      ok: false,
      message: `gp_check_element failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!collection.rootFound) {
    return {
      ok: false,
      message: `Selector "${args.selector}" matched no element at ${args.url}. Check the selector.`,
    };
  }

  const report = runAudit({
    url: args.url,
    viewport: args.viewport,
    elements: collection.elements,
    config,
    registry,
    maxViolations: CHECK_MAX_VIOLATIONS,
  });

  return { ok: true, report };
}

export function registerCheckElementTool(server: McpServer): void {
  server.registerTool(
    "gp_check_element",
    {
      title: "Gridproof: re-check one element",
      description:
        "Re-check a single element's subtree after a fix, without re-running " +
        "the full audit. Returns the violations found under that selector.",
      inputSchema: checkElementInputShape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: CheckElementInput) => {
      const result = await runCheckElement(args);

      if (!result.ok) {
        return {
          content: [{ type: "text" as const, text: result.message }],
          isError: true,
        };
      }

      const report = result.report;
      const s = report.summary;
      const clean = s.total === 0;
      const summary =
        `gp_check_element: ${s.total} violation(s) for "${args.selector}" ` +
        `(${s.errors} error, ${s.warns} warn) at ${args.viewport.width}×${args.viewport.height}.` +
        (clean ? " Clean — fix verified." : "") +
        (report.suppressedCount > 0
          ? ` ${report.suppressedCount} suppressed.`
          : "");

      return {
        content: [{ type: "text" as const, text: summary }],
        structuredContent: { selector: args.selector, ...report },
      };
    },
  );
}
