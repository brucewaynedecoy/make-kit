import { defineConfig } from "tsup";
import { embeddedSkillsEsbuildPlugin } from "./scripts/embedded-skills";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.dirname(fileURLToPath(import.meta.url));
// Resolve `yaml` through Node module resolution from this package folder, so
// the build finds it wherever the workspace installs it. `yaml/package.json`
// is an exported subpath; `yaml/browser/index.js` is not.
const yamlBrowserEntry = path.join(
  path.dirname(createRequire(import.meta.url).resolve("yaml/package.json")),
  "browser/index.js",
);

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node24",
  platform: "node",
  sourcemap: true,
  clean: true,
  bundle: true,
  // `zod` is bundled because the operation registry imports it eagerly at CLI
  // startup; the packed tarball must keep working when invoked directly with
  // `node dist/index.js` and no installed node_modules.
  noExternal: ["@clack/core", "@clack/prompts", "yaml", "zod"],
  esbuildPlugins: [
    embeddedSkillsEsbuildPlugin(packageDir),
    {
      name: "yaml-browser-entry",
      setup(build) {
        build.onResolve({ filter: /^yaml$/ }, () => ({
          path: yamlBrowserEntry,
        }));
      },
    },
  ],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
