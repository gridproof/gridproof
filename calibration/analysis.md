# Gridproof calibration — analysis (manual TP/FP classification)

**Target:** ChainHint frontend (`vite_react_shadcn_ts`) served at `http://localhost:8080/`,
landing route `/`, rendered by Playwright after `networkidle`. This is the spec's
named-first calibration target (§10), running locally.

**Method:** `gp_audit` at 1440×900 and 375×812 with truncation disabled
(`maxViolations: 100000`). Full raw dump in
[`report-raw.md`](report-raw.md) / `report-raw.json`. Each violation was
classified TRUE positive (real design drift worth flagging) or FALSE positive
(noise) using the element snippet + class list. **No rule logic was changed** in
this pass.

> The two viewports report largely the **same** issues (responsive re-render), so
> treat the desktop set as the ~unique issue count and mobile as confirmation.

---

## Headline

| Viewport | Total | TP | FP | **FP rate** |
|----------|------:|---:|---:|------------:|
| desktop 1440×900 | 242 | 32 | 210 | **86.8%** |
| mobile 375×812 | 230 | 25 | 205 | **89.1%** |
| combined | 472 | 57 | 415 | **87.9%** |

**Target is <5% (§10, §12). Current raw FP rate ≈ 88% — roughly 18× over bar.**
This is the expected pre-tuning state; the rules are correct against the *spec's*
scale but the spec's scale diverges from the *Tailwind default scale* this project
actually uses.

---

## Per-rule breakdown (desktop)

| Rule | TP | FP | FP% | Verdict |
|------|---:|---:|----:|---------|
| `arbitrary-value` | 0 | 99 | 100% | pure noise on this page |
| `spacing-scale` | 1 | 60 | 98% | pure noise on this page |
| `canonical-size` | 23 | 48 | 68% | mixed; real tap-target signal buried in icon noise |
| `gap-consistency` | 8 | 3 | 27% | low volume; the 8 "TP" are borderline (see caveats) |

Mobile is materially identical (arbitrary 0/99, spacing 0/55, canonical 17/48,
gap 8/3).

---

## Root-cause catalog (FP classes, ranked by count — combined both viewports)

### 1. On-grid fixed sizes lacking a named Tailwind step — **158** (`arbitrary-value`)
`w-[200px]`, `h-[60px]`, `w-[400px]`, `h-[500px]` on logo lockups / media boxes.
These values **are on the 4px grid** (200, 60, 400, 500 all ÷4) — `spacing-scale`
would pass them — but `arbitrary-value` judges against the *discrete named*
Tailwind scale, which skips them (56→64, 192→208…). The suggestion `w-[200px]→w-48`
would **resize the element by 8px**. Flagging an on-grid, deliberately-fixed
dimension as drift is noise, and the "fix" is destructive.

### 2. Tailwind half-steps rejected by `baseUnit: 4` — **109** (`spacing-scale`)
`6px` (×79), `10px`, `14px` come from **standard** classes `px-1.5`/`py-1.5`
(6px), `2.5` (10px), `mt-3.5`/`px-3.5` (14px). These are first-class Tailwind
steps (1.5/2.5/3.5), but `6 % 4 ≠ 0` and they aren't in `allowedValues:[1,2]`, so
the rule rejects them. Source-hint even reports `from="py-1.5"` — i.e. the tool
knows it's a standard class and flags it anyway. This is the single clearest
"our scale ≠ the framework's scale" failure.

### 3. Small icons (14px) flagged off the canonical set — **56** (`canonical-size`)
Lucide SVGs rendered at 14px (`size-3.5`/`h-3.5 w-3.5`). `14 ∉ {16,20,24,32,40,48}`
so each warns. 14px is a legitimate small-icon size; snapping to 16 is cosmetic,
not drift.

### 4. `rounded-[*]` judged on the spacing scale — **40** (`arbitrary-value`)
`rounded-[28px]`, `rounded-[16px]`, `rounded-[14px]`, `rounded-[32px]`. Border-radius
does **not** use the numeric spacing scale, and the suggestions are often invalid
classes (`rounded-7`, `rounded-4` don't exist — Tailwind radius is
sm/md/lg/xl/2xl/3xl/full). The regex includes `rounded` but the mapping is wrong
for it.

