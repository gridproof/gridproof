# Gridproof calibration — AFTER (v1.2 Tailwind-aware rules)

**Target:** `http://localhost:8080/` (ChainHint frontend, Vite dev). Same harness as report-raw.md.

---

## Viewport: desktop 1440×900

- Elements collected: **732**
- Total violations: **36** (36 error, 0 warn)
- By rule: spacing-scale=0, arbitrary-value=0, gap-consistency=0, canonical-size=36

### spacing-scale — 0

_none_

### arbitrary-value — 0

_none_

### gap-consistency — 0

_none_

### canonical-size — 36

| # | selector | property | actual | expected | sev | fixHint |
|---|---|---|---|---|---|---|
| 1 | `#root > div:nth-of-type(2) > header > div > a` | height | 32px | 44px | error | manual — interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 2 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(1)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 3 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(2)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 4 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(3)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 5 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(4)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 6 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(5)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 7 | `div:nth-of-type(2) > header > div > nav > a:nth-of-type(6)` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 8 | `a.rounded-lg.bg-muted.px-4.py-2.text-sm.font-medium.text-foreground.transition-colors.hover\:bg-muted\/80` | height | 36px | 44px | error | manual — interactive target is 36px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 9 | `button.rounded-xl.px-4.py-1\.5.text-sm.font-medium.transition-all.whitespace-nowrap.bg-primary\/20.text-primary.border.border-primary\/30` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 10 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(2)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 11 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(3)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 12 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(4)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 13 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(5)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 14 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(6)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 15 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(7)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 16 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(8)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 17 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(9)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 18 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(10)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 19 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(11)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 20 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(12)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 21 | `a.flex.items-center.gap-2.rounded-lg.border.border-border\/60.bg-muted\/40.px-5.py-2\.5.text-sm.font-medium.text-muted-foreground.transition-all.hover\:border-border.hover\:text-foreground.hover\:bg-muted\/70` | height | 42px | 44px | error | manual — interactive target is 42px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 22 | `[data-testid="billing-toggle-monthly"]` | height | 32px | 44px | error | manual — interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 23 | `[data-testid="billing-toggle-annual"]` | height | 33px | 44px | error | manual — interactive target is 33px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 24 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(1)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 25 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(2)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 26 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(3)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 27 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(4)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 28 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(5)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 29 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(6)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 30 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(1)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 31 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(2)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 32 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(3)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 33 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(4)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 34 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(5)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 35 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(6)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 36 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(7)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |

---

## Viewport: mobile 375×812

- Elements collected: **763**
- Total violations: **30** (30 error, 0 warn)
- By rule: spacing-scale=0, arbitrary-value=0, gap-consistency=0, canonical-size=30

### spacing-scale — 0

_none_

### arbitrary-value — 0

_none_

### gap-consistency — 0

_none_

### canonical-size — 30

| # | selector | property | actual | expected | sev | fixHint |
|---|---|---|---|---|---|---|
| 1 | `#root > div:nth-of-type(2) > header > div > a` | height | 32px | 44px | error | manual — interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 2 | `button.rounded-lg.p-1\.5.text-muted-foreground.hover\:text-foreground.hover\:bg-muted\/50.transition-colors` | width | 32px | 44px | error | manual — interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 3 | `button.rounded-xl.px-4.py-1\.5.text-sm.font-medium.transition-all.whitespace-nowrap.bg-primary\/20.text-primary.border.border-primary\/30` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 4 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(2)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 5 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(3)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 6 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(4)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 7 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(5)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 8 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(6)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 9 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(7)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 10 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(8)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 11 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(9)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 12 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(10)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 13 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(11)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 14 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(12)` | height | 34px | 44px | error | manual — interactive target is 34px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 15 | `a.flex.items-center.gap-2.rounded-lg.border.border-border\/60.bg-muted\/40.px-5.py-2\.5.text-sm.font-medium.text-muted-foreground.transition-all.hover\:border-border.hover\:text-foreground.hover\:bg-muted\/70` | height | 42px | 44px | error | manual — interactive target is 42px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 16 | `[data-testid="billing-toggle-monthly"]` | height | 32px | 44px | error | manual — interactive target is 32px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 17 | `[data-testid="billing-toggle-annual"]` | height | 33px | 44px | error | manual — interactive target is 33px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 18 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(1)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 19 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(2)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 20 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(3)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 21 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(4)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 22 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(5)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 23 | `div:nth-of-type(2) > footer > div > div:nth-of-type(2) > a:nth-of-type(6)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 24 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(1)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 25 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(2)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 26 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(3)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 27 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(4)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 28 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(5)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 29 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(6)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |
| 30 | `div:nth-of-type(2) > footer > div > div:nth-of-type(3) > a:nth-of-type(7)` | height | 20px | 44px | error | manual — interactive target is 20px, below the 44px minimum tap size (WCAG 2.5.8); enlarge to at least 44px |

