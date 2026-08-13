// 60-site generalization harness. Renders each URL at desktop+mobile using the
// EXACT committed rules (imported from dist/), writes raw report JSON.
// Measurement only — no rule tuning. Graceful skip on any per-site failure.
import { withRenderedPage, shutdownRenderer } from "../dist/engine/renderer.js";
import { collectGeometry } from "../dist/engine/collector.js";
import { runAudit } from "../dist/engine/runner.js";
import { registry } from "../dist/engine/rule.js";
import { registerDefaultRules } from "../dist/engine/rules/register.js";
import { DEFAULT_CONFIG } from "../dist/config/defaults.js";
import { suppressSelectorsFromConfig } from "../dist/util/suppress.js";
import { writeFileSync } from "node:fs";

const CONFIG = DEFAULT_CONFIG;
const MAXV = 100000;
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

// fw = my honest framework guess. tw-expected := fw === "tailwind".
// Original 24 first (before/after continuity), then 36 new.
const SITES = [
  // ---- original 24 ----
  { url: "https://ui.shadcn.com/", type: "component-lib", fw: "tailwind" },
  { url: "https://ui.shadcn.com/examples/dashboard", type: "dashboard", fw: "tailwind" },
  { url: "https://ui.shadcn.com/examples/cards", type: "cards", fw: "tailwind" },
  { url: "https://ui.shadcn.com/examples/mail", type: "app", fw: "tailwind" },
  { url: "https://ui.shadcn.com/examples/forms", type: "forms", fw: "tailwind" },
  { url: "https://tailwindcss.com/", type: "marketing", fw: "tailwind" },
  { url: "https://flowbite.com/", type: "components", fw: "tailwind" },
  { url: "https://daisyui.com/", type: "components", fw: "tailwind" },
  { url: "https://www.tremor.so/", type: "dashboard", fw: "tailwind" },
  { url: "https://preline.co/", type: "components", fw: "tailwind" },
  { url: "https://dub.co/", type: "saas", fw: "tailwind" },
  { url: "https://cal.com/", type: "saas", fw: "tailwind" },
  { url: "https://resend.com/", type: "marketing", fw: "tailwind" },
  { url: "https://supabase.com/", type: "marketing", fw: "tailwind" },
  { url: "https://astro.build/", type: "marketing", fw: "tailwind" },
  { url: "https://precedent.dev/", type: "starter", fw: "tailwind" },
  { url: "https://vercel.com/", type: "marketing", fw: "tailwind" },
  { url: "https://getbootstrap.com/", type: "bootstrap", fw: "bootstrap" },
  { url: "https://getbootstrap.com/docs/5.3/examples/dashboard/", type: "bootstrap-dash", fw: "bootstrap" },
  { url: "https://mui.com/", type: "css-in-js", fw: "mui" },
  { url: "https://ant.design/", type: "antd", fw: "antd" },
  { url: "https://www.chakra-ui.com/", type: "css-in-js", fw: "chakra" },
  { url: "https://styled-components.com/", type: "css-in-js", fw: "styled-components" },
  { url: "https://getbootstrap.com/docs/5.3/examples/album/", type: "bootstrap-gallery", fw: "bootstrap" },

  // ---- new: Tailwind SaaS (6) ----
  { url: "https://linear.app/", type: "saas", fw: "tailwind" },
  { url: "https://railway.com/", type: "saas", fw: "tailwind" },
  { url: "https://clerk.com/", type: "saas", fw: "tailwind" },
  { url: "https://upstash.com/", type: "saas", fw: "tailwind" },
  { url: "https://trigger.dev/", type: "saas", fw: "tailwind" },
  { url: "https://planetscale.com/", type: "saas", fw: "tailwind" },

  // ---- new: Tailwind component libs (2) ----
  { url: "https://www.hyperui.dev/", type: "components", fw: "tailwind" },
  { url: "https://tailgrids.com/", type: "components", fw: "tailwind" },

  // ---- new: mainstream high-traffic messy-DOM (15) ----
  { url: "https://www.nytimes.com/", type: "news", fw: "custom" },
  { url: "https://www.theguardian.com/international", type: "news", fw: "custom" },
  { url: "https://www.bbc.com/", type: "news", fw: "custom" },
  { url: "https://www.cnn.com/", type: "news", fw: "custom" },
  { url: "https://www.amazon.com/dp/B08N5WRWNW", type: "ecommerce-product", fw: "custom" },
  { url: "https://www.reddit.com/", type: "social", fw: "custom" },
  { url: "https://medium.com/", type: "media", fw: "custom" },
  { url: "https://github.com/", type: "dev-landing", fw: "primer" },
  { url: "https://stripe.com/", type: "saas-marketing", fw: "custom" },
  { url: "https://www.notion.com/", type: "saas-marketing", fw: "custom" },
  { url: "https://www.figma.com/", type: "saas-marketing", fw: "custom" },
  { url: "https://slack.com/", type: "saas-marketing", fw: "custom" },
  { url: "https://developer.mozilla.org/en-US/", type: "docs", fw: "custom" },
  { url: "https://react.dev/", type: "docs", fw: "custom" },
  { url: "https://news.ycombinator.com/", type: "messy-minimal", fw: "plain-css" },

  // ---- new: non-Tailwind control (13) ----
  { url: "https://www.gov.uk/", type: "gov", fw: "plain-css" },
  { url: "https://www.usa.gov/", type: "gov", fw: "plain-css" },
  { url: "https://www.mit.edu/", type: "edu", fw: "plain-css" },
  { url: "https://european-union.europa.eu/index_en", type: "gov", fw: "plain-css" },
  { url: "https://getbootstrap.com/docs/5.3/examples/pricing/", type: "bootstrap-example", fw: "bootstrap" },
  { url: "https://getbootstrap.com/docs/5.3/examples/carousel/", type: "bootstrap-example", fw: "bootstrap" },
  { url: "https://pro.ant.design/", type: "antd", fw: "antd" },
  { url: "https://mui.com/material-ui/getting-started/", type: "css-in-js", fw: "mui" },
  { url: "https://www.chakra-ui.com/docs/get-started/installation", type: "css-in-js", fw: "chakra" },
  { url: "https://mantine.dev/", type: "css-in-js", fw: "mantine" },
  { url: "https://bulma.io/", type: "css-framework", fw: "bulma" },
  { url: "https://semantic-ui.com/", type: "css-framework", fw: "semantic" },
  { url: "https://www.w3.org/", type: "standards", fw: "plain-css" },
];

