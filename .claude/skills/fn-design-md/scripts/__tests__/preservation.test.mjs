// Integration tests for the preservation flow: --init greenfield-only,
// refuse-overwrite when no markers, frontmatter parses on line 1, per-section
// markers survive regenerate, legacy single-block markers migrate.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LEGACY_MARKER_START,
  LEGACY_MARKER_END,
} from "../lib/preserve.mjs";
import { sectionStartMarker, sectionEndMarker } from "../lib/template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const EMIT = join(SKILL_ROOT, "scripts", "emit-design-md.mjs");
const SOURCE = join(SKILL_ROOT, "tests", "fixtures", "dimensional-source");
const EXPECTED_DESIGN = join(SKILL_ROOT, "tests", "fixtures", "expected", "DESIGN.md");
const DIMENSIONAL_PROSE = join(SKILL_ROOT, "references", "templates", "dimensional-prose.yaml");

function runEmit(args, opts = {}) {
  return spawnSync("node", [EMIT, ...args], { encoding: "utf8", ...opts });
}

function tmp() {
  return mkdtempSync(join(tmpdir(), "fn-design-md-preserve-"));
}

test("--init greenfield (missing file) → writes per-section markers", () => {
  const out = tmp();
  try {
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init"]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(got.startsWith("---\n"), "frontmatter must start on line 1");
    assert.ok(got.includes(sectionStartMarker("overview")), "overview start marker missing");
    assert.ok(got.includes(sectionEndMarker("dos-and-donts")), "dos-and-donts end marker missing");
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

test("merge path: existing per-section markered file regenerates without losing structure", () => {
  const out = tmp();
  try {
    const seed = readFileSync(EXPECTED_DESIGN, "utf8");
    writeFileSync(join(out, "DESIGN.md"), seed);
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(got.includes(sectionStartMarker("overview")));
    assert.ok(got.includes(sectionEndMarker("dos-and-donts")));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("legacy migration: single-block markers + suffix prose → per-section markers, suffix preserved", () => {
  const out = tmp();
  try {
    const legacy =
      `---\nname: example\n---\n\n${LEGACY_MARKER_START}\n## Overview\n\nold body\n\n${LEGACY_MARKER_END}\n\n## Identity\n\nLegacy suffix prose.\n`;
    writeFileSync(join(out, "DESIGN.md"), legacy);
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(!got.includes(LEGACY_MARKER_START), "legacy start marker should be gone");
    assert.ok(!got.includes(LEGACY_MARKER_END), "legacy end marker should be gone");
    assert.ok(got.includes(sectionStartMarker("overview")), "new per-section markers must be present");
    assert.ok(got.includes("Legacy suffix prose."), "legacy suffix must be preserved");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("preserved sections survive regenerate when authored content is between their markers", () => {
  const out = tmp();
  try {
    // First emit with the dimensional-prose template to seed preserved
    // sections with placeholder content + per-section markers.
    let r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--template", DIMENSIONAL_PROSE, "--init"]);
    assert.equal(r.status, 0, `first emit failed: ${r.stderr}`);

    // Hand-edit the Identity section: replace placeholder with real prose.
    const seeded = readFileSync(join(out, "DESIGN.md"), "utf8");
    const start = sectionStartMarker("identity");
    const end = sectionEndMarker("identity");
    const startIdx = seeded.indexOf(start);
    const endIdx = seeded.indexOf(end);
    const before = seeded.slice(0, startIdx + start.length);
    const after = seeded.slice(endIdx);
    const handAuthored = `${before}\n## Identity\n\nWe are the makers of bricks.\n${after}`;
    writeFileSync(join(out, "DESIGN.md"), handAuthored);

    // Re-emit; the Identity body must survive.
    r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--template", DIMENSIONAL_PROSE]);
    assert.equal(r.status, 0, `regen failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    assert.ok(got.includes("We are the makers of bricks."), "preserved section was clobbered on regen");
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
