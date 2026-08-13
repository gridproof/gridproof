# Gridproof calibration — raw findings (no tuning)

**Target:** `http://localhost:8080/` (ChainHint frontend, Vite dev)

**Generated:** raw dump; every rule, before any dedup/tuning changes.

---

## Viewport: desktop 1440×900

- Elements collected: **740**
- Total violations: **242** (36 error, 206 warn)
- By rule: spacing-scale=61, arbitrary-value=99, gap-consistency=11, canonical-size=71
- truncated: false · suppressedCount: 0

### spacing-scale — 61

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `span.rounded-md.bg-primary\/15.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-primary` | padding | 6px | 8px | warn | manual from=px-1.5 — padding is set by the standard class "px-1.5"; change that class to reach 8px |
| 2 | `div.mb-6.inline-flex.items-center.gap-2.rounded-full.border.border-border.bg-muted\/50.px-4.py-1\.5.text-xs.text-muted-foreground` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 3 | `button.rounded-xl.px-4.py-1\.5.text-sm.font-medium.transition-all.whitespace-nowrap.bg-primary\/20.text-primary.border.border-primary\/30` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 4 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 5 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 6 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(4)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 7 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(5)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 8 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(6)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 9 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(7)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 10 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(8)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 11 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(9)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 12 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(10)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 13 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(11)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 14 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(12)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 15 | `main > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > h3` | margin | 290px | 292px | warn | manual — trace margin:290px in stylesheets |
| 16 | `main > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > h3` | margin | 290px | 292px | warn | manual — trace margin:290px in stylesheets |
| 17 | `div.inline-flex.items-center.gap-2.rounded-full.border.border-border.bg-muted\/50.px-4.py-1\.5.text-xs.font-semibold.tracking-wider.uppercase.text-muted-foreground` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 18 | `h2.text-3xl.sm\:text-5xl.font-bold.text-foreground.sm\:max-w-\[700px\].sm\:mx-auto.\[text-wrap\:balance\]` | margin | 314.422px | 316px | warn | manual — trace margin:314.422px in stylesheets |
| 19 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > p` | margin-top | 14px | 16px | warn | manual from=mt-3.5 — margin-top is set by the standard class "mt-3.5"; change that class to reach 16px |
| 20 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 21 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 22 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 23 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 24 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 25 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 26 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 27 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 28 | `div:nth-of-type(1) > a > div > div:nth-of-type(5) > span` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 29 | `div:nth-of-type(1) > a > div > div:nth-of-type(5) > span` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 30 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > p` | margin-top | 14px | 16px | warn | manual from=mt-3.5 — margin-top is set by the standard class "mt-3.5"; change that class to reach 16px |
| 31 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 32 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 33 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 34 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 35 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 36 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 37 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 38 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 39 | `div:nth-of-type(2) > a > div > div:nth-of-type(5) > span` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 40 | `div:nth-of-type(2) > a > div > div:nth-of-type(5) > span` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 41 | `a.flex.items-center.gap-2.rounded-lg.border.border-border\/60.bg-muted\/40.px-5.py-2\.5.text-sm.font-medium.text-muted-foreground.transition-all.hover\:border-border.hover\:text-foreground.hover\:bg-muted\/70` | padding | 10px | 12px | warn | manual from=py-2.5 — padding is set by the standard class "py-2.5"; change that class to reach 12px |
| 42 | `main > div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(1) > h3` | margin | 290px | 292px | warn | manual — trace margin:290px in stylesheets |
| 43 | `main > div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(1) > h3` | margin | 290px | 292px | warn | manual — trace margin:290px in stylesheets |
| 44 | `[data-testid="billing-toggle-monthly"]` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 45 | `[data-testid="billing-toggle-annual"]` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 46 | `span.ml-1\.5.rounded-full.bg-emerald-500.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-white` | padding | 6px | 8px | warn | manual from=px-1.5 — padding is set by the standard class "px-1.5"; change that class to reach 8px |
| 47 | `span.ml-1\.5.rounded-full.bg-emerald-500.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-white` | margin-left | 6px | 8px | warn | manual from=ml-1.5 — margin-left is set by the standard class "ml-1.5"; change that class to reach 8px |
| 48 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 49 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 50 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 51 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 52 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 53 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 54 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 55 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 56 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 57 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 58 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 59 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 60 | `main > div:nth-of-type(5) > div:nth-of-type(3) > div:nth-of-type(1) > h3` | margin | 34px | 36px | warn | manual — trace margin:34px in stylesheets |
| 61 | `h2.relative.text-5xl.font-extrabold.text-foreground.sm\:max-w-\[700px\].sm\:mx-auto.\[text-wrap\:balance\]` | margin | 306.391px | 308px | warn | manual — trace margin:306.391px in stylesheets |

