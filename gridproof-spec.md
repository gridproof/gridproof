# Gridproof — MVP Technical Specification v1.1

Spec for Claude Code. Build order is top-to-bottom. Everything marked **v2** is OUT of scope for this build — do not implement, only leave extension points.

---

## 0. Naming (fixed, do not change)

| Asset | Value |
|-------|-------|
| Product | Gridproof |
| Tagline | "Gridproof your UI — automated spacing & grid QA in the agent loop" |
| GitHub repo | `gridproof/gridproof` |
| npm package | `gridproof` (already reserved as 0.0.1 stub — bump version on first real publish, never unpublish) |
| Binary | `npx gridproof` |
| MCP tool prefix | `gp_` |
| Config file | `gridproof.config.json` |
| Inline suppression attr | `data-gp-ignore` |

## 1. Product Overview

**Problem:** AI coding agents generate UIs with off-scale spacing (`py-[13px]`), inconsistent gaps, and non-standard sizes. This design drift ships to production because no automated check exists inside the agent loop.

**Solution:** An MCP server + Claude Code skill that renders the frontend (Playwright), measures computed geometry, checks it against a spacing/token rule set, and returns a structured fix report the agent applies to source code, then re-checks.

**Form factor:** Open-source npm package `gridproof` (MCP server, stdio transport) + `SKILL.md` for Claude Code. No SaaS, no auth, no billing in v1.

**Core loop:**
```
agent generates UI → gp_audit(url) → JSON violations with fix hints
→ agent edits source → gp_audit(url) → clean report = done
```

---

## 2. Scope

### v1 (this build)
| # | Rule ID | Check | Fix strategy |
|---|---------|-------|--------------|
| 1 | `spacing-scale` | Computed margin/padding/gap not a multiple of base unit (default 4px) and not in token scale | Snap to nearest valid value |
| 2 | `arbitrary-value` | Tailwind arbitrary spacing/size classes (`p-[13px]`, `w-[347px]`, `gap-[7px]`) off-scale | Suggest nearest Tailwind scale class |
| 3 | `gap-consistency` | Sibling gaps inside a flex/grid container differ (when not set via `gap`) | Suggest unifying via `gap` on the container |
| 4 | `canonical-size` | Icon/interactive-element sizes off canonical scale {16, 20, 24, 32, 40, 48} + tap targets < 44px | Snap to nearest canonical size; enlarge tap targets |

### v2 (extension points only, no implementation)
Column-grid clustering, gutter consistency, cross-breakpoint alignment drift, baseline rhythm, Figma token import. The rule engine must be pluggable so these drop in as new `Rule` implementations.

### Explicit non-goals for v1
No computer vision, no screenshots-as-analysis (screenshot only as report attachment), no CI runner, no auto-editing of source files by the server itself (the agent edits; the server only measures and suggests).

---

## 3. Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript, strict mode | MCP SDK quality, typed rule engine |
| MCP | `@modelcontextprotocol/sdk`, stdio transport | Local tool for Claude Code; no HTTP needed |
| Schemas | Zod for all tool inputs/outputs | Validation + self-documenting |
| Rendering | Playwright (Chromium only) | Deterministic computed styles, viewport control |
| Package | Single npm package, `npx gridproof` runnable | Zero-install UX via npx |
| Tests | Vitest + fixture HTML pages | Deterministic, no network |

Before implementation, fetch the TypeScript MCP SDK README (`https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`) and follow current `server.registerTool` patterns.

---

## 4. Repository Structure

