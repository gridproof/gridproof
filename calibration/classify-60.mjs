// Auto-classifier for the 60-site run. Buckets every finding by root-cause
// signature and emits: per-site table, aggregate bucket counts, gate audit,
// regression-sentinel check. Decision logic is spelled out in DECISION_LOGIC
// below and echoed to the report so the judgment is auditable.
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(
  readFileSync(new URL("./generalization-60.json", import.meta.url)),
);

const MIN_ICON = 10; // config minIconSize
// The collector excludes hero elements (>=64px) from the icon path, so any
// icon finding is <64px by construction. A canonical-size "icon" finding at
// >=64px would mean a non-icon container/button leaked into the icon path —
// the /icon/i substring-match regression signature. Below 64px it is a genuine
// icon merely above the 48px canonical ceiling, not a leak.
const ICON_LEAK = 64;
const ICON_CEILING = 48; // largest canonical anchor; above = above-ceiling real icon
const BREAKPOINT = 768; // config tapTargetBreakpoint

const parsePx = (s) => {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(String(s).trim());
  return m ? Number.parseFloat(m[1]) : null;
};
const halfPxOff = (n) => Math.abs(n - Math.round(n * 2) / 2);
const SIZE_PROPS = new Set([
  "width", "height", "size", "min-width", "min-height", "max-width", "max-height",
]);
const isIconNote = (v) => (v.fixHint?.note ?? "").includes("off the canonical scale");
const isTapNote = (v) =>
  (v.fixHint?.note ?? "").includes("tap size") ||
  (v.fixHint?.note ?? "").includes("WCAG 2.5.8");

// Sentinel bucket ids (clear-FP; must all be 0)
const SENTINELS = new Set([
  "REGRESSION:arbitrary-size",
  "REGRESSION:fractional-subpixel",
  "REGRESSION:sprite-below-floor",
  "REGRESSION:icon-substring-match",
  "REGRESSION:desktop-tap-target",
]);
// category per non-sentinel bucket
const CATEGORY = {
  "component-lib-spacing": "info",
  "arbitrary-hygiene": "borderline",
  "genuine-spacing-drift": "TP",
  "arbitrary-spacing-drift": "TP",
  "non-canonical-real-icon": "TP",
  "tap-target-mobile": "TP",
  // gap-consistency split by max sibling distance (parsed from the note):
  //   small list gaps are plausible drift (TP); huge spreads are the rule
  //   misfiring on layout wrappers ("set gap-96" for 689px-apart page sections)
  //   — a clear FP the 24-site run under-exposed (only 9 findings there).
  "gap-list": "TP",
  "gap-borderline": "borderline",
  "gap-layout-wrapper-FP": "clear-FP-newclass",
  "other": "borderline",
};
// Max inter-sibling distance (px) parsed from a gap-consistency note, or null.
function gapMaxSibling(v) {
  const note = v.fixHint?.note ?? "";
  const nums = [...note.matchAll(/([0-9.]+)px/g)].map((m) => Number.parseFloat(m[1]));
  return nums.length ? Math.max(...nums) : null;
}

/** Classify one violation in a given viewport width. Returns a bucket id. */
function classify(v, vpWidth) {
  const px = parsePx(v.actual);

  // --- REGRESSION SENTINELS (checked first) ---
  if (v.ruleId === "arbitrary-value" && SIZE_PROPS.has(v.property))
    return "REGRESSION:arbitrary-size";
  if (
    (v.ruleId === "spacing-scale" || v.ruleId === "canonical-size") &&
    px !== null &&
    halfPxOff(px) >= 0.12
  )
    return "REGRESSION:fractional-subpixel";
  if (v.ruleId === "canonical-size" && isIconNote(v) && px !== null && px < MIN_ICON)
    return "REGRESSION:sprite-below-floor";
  if (v.ruleId === "canonical-size" && isIconNote(v) && px !== null && px >= ICON_LEAK)
    return "REGRESSION:icon-substring-match";
  if (v.ruleId === "canonical-size" && isTapNote(v) && vpWidth >= BREAKPOINT)
    return "REGRESSION:desktop-tap-target";

  // --- TP / info / borderline ---
  if (v.ruleId === "spacing-scale")
    return v.severity === "info" ? "component-lib-spacing" : "genuine-spacing-drift";
  if (v.ruleId === "arbitrary-value")
    return v.actual === v.expected ? "arbitrary-hygiene" : "arbitrary-spacing-drift";
  if (v.ruleId === "canonical-size" && isIconNote(v)) return "non-canonical-real-icon";
  if (v.ruleId === "canonical-size" && isTapNote(v)) return "tap-target-mobile";
  if (v.ruleId === "gap-consistency") {
    const maxSib = gapMaxSibling(v);
    if (maxSib === null || maxSib > 200) return "gap-layout-wrapper-FP";
    if (maxSib > 64) return "gap-borderline";
    return "gap-list";
  }
  return "other";
}

