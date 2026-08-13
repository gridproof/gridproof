# Gridproof calibration — AFTER (v1.2 Tailwind-aware conservative rules)

**Target:** ChainHint frontend at `http://localhost:8080/`, same harness and
viewports as the raw run. Raw dump: [`report-after.md`](report-after.md).

## Before → after

| Viewport | Before total | Before FP | After total | After FP | **FP rate** |
|----------|-------------:|----------:|------------:|---------:|------------:|
| desktop 1440×900 | 242 | 210 | 36 | 0 | **86.8% → 0%** |
| mobile 375×812 | 230 | 205 | 30 | 0 | **89.1% → 0%** |
| **combined** | **472** | **415** | **66** | **0** | **87.9% → ~0%** |

**Under the <5% bar (§10/§12).** Findings dropped 7×; every remaining finding is
a real sub-44px interactive element.

## After breakdown (both viewports)

| Rule | Before | After | Notes |
|------|-------:|------:|-------|
| `spacing-scale` | 61 / 55 | **0 / 0** | half-steps now valid; auto-margins ignored |
| `arbitrary-value` | 99 / 99 | **0 / 0** | sizes not snapped; radius out of scope |
| `gap-consistency` | 11 / 11 | **0 / 0** | content-stacks / overlays / layout-wrappers skipped |
| `canonical-size` | 71 / 65 | **36 / 30** | all real sub-44 tap targets (0 FP); icon noise gone |

The 36/30 remaining are `<button>`/`<a href>`/`[role=button]`/`[role=radio]`
elements with `min(w,h) < 44` (sizes 20–42px). Classified TRUE positives: they
are genuinely below the tap-target minimum. 0 were inline-in-text links, 0 were
decorative/icon.

## Root causes addressed (from analysis.md)

| # | Cause (FP count) | Fix |
|---|------------------|-----|
| 1 | on-grid fixed sizes snapped (158) | `arbitrary-value` never resizes SIZE props; on-grid sizes pass |
| 2 | Tailwind half-steps rejected (109) | `spacing-scale` valid = grid **OR Tailwind scale** OR allowed |
| 3 | 14px icons off canonical (56) | `canonicalSizes` now includes 12 & 14 |
| 4 | `rounded-*` on spacing scale (40) | `rounded` removed from `arbitrary-value` scope; never invalid classes |
| 5 | inline text links as tap targets (26) | tap targets exclude inline `a[href]` inside a text block |
| 6 | decorative/logo SVG & img as icons (14) | icons = small svg / class·icon / img-in-link; hero (≥64px) excluded |
| 7 | gap on non-lists / overlays | skip abs-positioned children, text-stacks, all-valid gaps, non-positive gaps |
| — | `mx-auto` margins as spacing (≈6) | collector detects auto-centering; `spacing-scale` ignores those margins |

## Remaining findings I chose NOT to chase (and why)

- **The 36/30 tap-target errors are all TRUE positives** (real interactive
  elements < 44px), so they do not count against the FP bar. I did **not**
  suppress them. Note, honestly: `minTapTarget: 44` is WCAG 2.5.8 **AAA**, which
  is aggressive for **desktop pointer** nav — a 36px desktop nav link is widely
  considered fine. If the volume is undesirable, the lever is **config**
  (`minTapTarget`, or a desktop exemption) — not a rule change or a suppress
  list. On mobile these are legitimate accessibility findings. This is a
  threshold/policy choice for you, not a false positive, so per the milestone's
  "no suppressions to force the number down" I left them as findings.

## Method note

Fixes are **systemic** (Tailwind-scale awareness, property-class-aware
arbitrary-value, tighter icon/tap targeting, layout-vs-content gap heuristics) —
**no ChainHint-specific suppress list** was added (§12: over-tuning to one
project is its own risk). The same fixes generalize to any Tailwind/shadcn
project.
