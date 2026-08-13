import type { AuditReport, Violation, ViolationSeverity } from "./schema.js";

/**
 * renderHtml — pure function turning an {@link AuditReport} into a complete,
 * self-contained HTML document (inline CSS, zero runtime deps, no external
 * fetches). This is the single source of truth for the human-facing report.
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

/** HTML-escape any dynamic string before interpolation. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Human sentence describing what's wrong with a finding. */
function describeIssue(v: Violation): string {
  const note = v.fixHint.note ?? "";
  if (v.ruleId === "canonical-size") {
    if (/tap size|WCAG/i.test(note)) {
      return `tap target ${v.actual}, below ${v.expected}`;
    }
    return `icon ${v.property} ${v.actual}, off the canonical scale`;
  }
  if (v.ruleId === "gap-consistency") {
    return `ragged sibling gaps (${v.actual})`;
  }
  if (v.ruleId === "arbitrary-value") {
    const from = v.fixHint.from ?? v.property;
    return v.actual === v.expected
      ? `${from} — arbitrary value, use the named class`
      : `${from} off-scale (${v.actual})`;
  }
  // spacing-scale
  return `${v.property} ${v.actual} off-scale`;
}

/** Fix cell HTML: from→to (colored) for class swaps, sensible text otherwise. */
function renderFix(v: Violation): string {
  const { kind, from, to, note } = v.fixHint;

  if ((kind === "tailwind-class" || kind === "container-gap") && to) {
    const lead =
      kind === "container-gap" ? `set <span class="to">${esc(to)}</span> on container` : "";
    const swap =
      from !== undefined
        ? `<span class="from">${esc(from)}</span> <span class="arrow">&rarr;</span> <span class="to">${esc(to)}</span>`
        : lead || `<span class="to">${esc(to)}</span>`;
    const extra =
      kind === "container-gap" && note ? `<div class="fix-note">${esc(note)}</div>` : "";
    return `${swap}${extra}`;
  }

  // css-value / manual → render the note, highlighting a WCAG reference.
  if (note) {
    const html = esc(note).replace(
      /WCAG\s*2\.5\.8/gi,
      '<span class="wcag">WCAG 2.5.8</span>',
    );
    return `<span class="fix-manual">${html}</span>`;
  }
  return `<span class="muted">&mdash;</span>`;
}

const SEV_LABEL: Record<ViolationSeverity, string> = {
  error: "error",
  warn: "warn",
  info: "info",
};

function healthBar(errors: number, warns: number, infos: number): string {
  const total = errors + warns + infos;
  if (total === 0) {
    return `<div class="bar bar-clean"><span>No drift detected</span></div>`;
  }
  const seg = (n: number, cls: string): string =>
    n > 0
      ? `<div class="seg ${cls}" style="flex:${n}" title="${n} ${cls}"></div>`
      : "";
  return `<div class="bar">${seg(errors, "error")}${seg(warns, "warn")}${seg(infos, "info")}</div>`;
}

function scoreBlock(errors: number, warns: number, infos: number): string {
  const cell = (n: number, cls: string, label: string): string =>
    `<div class="score-cell ${n > 0 ? cls : "zero"}">
       <div class="score-num">${n}</div>
       <div class="score-label">${label}</div>
     </div>`;
  return `<div class="score">
      ${cell(errors, "error", "errors")}
      ${cell(warns, "warn", "warnings")}
      ${cell(infos, "info", "info")}
    </div>`;
}

function byRuleStrip(byRule: Record<string, number>): string {
  const chips = RULE_IDS.map((id) => {
    const n = byRule[id] ?? 0;
    return `<span class="chip ${n > 0 ? "" : "chip-zero"}"><code>${id}</code><b>${n}</b></span>`;
  }).join("");
  return `<div class="byrule">${chips}</div>`;
}

