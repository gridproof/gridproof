import { readFile } from "node:fs/promises";
import { dirname, join, parse as parsePath } from "node:path";
import { DEFAULT_CONFIG } from "./defaults.js";
import {
  gridproofConfigFileSchema,
  type GridproofConfig,
} from "./schema.js";

const CONFIG_FILENAME = "gridproof.config.json";

/**
 * Walk up from `startDir` looking for `gridproof.config.json`.
 * Returns the absolute path or `null` if none found before the filesystem root.
 */
async function findConfigFile(startDir: string): Promise<string | null> {
  let dir = startDir;
  // Stop once dirname() stops changing (filesystem root).
  for (;;) {
    const candidate = join(dir, CONFIG_FILENAME);
    try {
      await readFile(candidate, "utf8");
      return candidate;
    } catch {
      // not here — keep walking up
    }
    const parent = dirname(dir);
    if (parent === dir || parent === parsePath(dir).root) {
      // one more check at the root itself
      const rootCandidate = join(parent, CONFIG_FILENAME);
      try {
        await readFile(rootCandidate, "utf8");
        return rootCandidate;
      } catch {
        return null;
      }
    }
    dir = parent;
  }
}

/**
 * Shallow-merge a partial config file over {@link DEFAULT_CONFIG}.
 * Top-level keys override wholesale (arrays/objects are replaced, not deep-merged)
 * — predictable and matches the spec's flat config shape.
 */
export function mergeConfig(
  file: Partial<GridproofConfig>,
): GridproofConfig {
  return {
    baseUnit: file.baseUnit ?? DEFAULT_CONFIG.baseUnit,
    allowedValues: file.allowedValues ?? DEFAULT_CONFIG.allowedValues,
    canonicalSizes: file.canonicalSizes ?? DEFAULT_CONFIG.canonicalSizes,
    minTapTarget: file.minTapTarget ?? DEFAULT_CONFIG.minTapTarget,
    tapTargetBreakpoint:
      file.tapTargetBreakpoint ?? DEFAULT_CONFIG.tapTargetBreakpoint,
    rules: { ...DEFAULT_CONFIG.rules, ...(file.rules ?? {}) },
    suppress: file.suppress ?? DEFAULT_CONFIG.suppress,
  };
}

export interface LoadedConfig {
  config: GridproofConfig;
  /** Absolute path of the config file used, or null when defaults were used. */
  source: string | null;
}

/**
 * Resolve the effective config: defaults merged with a discovered
 * `gridproof.config.json` (searched upward from `cwd`). Returns pure defaults
 * when no file exists. Throws a clear error only when a file exists but is
 * malformed — never on absence.
 */
export async function loadConfig(
  cwd: string = process.cwd(),
): Promise<LoadedConfig> {
  const path = await findConfigFile(cwd);
  if (path === null) {
    return { config: DEFAULT_CONFIG, source: null };
  }

  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch {
    return { config: DEFAULT_CONFIG, source: null };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Invalid ${CONFIG_FILENAME} at ${path}: not valid JSON (${
        (err as Error).message
      }).`,
    );
  }

  const parsed = gridproofConfigFileSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Invalid ${CONFIG_FILENAME} at ${path}: ${parsed.error.message}`,
    );
  }

  return { config: mergeConfig(parsed.data), source: path };
}
