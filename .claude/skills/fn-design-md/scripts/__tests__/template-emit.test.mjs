// Integration tests for --template: custom-vocabulary emit, redaction halt,
// and lint-template.mjs validation.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sectionStartMarker, sectionEndMarker } from "../lib/template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const EMIT = join(SKILL_ROOT, "scripts", "emit-design-md.mjs");
const LINT = join(SKILL_ROOT, "scripts", "lint-template.mjs");
const SOURCE = join(SKILL_ROOT, "tests", "fixtures", "dimensional-source");
const DIMENSIONAL_PROSE = join(SKILL_ROOT, "references", "templates", "dimensional-prose.yaml");

function runEmit(args) {
  return spawnSync("node", [EMIT, ...args], { encoding: "utf8" });
}
function runLint(args) {
  return spawnSync("node", [LINT, ...args], { encoding: "utf8" });
}
function tmp() {
  return mkdtempSync(join(tmpdir(), "fn-template-emit-"));
}

test("dimensional-prose template emits Identity → Type → Colour → … → Anti-patterns", () => {
  const out = tmp();
  try {
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init", "--template", DIMENSIONAL_PROSE]);
    assert.equal(r.status, 0, `emit failed: ${r.stderr}`);
    const got = readFileSync(join(out, "DESIGN.md"), "utf8");
    // Section ordering: pull start markers in the order they appear and check.
    const order = ["identity", "type", "colour", "surfaces", "layout", "content-fundamentals", "anti-patterns"];
    let cursor = 0;
    for (const id of order) {
      const idx = got.indexOf(sectionStartMarker(id), cursor);
      assert.notEqual(idx, -1, `missing start marker for ${id}`);
      cursor = idx;
    }
    // Identity is preserved → carries the placeholder text.
    assert.match(got, /## Identity\n\n[\s\S]*makes this product feel like itself/);
    // Type and Colour are generated → carry the same prose as Typography/Colors.
    assert.match(got, /## Type\n\n[\s\S]*Typography tokens map intent/);
    assert.match(got, /## Colour\n\n[\s\S]*colour tokens/);
    // Anti-patterns is preserved as a top-level section.
    assert.match(got, /## Anti-patterns/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("redaction halt — emit fails when forbidden term appears in placeholder prose", () => {
  const out = tmp();
  try {
    // Build a custom template with a forbidden-terms list that flags the
    // placeholder text. This proves the emit halts before write.
    const forbiddenPath = join(out, "forbidden.txt");
    writeFileSync(forbiddenPath, "makes this product feel like itself\n");
    const tplPath = join(out, "tpl.yaml");
    writeFileSync(
      tplPath,
      `profile_name: redaction-test
sections:
  - id: identity
    heading: Identity
    disposition: preserved
    placeholder: |
      One paragraph describing what makes this product feel like itself.
  - id: colour
    heading: Colour
    disposition: generated
    source: colors
redactions:
  forbidden_terms_path: ${forbiddenPath}
`
    );
    const r = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init", "--template", tplPath]);
    assert.notEqual(r.status, 0, "emit must halt on forbidden term");
    assert.match(r.stderr, /forbidden term/);
    assert.match(r.stderr, /makes this product feel like itself/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("lint-template.mjs — clean dimensional-prose output passes", () => {
  const out = tmp();
  try {
    const r1 = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init", "--template", DIMENSIONAL_PROSE]);
    assert.equal(r1.status, 0, `emit failed: ${r1.stderr}`);
    const r2 = runLint([join(out, "DESIGN.md"), DIMENSIONAL_PROSE]);
    assert.equal(r2.status, 0, `lint-template failed: ${r2.stderr || r2.stdout}`);
    assert.match(r2.stdout, /validates against template "dimensional-prose"/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("lint-template.mjs — flags a missing section marker", () => {
  const out = tmp();
  try {
    const r1 = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init", "--template", DIMENSIONAL_PROSE]);
    assert.equal(r1.status, 0);
    let got = readFileSync(join(out, "DESIGN.md"), "utf8");
    // Strip the surfaces start marker so lint catches the missing section.
    got = got.replace(sectionStartMarker("surfaces"), "");
    writeFileSync(join(out, "DESIGN.md"), got);
    const r2 = runLint([join(out, "DESIGN.md"), DIMENSIONAL_PROSE]);
    assert.notEqual(r2.status, 0);
    assert.match(r2.stderr, /missing start marker for "surfaces"/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("lint-template.mjs — runs the redaction pass when the template references one", () => {
  const out = tmp();
  try {
    // Emit cleanly (no redaction list yet), then point the lint at a
    // template-with-forbidden-list and confirm it flags the placeholder.
    const r1 = runEmit(["--from-dimensional", SOURCE, "--out", out, "--init", "--template", DIMENSIONAL_PROSE]);
    assert.equal(r1.status, 0);

    const forbiddenPath = join(out, "forbidden.txt");
    writeFileSync(forbiddenPath, "Tokens map intent\n");
    const tplPath = join(out, "tpl-with-redactions.yaml");
    // Mirror dimensional-prose ordering but add a redaction list pointed at
    // a term we know appears in the generated typography prose.
    const dimTpl = readFileSync(DIMENSIONAL_PROSE, "utf8");
    const augmented = dimTpl.replace(
      /# redactions:[\s\S]*$/,
      `redactions:\n  forbidden_terms_path: ${forbiddenPath}\n`
    );
    writeFileSync(tplPath, augmented);

    const r2 = runLint([join(out, "DESIGN.md"), tplPath]);
    assert.notEqual(r2.status, 0);
    assert.match(r2.stderr, /forbidden term/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