registerDefaultRules(registry); // shared registry starts empty (Day-1 design)
const suppressSelectors = suppressSelectorsFromConfig(CONFIG.suppress);

function withTimeout(promise, ms, label) {
  let t;
  const guard = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error(`hard timeout ${ms}ms (${label})`)), ms);
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(t));
}

async function auditOne(url, viewport) {
  const collection = await withTimeout(
    withRenderedPage(url, viewport, (page) =>
      collectGeometry(page, { suppressSelectors }),
    ),
    50000,
    "render+collect",
  );
  if (!collection.rootFound) throw new Error("root <body> not found");
  const report = runAudit({
    url,
    viewport,
    elements: collection.elements,
    config: CONFIG,
    registry,
    maxViolations: MAXV,
    isTailwind: collection.isTailwind,
  });
  return {
    elements: collection.elements.length,
    capped: collection.capped,
    isTailwind: report.isTailwind,
    total: report.summary.total,
    byRule: report.summary.byRule,
    violations: report.violations,
  };
}

const results = [];
for (const site of SITES) {
  const entry = { url: site.url, type: site.type, fw: site.fw };
  for (const [vpName, vp] of [["desktop", DESKTOP], ["mobile", MOBILE]]) {
    try {
      entry[vpName] = await auditOne(site.url, vp);
      const e = entry[vpName];
      console.error(`[ok] ${site.url} ${vpName} el=${e.elements} tw=${e.isTailwind} total=${e.total}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      entry[vpName] = { error: msg.slice(0, 300) };
      console.error(`[skip] ${site.url} ${vpName} :: ${msg.slice(0, 120)}`);
    }
  }
  results.push(entry);
}

await shutdownRenderer();
const out = new URL("./generalization-60.json", import.meta.url);
writeFileSync(out, JSON.stringify(results, null, 2));
console.error(`\nDONE: ${results.length} sites → calibration/generalization-60.json`);
