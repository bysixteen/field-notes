// Round-trip integration test: running emit-design-md.mjs twice on the same
// input must produce byte-identical output. This pins determinism end-to-end
// (cap-policy ordering, YAML key ordering, OKLCH→hex stability).

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const EMIT = join(SKILL_ROOT, "scripts", "emit-design-md.mjs");
const SOURCE = join(SKILL_ROOT, "tests", "fixtures", "dimensional-source");

function emit(outDir) {
  const result = spawnSync(
    "node",
    [EMIT, "--from-dimensional", SOURCE, "--out", outDir, "--name", "fixture"],
    { encoding: "utf8" }
  );
  assert.equal(result.status, 0, `emit failed: ${result.stderr}`);
  return {
    designMd: readFileSync(join(outDir, "DESIGN.md"), "utf8"),
    tokensJson: readFileSync(join(outDir, "tokens.json"), "utf8"),
  };
}

test("emit-twice — DESIGN.md byte-identical across runs", () => {
  const a = mkdtempSync(join(tmpdir(), "bs-design-md-emit-a-"));
  const b = mkdtempSync(join(tmpdir(), "bs-design-md-emit-b-"));
  try {
    const first = emit(a);
    const second = emit(b);
    assert.equal(first.designMd, second.designMd, "DESIGN.md drifted between identical runs");
    assert.equal(first.tokensJson, second.tokensJson, "tokens.json drifted between identical runs");
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});
