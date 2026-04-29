// Pin content correctness: emit against the dimensional-source fixture and
// diff the result against a checked-in expected/ DESIGN.md and tokens.json.
// Any unintentional change to cap policy, naming, property emission, or YAML
// shape will fail this test, forcing a deliberate refresh of the fixture.

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
const EXPECTED = join(SKILL_ROOT, "tests", "fixtures", "expected");

test("emit-vs-fixture — DESIGN.md matches the canonical expected/", () => {
  const out = mkdtempSync(join(tmpdir(), "fn-design-md-vs-fixture-"));
  try {
    const result = spawnSync(
      "node",
      [EMIT, "--from-dimensional", SOURCE, "--out", out, "--name", "fixture"],
      { encoding: "utf8" }
    );
    assert.equal(result.status, 0, `emit failed: ${result.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    const want = readFileSync(join(EXPECTED, "DESIGN.md"), "utf8");
    assert.equal(
      got,
      want,
      "DESIGN.md diverged from expected fixture. If intentional, regenerate:\n" +
        `  node ${EMIT} --from-dimensional <source> --out ${EXPECTED} --name fixture`
    );
    const gotTokens = readFileSync(join(out, "tokens.json"), "utf8");
    const wantTokens = readFileSync(join(EXPECTED, "tokens.json"), "utf8");
    assert.equal(gotTokens, wantTokens, "tokens.json diverged from expected fixture");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
