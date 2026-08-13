import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/loader.js";
import { ruleIdSchema } from "../config/schema.js";
import { collectGeometry } from "../engine/collector.js";
import { RenderError, withRenderedPage } from "../engine/renderer.js";
import { registry } from "../engine/rule.js";
import { runAudit } from "../engine/runner.js";
import { suppressSelectorsFromConfig } from "../util/suppress.js";

/**
 * gp_audit (spec §5.1) — primary tool. Renders the URL, collects geometry in a
 * single in-page pass, runs the enabled rules, and returns an AuditReport (§6)
 * as `structuredContent` plus a short text summary.
 *
 * Day 2: spacing-scale and arbitrary-value are live; gap-consistency and
 * canonical-size are not yet registered (no-op).
 */

const viewportSchema = z
  .object({
    width: z.number().int().min(320).max(3840),
    height: z.number().int().min(480).max(2160),
  })
  .default({ width: 1440, height: 900 })
  .describe("Viewport for this audit pass. Run once per breakpoint.");

/** Input shape (ZodRawShape) per spec §5.1. */
export const auditInputShape = {
  url: z
    .string()
    .url()
    .describe("URL of the running frontend, e.g. http://localhost:5173"),
  viewport: viewportSchema,
  rules: z
    .array(ruleIdSchema)
    .optional()
    .describe("Subset of rules to run. Default: all enabled in config."),
  selector: z
    .string()
    .optional()
    .describe("Limit audit to a DOM subtree, e.g. '#main'. Default: body."),
  maxViolations: z
    .number()
    .int()
    .default(50)
    .describe("Cap report size to protect agent context window."),
} as const;

const auditInputObject = z.object(auditInputShape);
export type AuditInput = z.infer<typeof auditInputObject>;

export function registerAuditTool(server: McpServer): void {
  server.registerTool(
    "gp_audit",
    {
      title: "Gridproof: audit a URL",
      description:
        "Render a running frontend and audit its spacing/grid geometry against " +
        "the spacing-scale and arbitrary-value rules. Returns a structured " +
        "AuditReport (violations with fix hints) plus a text summary.",
      inputSchema: auditInputShape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: AuditInput) => {
      try {
        // Load config first — selector-form suppressions must be matched in-page.
        let config;
        try {
          ({ config } = await loadConfig());
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: "text" as const, text: msg }],
            isError: true,
          };
        }

        const collection = await withRenderedPage(
          args.url,
          args.viewport,
          (page) =>
            collectGeometry(page, {
              selector: args.selector,
              suppressSelectors: suppressSelectorsFromConfig(config.suppress),
            }),
        );

        if (!collection.rootFound) {
          const sel = args.selector ?? "body";
          return {
            content: [
              {
                type: "text" as const,
                text: `Selector "${sel}" matched no element at ${args.url}. Check the selector or omit it to audit <body>.`,
              },
            ],
            isError: true,
          };
        }

        const report = runAudit({
          url: args.url,
          viewport: args.viewport,
          elements: collection.elements,
          config,
          registry,
          rules: args.rules,
          maxViolations: args.maxViolations,
          isTailwind: collection.isTailwind,
        });

        const extra: string[] = [...report.notes];
        if (collection.capped) {
          extra.push(
            `Element cap of ${collection.cap} reached during collection; narrow with "selector" for full coverage.`,
          );
        }
        if (report.truncated) {
          extra.push(
            `Showing worst ${report.violations.length} of ${report.summary.total}; raise "maxViolations" to see more.`,
          );
        }

        if (report.suppressedCount > 0) {
          extra.push(`${report.suppressedCount} finding(s) suppressed.`);
        }

        const s = report.summary;
        const summary =
          `gp_audit: ${s.total} violation(s) (${s.errors} error, ${s.warns} warn, ${s.infos} info) ` +
          `on ${args.url} at ${args.viewport.width}×${args.viewport.height}. ` +
          `byRule: ${Object.entries(s.byRule)
            .map(([r, n]) => `${r}=${n}`)
            .join(", ") || "none"}.` +
          (extra.length > 0 ? ` ${extra.join(" ")}` : "");

        return {
          content: [{ type: "text" as const, text: summary }],
          structuredContent: report,
        };
      } catch (err) {
        if (err instanceof RenderError) {
          return {
            content: [{ type: "text" as const, text: err.message }],
            isError: true,
          };
        }
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `gp_audit failed: ${msg}` }],
          isError: true,
        };
      }
    },
  );
}
