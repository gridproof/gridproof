---
name: gridproof
description: >-
  Automated spacing & grid QA for web UIs, inside the agent loop. Use for
  "design QA", "check spacing", "fix my grid/spacing", "audit UI", "design
  review", "show me the spacing issues", "generate a design report", "give me
  an audit report", and automatically after you generate or modify frontend
  UI. Renders the running app with Playwright, measures computed geometry, and
  returns structured fix hints to apply to source, then re-checks.
---

# Gridproof — spacing & grid QA

Catch off-scale spacing, arbitrary Tailwind values, inconsistent gaps, and
non-canonical sizes in a running frontend, fix them in source, and verify — all
via the `gp_*` MCP tools. Follow this loop exactly.

## Three surfaces — pick the right one

- **`gp_audit`** — JSON violations + fix hints, no file written. Drives the
  fix-loop below.
- **`gp_report`** — same audit, plus writes a self-contained HTML report to
  disk and returns its path. Use this **instead of** `gp_audit` when the user
  wants to see the findings themselves ("show me the spacing issues",
  "generate a design report", "give me an audit report") rather than have you
  fix them.
- **`gp_check_element`** — cheap re-check of one element's subtree after a
  fix; skips a full re-audit.

## Loop

1. **Get a running URL.** Ensure the dev server is running; obtain its URL
   (e.g. `http://localhost:5173`). If it isn't running, start it first.
2. **Read config, then audit.** Call `gp_get_config` to learn the active
   `baseUnit`, `canonicalSizes`, `minTapTarget`, and rule severities. Then call
   `gp_audit` at **1440×900** — or `gp_report` if the user asked to review the
   findings themselves; hand them the file path and stop there.
3. **Fix at the right altitude, in one batch.** Group violations by `fixHint`.
   Prefer **container-level** fixes over per-element ones — e.g. set `gap-4` on
   the parent and remove child margins rather than patching each child. Apply the
   edits to source as a single commit-sized batch.
4. **Verify.** Call `gp_check_element` for each element you touched, then run a
   final `gp_audit` to confirm the report is clean.
5. **Check mobile if it matters.** Repeat the audit at **375×812**. Tap-target
   findings (WCAG 2.5.8, <44px) are reported at mobile widths only.
6. **Don't silence findings.** Never "fix" a violation by adding
   `data-gp-ignore` unless the user explicitly approves that exception. When they
   do, record the reason in `gridproof.config.json` under `suppress` instead.
7. **Anti-loop guard.** Stop after **3 fix→recheck cycles**. Report any remaining
   items to the user rather than looping.

## Principles

- **Suggest, don't forbid.** Most findings are `warn`; only sub-44px tap targets
  are `error`. Nothing blocks — there are no exit-code semantics.
- **The server measures; you edit.** Gridproof never touches source files. It
  points to the drift and the fix; you make the change.
- **Fix hints tell you how.** `kind: "tailwind-class"` gives `from`/`to`
  classes; `container-gap` suggests a unifying `gap`; `manual` means trace the
  value yourself (`note` says where to look).