### arbitrary-value — 99

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `div.absolute.-top-40.-left-40.h-\[500px\].w-\[500px\].rounded-full.bg-primary\/5.blur-\[120px\]` | height | 500px | 384px | warn | tailwind-class from=h-[500px] to=h-96 |
| 2 | `div.absolute.-top-40.-left-40.h-\[500px\].w-\[500px\].rounded-full.bg-primary\/5.blur-\[120px\]` | width | 500px | 384px | warn | tailwind-class from=w-[500px] to=w-96 |
| 3 | `div.absolute.-bottom-40.-right-40.h-\[400px\].w-\[400px\].rounded-full.bg-accent\/5.blur-\[120px\]` | height | 400px | 384px | warn | tailwind-class from=h-[400px] to=h-96 |
| 4 | `div.absolute.-bottom-40.-right-40.h-\[400px\].w-\[400px\].rounded-full.bg-accent\/5.blur-\[120px\]` | width | 400px | 384px | warn | tailwind-class from=w-[400px] to=w-96 |
| 5 | `header.sticky.top-0.z-\[200\].border-b.border-border.px-6.h-\[60px\].glass-strong.flex.items-center` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 6 | `div:nth-of-type(2) > main > div:nth-of-type(1) > div:nth-of-type(2) > div` | border-radius | 28px | 28px | warn | tailwind-class from=rounded-[28px] to=rounded-7 — arbitrary value is on-scale; use the named Tailwind class |
| 7 | `div.glass-strong.rounded-\[28px\].p-4.sm\:p-9.relative.overflow-hidden.noise` | border-radius | 28px | 28px | warn | tailwind-class from=rounded-[28px] to=rounded-7 — arbitrary value is on-scale; use the named Tailwind class |
| 8 | `input.w-full.rounded-\[16px\].border.border-border.bg-background\/50.py-4.pl-10.sm\:pl-12.pr-4.font-mono.text-sm.sm\:text-lg.text-foreground.placeholder\:text-muted-foreground.focus\:border-primary\/50.focus\:outline-none.focus\:ring-1.focus\:ring-primary\/30.transition-all` | border-radius | 16px | 16px | warn | tailwind-class from=rounded-[16px] to=rounded-4 — arbitrary value is on-scale; use the named Tailwind class |
| 9 | `button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.ring-offset-background.focus-visible\:outline-none.focus-visible\:ring-2.focus-visible\:ring-ring.focus-visible\:ring-offset-2.disabled\:pointer-events-none.\[\&_svg\]\:pointer-events-none.\[\&_svg\]\:size-4.\[\&_svg\]\:shrink-0.h-10.px-4.mt-5.w-full.rounded-\[16px\].bg-primary.py-6.sm\:py-7.text-base.font-semibold.text-primary-foreground.transition-all.hover\:bg-primary\/90.hover\:shadow-\[0_0_30px_-5px_hsl\(var\(--primary\)\/0\.4\)\].disabled\:opacity-40` | border-radius | 16px | 16px | warn | tailwind-class from=rounded-[16px] to=rounded-4 — arbitrary value is on-scale; use the named Tailwind class |
| 10 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(1)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 11 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(1)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 12 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(2)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 13 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(2)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 14 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(3)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 15 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(3)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 16 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(4)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 17 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(4)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 18 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(5)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 19 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(5)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 20 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(6)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 21 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(6)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 22 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(7)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 23 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(7)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 24 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(8)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 25 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(8)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 26 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(9)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 27 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(9)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 28 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(10)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 29 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(10)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 30 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(11)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 31 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(11)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 32 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(12)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 33 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(12)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 34 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(13)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 35 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(13)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 36 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(14)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 37 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(14)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 38 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(15)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 39 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(15)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 40 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(16)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 41 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(16)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 42 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(17)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 43 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(17)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 44 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(18)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 45 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(18)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 46 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(1)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 47 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(1)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 48 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 49 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 50 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(3)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 51 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(3)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 52 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(4)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 53 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(4)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 54 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(5)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 55 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(5)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 56 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(6)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 57 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(6)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 58 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(7)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 59 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(7)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 60 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(8)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 61 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(8)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 62 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(9)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 63 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(9)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 64 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(10)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 65 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(10)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 66 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(11)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 67 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(11)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 68 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(12)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 69 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(12)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 70 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(13)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 71 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(13)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 72 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(14)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 73 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(14)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 74 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(15)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 75 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(15)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 76 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(16)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 77 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(16)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 78 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(17)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 79 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(17)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 80 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(18)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 81 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(18)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 82 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 83 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 84 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(5) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 85 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(7) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 86 | `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > a > div` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 87 | `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > a > div` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 88 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 89 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 90 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 91 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 92 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(5) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 93 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(6) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 94 | `div.reveal.reveal-delay-1.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 95 | `div.reveal.reveal-delay-2.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all.border.border-primary\/40.glow-soft` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 96 | `div.reveal.reveal-delay-3.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 97 | `div.h-\[200px\].w-\[400px\].rounded-full.bg-primary\/10.blur-\[100px\]` | height | 200px | 192px | warn | tailwind-class from=h-[200px] to=h-48 |
| 98 | `div.h-\[200px\].w-\[400px\].rounded-full.bg-primary\/10.blur-\[100px\]` | width | 400px | 384px | warn | tailwind-class from=w-[400px] to=w-96 |
| 99 | `button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.ring-offset-background.focus-visible\:outline-none.focus-visible\:ring-2.focus-visible\:ring-ring.focus-visible\:ring-offset-2.disabled\:pointer-events-none.disabled\:opacity-50.\[\&_svg\]\:pointer-events-none.\[\&_svg\]\:size-4.\[\&_svg\]\:shrink-0.h-10.relative.mt-8.rounded-\[18px\].bg-primary.px-10.py-6.text-base.font-semibold.text-primary-foreground.transition-all.hover\:bg-primary\/90.hover\:shadow-\[0_0_30px_-5px_hsl\(var\(--primary\)\/0\.4\)\]` | border-radius | 18px | 16px | warn | tailwind-class from=rounded-[18px] to=rounded-4 |

