import { z } from "zod";

/**
 * Gridproof configuration schema (spec §8).
 *
 * All fields optional at the file level; {@link ../config/defaults.ts} supplies
 * the defaults and {@link ./loader.ts} merges a discovered `gridproof.config.json`
 * over them. Severity is `warn` everywhere except tap targets — "suggest, don't
 * forbid": no rule blocks, the tool has no exit-code semantics in v1.
 */

export const RULE_IDS = [
  "spacing-scale",
  "arbitrary-value",
  "gap-consistency",
  "canonical-size",
] as const;

export const ruleIdSchema = z.enum(RULE_IDS);
export type RuleId = z.infer<typeof ruleIdSchema>;

export const severitySchema = z.enum(["error", "warn"]);
export type Severity = z.infer<typeof severitySchema>;

/** Per-rule severity map. */
export const ruleSeverityMapSchema = z.record(ruleIdSchema, severitySchema);
export type RuleSeverityMap = z.infer<typeof ruleSeverityMapSchema>;

/**
 * Suppression entry. Two shapes, both counted-never-listed:
 *  - selector-based: hide findings under a CSS selector (optionally per-rule)
 *  - value-based:    hide a specific computed value everywhere, with a reason
 */
export const suppressionSchema = z.union([
  z.object({
    selector: z.string(),
    rules: z.array(ruleIdSchema).optional(),
  }),
  z.object({
    value: z.string(),
    reason: z.string().optional(),
  }),
]);
export type Suppression = z.infer<typeof suppressionSchema>;

export const gridproofConfigSchema = z.object({
  baseUnit: z.number().positive(),
  allowedValues: z.array(z.number()),
  canonicalSizes: z.array(z.number()),
  minTapTarget: z.number().positive(),
  rules: ruleSeverityMapSchema,
  suppress: z.array(suppressionSchema),
});
export type GridproofConfig = z.infer<typeof gridproofConfigSchema>;

/** The partial shape a user may write in `gridproof.config.json`. */
export const gridproofConfigFileSchema = gridproofConfigSchema.partial();
export type GridproofConfigFile = z.infer<typeof gridproofConfigFileSchema>;
