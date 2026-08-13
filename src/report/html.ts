import type { AuditReport, Violation, ViolationSeverity } from "./schema.js";

/**
 * renderHtml — pure function turning an {@link AuditReport} into a complete,
 * self-contained HTML document (inline CSS, zero runtime deps, no external
 * fetches). Single source of truth for the human-facing report.
 *
 * Design: calm near-black surface, data as the hero. One focal verdict (a single
 * count colored by the worst severity), the severity split demoted to a quiet
 * inline legend, and a dense-but-airy triage table. Color only where it earns
 * its place (severity tags, from→to fixes).
 */

export interface RenderMeta {
  /** Gridproof version, shown in the footer. */
  version: string;
  /** Elements scanned during collection (run-context line). */
  elementsScanned?: number | undefined;
}

const RULE_IDS = [
  "spacing-scale",
  "arbitrary-value",
  "gap-consistency",
  "canonical-size",
] as const;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Worst severity present drives the hero color. */
function verdictClass(errors: number, warns: number, infos: number): string {
  if (errors > 0) return "error";
  if (warns > 0) return "warn";
  if (infos > 0) return "info";
  return "ok";
}

/** "2026-08-13T16:48:17.657Z" → "2026-08-13 16:48" (falls back to raw). */
function shortTimestamp(ts: string): string {
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(ts);
  return m ? `${m[1]} ${m[2]}` : ts;
}

/** Concise, non-duplicative fix cell (the Issue column already states what's wrong). */
function renderFix(v: Violation): string {
  const { kind, from, to } = v.fixHint;
  const toEl = (s: string): string => `<span class="to">${esc(s)}</span>`;

  if (kind === "tailwind-class" && from && to) {
    return `<span class="from">${esc(from)}</span> <span class="arrow">&rarr;</span> ${toEl(to)}`;
  }
  if (kind === "tailwind-class" && to) return `<span class="arrow">&rarr;</span> ${toEl(to)}`;
  if (kind === "container-gap" && to) return `set ${toEl(to)} on container`;

  if (v.ruleId === "canonical-size") {
    if (/tap size|WCAG/i.test(v.fixHint.note ?? "")) {
      return `enlarge to &ge;${esc(v.expected)} <span class="wcag">WCAG 2.5.8</span>`;
    }
    return `snap to ${toEl(v.expected)}`;
  }
  if (kind === "css-value") return `${esc(v.property)}: ${toEl(v.expected)} <span class="muted">(inline)</span>`;
  // spacing-scale manual
  return `${toEl(v.expected)} <span class="muted">&middot; trace in CSS</span>`;
}

const SEV_LABEL: Record<ViolationSeverity, string> = { error: "error", warn: "warn", info: "info" };

/** Property-agnostic issue label for a group (findings with the same fix). */
function groupIssue(v: Violation): string {
  const note = v.fixHint.note ?? "";
  if (v.ruleId === "canonical-size") {
    if (/tap size|WCAG/i.test(note)) return `tap target ${v.actual}, below ${v.expected}`;
    return `icon ${v.actual}, off canonical`;
  }
  if (v.ruleId === "gap-consistency") return `ragged sibling gaps (${v.actual})`;
  if (v.ruleId === "arbitrary-value") {
    const from = v.fixHint.from ?? v.property;
    return v.actual === v.expected ? `${from} — use the named class` : `${from} off-scale (${v.actual})`;
  }
  return `${v.actual} off-scale`;
}

interface Group {
  severity: ViolationSeverity;
  ruleId: string;
  issue: string;
  fixHtml: string;
  selectors: string[];
}

const SEV_RANK: Record<ViolationSeverity, number> = { error: 0, warn: 1, info: 2 };

/**
 * Aggregate findings by (rule + severity + value + fix) — one fix applies to many
 * elements, so this collapses hundreds of near-identical rows into a handful of
 * actionable groups. Ordered worst-severity first, then by impact (count).
 */