```
gridproof/
├── package.json
├── tsconfig.json
├── README.md                  # install, quickstart, GIF demo placeholder
├── SKILL.md                   # Claude Code skill (section 9)
├── src/
│   ├── index.ts               # MCP server entry, stdio transport
│   ├── tools/
│   │   ├── audit.ts           # gp_audit tool
│   │   ├── check-element.ts   # gp_check_element tool
│   │   └── config.ts          # gp_get_config tool
│   ├── engine/
│   │   ├── renderer.ts        # Playwright lifecycle, page pooling
│   │   ├── collector.ts       # in-page script: walk DOM, collect geometry
│   │   ├── rule.ts            # Rule interface + registry
│   │   └── rules/
│   │       ├── spacing-scale.ts
│   │       ├── arbitrary-value.ts
│   │       ├── gap-consistency.ts
│   │       └── canonical-size.ts
│   ├── report/
│   │   ├── schema.ts          # Zod: Violation, AuditReport
│   │   └── source-hint.ts     # map computed value → likely source (Tailwind class / CSS var)
│   ├── config/
│   │   ├── schema.ts          # Zod: GridproofConfig
│   │   ├── loader.ts          # find + parse gridproof.config.json, defaults
│   │   └── defaults.ts
│   └── util/
│       ├── nearest.ts         # snap-to-scale math
│       └── suppress.ts        # suppression matching
├── fixtures/                  # HTML test pages with known violations
│   ├── off-scale.html
│   ├── arbitrary.html
│   ├── gaps.html
│   └── clean.html
└── test/
    └── *.test.ts              # one test file per rule + integration
```

---

## 5. MCP Tools

All tools: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false` (audit touches only the given URL). Return both human-readable text summary AND `structuredContent`.

### 5.1 `gp_audit`
Primary tool. Renders URL, runs all enabled rules, returns full report.

```ts
// Input (Zod)
{
  url: z.string().url()
    .describe("URL of the running frontend, e.g. http://localhost:5173"),
  viewport: z.object({ width: z.number().int().min(320).max(3840),
                       height: z.number().int().min(480).max(2160) })
    .default({ width: 1440, height: 900 })
    .describe("Viewport for this audit pass. Run once per breakpoint."),
  rules: z.array(z.enum(["spacing-scale","arbitrary-value","gap-consistency","canonical-size"]))
    .optional()
    .describe("Subset of rules to run. Default: all enabled in config."),
  selector: z.string().optional()
    .describe("Limit audit to a DOM subtree, e.g. '#main'. Default: body."),
  maxViolations: z.number().int().default(50)
    .describe("Cap report size to protect agent context window.")
}
```

Output: `AuditReport` (section 6). If >maxViolations found, truncate, set `truncated: true`, and sort by severity then by DOM order so the agent fixes the worst first.

### 5.2 `gp_check_element`
Post-fix verification of a single element without re-running the full audit. Input: `url`, `selector`, optional `viewport`. Output: violations for that element only. This closes the loop cheaply.

### 5.3 `gp_get_config`
Returns resolved config (defaults + `gridproof.config.json` merge) so the agent knows the active scale/tokens before proposing fixes.

---

## 6. Report Schema

```ts
interface Violation {
  ruleId: "spacing-scale" | "arbitrary-value" | "gap-consistency" | "canonical-size";
  severity: "error" | "warn";        // off-scale = warn by default; tap-target<44 = error
  selector: string;                  // stable CSS selector (id > data-testid > nth-of-type path)
  property: string;                  // e.g. "padding-top", "gap", "width"
  actual: string;                    // computed value, e.g. "13px"
  expected: string;                  // nearest valid, e.g. "12px"
  fixHint: {
    kind: "tailwind-class" | "css-value" | "container-gap" | "manual";
    from?: string;                   // e.g. "py-[13px]"
    to?: string;                     // e.g. "py-3"
    note?: string;                   // e.g. "set gap-4 on parent .card-list, remove child margins"
  };
  snippet?: string;                  // outerHTML head of the element, truncated to 120 chars
}

interface AuditReport {
  url: string;
  viewport: { width: number; height: number };
  timestamp: string;                 // ISO 8601
  config: { baseUnit: number; scale: number[]; canonicalSizes: number[] };
  summary: { total: number; byRule: Record<string, number>; errors: number; warns: number };
  violations: Violation[];
  truncated: boolean;
  suppressedCount: number;           // how many were hidden by suppressions
}
```

Selector stability rule: prefer `#id`, then `[data-testid]`, then shortest unique class combo, then structural path. Never emit selectors longer than 5 segments.

