# Gridproof — generalization test (24 live public URLs)

**Goal:** prove Gridproof stays quiet on OTHER people's UIs, not just ChainHint
(where it hit 0% FP). Live deployed URLs only — no cloning, no local servers.
Each URL audited at **1440×900** and **375×812** via Playwright. Measurement
only; **no rule changes**.

Raw data: `calibration/generalization.json`.

## Verdict (read this first)

**The <5% FP bar does NOT hold across sites.** ChainHint's 0% was overfit to one
project. Across ~2,600 findings on 22 reachable sites:

| Bucket | Count | Share |
|--------|------:|------:|
| Clear false positives | 828 | **31.7%** |
| Borderline (technically-true but noisy) | 821 | 31.5% |
| True positives | 960 | 36.8% |

Clear FP alone is **~32%** — 6× over bar. The failures are **systemic** (they
repeat across many sites), not per-site quirks.

## Findings table

| URL | Type | Desktop | Mobile | Dominant rule |
|-----|------|--------:|-------:|---------------|
| ui.shadcn.com | component-lib | 48 | 12 | canonical-size |
| ui.shadcn.com/examples/dashboard | dashboard | 28 | 11 | canonical-size |
| ui.shadcn.com/examples/cards | cards | 1 | 1 | spacing-scale |
| ui.shadcn.com/examples/mail | app | 1 | 1 | spacing-scale |
| ui.shadcn.com/examples/forms | forms | 1 | 1 | spacing-scale |
| tailwindcss.com | marketing | 16 | 41 | canonical-size |
| flowbite.com | components | 15 | 63 | canonical-size |
| daisyui.com | components | 95 | 99 | canonical-size |
| tremor.so | dashboard | 11 | 35 | canonical-size |
| preline.co | components | ERR | 68 | canonical-size |
| dub.co | saas | 132 | 152 | canonical-size |
| cal.com | saas | 47 | 132 | canonical-size |
| resend.com | marketing | 97 | 158 | arbitrary-value |
| supabase.com | marketing | 232 | 52 | arbitrary-value |
| astro.build | marketing | 90 | 127 | canonical-size |
| precedent.dev | starter | 1 | 12 | canonical-size |
| vercel.com | marketing | 17 | 104 | canonical-size |
| getbootstrap.com | bootstrap | 40 | 79 | canonical-size |
| getbootstrap.com/…/dashboard | bootstrap-dash | 0 | 6 | canonical-size |
| mui.com | css-in-js | 74 | 103 | canonical-size |
| ant.design | antd | 119 | 159 | canonical-size |
| chakra-ui.com | css-in-js | ERR | ERR | — |
| styled-components.com | css-in-js | 36 | 64 | spacing-scale |
| getbootstrap.com/…/album | bootstrap-gallery | 2 | 26 | canonical-size |

**Unreachable / skipped:** `chakra-ui.com` (both viewports — nav failure),
`preline.co` desktop (timeout; mobile worked). Handled gracefully; the run
continued.

Note: the tiny shadcn *example* pages (cards/mail/forms) are near-clean (1
finding) — Gridproof is fine on small, disciplined shadcn UIs. It's the large
marketing/component sites that explode.

## Recurring FP causes (systemic — ranked by count, seen across many sites)

### 1. Arbitrary off-grid SIZE flagged as drift — **458 FP** (`arbitrary-value`)
`h-[62px]` (supabase ×180), `w-[350px]`/`w-[450px]` (resend ×60),
`max-w-[530px]` (dub). v1.2 flags any arbitrary SIZE value that isn't ÷baseUnit
as an "off-grid dimension." Real sites use off-grid pixel dimensions **constantly
and deliberately** (62/350/450/530px). This is the single biggest FP source and
it dominates the Tailwind marketing sites (supabase 204 FP, resend 159 FP).
→ **Proposed fix:** don't flag arbitrary SIZE values at all. A concrete
`w-[…px]`/`h-[…px]` is a deliberate dimension, never drift.