function groupViolations(violations: readonly Violation[]): Group[] {
  const map = new Map<string, { rep: Violation; selectors: string[] }>();
  for (const v of violations) {
    const fh = v.fixHint;
    const key = [v.ruleId, v.severity, v.actual, v.expected, fh.kind, fh.from ?? "", fh.to ?? ""].join("|");
    const g = map.get(key);
    if (g) g.selectors.push(v.selector);
    else map.set(key, { rep: v, selectors: [v.selector] });
  }
  return [...map.values()]
    .map((g) => ({
      severity: g.rep.severity,
      ruleId: g.rep.ruleId,
      issue: groupIssue(g.rep),
      fixHtml: renderFix(g.rep),
      selectors: g.selectors,
    }))
    .sort(
      (a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || b.selectors.length - a.selectors.length,
    );
}

const SELECTORS_SHOWN = 4;

function affectedHtml(selectors: string[]): string {
  const shown = selectors
    .slice(0, SELECTORS_SHOWN)
    .map((s) => `<code class="sel">${esc(s)}</code>`)
    .join(" ");
  const extra = selectors.length - SELECTORS_SHOWN;
  const more = extra > 0 ? ` <span class="muted">+${extra} more</span>` : "";
  return `<span class="count">&times;${selectors.length}</span> ${shown}${more}`;
}

function heroBlock(
  total: number,
  errors: number,
  warns: number,
  infos: number,
): string {
  const vc = verdictClass(errors, warns, infos);
  const headline =
    total === 0 ? "No drift detected" : `${total} finding${total === 1 ? "" : "s"}`;

  // Quiet inline legend with colored dots; omit zero rows entirely.
  const legendParts: string[] = [];
  if (errors > 0) legendParts.push(`<span class="lg error"><i></i>${errors} error${errors === 1 ? "" : "s"}</span>`);
  if (warns > 0) legendParts.push(`<span class="lg warn"><i></i>${warns} warning${warns === 1 ? "" : "s"}</span>`);
  if (infos > 0) legendParts.push(`<span class="lg info"><i></i>${infos} info</span>`);
  const legend =
    legendParts.length > 0
      ? `<div class="legend">${legendParts.join('<span class="sep">&middot;</span>')}</div>`
      : `<div class="legend clean">all four rules pass</div>`;

  // Slim proportional bar (or a clean green line when there are no findings).
  const seg = (n: number, cls: string): string =>
    n > 0 ? `<div class="seg ${cls}" style="flex:${n}"></div>` : "";
  const bar =
    total === 0
      ? `<div class="bar bar-clean"></div>`
      : `<div class="bar">${seg(errors, "error")}${seg(warns, "warn")}${seg(infos, "info")}</div>`;

  return `<div class="hero">
      <div class="big ${vc}">${total}</div>
      <div class="hero-text">
        <div class="headline ${vc}">${headline}</div>
        ${legend}
      </div>
    </div>
    ${bar}`;
}

function byRuleStrip(byRule: Record<string, number>): string {
  const chips = RULE_IDS.filter((id) => (byRule[id] ?? 0) > 0).map(
    (id) => `<span class="chip"><code>${id}</code><b>${byRule[id]}</b></span>`,
  );
  return chips.length > 0 ? `<div class="byrule">${chips.join("")}</div>` : "";
}

function contextLine(report: AuditReport, meta: RenderMeta): string {
  const tw = report.isTailwind
    ? `Tailwind <span class="ok">&#10003;</span>`
    : `non-Tailwind`;
  const els =
    meta.elementsScanned !== undefined ? ` &middot; ${meta.elementsScanned} elements` : "";
  return `<div class="context">
      <span class="u">${esc(report.url)}</span>
      &middot; ${report.viewport.width}&times;${report.viewport.height}
      &middot; ${tw}
      &middot; base ${report.config.baseUnit}px${els}
    </div>`;
}

function gateBadge(report: AuditReport): string {
  if (report.isTailwind) return "";
  return `<div class="gate">Non-Tailwind page &mdash; accessibility checks only</div>`;
}

function rowsHtml(report: AuditReport): string {
  if (report.violations.length === 0) {
    return `<tr class="empty"><td colspan="4">Nothing to fix.</td></tr>`;
  }
  const groups = groupViolations(report.violations);
  const rows = groups
    .map((g) => {
      const sev = g.severity;
      return `<tr class="sev-${sev}">
        <td class="c-sev"><span class="tag tag-${sev}">${SEV_LABEL[sev]}</span></td>
        <td class="c-issue">${esc(g.issue)}<span class="rule">${g.ruleId}</span></td>
        <td class="c-fix">${g.fixHtml}</td>
        <td class="c-aff">${affectedHtml(g.selectors)}</td>
      </tr>`;
    })
    .join("\n");

  const more = report.summary.total - report.violations.length;
  const truncatedRow =
    report.truncated && more > 0
      ? `<tr class="more"><td colspan="4">+${more} more finding(s) beyond the cap &mdash; raise <code>maxViolations</code> to see all ${report.summary.total}.</td></tr>`
      : "";
  const groupNote = `<tr class="grouped"><td colspan="4">${report.violations.length} finding(s) grouped into ${groups.length} fix(es), most impactful first.</td></tr>`;
  return rows + truncatedRow + (groups.length < report.violations.length ? groupNote : "");
}

const STYLE = `
:root {
  --bg:#0b0e13; --panel:#12161d; --line:#20262f; --line-soft:rgba(32,38,47,0.6);
  --text:#e6edf3; --muted:#8b949e; --faint:#5c6470;
  --error:#f85149; --warn:#d99a2b; --info:#589dff; --ok:#3fb950;
  --grid:rgba(255,255,255,0.022);
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
* { box-sizing:border-box; }
html,body { margin:0; }
body { background:var(--bg); color:var(--text); font-family:var(--sans); font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased; }
.wrap { max-width:960px; margin:0 auto; padding:0 28px 72px; }

.header { position:relative; margin:0 -28px 30px; padding:26px 28px 22px; border-bottom:1px solid var(--line); overflow:hidden;
  background:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size:26px 26px; }
.brandline { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:22px; }
.logo { font-family:var(--mono); font-weight:600; font-size:13px; letter-spacing:0.01em; color:var(--muted); }
.logo b { color:var(--text); }
.stamp { font-family:var(--mono); font-size:11px; color:var(--faint); }

/* Hero verdict — the single focal point */
.hero { display:flex; align-items:center; gap:20px; }
.big { font-family:var(--mono); font-size:64px; font-weight:700; line-height:0.9; letter-spacing:-0.03em; }
.big.error { color:var(--error); } .big.warn { color:var(--warn); } .big.info { color:var(--info); } .big.ok { color:var(--ok); }
.headline { font-size:17px; font-weight:600; letter-spacing:-0.01em; }
.headline.error { color:var(--error); } .headline.warn { color:var(--warn); } .headline.info { color:var(--info); } .headline.ok { color:var(--ok); }
.legend { margin-top:5px; font-size:12px; color:var(--muted); display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
.legend .lg { display:inline-flex; align-items:center; gap:5px; }
.legend .lg i { width:7px; height:7px; border-radius:50%; display:inline-block; }
.legend .error i { background:var(--error); } .legend .warn i { background:var(--warn); } .legend .info i { background:var(--info); }
.legend .sep { color:var(--faint); }
.legend.clean { color:var(--faint); }

.bar { display:flex; height:3px; border-radius:3px; overflow:hidden; margin:16px 0 16px; background:var(--panel); }
.bar .seg.error { background:var(--error); } .bar .seg.warn { background:var(--warn); } .bar .seg.info { background:var(--info); }
.bar-clean { background:linear-gradient(90deg, rgba(63,185,80,0.55), rgba(63,185,80,0.15)); }

.byrule { display:flex; flex-wrap:wrap; gap:7px; margin:0 0 12px; }
.chip { display:inline-flex; align-items:center; gap:6px; padding:2px 8px; border:1px solid var(--line); border-radius:5px; font-size:11.5px; }
.chip code { font-family:var(--mono); color:var(--muted); } .chip b { font-family:var(--mono); color:var(--text); }

.context { font-family:var(--mono); font-size:11.5px; color:var(--faint); }
.context .u { color:var(--muted); } .context .ok { color:var(--ok); }
.gate { margin-top:12px; display:inline-block; padding:4px 10px; border-radius:5px; font-size:11.5px; font-weight:600;
  color:var(--info); background:rgba(88,157,255,0.08); border:1px solid rgba(88,157,255,0.28); }

table { width:100%; border-collapse:collapse; font-size:13px; }
thead th { text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color:var(--faint); font-weight:600; padding:0 12px 9px; }
tbody td { padding:13px 12px; border-top:1px solid var(--line-soft); vertical-align:top; }
tbody tr:first-child td { border-top:1px solid var(--line); }
tbody tr:hover { background:rgba(255,255,255,0.015); }
.c-sev { width:62px; } .c-issue { width:26%; } .c-fix { width:24%; }

.tag { display:inline-block; padding:1px 7px; border-radius:4px; font-family:var(--mono); font-size:10.5px; font-weight:600; }
.tag-error { color:var(--error); background:rgba(248,81,73,0.10); } .tag-warn { color:var(--warn); background:rgba(217,154,43,0.10); } .tag-info { color:var(--info); background:rgba(88,157,255,0.08); }
.sel { font-family:var(--mono); font-size:11.5px; color:var(--muted); word-break:break-all; }
.rule { display:block; font-family:var(--mono); font-size:10px; color:var(--faint); margin-top:3px; }
.c-issue { color:var(--text); }
.c-fix { font-family:var(--mono); font-size:12px; color:var(--muted); }
.c-fix .from { color:var(--error); } .c-fix .to { color:var(--ok); } .c-fix .arrow { color:var(--faint); }
.c-aff { color:var(--faint); font-size:12px; line-height:1.9; }
.c-aff .count { font-family:var(--mono); font-weight:700; color:var(--text); margin-right:6px; }
.wcag { color:var(--info); white-space:nowrap; } .muted { color:var(--faint); }
tr.sev-info td { opacity:0.6; }
tr.empty td { text-align:center; color:var(--faint); padding:30px 12px; }
tr.more td, tr.grouped td { text-align:center; color:var(--faint); font-size:11.5px; padding:12px; }
tr.grouped td { border-top:1px solid var(--line); }

.footer { margin-top:28px; padding-top:14px; border-top:1px solid var(--line); display:flex; justify-content:space-between; color:var(--faint); font-size:11.5px; font-family:var(--mono); }
`;

export function renderHtml(report: AuditReport, meta: RenderMeta): string {
  const s = report.summary;
  const title = `Gridproof — ${s.total} finding${s.total === 1 ? "" : "s"}`;
  const suppressed =
    report.suppressedCount > 0
      ? `<span>${report.suppressedCount} suppressed</span>`
      : "<span></span>";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>${STYLE}</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="brandline">
      <span class="logo">grid<b>proof</b></span>
      <span class="stamp">${esc(shortTimestamp(report.timestamp))}</span>
    </div>
    ${heroBlock(s.total, s.errors, s.warns, s.infos)}
    ${byRuleStrip(s.byRule)}
    ${contextLine(report, meta)}
    ${gateBadge(report)}
  </div>

  <table>
    <thead><tr><th>Severity</th><th>Issue</th><th>Suggested fix</th><th>Affected</th></tr></thead>
    <tbody>
      ${rowsHtml(report)}
    </tbody>
  </table>

  <div class="footer">
    <span>Gridproof v${esc(meta.version)} &middot; suggest, don't forbid</span>
    ${suppressed}
  </div>
</div>
</body>
</html>`;
}