---

## 7. Detection Engine

### 7.1 Renderer (`renderer.ts`)
- Launch Chromium headless once per server process, reuse browser; new context per audit.
- `page.goto(url, { waitUntil: "networkidle", timeout: 15000 })`, then `await page.evaluate(...)` injecting the collector.
- On navigation failure return an actionable MCP error: `"Could not reach {url}. Is the dev server running? Start it and retry."` — never a stack trace.
- Set `deviceScaleFactor: 1` to avoid subpixel noise.

### 7.2 Collector (`collector.ts`)
Single in-page pass (one `evaluate`, no per-element round trips):
```
for each element in subtree (skip: script/style/head, display:none, visibility:hidden,
                             zero-size, aria-hidden containers of icons handled separately):
  record {
    selector, tagName, classList,
    rect: getBoundingClientRect() (round to 0.5px),
    computed: { marginTop/Right/Bottom/Left, paddingTRBL, gap, rowGap, columnGap,
                width, height, display, position },
    parentDisplay, siblingIndex
  }
```
- Round all values: treat |x − round(x)| < 0.6px as on-grid (subpixel tolerance). This kills the #1 false-positive source (rem→px rounding, zoom).
- Ignore values of 0, `auto`, percentages, and viewport units for spacing-scale (only concrete px results are judged).
- Cap collection at 3000 elements; if exceeded, report and suggest narrowing `selector`.

### 7.3 Rules

**`spacing-scale`** — for each computed margin/padding/gap px value `v > 0`: valid iff `v % baseUnit === 0` (after tolerance) OR `v ∈ config.allowedValues` (default includes 1, 2 for borders/hairlines). Violation carries nearest multiple.

**`arbitrary-value`** — regex over `classList`: `/(?:^|:)(-?(?:[mp][trblxy]?|gap|space-[xy]|w|h|size|inset|top|right|bottom|left|rounded(?:-[a-z]+)?))-\[(\d+(?:\.\d+)?)(px|rem)\]/`. Convert rem→px (×16). If value off-scale → suggest nearest Tailwind class from the standard scale map (`0.5→2px … 96→384px`; hardcode map in `defaults.ts`). If the arbitrary value IS on-scale (e.g. `p-[16px]`) → `warn` with `to: "p-4"` (style hygiene, not error).

**`gap-consistency`** — for each flex/grid container with ≥3 children laid out on one axis: compute inter-sibling distances from rects. If container has computed `gap > 0` → skip (already systematic). Else if distances differ by > tolerance AND spread > baseUnit → one violation on the container: `note: "children spaced {list}; set gap-{n} on container and remove child margins"`. Do NOT emit per-child violations (noise).

**`canonical-size`** — targets: `svg`, `img` inside buttons/links, elements with class matching `/icon/i`, and interactive elements (`button, a[href], input, [role=button]`). Icons: width/height must ∈ canonicalSizes. Interactive: min(rect.width, rect.height) ≥ 44px → else `error` (this is the only default-error rule; cite WCAG 2.5.8 in the fixHint note).

### 7.4 Source hint (`source-hint.ts`)
Best-effort mapping computed→source, in priority order:
1. Arbitrary Tailwind class present that explains the value → `tailwind-class` fix.
2. Standard Tailwind class present that explains the value (e.g. `p-4` → 16px is on-scale anyway) → skip.
3. Inline `style` attribute contains the property → `css-value` fix on inline style.
4. Otherwise → `kind: "manual"`, `note: "trace {property}:{actual} in stylesheets"` — the agent greps the codebase itself.

Do not attempt to read project source files from the server in v1. The agent has the codebase; the server only points.

---

## 8. Configuration & Suppressions

