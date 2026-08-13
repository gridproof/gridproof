import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ruleIdSchema } from "../config/schema.js";
import { performAudit } from "../engine/perform-audit.js";
import { renderHtml } from "../report/html.js";
import type { AuditReport } from "../report/schema.js";
import { VERSION } from "../version.js";

/**
 * gp_report — runs an audit (same inputs as gp_audit) and writes a
 * self-contained HTML report to disk. Returns the file path plus the same
 * AuditReport structuredContent as gp_audit, so agents get both the JSON and a
 * shareable report. Unlike the other tools, this one WRITES one file.
 */

const DEFAULT_OUTPUT = "./gridproof-report.html";

const viewportSchema = z
  .object({
    width: z.number().int().min(320).max(3840),
    height: z.number().int().min(480).max(2160),
  })
  .default({ width: 1440, height: 900 })
  .describe("Viewport for this audit pass. Run once per breakpoint.");

export const reportInputShape = {
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
  outputPath: z
    .string()
    .optional()
    .describe(
      "Where to write the HTML report. Default: ./gridproof-report.html",
    ),
} as const;

const reportInputObject = z.object(reportInputShape);
export type ReportInput = z.infer<typeof reportInputObject>;

export type RunReportResult =
  | { ok: true; path: string; report: AuditReport }
  | { ok: false; message: string };

/** Core of gp_report, decoupled from the MCP transport for testing. */
export async function runReport(
  input: ReportInput,
  outputPath: string = DEFAULT_OUTPUT,
): Promise<RunReportResult> {
  const result = await performAudit({
    url: input.url,
    viewport: input.viewport,
    rules: input.rules,
    selector: input.selector,
    maxViolations: input.maxViolations,
  });
  if (!result.ok) return { ok: false, message: result.message };

  const html = renderHtml(result.report, {
    version: VERSION,
    elementsScanned: result.elementsScanned,
  });
  const abs = path.resolve(outputPath);
  try {
    await writeFile(abs, html, "utf8");
  } catch (err) {
    return {
      ok: false,
      message: `Could not write report to ${abs}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  return { ok: true, path: abs, report: result.report };
}

export function registerReportTool(server: McpServer): void {
  server.registerTool(
    "gp_report",
    {
      title: "Gridproof: audit + write HTML report",
      description:
        "Render a URL, audit its spacing/grid geometry, and WRITE a self-contained " +
        "HTML report to disk (default ./gridproof-report.html). Returns the file " +
        "path plus the same AuditReport JSON as gp_audit.",
      inputSchema: reportInputShape,
      annotations: {
        // Honest: this tool writes one file to disk (unlike gp_audit/gp_get_config).
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: ReportInput) => {
      const result = await runReport(
        args,
        args.outputPath ?? DEFAULT_OUTPUT,
      );
      if (!result.ok) {
        return {
          content: [{ type: "text" as const, text: result.message }],
          isError: true,
        };
      }

      const s = result.report.summary;
      const summary =
        `gp_report: wrote ${result.path} — ${s.total} finding(s) ` +
        `(${s.errors} error, ${s.warns} warn, ${s.infos} info) on ${args.url}.`;

      return {
        content: [{ type: "text" as const, text: summary }],
        structuredContent: result.report,
      };
    },
  );
}
