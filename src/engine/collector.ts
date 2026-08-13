import type { Page } from "playwright";
import type { IgnoreSpec, SuppressSelector } from "../util/suppress.js";

/**
 * Collector (spec §7.2). One in-page pass — a single `page.evaluate`, no
 * per-element round trips. Walks the subtree, skips non-visible / structural
 * noise, rounds geometry to 0.5px, and caps at 3000 elements.
 *
 * Day 1: this is the real payload behind `gp_audit`'s raw-geometry mode. No
 * rules run over it yet.
 */

/** Rounded bounding rect (0.5px grid). */
export interface CollectedRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Computed geometry we care about (raw strings as `getComputedStyle` returns them). */
export interface CollectedComputed {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  gap: string;
  rowGap: string;
  columnGap: string;
  width: string;
  height: string;
  display: string;
  position: string;
}

export interface CollectedElement {
  /** Stable CSS selector (id > data-testid > unique class combo > nth path). */
  selector: string;
  tagName: string;
  classList: string[];
  rect: CollectedRect;
  computed: CollectedComputed;
  /** Parent's computed `display` (context for gap/layout rules). */
  parentDisplay: string | null;
  /** Stable selector of the parent element (grouping for gap-consistency). */
  parentSelector: string | null;
  /** Zero-based index among element siblings. */
  siblingIndex: number;
  /** `aria-hidden="true"` on this element (icons handled separately by rules). */
  ariaHidden: boolean;
  /** Raw `data-gp-ignore` attribute value if present (suppression, Day 3). */
  gpIgnore: string | null;
  /**
   * Effective suppression for this element, from inline `data-gp-ignore`
   * (self + ancestors) merged with matching config selector entries.
   */
  ignore: IgnoreSpec;
  /** A pointer tap target (button/[role=button]/input[button,submit]/non-inline a[href]). */
  isTapTarget: boolean;
  /** A small icon (svg/img ≤48px box or .icon); excludes decorative/hero graphics. */
  isIcon: boolean;
  /** Horizontal margins are auto-centering (mx-auto); spacing-scale ignores them. */
  autoMarginX: boolean;
  /** Raw inline `style` attribute value if present (source-hint branch 3). */
  styleAttr: string | null;
  /** outerHTML head of the element, truncated to 120 chars (§6 snippet). */
  snippet: string;
}

export interface CollectionResult {
  /** True when the requested root selector resolved to an element. */
  rootFound: boolean;
  /** Number of elements returned (≤ cap). */
  count: number;
  /** True when the cap was hit and collection stopped early. */
  capped: boolean;
  /** The cap that was applied. */
  cap: number;
  /** Whether the page uses Tailwind (distinctive-signal heuristic, page-level). */
  isTailwind: boolean;
  elements: CollectedElement[];
}

export interface CollectOptions {
  /** Root selector to scope the walk. Defaults to `body`. */
  selector?: string | undefined;
  /** Max elements to collect (spec §7.2 cap). */
  cap?: number;
  /** Config selector-suppressions to fold into each element's `ignore`. */
  suppressSelectors?: SuppressSelector[];
}

const DEFAULT_CAP = 3000;

/**
 * Run the single-pass collector inside the page and return raw geometry.
 * The function passed to `page.evaluate` is fully self-contained (it may only
 * reference its serialized argument), per Playwright's execution model.
 */