### gap-consistency — 11

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `div.relative.min-h-screen.flex.flex-col` | gap | -900px, -900px, -900px, 0px, 0px | 0px | warn | container-gap to=gap-0 — children spaced -900px, -900px, -900px, 0px, 0px; set gap-0 on container and remove child margins |
| 2 | `main.relative.z-10.flex.flex-1.flex-col.items-center.pt-16.pb-20.lg\:pt-24` | gap | 64px, 0px, 100px, -20px | 36px | warn | container-gap to=gap-9 — children spaced 64px, 0px, 100px, -20px; set gap-9 on container and remove child margins |
| 3 | `div.w-full.px-5.sm\:px-6.lg\:px-10.flex.flex-col.items-center` | gap | 40px, 32px, 64px | 44px | warn | container-gap to=gap-11 — children spaced 40px, 32px, 64px; set gap-11 on container and remove child margins |
| 4 | `#root > div:nth-of-type(2) > main > div:nth-of-type(3)` | gap | 116px, 96px | 112px | warn | container-gap to=gap-28 — children spaced 116px, 96px; set gap-28 on container and remove child margins |
| 5 | `div.reveal.reveal-delay-1.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 6 | `div.reveal.reveal-delay-2.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 7 | `div.reveal.reveal-delay-3.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 8 | `div.reveal.reveal-delay-1.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | gap | 12px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 9 | `div.reveal.reveal-delay-2.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all.border.border-primary\/40.glow-soft` | gap | 12px, 8px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 8px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 10 | `div.reveal.reveal-delay-3.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | gap | 12px, 8px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 8px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 11 | `div.reveal.relative.mt-32.w-full.max-w-7xl.py-20.flex.flex-col.items-center.text-center` | gap | -973.5px, -534px, -311px | 0px | warn | container-gap to=gap-0 — children spaced -973.5px, -534px, -311px; set gap-0 on container and remove child margins |

### canonical-size — 71

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
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
| 37 | `img.h-8` | width | 136px | 48px | warn | manual — icon width 136px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 38 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 39 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 40 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 41 | `div:nth-of-type(1) > a > div > div:nth-of-type(2) > img` | size | 80px | 48px | warn | manual — icon size 80px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 42 | `a > div > div:nth-of-type(5) > span > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 43 | `a > div > div:nth-of-type(5) > span > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 44 | `div:nth-of-type(2) > a > div > div:nth-of-type(2) > img` | size | 80px | 48px | warn | manual — icon size 80px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 45 | `div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(3) > a > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 46 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 47 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 48 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 49 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 50 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 51 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 52 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(4) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 53 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(5) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 54 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(6) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 55 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(7) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 56 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(8) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 57 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(9) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 58 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(10) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 59 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 60 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 61 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 62 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(4) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 63 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(5) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 64 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(6) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 65 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(7) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 66 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(8) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 67 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(9) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 68 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(10) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 69 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(11) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 70 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(12) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 71 | `footer > div > div:nth-of-type(1) > a > img` | width | 150px | 48px | warn | manual — icon width 150px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px (width 150px→48px, height 59px→48px) |

