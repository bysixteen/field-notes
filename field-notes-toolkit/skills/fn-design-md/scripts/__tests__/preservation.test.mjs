// Integration tests for the preservation flow: --init greenfield-only,
// refuse-overwrite when no markers, frontmatter parses on line 1.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MARKER_START, MARKER_END } from "../lib/preserve.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const EMIT = join(SKILL_ROOT, "scripts", "emit-design-md.mjs");
const SOURCE = join(SKILL_ROOT, "tests", "fixtures", "dimensional-source");
const EXPECTED_DESIGN = join(SKILL_ROOT, "tests", "fixtures", "expected", "DESIGN.md");

function runEmit(args, opts = {}) {
  return spawnSync("node", [EMIT, ...args], { encoding: "utf8", ...opts });
}

function tmp() {
  return mkdtempSync(join(tmpdir(), "fn-design-md-preserve-"));
}

test("--init greenfield (missing file) → writes marker-wrapped DESIGN.md", () => {
  const out = tmp();
  try {
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init"]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(got.startsWith("---\n"), "frontmatter must start on line 1");
    assert.ok(got.includes(MARKER_START), "MARKER_START missing");
    assert.ok(got.includes(MARKER_END), "MARKER_END missing");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("--init refuses non-empty no-marker file with actionable error", () => {
  const out = tmp();
  try {
    writeFileSync(join(out, "DESIGN.md"), "# hand-written\n\nSome prose.\n");
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init"]);
    assert.notEqual(r.status, 0, "emit should refuse");
    assert.match(r.stderr + r.stdout, /--init refuses to clobber/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("no --init, no markers → refuses and recommends migrate", () => {
  const out = tmp();
  try {
    writeFileSync(join(out, "DESIGN.md"), "# hand-written\n\nSome prose.\n");
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out]);
    assert.notEqual(r.status, 0, "emit should refuse");
    assert.match(r.stderr + r.stdout, /Refusing to overwrite[\s\S]*migrate/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("merge path: existing markered file regenerates and preserves suffix prose", () => {
  const out = tmp();
  try {
    // Seed with a markered file plus consumer prose below :end
    const seed = readFileSync(EXPECTED_DESIGN, "utf8") + `\n## Identity\n\nConsumer wrote this.\n`;
    writeFileSync(join(out, "DESIGN.md"), seed);
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(got.includes("## Identity"), "consumer suffix should be preserved on regen");
    assert.ok(got.includes("Consumer wrote this."));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("frontmatter on line 1: any standard YAML parser sees --- as the first line", () => {
  const out = tmp();
  try {
    runEmit(["--from-dimensional", SOURCE, "--out", out, "--init"]);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    const firstLine = got.split("\n")[0];
    assert.equal(firstLine, "---", "frontmatter delimiter must be the first line of the file");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