### 5. Inline text links flagged as tap targets — **26** (`canonical-size`)
Footer/body `<a class="text-sm …" href>` at ~20px tall. WCAG 2.5.8 **exempts
inline links in a text block** from the target-size minimum. Flagging them is a
false accessibility error.

### 6. Large decorative SVGs / logos treated as icons — **14** (`canonical-size`)
96px hero SVGs (`viewBox 0 0 500 500`) and a 136px-wide logo `<img>`. The rule
treats every `<svg>` (and logo img) as an icon and demands a canonical size;
these are illustrations, not icons.

### 7. `gap-consistency` on non-list / overlay-containing flex — **6** (`gap-consistency`)
Distances include `0px`/negative values (e.g. `-900px, -900px, 0px`) because the
flex container also holds absolutely-positioned decorative overlays; and some
containers are page-layout wrappers (`min-h-screen`, `max-w-7xl`), not card lists.

---

## What *did* look like signal (candidate TPs — for your call)

- **`canonical-size` tap targets 32–42px (~23 desktop):** real interactive
  elements (nav links styled as buttons, small icon buttons) below 44px. These
  are legitimately sub-threshold — **but 44px (WCAG 2.5.8 *AAA*) is aggressive for
  desktop pointer nav**; a 36px nav link is widely considered fine. Genuine on
  mobile; debatable on desktop. Borderline.
- **`gap-consistency` (~8):** flagged `.reveal … glass px-8 py-10` cards with
  distances like `40px, 32px, 64px`. On inspection these are **content stacks**
  (heading / body / CTA) with intentional typographic rhythm, not uniform lists —
  so I lean these are mostly FP too. Counted as TP mechanically; flagging for your
  eye.
- **`spacing-scale` 34px (1):** a genuinely odd authored value — plausible TP.

If the borderline tap-targets and gap items are reclassified FP, the "real" TP
count drops toward single digits and FP rate exceeds 95%.

---

## Root-cause themes (the 3 that matter)

1. **Scale mismatch — Gridproof's valid-scale ≠ Tailwind's default scale.**
   Drives causes #1 (on-grid unnamed sizes), #2 (half-steps), #3 (14px icons).
   ~320 of 415 FPs. The Tailwind default scale includes 1.5/2.5/3.5 (6/10/14px)
   and arbitrary on-grid values are idiomatic; our `baseUnit=4` + discrete
   named-scale + canonical `{16,20,24…}` all reject values this stack uses on
   purpose.
2. **Rule targets too broad.** `arbitrary-value` judges `rounded-*` on the spacing
   scale (#4); `canonical-size` treats every `<svg>`/logo as an icon (#6) and
   every `<a href>` as a tap target incl. inline links (#5).
3. **Layout-derived values judged as authored.** computed `mx-auto`→`290px`,
   subpixel `314.422px`, and abs-positioned children skewing gap distances (#7).

---

## Decision surface (NOT acting — for your review)

For each cause the lever differs; I am **not** choosing:

| Cause | Fix (rule logic) | Suppress (config) | Accept |
|-------|------------------|-------------------|--------|
| #2 half-steps | add 6/10/14 (or the full Tailwind px set) to the valid scale | `allowedValues` | — |
| #1 on-grid unnamed w/h | `arbitrary-value` should pass on-grid values; only flag off-grid | — | — |
| #4 rounded | drop `rounded` from spacing judgement (own scale or ignore) | — | — |
| #3 14px icons | add 14 to `canonicalSizes`, or only judge `.icon`/sized icons | `canonicalSizes` | accept |
| #5 inline links | exempt inline `<a>` in text flow | selector suppress | — |
| #6 decorative svg | only treat sized/`.icon` svg as icons; skip large/illustration | selector suppress | — |
| #7 gap overlays | ignore abs-positioned/0/negative-distance children | selector suppress | — |

My read: causes #1, #2, #4, #6, #7 are **rule-literalness bugs** worth fixing in
logic (they'd misfire on almost any Tailwind/shadcn project, not just ChainHint);
#3 and #5 are defensible either way (fix vs config). But over-tuning to one
project is a real risk (§12) — hence stopping here for your direction.
