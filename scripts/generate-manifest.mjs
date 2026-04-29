#!/usr/bin/env node
/**
 * generate-manifest.mjs
 *
 * Regenerates the two-tier manifest artefacts:
 *
 *   Tier 3  →  /tokens.json   (DTCG; produced by generate-ramps.ts)
 *   Tier 1  →  /DESIGN.md     (Google DESIGN.md spec; produced by emit-design-md.mjs)
 *
 * Tier 2 (/.context/INDEX.md) is hand-authored and not touched here.
 *
 * Run: npm run generate:manifest
 *
 * Exits non-zero if the linter reports any errors.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: repoRoot,
    stdio: "inherit",
    ...opts,
  });
  if (result.status !== 0) {
    console.error(`\n✗ ${cmd} ${args.join(" ")} exited with status ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log("→ regenerating /tokens.json (Tier 3)");
run("npx", ["tsx", "scripts/generate-ramps.ts"]);

const componentsPath = join(repoRoot, "components.json");
if (!existsSync(componentsPath)) {
  console.error(`\n✗ components.json not found at ${componentsPath}`);
  console.error("  components.json is hand-authored and must exist before /DESIGN.md can be emitted.");
  process.exit(1);
}

console.log("\n→ regenerating /DESIGN.md (Tier 1)");
run("node", [
  ".claude/skills/fn-design-md/scripts/emit-design-md.mjs",
  "--tokens", "tokens.json",
  "--components", "components.json",
  "--out", ".",
  "--name", "field-notes",
]);

console.log("\n→ linting /DESIGN.md");
run("bash", [".claude/skills/fn-design-md/scripts/lint.sh", "DESIGN.md"]);

console.log("\n✓ manifest regenerated. Tier 2 routing map at /.context/INDEX.md is hand-authored.");
