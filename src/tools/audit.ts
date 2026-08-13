import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ruleIdSchema } from "../config/schema.js";
import { collectGeometry } from "../engine/collector.js";
import { RenderError, withRenderedPage } from "../engine/renderer.js";

/**
 * gp_audit (spec §5.1) — primary tool.
 *
 * Day 1: RAW-GEOMETRY MODE. Renders the URL, collects computed geometry in a
 * single in-page pass, and returns it as `structuredContent` plus a short text
 * summary. No rules run — the rule engine registry is empty by design today.
 * The `rules` input is accepted and echoed but not yet applied.
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
        "Render a running frontend and audit its spacing/grid geometry. " +
        "Day 1: returns RAW collected geometry (selector, tag, classes, rect, " +
        "computed spacing/size) as structuredContent — no rule findings yet.",
      inputSchema: auditInputShape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: AuditInput) => {
      try {
        const result = await withRenderedPage(
          args.url,
          args.viewport,
          (page) => collectGeometry(page, { selector: args.selector }),
        );

        if (!result.rootFound) {
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

        const notes: string[] = [];
        if (result.capped) {
          notes.push(
            `Element cap of ${result.cap} reached; collection stopped early. Narrow with the "selector" input for full coverage.`,
          );
        }

        const structuredContent = {
          mode: "raw-geometry" as const,
          url: args.url,
          viewport: args.viewport,
          timestamp: new Date().toISOString(),
          rootSelector: args.selector ?? "body",
          rulesRequested: args.rules ?? null,
          rulesApplied: [] as string[], // none in Day 1
          count: result.count,
          capped: result.capped,
          cap: result.cap,
          notes,
          elements: result.elements,
        };

        const summary =
          `gp_audit (raw geometry): collected ${result.count} element(s) from ` +
          `${structuredContent.rootSelector} at ${args.viewport.width}×${args.viewport.height} on ${args.url}. ` +
          `No rules run yet (Day 1 raw mode).` +
          (notes.length > 0 ? ` ${notes.join(" ")}` : "");

        return {
          content: [{ type: "text" as const, text: summary }],
          structuredContent,
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
          content: [
            { type: "text" as const, text: `gp_audit failed: ${msg}` },
          ],
          isError: true,
        };
      }
    },
  );
}