// ---- aggregate ----
const bucketTotals = {};
// diagnostic: real-icon outliers split by in-range (<=48) vs above-ceiling (48..64)
let iconInRange = 0, iconAboveCeiling = 0;
const catTotals = { "clear-FP": 0, "clear-FP-newclass": 0, borderline: 0, info: 0, TP: 0 };
const sentinelHits = []; // {bucket, url, vp, v}
let grandTotal = 0;

// Evidence-based ground-truth overrides for isTailwind, from a full-DOM probe
// (arbitrary -[…] classes + Tailwind color/responsive utilities). These correct
// my first-pass framework GUESS where the probe proved it wrong — so detector
// accuracy is scored against reality, not my initial mislabel.
const GROUND_TRUTH_TW = {
  "https://cal.com/": false, // homepage: 0 tw signals (app is TW, marketing site is not)
  "https://linear.app/": false, // 0 tw signals (vanilla-extract/custom)
  "https://react.dev/": true, // 136 arbitrary, 97 color utils — real Tailwind
  "https://www.reddit.com/": true, // arbitrary max-w-[480px], px-[var(--rem14)]
  "https://medium.com/": true, // sm: responsive utilities on marketing
  "https://pro.ant.design/": true, // mixed: real Tailwind arbitrary (bg-[#1677ff]) in an Ant app
};

const rows = []; // per-site
let reachableSites = 0;
let gtFnList = [], gtFpList = [], gtCorrect = 0, gtTotal = 0;
const skipped = [];
// gate tallies
let fnList = [], fpList = [], detCorrect = 0, detTotal = 0;

for (const site of data) {
  const twExpected = site.fw === "tailwind";
  const perSite = { desktop: {}, mobile: {} };
  let siteBucketCount = {};
  let anyReachable = false;
  let detDesktop = null, detMobile = null;
  const dTot = { desktop: null, mobile: null };

  for (const vpName of ["desktop", "mobile"]) {
    const r = site[vpName];
    const vpWidth = vpName === "desktop" ? 1440 : 375;
    if (!r || r.error) {
      perSite[vpName] = { error: r?.error ?? "missing" };
      continue;
    }
    anyReachable = true;
    dTot[vpName] = r.total;
    if (vpName === "desktop") detDesktop = r.isTailwind;
    else detMobile = r.isTailwind;
    for (const v of r.violations ?? []) {
      const b = classify(v, vpWidth);
      if (b === "non-canonical-real-icon") {
        const p = parsePx(v.actual);
        if (p !== null && p > ICON_CEILING) iconAboveCeiling++;
        else iconInRange++;
      }
      bucketTotals[b] = (bucketTotals[b] ?? 0) + 1;
      siteBucketCount[b] = (siteBucketCount[b] ?? 0) + 1;
      grandTotal++;
      if (SENTINELS.has(b)) {
        catTotals["clear-FP"]++;
        sentinelHits.push({ bucket: b, url: site.url, vp: vpName, v });
      } else {
        catTotals[CATEGORY[b]]++;
      }
    }
  }

  if (anyReachable) reachableSites++;
  else skipped.push({ url: site.url, d: site.desktop?.error, m: site.mobile?.error });

  // dominant non-sentinel bucket for the row
  const dom = Object.entries(siteBucketCount)
    .filter(([b]) => !SENTINELS.has(b))
    .sort((a, b) => b[1] - a[1])[0];
  const domSentinel = Object.entries(siteBucketCount)
    .filter(([b]) => SENTINELS.has(b))
    .sort((a, b) => b[1] - a[1])[0];

  const detected = detDesktop ?? detMobile; // site-level
  // gate accounting (reachable only) — vs my first-pass GUESS
  if (anyReachable && detected !== null) {
    detTotal++;
    const detIsTw = detected === true;
    if (twExpected === detIsTw) detCorrect++;
    if (twExpected && !detIsTw) fnList.push(site.url);
    if (!twExpected && detIsTw) fpList.push(site.url);
    // vs evidence-based ground truth
    const gt = site.url in GROUND_TRUTH_TW ? GROUND_TRUTH_TW[site.url] : twExpected;
    gtTotal++;
    if (gt === detIsTw) gtCorrect++;
    if (gt && !detIsTw) gtFnList.push(site.url);
    if (!gt && detIsTw) gtFpList.push(site.url);
  }

  rows.push({
    url: site.url,
    fw: site.fw,
    type: site.type,
    detected: detected === null ? "—" : detected ? "TW" : "non-TW",
    detMobile: detMobile === null ? "—" : detMobile ? "TW" : "non-TW",
    desktop: dTot.desktop === null ? "ERR" : dTot.desktop,
    mobile: dTot.mobile === null ? "ERR" : dTot.mobile,
    dom: domSentinel ? `⚠${domSentinel[0]}` : dom ? dom[0] : "—",
    skipped: anyReachable ? "" : "SKIP",
    twExpected,
  });
}

