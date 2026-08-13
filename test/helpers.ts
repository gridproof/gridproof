import type {
  CollectedComputed,
  CollectedElement,
  CollectedRect,
} from "../src/engine/collector.js";
import type { IgnoreSpec } from "../src/util/suppress.js";

/** All-zero computed geometry; override selectively per test. */
export const ZERO_COMPUTED: CollectedComputed = {
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  gap: "normal",
  rowGap: "normal",
  columnGap: "normal",
  width: "0px",
  height: "0px",
  display: "block",
  position: "static",
};

const ZERO_RECT: CollectedRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export interface MakeElementOptions {
  selector?: string;
  tagName?: string;
  classList?: string[];
  rect?: Partial<CollectedRect>;
  computed?: Partial<CollectedComputed>;
  parentDisplay?: string | null;
  parentSelector?: string | null;
  siblingIndex?: number;
  ignore?: IgnoreSpec;
  isInteractive?: boolean;
  isIcon?: boolean;
  styleAttr?: string | null;
}

/** Build a CollectedElement for unit tests (no browser). */
export function makeElement(o: MakeElementOptions = {}): CollectedElement {
  return {
    selector: o.selector ?? "#el",
    tagName: o.tagName ?? "div",
    classList: o.classList ?? [],
    rect: { ...ZERO_RECT, ...o.rect },
    computed: { ...ZERO_COMPUTED, ...o.computed },
    parentDisplay: o.parentDisplay ?? "block",
    parentSelector: o.parentSelector ?? null,
    siblingIndex: o.siblingIndex ?? 0,
    ariaHidden: false,
    gpIgnore: null,
    ignore: o.ignore ?? null,
    isInteractive: o.isInteractive ?? false,
    isIcon: o.isIcon ?? false,
    styleAttr: o.styleAttr ?? null,
    snippet: `<${o.tagName ?? "div"}>`,
  };
}