### 2. `/icon/i` substring matches non-icons — **107 FP** (`canonical-size`)
The icon detector treats any element whose class contains the substring "icon" as
an icon. That catches:
- shadcn **buttons**: `has-data-[icon=inline-end]:pr-1.5` (literal "icon" in a
  Tailwind variant) → the 67px/141px button is judged as an off-canonical icon.
- MUI **containers**: `MuiContainer` lowercases to "mu**icon**tainer" → 1200px
  layout containers flagged as icons.

Worse: because these become "icons," they're flagged at **desktop**, bypassing
the viewport-aware tap-target exemption entirely.
→ **Proposed fix:** match `icon` as a delimited token, not a substring, and never
let the icon path fire on an element that is really a tap target (fall through to
the tap rule, which is mobile-only).

### 3. Fractional / subpixel computed values treated as authored — **105 FP** (`spacing-scale`) + **85 FP** (`canonical-size`)
`25.781px`, `7.369px`, `3.36px`, `109.328px` spacing; `10.5px`, `24.5px` icons.
These come from rem-with-nonstandard-root, `%`, flex, and transforms — not
authored tokens. Seen on mui, bootstrap, styled-components, supabase, dub.
→ **Proposed fix:** ignore values that aren't within tolerance of an integer
(or round icon dimensions before the canonical check).

### 4. Tiny decorative sprites as icons — **73 FP** (`canonical-size`)
cal.com renders `<svg style="width:100%;height:100%"><use href="#…"></svg>` at
4–8px (sprite glyphs). Flagged as off-canonical icons.
→ **Proposed fix:** exclude svgs below a sane icon floor (e.g. <10px) and
sprite-`<use>` glyphs.

## Borderline (821 — technically-true, but noise you probably don't want)

- **Off-grid integer spacing on non-Tailwind / component-lib sites** (antd 7/11/15px,
  bootstrap 13/30px, daisyui 3/9/11px, MUI 5px). These ARE off a 4px grid, so the
  rule fires "correctly" and gives `manual` hints — but they're the design
  system's own tokens, not drift. The spec hoped non-Tailwind sites would get
  "only manual hints, no flood"; in practice antd gets **119/159** and MUI
  **74/103** — a flood of manual hints. Low-harm (no bad class suggestions) but
  high-volume.
- **Real icons at non-canonical sizes** (18px, 22px, 26px, 30px). Reasonable icon
  sizes simply not in `{12,14,16,20,24,32,40,48}`. Each is a defensible warn, but
  collectively noisy.

## Genuine true positives (960)

- Mobile sub-44px tap targets (the ChainHint pattern) — real, across most sites.
- Genuinely off-scale arbitrary **spacing** (`p-[13px]`-style) where it occurred.
- A handful of real off-scale paddings.

## Honest cross-site verdict

Gridproof is **not launch-ready for arbitrary sites** at its current tuning. It's
tight on disciplined shadcn component UIs (the small example pages: ~1 finding)
but noisy-to-unusable on large marketing sites and component libraries, and it
floods non-Tailwind sites with borderline manual hints. The 0% on ChainHint did
**not** generalize.

Three fixes would remove ~55% of all findings and the large majority of clear
FPs, without per-site suppression:

1. **`arbitrary-value`: stop flagging arbitrary SIZE values** (−458 FP). Sizes
   are deliberate; only judge spacing props.
2. **`canonical-size`: fix `/icon/i` to token-match, and don't let the icon path
   fire on tap targets** (−107 FP + closes the desktop-exemption bypass).
3. **Ignore fractional/subpixel values** in both spacing-scale and canonical-size
   (−190 FP), and add an icon-size floor (−73 FP).

The borderline buckets (non-Tailwind spacing flood; real-icon-size warns) are a
separate policy question — likely a Tailwind-detection gate or a tighter icon
policy — and I'd want your direction before touching them.

**Per the "measurement only, stop for review" discipline: no rules were changed.
Awaiting your call on which of the three fixes to make.**