const pct = (n) => ((n / grandTotal) * 100).toFixed(1) + "%";

// ---- print ----
const L = [];
L.push("=== BUCKET TOTALS ===");
for (const [b, n] of Object.entries(bucketTotals).sort((a, b) => b[1] - a[1]))
  L.push(`${String(n).padStart(5)}  ${b}  [${SENTINELS.has(b) ? "clear-FP" : CATEGORY[b]}]`);
L.push("");
L.push("=== CATEGORY TOTALS ===");
L.push(`grand total findings (reachable): ${grandTotal}`);
for (const [c, n] of Object.entries(catTotals))
  L.push(`${String(n).padStart(5)}  ${c}  ${pct(n)}`);
L.push("");
L.push(`non-canonical-real-icon split: in-range(<=48px)=${iconInRange}  above-ceiling(48-64px)=${iconAboveCeiling}`);
L.push("");
L.push(`=== REGRESSION SENTINELS (must be 0): ${catTotals["clear-FP"]} total ===`);
if (sentinelHits.length === 0) L.push("PASS — zero sentinel hits.");
else
  for (const h of sentinelHits.slice(0, 40))
    L.push(`  ${h.bucket} | ${h.url} ${h.vp} | ${h.v.ruleId} ${h.v.property} ${h.v.actual} | ${h.v.selector.slice(0, 50)}`);
L.push("");
L.push(`=== GATE / DETECTION (reachable=${detTotal}) ===`);
L.push(`[A] vs first-pass GUESS: ${detCorrect}/${detTotal} = ${((detCorrect / detTotal) * 100).toFixed(1)}%`);
L.push(`    FN(guess): ${fnList.length} :: ${fnList.map((u) => u.replace("https://", "")).join(", ")}`);
L.push(`    FP(guess): ${fpList.length} :: ${fpList.map((u) => u.replace("https://", "")).join(", ")}`);
L.push(`[B] vs EVIDENCE ground truth: ${gtCorrect}/${gtTotal} = ${((gtCorrect / gtTotal) * 100).toFixed(1)}%`);
L.push(`    FN(true, TW gated off): ${gtFnList.length}`);
gtFnList.forEach((u) => L.push(`      FN ${u}`));
L.push(`    FP(true, non-TW run as TW): ${gtFpList.length}`);
gtFpList.forEach((u) => L.push(`      FP ${u}`));
L.push("");
L.push(`=== SKIPPED (${skipped.length}) ===`);
skipped.forEach((s) => L.push(`  ${s.url} | d:${(s.d ?? "").slice(0, 40)} | m:${(s.m ?? "").slice(0, 40)}`));
L.push("");
L.push(`reachable sites: ${reachableSites}/${data.length}`);

// per-site table (markdown)
L.push("");
L.push("=== PER-SITE TABLE (markdown) ===");
L.push("| URL | fw-guess | type | isTailwind | mob-tw | desktop | mobile | dominant bucket | skip |");
L.push("|-----|----------|------|:----------:|:------:|--------:|-------:|-----------------|:----:|");
for (const r of rows) {
  const twMark = r.detected !== "—" && ((r.twExpected && r.detected === "non-TW") || (!r.twExpected && r.detected === "TW")) ? "❗" : "";
  L.push(`| ${r.url} | ${r.fw} | ${r.type} | ${r.detected}${twMark} | ${r.detMobile} | ${r.desktop} | ${r.mobile} | ${r.dom} | ${r.skipped} |`);
}

const text = L.join("\n");
console.log(text);
writeFileSync(new URL("./classify-60.out.txt", import.meta.url), text);

// also dump machine summary for the .md writer
writeFileSync(
  new URL("./classify-60.summary.json", import.meta.url),
  JSON.stringify({ bucketTotals, catTotals, grandTotal, iconInRange, iconAboveCeiling, detCorrect, detTotal, fnList, fpList, gtCorrect, gtTotal, gtFnList, gtFpList, skipped: skipped.map((s) => s.url), reachableSites, sites: data.length, rows }, null, 2),
);
