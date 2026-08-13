import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * gp_check_element (spec §5.2) — post-fix verification of a single element,
 * closing the fix loop cheaply.
 *
 * Day 1: MINIMAL VALID STUB. Accepts the documented input and returns a
 * well-formed empty result (no rules exist yet). Day 2+ will render the URL,
 * collect the single element's geometry, and run the enabled rules over it.
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
    .describe("CSS selector of the single element to re-check."),
  viewport: viewportSchema,
} as const;

const checkElementInputObject = z.object(checkElementInputShape);
export type CheckElementInput = z.infer<typeof checkElementInputObject>;

export function registerCheckElementTool(server: McpServer): void {
  server.registerTool(
    "gp_check_element",
    {
      title: "Gridproof: re-check one element",
      description:
        "Re-check a single element after a fix, without re-running the full " +
        "audit. Day 1: stub — returns an empty violation set (no rules yet).",
      inputSchema: checkElementInputShape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: CheckElementInput) => {
      const structuredContent = {
        mode: "stub" as const,
        url: args.url,
        selector: args.selector,
        viewport: args.viewport,
        violations: [] as unknown[],
        note: "gp_check_element is a Day 1 stub; per-element rule checks land Day 2+.",
      };

      return {
        content: [
          {
            type: "text" as const,
            text: `gp_check_element (stub): no rules run yet for "${args.selector}". 0 violations.`,
          },
        ],
        structuredContent,
      };
    },
  );
}