`gridproof.config.json` at project root (all optional, defaults shown):
```json
{
  "baseUnit": 4,
  "allowedValues": [1, 2],
  "canonicalSizes": [16, 20, 24, 32, 40, 48],
  "minTapTarget": 44,
  "rules": {
    "spacing-scale": "warn",
    "arbitrary-value": "warn",
    "gap-consistency": "warn",
    "canonical-size": "error"
  },
  "suppress": [
    { "selector": ".hero-art *", "rules": ["spacing-scale"] },
    { "value": "13px", "reason": "optical correction, logo lockup" }
  ]
}
```
Inline suppression: `data-gp-ignore` (all rules) or `data-gp-ignore="spacing-scale gap-consistency"` on any element — collector reads it and skips subtree for listed rules. Suppressed findings are counted, never listed.

Philosophy: **suggest, don't forbid.** Default severity `warn` everywhere except tap targets. No rule may block; the tool has no exit-code semantics in v1.

---

## 9. SKILL.md (ship in repo root, verbatim intent)

Frontmatter: name `gridproof`, description triggering on "design QA", "check spacing", "fix my grid/spacing", "audit UI", "design review", and automatically after generating/modifying frontend UI.

Body must instruct the agent to:
1. Ensure the dev server is running; get its URL.
2. Call `gp_get_config`, then `gp_audit` at 1440×900.
3. Group violations by fixHint, edit source (prefer container-level fixes over per-element), one commit-sized batch.
4. Verify with `gp_check_element` per touched element, then a final `gp_audit`.
5. If mobile matters, repeat audit at 375×812.
6. Never "fix" by adding `data-gp-ignore` unless the user explicitly approves the exception; record reason in config `suppress` instead.
7. Stop after 3 fix-recheck cycles and report remaining items to the user (anti-loop guard).

---

## 10. Testing

Fixtures are self-contained HTML (inline CSS + Tailwind CDN for the arbitrary-value fixture).

| Test | Fixture | Assert |
|------|---------|--------|
| spacing-scale detects 13px padding | off-scale.html | 1 violation, expected "12px" |
| tolerance: 15.7px (rem rounding) passes | off-scale.html | 0 violations for that node |
| arbitrary `p-[13px]` → `p-3` | arbitrary.html | fixHint.to === "p-3" |
| on-scale arbitrary `p-[16px]` → hygiene warn | arbitrary.html | severity warn, to "p-4" |
| gap-consistency fires on ragged list, silent on `gap-4` list | gaps.html | exactly 1 container violation |
| tap target 32px button → error | canonical | severity error, WCAG note present |
| suppression via data-gp-ignore | any | suppressedCount increments, violation absent |
| clean page | clean.html | total 0 |
| dead URL | — | actionable error message, no throw |
| 3000-element cap | generated | truncation message |

Integration test: spin `http-server` on fixtures, run `gp_audit` through MCP Inspector programmatically or direct tool invocation. All tests must pass with zero flake across 3 runs.

Acceptance bar (matches product plan): run against 2–3 real AI-generated projects (ChainHint frontend first); false-positive rate target <5% by manual review of reported violations.

---

## 11. Milestones

| Day | Deliverable |
|-----|-------------|
| 1 | Scaffold, MCP server boots in Claude Code, `gp_audit` returns raw geometry for a fixture (no rules) |
| 2 | Rules 1+2 with tests green; report schema final |
| 3 | Rules 3+4, suppressions, config loader, source hints |
| 4 | SKILL.md, README with quickstart, run on ChainHint frontend, fix false positives found |
| 5 | Polish: error messages, npx packaging, MCP Inspector pass, tag v0.1.0 |

---

## 12. Risks

| Risk | Mitigation |
|------|-----------|
| False positives kill trust (eslint-plugin-tailwindcss lesson) | 0.6px tolerance, allowedValues, warn-not-error, suppressions, real-project calibration on day 4 |
| Report blows agent context | maxViolations cap + severity sort + container-level dedup |
| Agent loops on unfixable finding | Skill rule: 3 cycles max, then surface to user |
| CSS-in-JS / non-Tailwind projects get only "manual" hints | Acceptable v1; computed values still correct, agent can grep |
| Playwright install weight | Document `npx playwright install chromium` in README as one-time step |
