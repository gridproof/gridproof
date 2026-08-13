# Gridproof

**Gridproof your UI — automated spacing & grid QA in the agent loop.**

Gridproof is an [MCP](https://modelcontextprotocol.io) server (stdio) plus a
Claude Code skill. It renders your running frontend with Playwright, measures the
**computed** geometry of every element, checks it against a spacing/token rule
set, and returns a structured fix report the agent applies to source — then
re-checks. It runs **inside the agent loop**, so design drift (`py-[13px]`,
ragged gaps, off-canonical icon sizes, sub-44px tap targets) gets caught before
it ships.

```
agent generates UI → gp_audit(url) → JSON violations with fix hints
→ agent edits source → gp_audit(url) → clean report = done
```

## Demo

<!-- GIF-DEMO-PLACEHOLDER: recorded at launch. Do not fabricate output. -->
_Demo GIF coming at launch._

## Quickstart

```bash
# 1. Install the Chromium build Playwright uses (one-time, ~150MB)
npx playwright install chromium

# 2. Run the server (via npx once published)
npx gridproof
```

### Register in Claude Code

Once published:

```bash
claude mcp add gridproof -- npx -y gridproof
```

From a local checkout (after `npm install && npm run build`):

```bash
claude mcp add gridproof -- node /absolute/path/to/gridproof/dist/index.js
```

The server exposes three tools:

| Tool | Purpose |
|------|---------|
| `gp_audit` | Render a URL and audit its geometry. Returns an `AuditReport` (violations + fix hints). |
| `gp_check_element` | Re-check a single element's subtree after a fix — cheap loop closer. |
| `gp_get_config` | Return the resolved config (defaults merged with `gridproof.config.json`). |

## Rules

Four rules, all reporting `warn` by default except tap targets:

- **`spacing-scale`** — margin/padding/gap values that aren't on the base grid, the Tailwind scale, or an allowed value. Carries the nearest valid value.
- **`arbitrary-value`** — off-scale arbitrary Tailwind spacing classes (`p-[13px]` → `p-3`). Deliberate fixed dimensions (`w-[200px]`) and border-radius are left alone.
- **`gap-consistency`** — a flex/grid **layout** list with ragged sibling spacing → suggests a unifying `gap` on the container.
- **`canonical-size`** — icons off the canonical size set (warn), and interactive elements below the tap-target minimum (**error**, WCAG 2.5.8) — reported at mobile widths only.

**Philosophy: suggest, don't forbid.** Everything is `warn` except sub-44px tap
targets; nothing blocks, and there are no exit-code semantics. The server
measures and points — the agent edits the source.

## Configuration

Optional `gridproof.config.json` at your project root (all fields optional;
defaults shown):

```json
{
  "baseUnit": 4,
  "allowedValues": [1, 2],
  "canonicalSizes": [12, 14, 16, 20, 24, 32, 40, 48],
  "minTapTarget": 44,
  "tapTargetBreakpoint": 768,
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

- `tapTargetBreakpoint` — tap-target checks apply only when the audit viewport is narrower than this (WCAG 2.5.8 is a touch criterion, irrelevant for desktop pointer nav).
- Inline suppression: `data-gp-ignore` (all rules) or `data-gp-ignore="spacing-scale gap-consistency"` on an element skips its subtree for those rules. Suppressed findings are counted, never listed.

## What it deliberately does NOT do

- **No computer vision / screenshot analysis.** It reads computed geometry, not pixels.
- **No CI runner.** It's an in-loop tool, not a gate; no exit codes.
- **No source editing by the server.** It measures and suggests; the agent (which has your codebase) makes the edits.
- **Not yet (v2, extension points only):** column-grid clustering, gutter consistency, cross-breakpoint alignment drift, baseline rhythm, Figma token import.

## Development

```bash
npm install
npm run build   # tsc → dist/
npm test        # vitest (unit + Playwright integration)
npm run dev     # run the server from TypeScript (tsx)
```

### Pre-push author guard (maintainers)

`.git/hooks/` isn't version-controlled, so after a fresh clone install the
pre-push guard (blocks a push unless commits are authored `gridproofdev@gmail.com`
and the active `gh` account is `gridproof`):

```bash
ln -sf ../../scripts/pre-push-guard.sh .git/hooks/pre-push
# or, if symlinks aren't an option:
#   printf '#!/usr/bin/env bash\nexec "$(git rev-parse --show-toplevel)/scripts/pre-push-guard.sh" "$@"\n' > .git/hooks/pre-push
chmod +x .git/hooks/pre-push scripts/pre-push-guard.sh
```

## License

MIT
