# Gridproof

**Gridproof your UI — automated spacing & grid QA in the agent loop.**

Gridproof is an [MCP](https://modelcontextprotocol.io) server (stdio) + Claude Code
skill that renders your running frontend with Playwright, measures computed
geometry, checks it against a spacing/token rule set, and returns a structured fix
report the agent applies to source — then re-checks. It runs **inside the agent
loop**, so design drift (`py-[13px]`, ragged gaps, off-canonical icon sizes) gets
caught before it ships.

> **Status:** Day 1 scaffold. The MCP server boots and `gp_audit` returns **raw
> collected geometry**. Rule detection (spacing-scale, arbitrary-value,
> gap-consistency, canonical-size) lands in subsequent milestones — see
> [`gridproof-spec.md`](gridproof-spec.md).

---

## Quickstart

```bash
# 1. Install browsers once (Playwright Chromium — one-time, ~150MB)
npx playwright install chromium

# 2. Build
npm install
npm run build

# 3. Run the MCP server over stdio
npx gridproof
```

### Add to Claude Code

Register the server (from the repo root, after `npm run build`):

```bash
claude mcp add gridproof -- node /absolute/path/to/gridproof/dist/index.js
```

Or, once published, `claude mcp add gridproof -- npx -y gridproof`.

The server exposes three tools:

| Tool | Purpose |
|------|---------|
| `gp_audit` | Render a URL and audit its geometry. **Day 1: returns raw geometry, no rules.** |
| `gp_check_element` | Re-check a single element after a fix (Day 1: stub). |
| `gp_get_config` | Return the resolved config (defaults + `gridproof.config.json`). Fully working. |

---

## Configuration

Optional `gridproof.config.json` at your project root (all fields optional;
defaults shown):

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
  "suppress": []
}
```

Philosophy: **suggest, don't forbid.** Severity is `warn` everywhere except tap
targets; no rule blocks. Inline suppression via `data-gp-ignore` lands with the
rule engine.

---

## Development

```bash
npm run dev     # run the server from TypeScript (tsx)
npm run build   # tsc → dist/
npm test        # vitest
```

Fixtures for rule development live in [`fixtures/`](fixtures/).

## Demo

_GIF demo placeholder — added once rules land._

## License

MIT
