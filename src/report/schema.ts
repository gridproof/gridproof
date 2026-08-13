import { z } from "zod";
import { ruleIdSchema } from "../config/schema.js";

/**
 * Violation severity. `error`/`warn` come from config; `info` is assigned by a
 * rule for findings that are true but not user-actionable (e.g. systematic
 * off-grid spacing sourced from a third-party component library).
 */
export const violationSeveritySchema = z.enum(["error", "warn", "info"]);
export type ViolationSeverity = z.infer<typeof violationSeveritySchema>;

/**
 * Report schema (spec §6). Defined in full now; consumed by the rule engine
 * starting Day 2. Day 1 `gp_audit` runs in raw-geometry mode and does NOT emit
 * an AuditReport yet — these types are the contract the rules will fill.
 */

export const fixHintKindSchema = z.enum([
  "tailwind-class",
  "css-value",
  "container-gap",
  "manual",
]);
export type FixHintKind = z.infer<typeof fixHintKindSchema>;

export const fixHintSchema = z.object({
  kind: fixHintKindSchema,
  from: z.string().optional(),
  to: z.string().optional(),
  note: z.string().optional(),
});
export type FixHint = z.infer<typeof fixHintSchema>;

export const violationSchema = z.object({
  ruleId: ruleIdSchema,
  /** error (tap-target), warn (off-scale, default), or info (systematic/library). */
  severity: violationSeveritySchema,
  /** stable CSS selector (id > data-testid > shortest unique class > nth path). */
  selector: z.string(),
  /** e.g. "padding-top", "gap", "width". */
  property: z.string(),
  /** computed value, e.g. "13px". */
  actual: z.string(),
  /** nearest valid value, e.g. "12px". */
  expected: z.string(),
  fixHint: fixHintSchema,
  /** outerHTML head of the element, truncated to 120 chars. */
  snippet: z.string().optional(),
});
export type Violation = z.infer<typeof violationSchema>;

export const auditReportSchema = z.object({
  url: z.string(),
  viewport: z.object({ width: z.number(), height: z.number() }),
  /** ISO 8601. */
  timestamp: z.string(),
  config: z.object({
    baseUnit: z.number(),
    scale: z.array(z.number()),
    canonicalSizes: z.array(z.number()),
  }),
  summary: z.object({
    total: z.number(),
    byRule: z.record(z.string(), z.number()),
    errors: z.number(),
    warns: z.number(),
    infos: z.number(),
  }),
  violations: z.array(violationSchema),
  truncated: z.boolean(),
  /** how many findings were hidden by suppressions. */
  suppressedCount: z.number(),
  /** Whether the page was detected/assumed to use Tailwind. */
  isTailwind: z.boolean(),
  /** Informational notes (e.g. rules skipped on a non-Tailwind page). */
  notes: z.array(z.string()),
});
export type AuditReport = z.infer<typeof auditReportSchema>;