function contextLine(
  report: AuditReport,
  meta: RenderMeta,
): string {
  const c = report.config;
  const tw = report.isTailwind
    ? `Tailwind <span class="ok">&#10003;</span>`
    : `Tailwind <span class="no">&#10007;</span>`;
  const els =
    meta.elementsScanned !== undefined ? ` &middot; ${meta.elementsScanned} elements` : "";
  return `<div class="context">
      <span class="u">${esc(report.url)}</span> &middot;
      ${report.viewport.width}&times;${report.viewport.height} &middot;
      ${tw} &middot;
      base ${c.baseUnit}px &middot; icons {${c.canonicalSizes.join(", ")}} &middot;
      ${esc(report.timestamp)}${els}
    </div>`;
}

function gateBadge(report: AuditReport): string {
  if (report.isTailwind) return "";
  return `<div class="gate">Non-Tailwind page &mdash; accessibility checks only (spacing/arbitrary rules skipped)</div>`;
}

function rowsHtml(report: AuditReport): string {
  if (report.violations.length === 0) {
    return `<tr class="empty"><td colspan="4">No findings. Nothing to fix.</td></tr>`;
  }
  const rows = report.violations
    .map((v) => {
      const sev = v.severity;
      return `<tr class="sev-${sev}">
        <td class="c-sev"><span class="tag tag-${sev}">${SEV_LABEL[sev]}</span></td>
        <td class="c-el"><code class="sel">${esc(v.selector)}</code><span class="rule">${v.ruleId}</span></td>
        <td class="c-issue">${esc(describeIssue(v))}</td>
        <td class="c-fix">${renderFix(v)}</td>
      </tr>`;
    })
    .join("\n");

  const truncatedRow = report.truncated
    ? `<tr class="more"><td colspan="4">Report truncated to ${report.violations.length} of ${report.summary.total} findings &mdash; ${report.summary.total - report.violations.length} more. Raise <code>maxViolations</code> to see all.</td></tr>`
    : "";
  return rows + truncatedRow;
}