---

## Viewport: mobile 375×812

- Elements collected: **765**
- Total violations: **230** (30 error, 200 warn)
- By rule: spacing-scale=55, arbitrary-value=99, gap-consistency=11, canonical-size=65
- truncated: false · suppressedCount: 0

### spacing-scale — 55

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `span.rounded-md.bg-primary\/15.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-primary` | padding | 6px | 8px | warn | manual from=px-1.5 — padding is set by the standard class "px-1.5"; change that class to reach 8px |
| 2 | `button.rounded-lg.p-1\.5.text-muted-foreground.hover\:text-foreground.hover\:bg-muted\/50.transition-colors` | padding | 6px | 8px | warn | manual from=p-1.5 — padding is set by the standard class "p-1.5"; change that class to reach 8px |
| 3 | `div.mb-6.inline-flex.items-center.gap-2.rounded-full.border.border-border.bg-muted\/50.px-4.py-1\.5.text-xs.text-muted-foreground` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 4 | `button.rounded-xl.px-4.py-1\.5.text-sm.font-medium.transition-all.whitespace-nowrap.bg-primary\/20.text-primary.border.border-primary\/30` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 5 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 6 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 7 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(4)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 8 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(5)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 9 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(6)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 10 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(7)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 11 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(8)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 12 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(9)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 13 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(10)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 14 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(11)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 15 | `div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > button:nth-of-type(12)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 16 | `div.inline-flex.items-center.gap-2.rounded-full.border.border-border.bg-muted\/50.px-4.py-1\.5.text-xs.font-semibold.tracking-wider.uppercase.text-muted-foreground` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 17 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > p` | margin-top | 14px | 16px | warn | manual from=mt-3.5 — margin-top is set by the standard class "mt-3.5"; change that class to reach 16px |
| 18 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 19 | `div:nth-of-type(2) > div:nth-of-type(1) > a > div > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 20 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 21 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 22 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 23 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 24 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 25 | `div:nth-of-type(1) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 26 | `div:nth-of-type(1) > a > div > div:nth-of-type(5) > span` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 27 | `div:nth-of-type(1) > a > div > div:nth-of-type(5) > span` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 28 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > p` | margin-top | 14px | 16px | warn | manual from=mt-3.5 — margin-top is set by the standard class "mt-3.5"; change that class to reach 16px |
| 29 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 30 | `div:nth-of-type(2) > div:nth-of-type(2) > a > div > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 31 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 32 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(1)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 33 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 34 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(2)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 35 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 36 | `div:nth-of-type(2) > a > div > div:nth-of-type(4) > span:nth-of-type(3)` | padding | 14px | 16px | warn | manual from=px-3.5 — padding is set by the standard class "px-3.5"; change that class to reach 16px |
| 37 | `div:nth-of-type(2) > a > div > div:nth-of-type(5) > span` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 38 | `div:nth-of-type(2) > a > div > div:nth-of-type(5) > span` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 39 | `a.flex.items-center.gap-2.rounded-lg.border.border-border\/60.bg-muted\/40.px-5.py-2\.5.text-sm.font-medium.text-muted-foreground.transition-all.hover\:border-border.hover\:text-foreground.hover\:bg-muted\/70` | padding | 10px | 12px | warn | manual from=py-2.5 — padding is set by the standard class "py-2.5"; change that class to reach 12px |
| 40 | `[data-testid="billing-toggle-monthly"]` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 41 | `[data-testid="billing-toggle-annual"]` | padding | 6px | 8px | warn | manual from=py-1.5 — padding is set by the standard class "py-1.5"; change that class to reach 8px |
| 42 | `span.ml-1\.5.rounded-full.bg-emerald-500.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-white` | padding | 6px | 8px | warn | manual from=px-1.5 — padding is set by the standard class "px-1.5"; change that class to reach 8px |
| 43 | `span.ml-1\.5.rounded-full.bg-emerald-500.px-1\.5.py-0\.5.text-\[10px\].font-semibold.uppercase.tracking-wider.text-white` | margin-left | 6px | 8px | warn | manual from=ml-1.5 — margin-left is set by the standard class "ml-1.5"; change that class to reach 8px |
| 44 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 45 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 46 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 47 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(1) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 48 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 49 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 50 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 51 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(2) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 52 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(4)` | row-gap | 6px | 8px | warn | manual from=gap-1.5 — row-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 53 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(4)` | column-gap | 6px | 8px | warn | manual from=gap-1.5 — column-gap is set by the standard class "gap-1.5"; change that class to reach 8px |
| 54 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > ul` | row-gap | 10px | 12px | warn | manual from=gap-2.5 — row-gap is set by the standard class "gap-2.5"; change that class to reach 12px |
| 55 | `div:nth-of-type(5) > div:nth-of-type(2) > div:nth-of-type(3) > div:nth-of-type(3) > ul` | column-gap | 10px | 12px | warn | manual from=gap-2.5 — column-gap is set by the standard class "gap-2.5"; change that class to reach 12px |

### arbitrary-value — 99

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `div.absolute.-top-40.-left-40.h-\[500px\].w-\[500px\].rounded-full.bg-primary\/5.blur-\[120px\]` | height | 500px | 384px | warn | tailwind-class from=h-[500px] to=h-96 |
| 2 | `div.absolute.-top-40.-left-40.h-\[500px\].w-\[500px\].rounded-full.bg-primary\/5.blur-\[120px\]` | width | 500px | 384px | warn | tailwind-class from=w-[500px] to=w-96 |
| 3 | `div.absolute.-bottom-40.-right-40.h-\[400px\].w-\[400px\].rounded-full.bg-accent\/5.blur-\[120px\]` | height | 400px | 384px | warn | tailwind-class from=h-[400px] to=h-96 |
| 4 | `div.absolute.-bottom-40.-right-40.h-\[400px\].w-\[400px\].rounded-full.bg-accent\/5.blur-\[120px\]` | width | 400px | 384px | warn | tailwind-class from=w-[400px] to=w-96 |
| 5 | `header.sticky.top-0.z-\[200\].border-b.border-border.px-6.h-\[60px\].glass-strong.flex.items-center` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 6 | `div:nth-of-type(2) > main > div:nth-of-type(1) > div:nth-of-type(2) > div` | border-radius | 28px | 28px | warn | tailwind-class from=rounded-[28px] to=rounded-7 — arbitrary value is on-scale; use the named Tailwind class |
| 7 | `div.glass-strong.rounded-\[28px\].p-4.sm\:p-9.relative.overflow-hidden.noise` | border-radius | 28px | 28px | warn | tailwind-class from=rounded-[28px] to=rounded-7 — arbitrary value is on-scale; use the named Tailwind class |
| 8 | `input.w-full.rounded-\[16px\].border.border-border.bg-background\/50.py-4.pl-10.sm\:pl-12.pr-4.font-mono.text-sm.sm\:text-lg.text-foreground.placeholder\:text-muted-foreground.focus\:border-primary\/50.focus\:outline-none.focus\:ring-1.focus\:ring-primary\/30.transition-all` | border-radius | 16px | 16px | warn | tailwind-class from=rounded-[16px] to=rounded-4 — arbitrary value is on-scale; use the named Tailwind class |
| 9 | `button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.ring-offset-background.focus-visible\:outline-none.focus-visible\:ring-2.focus-visible\:ring-ring.focus-visible\:ring-offset-2.disabled\:pointer-events-none.\[\&_svg\]\:pointer-events-none.\[\&_svg\]\:size-4.\[\&_svg\]\:shrink-0.h-10.px-4.mt-5.w-full.rounded-\[16px\].bg-primary.py-6.sm\:py-7.text-base.font-semibold.text-primary-foreground.transition-all.hover\:bg-primary\/90.hover\:shadow-\[0_0_30px_-5px_hsl\(var\(--primary\)\/0\.4\)\].disabled\:opacity-40` | border-radius | 16px | 16px | warn | tailwind-class from=rounded-[16px] to=rounded-4 — arbitrary value is on-scale; use the named Tailwind class |
| 10 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(1)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 11 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(1)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 12 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(2)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 13 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(2)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 14 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(3)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 15 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(3)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 16 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(4)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 17 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(4)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 18 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(5)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 19 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(5)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 20 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(6)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 21 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(6)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 22 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(7)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 23 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(7)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 24 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(8)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 25 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(8)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 26 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(9)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 27 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(9)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 28 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(10)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 29 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(10)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 30 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(11)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 31 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(11)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 32 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(12)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 33 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(12)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 34 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(13)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 35 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(13)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 36 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(14)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 37 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(14)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 38 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(15)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 39 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(15)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 40 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(16)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 41 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(16)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 42 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(17)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 43 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(17)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 44 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(18)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 45 | `div:nth-of-type(2) > div > div > div:nth-of-type(1) > div:nth-of-type(18)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 46 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(1)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 47 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(1)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 48 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 49 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(2)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 50 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(3)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 51 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(3)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 52 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(4)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 53 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(4)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 54 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(5)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 55 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(5)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 56 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(6)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 57 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(6)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 58 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(7)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 59 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(7)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 60 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(8)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 61 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(8)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 62 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(9)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 63 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(9)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 64 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(10)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 65 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(10)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 66 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(11)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 67 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(11)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 68 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(12)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 69 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(12)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 70 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(13)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 71 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(13)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 72 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(14)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 73 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(14)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 74 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(15)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 75 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(15)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 76 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(16)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 77 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(16)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 78 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(17)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 79 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(17)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 80 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(18)` | height | 60px | 56px | warn | tailwind-class from=h-[60px] to=h-14 |
| 81 | `div:nth-of-type(2) > div > div > div:nth-of-type(2) > div:nth-of-type(18)` | width | 200px | 192px | warn | tailwind-class from=w-[200px] to=w-48 |
| 82 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 83 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 84 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(5) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 85 | `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(7) > div > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 86 | `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > a > div` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 87 | `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(2) > a > div` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 88 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 89 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 90 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 91 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(4) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 92 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(5) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 93 | `div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(6) > div` | border-radius | 14px | 14px | warn | tailwind-class from=rounded-[14px] to=rounded-3.5 — arbitrary value is on-scale; use the named Tailwind class |
| 94 | `div.reveal.reveal-delay-1.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 95 | `div.reveal.reveal-delay-2.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all.border.border-primary\/40.glow-soft` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 96 | `div.reveal.reveal-delay-3.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | border-radius | 32px | 32px | warn | tailwind-class from=rounded-[32px] to=rounded-8 — arbitrary value is on-scale; use the named Tailwind class |
| 97 | `div.h-\[200px\].w-\[400px\].rounded-full.bg-primary\/10.blur-\[100px\]` | height | 200px | 192px | warn | tailwind-class from=h-[200px] to=h-48 |
| 98 | `div.h-\[200px\].w-\[400px\].rounded-full.bg-primary\/10.blur-\[100px\]` | width | 400px | 384px | warn | tailwind-class from=w-[400px] to=w-96 |
| 99 | `button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.ring-offset-background.focus-visible\:outline-none.focus-visible\:ring-2.focus-visible\:ring-ring.focus-visible\:ring-offset-2.disabled\:pointer-events-none.disabled\:opacity-50.\[\&_svg\]\:pointer-events-none.\[\&_svg\]\:size-4.\[\&_svg\]\:shrink-0.h-10.relative.mt-8.rounded-\[18px\].bg-primary.px-10.py-6.text-base.font-semibold.text-primary-foreground.transition-all.hover\:bg-primary\/90.hover\:shadow-\[0_0_30px_-5px_hsl\(var\(--primary\)\/0\.4\)\]` | border-radius | 18px | 16px | warn | tailwind-class from=rounded-[18px] to=rounded-4 |

