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
  /** Matches `button, a[href], input, [role=button]` (canonical-size targets). */
  isInteractive: boolean;
  /** svg, img inside a button/link, or class matching /icon/i (canonical-size). */
  isIcon: boolean;
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

      const root: Element | null = document.querySelector(rootSelector);
      if (root === null) {
        return { rootFound: false, count: 0, capped: false, cap, elements: [] };
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

      const isInteractiveEl = (el: Element): boolean => {
        try {
          return el.matches('button, a[href], input, [role="button"]');
        } catch {
          return false;
        }
      };

      const isIconEl = (el: Element): boolean => {
        const tag = el.tagName.toLowerCase();
        if (tag === "svg") return true;
        if (tag === "img" && el.closest("button, a[href]") !== null) return true;
        return Array.from(el.classList).some((c) => /icon/i.test(c));
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
            isInteractive: isInteractiveEl(el),
            isIcon: isIconEl(el),
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

      return { rootFound: true, count: elements.length, capped, cap, elements };
    },
    { rootSelector, cap, suppressSelectors },
  );
}