export async function collectGeometry(
  page: Page,
  options: CollectOptions = {},
): Promise<CollectionResult> {
  const cap = options.cap ?? DEFAULT_CAP;
  const rootSelector = options.selector ?? "body";
  const suppressSelectors = options.suppressSelectors ?? [];

  return page.evaluate(
    ({ rootSelector, cap, suppressSelectors }): CollectionResult => {
      const round05 = (n: number): number => Math.round(n * 2) / 2;

      // Page-level Tailwind detection using DISTINCTIVE signals (variant colons,
      // arbitrary [..] values, bare flex/grid, color-shade utilities). Chosen to
      // avoid a Bootstrap false-positive (Bootstrap shares p-*/m-*/w-* names but
      // uses no `:` variants, no `[..]`, `d-flex` not `flex`, `w-100` not shades).
      const detectTailwind = (): boolean => {
        const SIGNALS: RegExp[] = [
          /-\[[^\]]+\]/,
          /^(?:sm|md|lg|xl|2xl):/,
          /^(?:hover|focus|active|group-hover|focus-visible|disabled|dark):/,
          /^(?:flex|grid|inline-flex|inline-grid)$/,
          /^(?:space|gap)-[xy]?-?\d/,
          /^(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}$/,
          /^rounded-(?:sm|md|lg|xl|2xl|3xl|full)$/,
          /^shadow-(?:sm|md|lg|xl|2xl|inner)$/,
        ];
        let hits = 0;
        const nodes = document.querySelectorAll("[class]");
        const limit = Math.min(nodes.length, 2000);
        for (let i = 0; i < limit; i++) {
          for (const c of Array.from((nodes[i] as Element).classList)) {
            if (SIGNALS.some((re) => re.test(c))) {
              hits++;
              if (hits >= 8) return true;
            }
          }
        }
        return hits >= 8;
      };
      const isTailwind = detectTailwind();

      const root: Element | null = document.querySelector(rootSelector);
      if (root === null) {
        return {
          rootFound: false,
          count: 0,
          capped: false,
          cap,
          isTailwind,
          elements: [],
        };
      }

      const esc = (s: string): string =>
        typeof CSS !== "undefined" && CSS.escape ? CSS.escape(s) : s;

      const isUnique = (sel: string): boolean => {
        try {
          return document.querySelectorAll(sel).length === 1;
        } catch {
          return false;
        }
      };

      /** Build a stable selector (spec §6): id > data-testid > class combo > nth path, ≤5 segments. */
      const buildSelector = (el: Element): string => {
        if (el.id) {
          const byId = `#${esc(el.id)}`;
          if (isUnique(byId)) return byId;
        }
        const testId = el.getAttribute("data-testid");
        if (testId) {
          const byTest = `[data-testid="${testId}"]`;
          if (isUnique(byTest)) return byTest;
        }
        // shortest unique class combo on this element
        const classes = Array.from(el.classList);
        if (classes.length > 0) {
          const combo = `${el.tagName.toLowerCase()}.${classes
            .map(esc)
            .join(".")}`;
          if (isUnique(combo)) return combo;
        }
        // structural nth-of-type path, capped at 5 segments
        const segments: string[] = [];
        let node: Element | null = el;
        while (node && segments.length < 5) {
          const tag = node.tagName.toLowerCase();
          if (node.id && isUnique(`#${esc(node.id)}`)) {
            segments.unshift(`#${esc(node.id)}`);
            break;
          }
          const parent: Element | null = node.parentElement;
          if (!parent) {
            segments.unshift(tag);
            break;
          }
          const sameTag = Array.from(parent.children).filter(
            (c) => c.tagName === node!.tagName,
          );
          if (sameTag.length === 1) {
            segments.unshift(tag);
          } else {
            const idx = sameTag.indexOf(node) + 1;
            segments.unshift(`${tag}:nth-of-type(${idx})`);
          }
          node = parent;
          if (node === document.body || node === document.documentElement) break;
        }
        return segments.join(" > ");
      };

      /** Effective suppression: inline data-gp-ignore (self+ancestors) + config selectors. */
      const computeIgnore = (el: Element): IgnoreSpec => {
        let all = false;
        const rules = new Set<string>();

        let node: Element | null = el;
        while (node !== null) {
          const attr = node.getAttribute("data-gp-ignore");
          if (attr !== null) {
            if (attr.trim() === "") {
              all = true;
            } else {
              for (const r of attr.trim().split(/\s+/)) rules.add(r);
            }
          }
          node = node.parentElement;
        }

        for (const ss of suppressSelectors) {
          let matched = false;
          try {
            matched = el.matches(ss.selector);
          } catch {
            matched = false;
          }
          if (matched) {
            if (ss.all) all = true;
            else for (const r of ss.rules) rules.add(r);
          }
        }

        if (all) return "all";
        if (rules.size > 0) return Array.from(rules);
        return null;
      };

      /**
       * A tap target for canonical-size (v1.2): button, [role=button],
       * input[type=button|submit], or a[href] that is NOT an inline link within
       * text flow (those are WCAG 2.5.8 exempt).
       */
      const isTapTargetEl = (el: Element): boolean => {
        const tag = el.tagName.toLowerCase();
        if (tag === "button") return true;
        try {
          if (el.matches('[role="button"]')) return true;
        } catch {
          /* ignore */
        }
        if (tag === "input") {
          const t = (el.getAttribute("type") ?? "").toLowerCase();
          return t === "button" || t === "submit";
        }
        if (tag === "a" && el.hasAttribute("href")) {
          if (getComputedStyle(el).display === "inline") {
            const parent = el.parentElement;
            if (parent) {
              for (const n of Array.from(parent.childNodes)) {
                if (
                  n.nodeType === 3 &&
                  (n.textContent ?? "").trim() !== ""
                ) {
                  return false; // inline link inside a text block → exempt
                }
              }
            }
          }
          return true;
        }
        return false;
      };

      /**
       * "icon" as a whole class token (hyphen/underscore-delimited), NOT a
       * substring. Matches `icon`, `nav-icon`, `icon-lg`; rejects `MuiContainer`
       * ("muicontainer") and Tailwind variant fragments like
       * `has-data-[icon=inline-end]:pr-1.5` (contains `[`/`:`).
       */
      const hasIconClass = (el: Element): boolean =>
        Array.from(el.classList).some((c) => {
          if (/[[\]:()]/.test(c)) return false; // Tailwind variant/arbitrary/pseudo
          const segs = c.toLowerCase().split(/[-_]/);
          return segs.includes("icon") || segs.includes("icons");
        });

      /**
       * An icon for canonical-size (v1.3): a small (<64px) element that is an
       * icon by class token, a standalone/interactive small svg, or an img
       * inside a button/link. Tap targets are NEVER icons (closes the
       * desktop-exemption bypass). The lower size floor is applied by the rule.
       */
      const isIconEl = (el: Element, maxDim: number, isTap: boolean): boolean => {
        if (isTap) return false;
        if (maxDim <= 0 || maxDim >= 64) return false; // decorative / hero / container
        if (hasIconClass(el)) return true;
        const tag = el.tagName.toLowerCase();
        if (tag === "img") return el.closest("button, a[href]") !== null;
        if (tag !== "svg") return false;
        return maxDim <= 48 || el.closest("button, a[href]") !== null;
      };

      const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "HEAD", "META", "LINK", "TITLE"]);

      const elements: CollectedElement[] = [];
      let capped = false;

      // Manual pre-order walk so we can prune subtrees (display:none, hidden tags).
      const stack: Element[] = [root];
      while (stack.length > 0) {
        const el = stack.pop() as Element;

        if (SKIP_TAGS.has(el.tagName)) {
          continue; // prune node + subtree
        }

        const cs = getComputedStyle(el);

        // display:none prunes the whole subtree.
        if (cs.display === "none") {
          continue;
        }

        const rectRaw = el.getBoundingClientRect();
        const zeroSize = rectRaw.width === 0 && rectRaw.height === 0;
        const hidden = cs.visibility === "hidden";

        // Record this node unless it is hidden or zero-size (still descend into
        // children — a descendant may be visible / non-zero).
        if (!hidden && !zeroSize) {
          if (elements.length >= cap) {
            capped = true;
            break;
          }

          const parent = el.parentElement;
          const parentDisplay =
            parent !== null ? getComputedStyle(parent).display : null;
          const parentSelector = parent !== null ? buildSelector(parent) : null;

          let siblingIndex = 0;
          if (parent) {
            siblingIndex = Array.from(parent.children).indexOf(el);
          }

          // Auto-centering horizontal margins (mx-auto) resolve to px; treat as
          // layout, not authored spacing (spec §7.2 "ignore auto").
          let autoMarginX = false;
          {
            const disp = cs.display;
            const blockish =
              disp === "block" ||
              disp.startsWith("flex") ||
              disp.startsWith("grid") ||
              disp === "table" ||
              disp === "list-item";
            const ml = Number.parseFloat(cs.marginLeft) || 0;
            const mr = Number.parseFloat(cs.marginRight) || 0;
            if (blockish && parent !== null && ml > 0.5 && Math.abs(ml - mr) < 0.6) {
              const pcs = getComputedStyle(parent);
              const parentContent =
                parent.clientWidth -
                (Number.parseFloat(pcs.paddingLeft) || 0) -
                (Number.parseFloat(pcs.paddingRight) || 0);
              if (Math.abs(ml + mr + rectRaw.width - parentContent) < 1.5) {
                autoMarginX = true;
              }
            }
          }

          const maxDim = Math.max(rectRaw.width, rectRaw.height);

          elements.push({
            selector: buildSelector(el),
            tagName: el.tagName.toLowerCase(),
            classList: Array.from(el.classList),
            rect: {
              x: round05(rectRaw.x),
              y: round05(rectRaw.y),
              width: round05(rectRaw.width),
              height: round05(rectRaw.height),
              top: round05(rectRaw.top),
              right: round05(rectRaw.right),
              bottom: round05(rectRaw.bottom),
              left: round05(rectRaw.left),
            },
            computed: {
              marginTop: cs.marginTop,
              marginRight: cs.marginRight,
              marginBottom: cs.marginBottom,
              marginLeft: cs.marginLeft,
              paddingTop: cs.paddingTop,
              paddingRight: cs.paddingRight,
              paddingBottom: cs.paddingBottom,
              paddingLeft: cs.paddingLeft,
              gap: cs.gap,
              rowGap: cs.rowGap,
              columnGap: cs.columnGap,
              width: cs.width,
              height: cs.height,
              display: cs.display,
              position: cs.position,
            },
            parentDisplay,
            parentSelector,
            siblingIndex,
            ariaHidden: el.getAttribute("aria-hidden") === "true",
            gpIgnore: el.getAttribute("data-gp-ignore"),
            ignore: computeIgnore(el),
            isTapTarget: isTapTargetEl(el),
            isIcon: (() => {
              const isTap = isTapTargetEl(el);
              return isIconEl(el, maxDim, isTap);
            })(),
            autoMarginX,
            styleAttr: el.getAttribute("style"),
            snippet: (() => {
              const oh = el.outerHTML;
              return oh.length > 120 ? oh.slice(0, 120) : oh;
            })(),
          });
        }

        // Push children in reverse so the walk stays document order.
        const children = el.children;
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i] as Element);
        }
      }

      return {
        rootFound: true,
        count: elements.length,
        capped,
        cap,
        isTailwind,
        elements,
      };
    },
    { rootSelector, cap, suppressSelectors },
  );
}
