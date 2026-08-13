# Gridproof — 60-site generalization run (auto-classified)

Broad re-measurement scaling 24 → **60 live public URLs** (original 24 for
before/after continuity + 36 new). Each URL audited at **1440×900** and
**375×812** with the *exact committed rules* (icon anchor-tolerance + info tier,
66 tests green). **Measurement only — no rule was changed.** Raw data:
`generalization-60.json`; harness `run-60.mjs`; auto-classifier `classify-60.mjs`
(+ `classify-60.out.txt`, `classify-60.summary.json`).

## Verdict (read first)

- **Regression zero-bar: PASS.** All five fixed FP classes (arbitrary-size,
  fractional-subpixel, icon-substring-match, sprite-below-floor,
  desktop-tap-target) = **0 occurrences** across 4,259 findings.
- **But a NEW systemic clear-FP class surfaced that the 24-site run hid:**
  `gap-consistency` misfiring on **layout wrappers** — **327 findings (7.7%)**,
  every one nonsensical (`set gap-96` for page sections spaced 689–2066px apart).
  Over the <5% bar, confined to one rule. **Listed, not tuned** (per "stop for
  review").
- Detection accuracy **87.7%** against evidence-verified ground truth (77.2%
  against my raw first-pass guesses — I mislabeled 6 sites the detector read
  correctly).
- **Launch-ready for disciplined Tailwind app/component UIs. NOT ready with
  `gap-consistency` enabled on messy, layout-heavy pages.**

## Classifier decision logic (audit this, not the 4,259 findings)

Every finding is bucketed by root-cause signature, in this order. `px` = numeric
`actual`. Viewport width `w` (desktop 1440 / mobile 375). The five REGRESSION
SENTINELS are checked **first** — any hit is a loud regression:

| # | Bucket | Signature | Category |
|---|--------|-----------|----------|
| S1 | `REGRESSION:arbitrary-size` | `ruleId=arbitrary-value` AND property ∈ {width,height,size,min/max-w/h} | clear-FP |
| S2 | `REGRESSION:fractional-subpixel` | `ruleId∈{spacing-scale,canonical-size}` AND `|px − round(px·2)/2| ≥ 0.12` (off the 0.5px grid) | clear-FP |
| S3 | `REGRESSION:sprite-below-floor` | icon finding AND `px < 10` (minIconSize) | clear-FP |
| S4 | `REGRESSION:icon-substring-match` | icon finding AND `px ≥ 64` (collector excludes hero ≥64 from icons → a ≥64 "icon" = non-icon leak) | clear-FP |
| S5 | `REGRESSION:desktop-tap-target` | tap-target finding AND `w ≥ 768` | clear-FP |
| — | `component-lib-spacing` | `spacing-scale` AND `severity=info` (same off-scale value on ≥3 elements = library token) | **info** |
| — | `genuine-spacing-drift` | `spacing-scale` AND `severity≠info` (one-off off-grid+off-scale) | **TP** |
| — | `arbitrary-spacing-drift` | `arbitrary-value`, `actual≠expected` (off-scale arbitrary spacing) | **TP** |
| — | `arbitrary-hygiene` | `arbitrary-value`, `actual=expected` (on-scale, rename-only) | borderline |
| — | `non-canonical-real-icon` | icon finding, `10 ≤ px < 64`, beyond ±2 of any anchor | **TP** |
| — | `tap-target-mobile` | tap-target finding, `w < 768` | **TP** |
| — | `gap-list` | `gap-consistency`, max sibling distance ≤ 64px (real list) | **TP** |
| — | `gap-borderline` | `gap-consistency`, 64 < maxSib ≤ 200px | borderline |
| — | `gap-layout-wrapper-FP` | `gap-consistency`, maxSib > 200px (children are page sections, not list items) | **clear-FP (new class)** |

`icon finding` = `ruleId=canonical-size` with note "off the canonical scale".
`tap-target finding` = note contains "tap size"/"WCAG 2.5.8".

**Two judgments I audited and corrected during the run** (the point of emitting
the logic):
1. My first pass classified every `gap-consistency` finding as TP. Parsing the
   sibling distances proved **327/329 fire on layout wrappers (maxSib >200px), 0
   on real lists** → reclassified to clear-FP. This is the headline finding.
2. I initially set the icon-leak threshold (S4) at 52px; that mislabeled 64 real
   48–63px logos/avatars as regressions. The collector's own hero-exclusion
   ceiling is 64px, so S4 belongs at 64. Corrected → S4 = 0, those 64 are real
   above-ceiling icons (see new bucket #2).

## Per-site table (60 URLs)

`isTailwind` = detector output; ❗ = disagrees with my framework-guess (see gate
audit for which are detector errors vs my mis-guesses). desktop/mobile = total
findings.

| URL | fw-guess | type | isTailwind | desktop | mobile | dominant bucket | skip |
|-----|----------|------|:----------:|--------:|-------:|-----------------|:----:|
| ui.shadcn.com | tailwind | component-lib | TW | 1 | 6 | tap-target-mobile | |
| ui.shadcn.com/examples/dashboard | tailwind | dashboard | TW | 3 | 7 | tap-target-mobile | |
| ui.shadcn.com/examples/cards | tailwind | cards | non-TW❗ | 0 | 0 | — | |
| ui.shadcn.com/examples/mail | tailwind | app | non-TW❗ | 0 | 0 | — | |
| ui.shadcn.com/examples/forms | tailwind | forms | non-TW❗ | 0 | 0 | — | |
| tailwindcss.com | tailwind | marketing | TW | 8 | 37 | tap-target-mobile | |
| flowbite.com | tailwind | components | TW | ERR | 50 | tap-target-mobile | |
| daisyui.com | tailwind | components | TW | 78 | 92 | tap-target-mobile | |
| tremor.so | tailwind | dashboard | TW | 1 | 28 | tap-target-mobile | |
| preline.co | tailwind | components | TW | 6 | 60 | tap-target-mobile | |
| dub.co | tailwind | saas | TW | 49 | 92 | arbitrary-spacing-drift | |
| cal.com | tailwind | saas | non-TW❗ | 1 | 86 | tap-target-mobile | |
| resend.com | tailwind | marketing | TW | 9 | 78 | tap-target-mobile | |
| supabase.com | tailwind | marketing | TW | 15 | 23 | non-canonical-real-icon | |
| astro.build | tailwind | marketing | TW | 46 | 84 | tap-target-mobile | |
| precedent.dev | tailwind | starter | TW | 0 | 8 | tap-target-mobile | |
| vercel.com | tailwind | marketing | TW | 6 | 94 | tap-target-mobile | |
| getbootstrap.com | bootstrap | bootstrap | non-TW | 0 | 54 | tap-target-mobile | |
| getbootstrap.com/…/dashboard | bootstrap | bootstrap-dash | TW❗ | 0 | 6 | tap-target-mobile | |
| mui.com | mui | css-in-js | non-TW | 2 | 54 | tap-target-mobile | |
| ant.design | antd | antd | non-TW | 0 | 83 | tap-target-mobile | |
| chakra-ui.com | chakra | css-in-js | — | ERR | ERR | — | SKIP |
| styled-components.com | styled-components | css-in-js | non-TW | 1 | 23 | tap-target-mobile | |
| getbootstrap.com/…/album | bootstrap | bootstrap-gallery | TW❗ | 1 | 25 | tap-target-mobile | |
| linear.app | tailwind | saas | non-TW❗ | 0 | 93 | tap-target-mobile | |
| railway.com | tailwind | saas | TW | 4 | 8 | tap-target-mobile | |
| clerk.com | tailwind | saas | TW | 77 | 115 | tap-target-mobile | |
| upstash.com | tailwind | saas | TW | 13 | 59 | tap-target-mobile | |
| trigger.dev | tailwind | saas | TW | 105 | 234 | tap-target-mobile | |
| planetscale.com | tailwind | saas | TW | 0 | 50 | tap-target-mobile | |
| hyperui.dev | tailwind | components | TW | 0 | 9 | tap-target-mobile | |
| tailgrids.com | tailwind | components | TW | 59 | 81 | component-lib-spacing | |
| nytimes.com | custom | news | non-TW | 10 | 120 | tap-target-mobile | |
| theguardian.com/international | custom | news | non-TW | 22 | 84 | tap-target-mobile | |
| bbc.com | custom | news | non-TW | 38 | 166 | **gap-layout-wrapper-FP** | |
| cnn.com | custom | news | — | ERR | ERR | — | SKIP |
| amazon.com/dp/B08N5WRWNW | custom | ecommerce-product | non-TW | 0 | 3 | tap-target-mobile | |
| reddit.com | custom | social | TW❗ | 0 | 1 | tap-target-mobile | |
| medium.com | custom | media | TW❗ | 11 | 14 | genuine-spacing-drift | |
| github.com | primer | dev-landing | non-TW | 2 | 86 | tap-target-mobile | |
| stripe.com | custom | saas-marketing | non-TW | 7 | 143 | tap-target-mobile | |
| notion.com | custom | saas-marketing | TW❗ | 49 | 85 | component-lib-spacing | |
| figma.com | custom | saas-marketing | — | ERR | ERR | — | SKIP |
| slack.com | custom | saas-marketing | non-TW | 1 | 46 | tap-target-mobile | |
| developer.mozilla.org | custom | docs | non-TW | 0 | 55 | tap-target-mobile | |
| react.dev | custom | docs | TW❗ | 30 | 84 | tap-target-mobile | |
| news.ycombinator.com | plain-css | messy-minimal | non-TW | 0 | 92 | tap-target-mobile | |
| gov.uk | plain-css | gov | non-TW | 6 | 84 | tap-target-mobile | |
| usa.gov | plain-css | gov | non-TW | 20 | 25 | non-canonical-real-icon | |
| mit.edu | plain-css | edu | non-TW | 0 | 39 | tap-target-mobile | |
| european-union.europa.eu | plain-css | gov | non-TW | 0 | 19 | tap-target-mobile | |
| getbootstrap.com/…/pricing | bootstrap | bootstrap-example | non-TW | 0 | 20 | tap-target-mobile | |
| getbootstrap.com/…/carousel | bootstrap | bootstrap-example | non-TW | 0 | 10 | tap-target-mobile | |
| pro.ant.design | antd | antd | TW❗ | 21 | 39 | tap-target-mobile | |
| mui.com/material-ui/getting-started | mui | css-in-js | non-TW | 1 | 24 | tap-target-mobile | |
| chakra-ui.com/docs/get-started | chakra | css-in-js | non-TW | 0 | 23 | tap-target-mobile | |
| mantine.dev | mantine | css-in-js | non-TW | 31 | 153 | tap-target-mobile | |
| bulma.io | bulma | css-framework | non-TW | 12 | 167 | tap-target-mobile | |
| semantic-ui.com | semantic | css-framework | TW❗ | 181 | 107 | component-lib-spacing | |
| w3.org | plain-css | standards | non-TW | 0 | 4 | tap-target-mobile | |

**Reachable: 57/60.** Skipped gracefully (networkidle timeout / bot-wall,
run continued, never aborted): `chakra-ui.com` (both), `cnn.com` (both),
`figma.com` (both); `flowbite.com` desktop only (mobile fine).

## Aggregate (4,259 findings across 57 reachable sites)

| Bucket | Count | Category |
|--------|------:|----------|
| tap-target-mobile | 2,552 | TP |
| component-lib-spacing | 533 | info |
| non-canonical-real-icon | 336 | TP |
| **gap-layout-wrapper-FP** | **327** | **clear-FP (new class)** |
| arbitrary-spacing-drift | 302 | TP |
| genuine-spacing-drift | 161 | TP |
| arbitrary-hygiene | 46 | borderline |
| gap-borderline | 2 | borderline |

| Category | Count | Rate |
|----------|------:|-----:|
| clear-FP — the 4 previously-fixed classes | 0 | **0.0%** |
| clear-FP — NEW class (gap layout-wrapper) | 327 | **7.7%** |
| borderline | 48 | 1.1% |
| info (component-lib tokens) | 533 | 12.5% |
| TP | 3,351 | 78.7% |

## Regression check (zero bar) — PASS

| Sentinel (must be 0) | Count |
|----------------------|------:|
| arbitrary-size | **0** |
| fractional-subpixel | **0** |
| icon-substring-match | **0** |
| sprite-below-floor | **0** |
| desktop-tap-target | **0** |

**No fixed FP class reappeared.** Verified directly: 0 arbitrary-value findings
on size props; 0 spacing/icon values off the 0.5px grid; 0 icon findings ≥64px
(the true substring-leak signature); 0 icon findings <10px; 0 tap-target findings
at desktop width. The four systemic FPs from `generalization.md` (458 + 107 + 190
+ 73) stay eliminated at 60-site scale.

## Detection / gate audit (critical failure mode = misdetection)

Two accuracies, because my first-pass framework guesses were themselves wrong on
6 sites (verified with a full-DOM probe — arbitrary `-[…]` classes + Tailwind
color/responsive utilities):

- **[A] vs my raw guess: 44/57 = 77.2%**
- **[B] vs evidence-verified ground truth: 50/57 = 87.7%**

My 6 mis-guesses (detector was right, I was wrong):
`react.dev` (136 arb + 97 color utils → **is Tailwind**), `reddit.com`
(`max-w-[480px]`, `px-[var(--rem14)]` → **is Tailwind**), `medium.com`
(`sm:` utilities → Tailwind-using), `linear.app` & `cal.com` (0 Tailwind
signals → **not Tailwind**; the cal *app* is TW, its *marketing site* isn't),
`pro.ant.design` (real `bg-[#1677ff]`/`md:flex-[2]` mixed into an Ant app).

**Genuine detector errors (against ground truth):**

- **FALSE NEGATIVES — real Tailwind gated off (3):** `ui.shadcn.com/examples/`
  cards, mail, forms. All are 9-element near-empty pages that clear <8 utility
  signals. Consequence: spacing/arbitrary rules skipped → *fewer* findings, never
  an added FP (all three produced 0 findings anyway). The concern is the
  *pattern*: a small, early-stage Tailwind app can be under-audited. Escape hatch
  exists: `assumeTailwind: true`.
- **FALSE POSITIVES — non-Tailwind run as Tailwind (4):**
  `getbootstrap.com/…/dashboard`, `getbootstrap.com/…/album` (Bootstrap 5.3 ships
  `gap-1`/`d-flex` utilities that trip the heuristic), `notion.com` (utility CSS,
  no arbitrary/color tells), `semantic-ui.com` (framework class words like
  `grid`/`flex`). Consequence measured: the misfire does **not** produce clear
  FPs — on semantic-ui, 236 of 288 findings land in the **info** tier
  (component-lib-spacing), which absorbs the non-Tailwind spacing flood exactly as
  designed. It adds info-tier *volume*, not false errors.

Net: the Tailwind gate is accurate (87.7%), fails safe in both directions
(FN→fewer findings; FP→info-tier volume, 0 clear FP), and its true errors are
concentrated on tiny pages and utility-word CSS frameworks.

## Before → after vs the 24-site run

Same 24 original URLs, this run vs the prior `generalization-after.json`:

| | after-24 (d+m) | 60-run, same 24 (d+m) |
|---|---:|---:|
| Total findings | 1,665 | 1,217 |

Lower, from natural site-content drift + this run's committed borderline fixes
(icon anchor-tolerance trims icon findings; component-spacing moved to info) +
`cal.com` now reading non-Tailwind. Biggest movers all downward
(dub −92, cal −76, ant −67, supabase −47, mui −46). **No upward regression on
any original site.** Category rates aren't directly comparable to the after-24
report because this run reclassifies real-icon outliers as TP (were borderline)
and component-lib spacing as info (was borderline) — an intentional policy shift
already committed, not a measurement change.

## New systemic buckets the 24-site run missed

Listed with proposed fix — **NOT implemented** (measurement-only discipline).

### 1. `gap-consistency` fires on layout wrappers — 327 findings (7.7%), a real FP class

The 24-site run saw only **9** gap findings; disciplined component UIs have few
ragged flex wrappers. Messy mainstream DOMs (bbc 126, nytimes 59, react.dev 42,
mantine 33, guardian 25) expose the rule firing on top-level flex containers whose
"children" are **page sections**, then advising `set gap-96`:

```
tailwindcss.com : children spaced 689px, 28px; set gap-96 …
cal.com         : children spaced 2066.5px, 396px; set gap-96 …
```

Distribution of the 329 gap findings by max sibling distance: **0 ≤64px (real
list), 2 in 64–200px, 327 >200px (layout wrapper), 294 of those >600px.** The
advice is actively wrong on all 327 → clear FP.

- **Proposed fix (do not implement):** skip `gap-consistency` when max
  inter-sibling distance exceeds a layout threshold (e.g. >200px, or > a small
  multiple of the median child size), or require the container's children to be
  size-homogeneous before treating it as a list. Alternatively gate
  `gap-consistency` behind Tailwind detection like spacing/arbitrary (it's
  currently framework-agnostic and runs everywhere).

### 2. Above-ceiling real icons (48–64px) — 65 findings, mild noise

`non-canonical-real-icon` (336) splits into 271 in-range (≤48px, legit drift) and
**65 above the 48px canonical ceiling** — real logos/wordmarks/avatars just over
48px (`clerk` 62×18 wordmark svg, `stripe` 60px nav logo, gov.uk 56px cards,
daisyui 54px squircle avatar). Snapping a 62px wordmark "to 48px" is poor advice.
Not a false positive (they *are* off the canonical set) but low-value.

- **Proposed fix (do not implement):** add 56/64 to `canonicalSizes`, or exempt
  wide-aspect (w:h ≥ ~2.5) svgs as wordmarks, or raise the icon ceiling to 64 to
  match the collector's hero-exclusion boundary.

### 3. `tap-target-mobile` dominates volume — 2,552 (60%)

Real sub-44px mobile targets, framework-agnostic, correctly still firing on
non-Tailwind sites (WCAG). Not new or wrong, but content-dense sites flood it
(bulma 167, bbc 166, mantine 153, stripe 143). This is a **policy** lever
(`minTapTarget`, or AA vs the AAA 44px), not a bug — noted for completeness.

## Launch-readiness verdict (Tailwind sites)

**Qualified go.**

- The **rules the fixes targeted are solid at 60-site scale**: 0 regressions, 0
  clear FP from spacing-scale / arbitrary-value / icon canonical-size, and the
  Tailwind gate is 87.7% accurate and fails safe. On disciplined Tailwind app and
  component UIs (shadcn, tremor, preline, hyperui, railway, planetscale,
  clerk-desktop) findings are low and dominated by genuine mobile tap-targets and
  real drift.
- **One blocker for messy/layout-heavy pages: `gap-consistency`.** It is a 7.7%
  clear-FP source with actively-wrong advice, invisible until this broader run.
  For a marketing/news/dashboard page it will emit absurd `gap-96` fixes.

**Recommendation (for your decision — not implemented here):** ship with
`gap-consistency` **off by default** (or behind the layout-wrapper guard above),
keep the other three rules on. That yields effectively **0% clear FP** on the
60-site corpus. With `gap-consistency` on and unguarded, Gridproof is not ready
for arbitrary layout-heavy sites.

**Per the "measurement only, stop for review" discipline: no rules were changed.
The gap-consistency layout-wrapper FP and the two minor buckets are reported for
your call on which (if any) to fix.**
