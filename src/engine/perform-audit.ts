import { loadConfig } from "../config/loader.js";
import type { RuleId } from "../config/schema.js";
import { collectGeometry } from "./collector.js";
import { RenderError, withRenderedPage } from "./renderer.js";
import { registry } from "./rule.js";
import { runAudit } from "./runner.js";
import type { AuditReport } from "../report/schema.js";
import { suppressSelectorsFromConfig } from "../util/suppress.js";

/**
 * Shared audit orchestration used by gp_audit, gp_report, and the CLI: load
 * config → render + collect (single in-page pass) → run the enabled rules.
 * Returns a discriminated result rather than throwing on the known conditions
 * (invalid config, unreachable URL, selector-not-found) so every caller can
 * surface an actionable message without a stack trace.
 */

export interface PerformAuditInput {
  url: string;
  viewport: { width: number; height: number };
  rules?: readonly RuleId[] | undefined;
  selector?: string | undefined;
  maxViolations: number;
}

export type PerformAuditResult =
  | {
      ok: true;
      report: AuditReport;
      /** Elements collected (for the report's "elements scanned" line). */
      elementsScanned: number;
      capped: boolean;
      cap: number;
    }
  | { ok: false; message: string };

export async function performAudit(
  input: PerformAuditInput,
): Promise<PerformAuditResult> {
  let config;
  try {
    ({ config } = await loadConfig());
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }

  let collection;
  try {
    collection = await withRenderedPage(input.url, input.viewport, (page) =>
      collectGeometry(page, {
        selector: input.selector,
        suppressSelectors: suppressSelectorsFromConfig(config.suppress),
      }),
    );
  } catch (err) {
    if (err instanceof RenderError) return { ok: false, message: err.message };
    return {
      ok: false,
      message: `audit failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!collection.rootFound) {
    const sel = input.selector ?? "body";
    return {
      ok: false,
      message: `Selector "${sel}" matched no element at ${input.url}. Check the selector or omit it to audit <body>.`,
    };
  }

  const report = runAudit({
    url: input.url,
    viewport: input.viewport,
    elements: collection.elements,
    config,
    registry,
    rules: input.rules,
    maxViolations: input.maxViolations,
    isTailwind: collection.isTailwind,
  });

  return {
    ok: true,
    report,
    elementsScanned: collection.count,
    capped: collection.capped,
    cap: collection.cap,
  };
}