### gap-consistency — 11

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
| 1 | `div.relative.min-h-screen.flex.flex-col` | gap | -812px, -812px, -812px, 0px, 0px | 0px | warn | container-gap to=gap-0 — children spaced -812px, -812px, -812px, 0px, 0px; set gap-0 on container and remove child margins |
| 2 | `main.relative.z-10.flex.flex-1.flex-col.items-center.pt-16.pb-20.lg\:pt-24` | gap | 64px, 0px, 100px, -20px | 36px | warn | container-gap to=gap-9 — children spaced 64px, 0px, 100px, -20px; set gap-9 on container and remove child margins |
| 3 | `div.w-full.px-5.sm\:px-6.lg\:px-10.flex.flex-col.items-center` | gap | 40px, 32px, 64px | 44px | warn | container-gap to=gap-11 — children spaced 40px, 32px, 64px; set gap-11 on container and remove child margins |
| 4 | `#root > div:nth-of-type(2) > main > div:nth-of-type(3)` | gap | 116px, 96px | 112px | warn | container-gap to=gap-28 — children spaced 116px, 96px; set gap-28 on container and remove child margins |
| 5 | `div.reveal.reveal-delay-1.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 6 | `div.reveal.reveal-delay-2.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 7 | `div.reveal.reveal-delay-3.flex.flex-col.items-center.rounded-3xl.glass.px-8.py-10.text-center.transition-colors.hover\:border-primary\/30` | gap | 20px, 12px | 16px | warn | container-gap to=gap-4 — children spaced 20px, 12px; set gap-4 on container and remove child margins |
| 8 | `div.reveal.reveal-delay-1.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | gap | 12px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 9 | `div.reveal.reveal-delay-2.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all.border.border-primary\/40.glow-soft` | gap | 12px, 8px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 8px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 10 | `div.reveal.reveal-delay-3.relative.flex.flex-col.rounded-\[32px\].glass.p-8.transition-all` | gap | 12px, 8px, 12px, 24px, 24px | 16px | warn | container-gap to=gap-4 — children spaced 12px, 8px, 12px, 24px, 24px; set gap-4 on container and remove child margins |
| 11 | `div.reveal.relative.mt-32.w-full.max-w-7xl.py-20.flex.flex-col.items-center.text-center` | gap | -368px, 16px, 32px | 0px | warn | container-gap to=gap-0 — children spaced -368px, 16px, 32px; set gap-0 on container and remove child margins |

### canonical-size — 65

| # | selector | property | actual | expected | sev | fixHint |
|---|----------|----------|--------|----------|-----|---------|
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
| 31 | `img.h-8` | width | 136px | 48px | warn | manual — icon width 136px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 32 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 33 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 34 | `div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > div > svg` | size | 96px | 48px | warn | manual — icon size 96px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 35 | `div:nth-of-type(1) > a > div > div:nth-of-type(2) > img` | size | 80px | 48px | warn | manual — icon size 80px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 36 | `a > div > div:nth-of-type(5) > span > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 37 | `a > div > div:nth-of-type(5) > span > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 38 | `div:nth-of-type(2) > a > div > div:nth-of-type(2) > img` | size | 80px | 48px | warn | manual — icon size 80px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px |
| 39 | `div:nth-of-type(3) > div:nth-of-type(3) > div:nth-of-type(3) > a > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 40 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 41 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 42 | `div:nth-of-type(3) > div:nth-of-type(1) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 43 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 44 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 45 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 46 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(4) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 47 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(5) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 48 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(6) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 49 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(7) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 50 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(8) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 51 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(9) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 52 | `div:nth-of-type(3) > div:nth-of-type(2) > ul > li:nth-of-type(10) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 53 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(1) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 54 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(2) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 55 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(3) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 56 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(4) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 57 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(5) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 58 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(6) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 59 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(7) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 60 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(8) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 61 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(9) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 62 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(10) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 63 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(11) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 64 | `div:nth-of-type(3) > div:nth-of-type(3) > ul > li:nth-of-type(12) > svg` | size | 14px | 16px | warn | manual — icon size 14px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 16px |
| 65 | `footer > div > div:nth-of-type(1) > a > img` | width | 150px | 48px | warn | manual — icon width 150px is off the canonical scale {16, 20, 24, 32, 40, 48}; snap to 48px (width 150px→48px, height 59px→48px) |

