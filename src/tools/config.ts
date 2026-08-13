import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadConfig } from "../config/loader.js";

/**
 * gp_get_config (spec §5.3). Returns the resolved config (defaults merged with a
 * discovered `gridproof.config.json`) so the agent knows the active scale/tokens
 * before proposing fixes. Fully functional in Day 1.
 */

export const configInputShape = {
  cwd: z
    .string()
    .optional()
    .describe(
      "Directory to search upward from for gridproof.config.json. Defaults to the server's working directory.",
    ),
} as const;

const configInputObject = z.object(configInputShape);
export type ConfigInput = z.infer<typeof configInputObject>;

export function registerConfigTool(server: McpServer): void {
  server.registerTool(
    "gp_get_config",
    {
      title: "Gridproof: get resolved config",
      description:
        "Return the effective Gridproof configuration (defaults merged with " +
        "gridproof.config.json if present): baseUnit, allowedValues, " +
        "canonicalSizes, minTapTarget, rule severities, suppressions.",
      inputSchema: configInputShape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (args: ConfigInput) => {
      let config;
      let source: string | null;
      try {
        ({ config, source } = await loadConfig(args.cwd ?? process.cwd()));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: msg }],
          isError: true,
        };
      }

      const structuredContent = {
        source, // absolute path of config file, or null when pure defaults
        usingDefaults: source === null,
        config,
      };

      const summary =
        (source === null
          ? "Using built-in defaults (no gridproof.config.json found). "
          : `Loaded config from ${source}. `) +
        `baseUnit=${config.baseUnit}, canonicalSizes=[${config.canonicalSizes.join(
          ", ",
        )}], minTapTarget=${config.minTapTarget}.`;

      return {
        content: [{ type: "text" as const, text: summary }],
        structuredContent,
      };
    },
  );
}
