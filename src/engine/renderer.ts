import { chromium, type Browser, type Page } from "playwright";

/**
 * Renderer (spec §7.1). Chromium is launched once per server process and
 * reused; every audit gets a fresh context (clean cookies/storage) at
 * `deviceScaleFactor: 1` to avoid subpixel noise. Navigation failures surface as
 * actionable messages — never a stack trace.
 */

export interface Viewport {
  width: number;
  height: number;
}

const NAV_TIMEOUT_MS = 15_000;

/**
 * Thrown for user-actionable problems (dead URL, unreachable dev server).
 * The tool layer converts this into an MCP error result with `message` only.
 */
export class RenderError extends Error {
  override readonly name = "RenderError";
}

let browserPromise: Promise<Browser> | null = null;

/** Launch (or reuse) the shared headless Chromium instance. */
async function getBrowser(): Promise<Browser> {
  if (browserPromise === null) {
    browserPromise = chromium.launch({ headless: true }).catch((err: unknown) => {
      // Reset so a later call can retry a fresh launch.
      browserPromise = null;
      const msg = err instanceof Error ? err.message : String(err);
      throw new RenderError(
        `Could not launch Chromium. Run \`npx playwright install chromium\` once, then retry. (${msg})`,
      );
    });
  }
  return browserPromise;
}

/**
 * Render `url` in a fresh context at `viewport` and run `fn` against the loaded
 * page. The context is always torn down afterward. Nav failures throw
 * {@link RenderError} with an actionable message.
 */
export async function withRenderedPage<T>(
  url: string,
  viewport: Viewport,
  fn: (page: Page) => Promise<T>,
): Promise<T> {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });

  try {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT_MS });
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new RenderError(
        `Could not reach ${url}. Is the dev server running? Start it and retry. (${detail})`,
      );
    }
    return await fn(page);
  } finally {
    await context.close();
  }
}

/** Close the shared browser (server shutdown). Safe to call when never launched. */
export async function shutdownRenderer(): Promise<void> {
  if (browserPromise === null) return;
  const pending = browserPromise;
  browserPromise = null;
  try {
    const browser = await pending;
    await browser.close();
  } catch {
    // best-effort teardown
  }
}
