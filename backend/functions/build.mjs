// One esbuild bundle per function -> ../.build/functions/<name>/index.js.
// `aws cloudformation package` zips and uploads those directories (see infra/scripts/deploy.sh).
import { build } from "esbuild";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FUNCTIONS = ["custom-message"];

const outRoot = fileURLToPath(new URL("../../.build/functions/", import.meta.url));
rmSync(outRoot, { recursive: true, force: true });

for (const name of FUNCTIONS) {
  await build({
    entryPoints: [fileURLToPath(new URL(`${name}/src/index.ts`, import.meta.url))],
    outfile: `${outRoot}${name}/index.js`,
    bundle: true,
    platform: "node",
    target: "node24",
    format: "cjs",
    sourcemap: false,
    legalComments: "none",
    logLevel: "info",
  });
}
