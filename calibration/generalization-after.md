# Gridproof — generalization RE-MEASURE (after post-generalization fixes)

Same 24 live public URLs, both viewports, same classification rigor. Compares
against `generalization.md`. Raw data: `calibration/generalization-after.json`.

## Headline

| Metric | Before | After |
|--------|-------:|------:|
| Total findings (reachable sites) | 2,609 | 1,665 |
| **Clear false positives** | **31.7%** | **0.0%** |
| Borderline | 31.5% | 42.2% |
| True positives | 36.8% | 57.8% |

**Clear FP went from ~32% to 0.** All four systemic FP classes are eliminated,
and the Tailwind gate silences the non-Tailwind spacing/arbitrary flood. No
per-site suppressions were used.

## Did the 4 bug fixes + gate work?

| Systemic FP cause | Before | After |
|-------------------|-------:|------:|
| Arbitrary off-grid SIZE flagged | 458 | **0** (SIZE props dropped from arbitrary-value) |
| `/icon/i` substring on non-icons | 107 | **0** (token-match + tap-targets never icons) |
| Fractional/subpixel values | 190 | **0** (sub-half-px guard + tolerance-canonical) |
| Tiny decorative sprites as icons | 73 | **0** (per-dimension icon floor, default 10px) |

## Per-site before → after (total findings)

| URL | Type | Desktop | Mobile | Detected |
|-----|------|--------:|-------:|:--------:|
| ui.shadcn.com | component-lib | 48 → 2 | 12 → 7 | TW |
| ui.shadcn.com/examples/dashboard | dashboard | 28 → 4 | 11 → 8 | TW |
| ui.shadcn.com/examples/cards | cards | 1 → 0 | 1 → 0 | non-TW\* |
| ui.shadcn.com/examples/mail | app | 1 → 0 | 1 → 0 | non-TW\* |
| ui.shadcn.com/examples/forms | forms | 1 → 0 | 1 → 0 | non-TW\* |
| tailwindcss.com | marketing | 16 → 10 | 41 → 39 | TW |
| flowbite.com | components | 15 → 10 | 63 → 59 | TW |
| daisyui.com | components | 95 → 86 | 99 → 94 | TW |
| tremor.so | dashboard | 11 → 2 | 35 → 29 | TW |
| preline.co | components | ERR → 9 | 68 → 63 | TW |
| dub.co | saas | 132 → 101 | 152 → 132 | TW |
| cal.com | saas | 47 → 39 | 132 → 124 | non-TW\* |
| resend.com | marketing | 97 → 14 | 158 → 82 | TW |
| supabase.com | marketing | 232 → 41 | 52 → 44 | TW |
| astro.build | marketing | 90 → 69 | 127 → 106 | TW |
| precedent.dev | starter | 1 → 1 | 12 → 10 | TW |
| vercel.com | marketing | 17 → 9 | 104 → 97 | TW |
| getbootstrap.com | bootstrap | 40 → 0 | 79 → 53 | non-TW |
| getbootstrap.com/…/dashboard | bootstrap-dash | 0 → 0 | 6 → 6 | TW\*\* |
| mui.com | css-in-js | 74 → 23 | 103 → 79 | non-TW |
| ant.design | antd | 119 → 37 | 159 → 113 | non-TW |
| chakra-ui.com | css-in-js | ERR | ERR | — |
| styled-components.com | css-in-js | 36 → 6 | 64 → 29 | non-TW |
| getbootstrap.com/…/album | bootstrap-gallery | 2 → 2 | 26 → 26 | TW\*\* |

## What the gate changed on non-Tailwind sites

The detector correctly classified the CSS-in-JS / Bootstrap control group as
**non-Tailwind** (MUI, Ant Design, styled-components, getbootstrap.com), silencing
`spacing-scale` and `arbitrary-value` there while keeping `canonical-size`
(accessibility). Effect on their desktop counts (tap targets suppressed at
desktop, so this is the spacing/icon flood): getbootstrap **40 → 0**, MUI
**74 → 23**, Ant Design **119 → 37**, styled-components **36 → 6**. The remaining
counts on those sites are `canonical-size` icon/tap findings, which are
framework-agnostic. Each carries the report note: *"Non-Tailwind page detected;
spacing/arbitrary rules skipped. Accessibility rules (canonical-size) still
applied."*

## What remains (borderline — 42%, not clear FP)

- **Real icons at non-canonical sizes (543)** — 18/22/26/30px icons that aren't
  in `{12,14,16,20,24,32,40,48}`. Each is a defensible `warn`, but collectively
  this is the dominant remaining volume (mostly on mobile, across all sites).
- **Off-grid integer spacing on Tailwind component libs (151)** — daisyUI 3/9/11px
  and similar. Genuinely off-scale, but they're the library's own component
  tokens.
- **gap-consistency (9)** — a handful.

These are technically-true findings, not false positives, so they don't count
against the FP bar. They're the same **policy** question flagged in
generalization.md (icon-size strictness; component-library spacing) — I did NOT
touch them this pass, as instructed.

## Detection edge cases (honest notes)

- **False negatives** (Tailwind page read as non-Tailwind): the shadcn *example*
  sub-pages (cards/mail/forms) and cal.com. Consequence: their Tailwind rules are
  skipped — this only *reduces* findings (no FP added). The example pages were
  near-clean anyway (1 finding).
- **False positives** (\*\*) : the Bootstrap *example* pages (dashboard/album)
  read as Tailwind. Harmless here (0–2 spacing findings), but the detector isn't
  perfect. `assumeTailwind: true|false` lets a user override per project.

## Verdict

The four fixes plus the Tailwind gate brought cross-site **clear FP from ~32% to
0%** with no per-site suppression, and cut total findings by ~36%. The
disciplined small pages are clean (shadcn examples: 0); the large sites are down
7–17× on the clear-FP drivers. Remaining volume is the borderline
icon-size / component-spacing policy bucket — a separate decision for you, not a
false-positive problem.
