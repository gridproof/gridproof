import { shutdownRenderer } from "./engine/renderer.js";
import { runReport } from "./tools/report.js";

/**
 * CLI mode: `npx gridproof --report <url> [--out <path>] [--viewport WxH]`.
 * Runs one audit, writes the HTML report, prints the path. Returns an exit code
 * (0 ok, 1 error). Falls back to the stdio MCP server when `--report` is absent
 * (dispatched in index.ts).
 */

const USAGE =
  "usage: npx gridproof --report <url> [--out <path>] [--viewport WxH]";

export function parseViewport(
  s: string,
): { width: number; height: number } | null {
  const m = /^(\d+)x(\d+)$/i.exec(s.trim());
  if (m === null) return null;
  return { width: Number(m[1]), height: Number(m[2]) };
}

/** Read the value following `--flag` in argv, or undefined. */
function flagValue(argv: readonly string[], flag: string): string | undefined {
  const i = argv.indexOf(flag);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
}

export async function runCli(argv: readonly string[]): Promise<number> {
  const url = flagValue(argv, "--report");
  if (url === undefined || url.startsWith("--")) {
    process.stderr.write(`${USAGE}\n`);
    return 1;
  }

  let viewport = { width: 1440, height: 900 };
  const vpStr = flagValue(argv, "--viewport");
  if (vpStr !== undefined) {
    const parsed = parseViewport(vpStr);
    if (parsed === null) {
      process.stderr.write(
        `Invalid --viewport "${vpStr}"; expected WxH, e.g. 1440x900.\n`,
      );
      return 1;
    }
    viewport = parsed;
  }

  const out = flagValue(argv, "--out") ?? "./gridproof-report.html";

  try {
    const result = await runReport({ url, viewport, maxViolations: 50 }, out);
    if (!result.ok) {
      process.stderr.write(`${result.message}\n`);
      return 1;
    }
    const s = result.report.summary;
    process.stdout.write(`${result.path}\n`);
    process.stderr.write(
      `Gridproof: ${s.total} finding(s) (${s.errors} error, ${s.warns} warn, ${s.infos} info) at ${viewport.width}×${viewport.height}.\n`,
    );
    return 0;
  } finally {
    await shutdownRenderer();
  }
}
