// Integration test for the `migrate` subcommand: non-interactive run against
// a legacy fixture; validates the generated/preserved/skipped
// dispositions; running migrate again is a no-op.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, copyFileSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MARKER_START, MARKER_END } from "../lib/preserve.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const EMIT = join(SKILL_ROOT, "scripts", "emit-design-md.mjs");
const LEGACY = join(SKILL_ROOT, "tests", "fixtures", "legacy-DESIGN.md");
const DISPOSITION = join(SKILL_ROOT, "tests", "fixtures", "legacy-disposition.yaml");

function tmp() {
  return mkdtempSync(join(tmpdir(), "fn-design-md-migrate-"));
}

test("migrate --non-interactive: g sections wrapped, p preserved, s deleted", () => {
  const dir = tmp();
  const legacyCopy = join(dir, "DESIGN.md");
  try {
    copyFileSync(LEGACY, legacyCopy);
    const r = spawnSync(
      "node",
      [EMIT, "migrate", "--in", legacyCopy, "--non-interactive", "--disposition", DISPOSITION],
      { encoding: "utf8" }
    );
    assert.equal(r.status, 0, `migrate failed: ${r.stderr}`);

    const out = readFileSync(legacyCopy, "utf8");
    const startIdx = out.indexOf(MARKER_START);
    const endIdx = out.indexOf(MARKER_END);
    assert.ok(startIdx !== -1 && endIdx > startIdx, "marker pair missing or out of order");

    const insideMarkers = out.slice(startIdx + MARKER_START.length, endIdx);
    const afterMarkers = out.slice(endIdx + MARKER_END.length);

    // 'g' headings inside markers (in source order)
    assert.ok(insideMarkers.includes("## Overview"));
    assert.ok(insideMarkers.includes("## Colors"));
    assert.ok(insideMarkers.includes("## Typography"));
    assert.ok(insideMarkers.includes("## Spacing"));

    // 'p' headings preserved below :end
    assert.ok(afterMarkers.includes("## The Five Dimensions"));
    assert.ok(afterMarkers.includes("## Component Size Scale"));
    assert.ok(afterMarkers.includes("## Identity"));
    assert.ok(afterMarkers.includes("## Aesthetic direction"));

    // 's' heading deleted entirely
    assert.ok(!out.includes("## Stale Section"));
    assert.ok(!out.includes("This section is out of date"));

    // Frontmatter passes through unchanged on line 1
    assert.equal(out.split("\n")[0], "---");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("migrate is idempotent: running again on a markered file is a no-op", () => {
  const dir = tmp();
  const legacyCopy = join(dir, "DESIGN.md");
  try {
    copyFileSync(LEGACY, legacyCopy);
    // First run wraps in markers
    const first = spawnSync(
      "node",
      [EMIT, "migrate", "--in", legacyCopy, "--non-interactive", "--disposition", DISPOSITION],
      { encoding: "utf8" }
    );
    assert.equal(first.status, 0);
    const afterFirst = readFileSync(legacyCopy, "utf8");

    // Second run detects markers and refuses to re-migrate
    const second = spawnSync(
      "node",
      [EMIT, "migrate", "--in", legacyCopy, "--non-interactive", "--disposition", DISPOSITION],
      { encoding: "utf8" }
    );
    assert.equal(second.status, 0);
    assert.match(second.stdout, /already contains preservation markers/);

    // File contents unchanged
    const afterSecond = readFileSync(legacyCopy, "utf8");
    assert.equal(afterFirst, afterSecond);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("migrate fails when YAML names a heading not in the source file", () => {
  const dir = tmp();
  const legacyCopy = join(dir, "DESIGN.md");
  const badYaml = join(dir, "bad.yaml");
  try {
    copyFileSync(LEGACY, legacyCopy);
    // Write a YAML that names only one of the source's headings.
    const yaml = `version: 1
sections:
  - heading: "## Overview"
    disposition: g
`;
    writeFileSync(badYaml, yaml);
    const r = spawnSync(
      "node",
      [EMIT, "migrate", "--in", legacyCopy, "--non-interactive", "--disposition", badYaml],
      { encoding: "utf8" }
    );
    assert.notEqual(r.status, 0, "migrate should fail on heading mismatch");
    assert.match(r.stderr + r.stdout, /does not match source file headings/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