const STYLE = `
:root {
  --bg:#0d1117; --panel:#161b22; --panel2:#0f141a; --border:#30363d;
  --text:#e6edf3; --muted:#8b949e; --faint:#6e7681;
  --error:#f85149; --warn:#d29922; --info:#58a6ff; --ok:#3fb950;
  --grid:rgba(255,255,255,0.035);
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
* { box-sizing:border-box; }
html,body { margin:0; }
body {
  background:var(--bg); color:var(--text); font-family:var(--sans);
  font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased;
}
.wrap { max-width:1040px; margin:0 auto; padding:0 24px 64px; }

/* Header with subtle grid motif */
.header {
  position:relative; margin:0 -24px 28px; padding:36px 24px 24px;
  border-bottom:1px solid var(--border); overflow:hidden;
  background:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px),
    radial-gradient(120% 140% at 15% -10%, rgba(88,166,255,0.08), transparent 60%);
  background-size:22px 22px, 22px 22px, 100% 100%;
}
.brand { display:flex; align-items:baseline; gap:10px; margin-bottom:20px; }
.brand .logo { font-family:var(--mono); font-weight:700; letter-spacing:0.02em; }
.brand .logo b { color:var(--info); }
.brand .tagline { color:var(--muted); font-size:12px; }

.score { display:flex; gap:36px; align-items:flex-end; }
.score-cell { display:flex; flex-direction:column; }
.score-num { font-family:var(--mono); font-size:52px; font-weight:700; line-height:1; letter-spacing:-0.02em; }
.score-label { font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--muted); margin-top:6px; }
.score-cell.error .score-num { color:var(--error); }
.score-cell.warn  .score-num { color:var(--warn); }
.score-cell.info  .score-num { color:var(--info); }
.score-cell.zero  .score-num { color:var(--faint); }

.bar { display:flex; height:8px; border-radius:5px; overflow:hidden; margin:22px 0 18px; background:var(--panel2); border:1px solid var(--border); }
.bar .seg.error { background:var(--error); }
.bar .seg.warn  { background:var(--warn); }
.bar .seg.info  { background:var(--info); }
.bar-clean { align-items:center; justify-content:center; height:auto; padding:8px; border-color:rgba(63,185,80,0.4); background:rgba(63,185,80,0.10); }
.bar-clean span { color:var(--ok); font-family:var(--mono); font-size:13px; font-weight:600; letter-spacing:0.02em; }

.byrule { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
.chip { display:inline-flex; align-items:center; gap:7px; padding:3px 9px; border:1px solid var(--border); border-radius:6px; background:var(--panel); font-size:12px; }
.chip code { font-family:var(--mono); color:var(--muted); }
.chip b { font-family:var(--mono); color:var(--text); }
.chip-zero { opacity:0.5; }
.chip-zero b { color:var(--faint); }

.context { font-family:var(--mono); font-size:11.5px; color:var(--faint); line-height:1.8; }
.context .u { color:var(--muted); }
.context .ok { color:var(--ok); }
.context .no { color:var(--warn); }

.gate { margin-top:14px; display:inline-block; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:600;
  color:var(--info); background:rgba(88,166,255,0.10); border:1px solid rgba(88,166,255,0.35); }

/* Triage table */
table { width:100%; border-collapse:collapse; font-size:13px; }
thead th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.07em; color:var(--muted); font-weight:600;
  padding:0 12px 8px; border-bottom:1px solid var(--border); }
tbody td { padding:11px 12px; border-bottom:1px solid rgba(48,54,61,0.55); vertical-align:top; }
tbody tr:hover { background:rgba(255,255,255,0.02); }
.c-sev { width:74px; }
.c-el { width:34%; }
.c-fix { width:32%; }

.tag { display:inline-block; padding:2px 8px; border-radius:5px; font-family:var(--mono); font-size:11px; font-weight:600; }
.tag-error { color:var(--error); background:rgba(248,81,73,0.12); border:1px solid rgba(248,81,73,0.4); }
.tag-warn  { color:var(--warn);  background:rgba(210,153,34,0.12); border:1px solid rgba(210,153,34,0.4); }
.tag-info  { color:var(--info);  background:rgba(88,166,255,0.10); border:1px solid rgba(88,166,255,0.35); }

.sel { font-family:var(--mono); font-size:12px; color:var(--text); word-break:break-all; }
.rule { display:block; font-family:var(--mono); font-size:10.5px; color:var(--faint); margin-top:3px; }
.c-issue { color:var(--muted); }

.c-fix { font-family:var(--mono); font-size:12px; }
.c-fix .from { color:var(--error); }
.c-fix .to { color:var(--ok); }
.c-fix .arrow { color:var(--faint); margin:0 2px; }
.fix-note, .fix-manual { color:var(--muted); font-family:var(--sans); font-size:12px; }
.fix-note { margin-top:4px; }
.wcag { color:var(--info); }

tr.sev-info td { opacity:0.72; }
tr.empty td { text-align:center; color:var(--muted); padding:28px 12px; }
tr.more td { text-align:center; color:var(--muted); font-size:12px; padding:14px 12px; background:var(--panel2); }
.muted { color:var(--faint); }

.footer { margin-top:26px; padding-top:16px; border-top:1px solid var(--border);
  display:flex; justify-content:space-between; color:var(--faint); font-size:12px; font-family:var(--mono); }
.footer .sup { color:var(--muted); }
`;

export function renderHtml(report: AuditReport, meta: RenderMeta): string {
  const s = report.summary;
  const title = `Gridproof report — ${s.total} finding${s.total === 1 ? "" : "s"}`;

  const footerSuppressed =
    report.suppressedCount > 0
      ? `<span class="sup">${report.suppressedCount} suppressed</span>`
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
    <div class="brand">
      <span class="logo">grid<b>proof</b></span>
      <span class="tagline">spacing &amp; grid QA</span>
    </div>
    ${scoreBlock(s.errors, s.warns, s.infos)}
    ${healthBar(s.errors, s.warns, s.infos)}
    ${byRuleStrip(s.byRule)}
    ${contextLine(report, meta)}
    ${gateBadge(report)}
  </div>

  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Element</th>
        <th>Issue</th>
        <th>Suggested fix</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml(report)}
    </tbody>
  </table>

  <div class="footer">
    <span>Gridproof v${esc(meta.version)} &middot; suggest, don't forbid</span>
    ${footerSuppressed}
  </div>
</div>
</body>
</html>`;
}
