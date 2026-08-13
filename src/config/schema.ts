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
  /**
   * Viewport width (px) below which tap-target checks apply. WCAG 2.5.8 is a
   * touch criterion, so tap-target findings are emitted only when the audit
   * viewport is narrower than this (default 768 = the mobile breakpoint).
   */
  tapTargetBreakpoint: z.number().positive(),
  /** Minimum rendered box (px) for an element to count as an icon (default 10). */
  minIconSize: z.number().positive(),
  /**
   * Tolerance (px) around each canonical anchor size for icons (default 2).
   * Real icon sets (lucide/heroicons) use 18/22/26 routinely, so an icon is
   * valid when within ±iconTolerance of any anchor; only true outliers flag.
   */
  iconTolerance: z.number().nonnegative(),
  /**
   * Max aspect ratio (max/min side) before an "icon" is treated as a wordmark /
   * logo and skipped (default 2.5). A 62×18 wordmark is a logo, not a 62px icon.
   */
  iconAspectRatioMax: z.number().positive(),
  /**
   * Max inter-sibling distance (px) for gap-consistency to treat a container as
   * a content LIST rather than a layout wrapper (default 96). Page sections
   * spaced hundreds of px apart are structure, not a ragged list gap.
   */
  maxListGap: z.number().positive(),
  /**
   * Whether to run the Tailwind-specific rules (spacing-scale, arbitrary-value).
   * "auto" (default) = detect Tailwind on the page; true = always run;
   * false = always skip them (accessibility rules still run).
   */
  assumeTailwind: z.union([z.literal("auto"), z.boolean()]),
  rules: ruleSeverityMapSchema,
  suppress: z.array(suppressionSchema),
});
export type GridproofConfig = z.infer<typeof gridproofConfigSchema>;

/** The partial shape a user may write in `gridproof.config.json`. */
export const gridproofConfigFileSchema = gridproofConfigSchema.partial();
export type GridproofConfigFile = z.infer<typeof gridproofConfigFileSchema>;
