import { defineConfig } from "vitest/config";

/**
 * The source uses NodeNext ESM with explicit `.js` import specifiers. Vitest's
 * resolver doesn't map those to their `.ts` sources by default, so a small
 * pre-resolver rewrites relative `.js` imports to `.ts` when a `.ts` exists.
 */
export default defineConfig({
  plugins: [
    {
      name: "resolve-ts-from-js",
      enforce: "pre",
      async resolveId(source, importer) {
        if (
          importer &&
          source.endsWith(".js") &&
          (source.startsWith("./") || source.startsWith("../"))
        ) {
          const asTs = `${source.slice(0, -3)}.ts`;
          const resolved = await this.resolve(asTs, importer, {
            skipSelf: true,
          });
          if (resolved) return resolved.id;
        }
        return null;
      },
    },
  ],
  test: {
    include: ["test/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    // One worker/browser at a time keeps Chromium usage deterministic.
    fileParallelism: false,
  },
});
