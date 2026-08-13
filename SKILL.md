---
name: gridproof
description: >-
  Automated spacing & grid QA for frontends, inside the agent loop. Use for
  "design QA", "check spacing", "fix my grid/spacing", "audit UI", "design
  review", and automatically after generating or modifying frontend UI. Renders
  the running app with Playwright, measures computed geometry, and returns
  structured fix hints to apply to source, then re-checks.
---

# Gridproof — spacing & grid QA

Use the `gp_*` MCP tools to catch off-scale spacing, inconsistent gaps, and
non-canonical sizes in a running frontend, then fix them in source and verify.

> Note: while Gridproof is on its Day 1 scaffold, `gp_audit` returns **raw
> geometry only** and `gp_check_element` is a stub. The workflow below is the
> intended loop once rules ship; `gp_get_config` already works.

## Workflow

1. **Ensure the dev server is running** and get its URL (e.g.
   `http://localhost:5173`). If it is not running, start it before auditing.
2. **Read the config, then audit.** Call `gp_get_config` to learn the active
   `baseUnit`, `canonicalSizes`, and rule severities. Then call `gp_audit` at
   **1440×900**.
3. **Fix at the right altitude.** Group violations by `fixHint`. Prefer
   **container-level fixes** (e.g. set `gap-4` on the parent and remove child
   margins) over per-element patches. Apply edits to source in one commit-sized
   batch.
4. **Verify.** Call `gp_check_element` for each touched element, then run a final
   `gp_audit` to confirm the report is clean.
5. **Mobile, if it matters.** Repeat the audit at **375×812**.
6. **Do not silence with suppressions casually.** Never "fix" a finding by adding
   `data-gp-ignore` unless the user explicitly approves the exception — and when
   they do, record the reason in `gridproof.config.json` `suppress` instead.
7. **Anti-loop guard.** Stop after **3 fix→recheck cycles**. Report any remaining
   items to the user rather than looping.

## Principles

- **Suggest, don't forbid.** Most findings are `warn`; only sub-44px tap targets
  are `error` (WCAG 2.5.8). Nothing blocks.
- **The server measures; you edit.** Gridproof never touches source files — it
  points, you fix.
