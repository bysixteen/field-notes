// Round-trip integration test: fn-init must produce a scaffold that
// fn-design-md --from-dimensional can consume to emit a valid DESIGN.md.
// Pinning the round-trip prevents drift between the two skills.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(__dirname, "..", "..");
const INIT = join(SKILL_ROOT, "scripts", "init.mjs");
const EMIT = join(SKILL_ROOT, "..", "fn-design-md", "scripts", "emit-design-md.mjs");

const REQUIRED_FILES = [
  "tokens.json",
  "components.json",
  "CLAUDE.md",
  "DESIGN.md",
  "content/design-system/model/sentiment.mdx",
  "content/design-system/model/emphasis.mdx",
  "content/design-system/model/size.mdx",
  "content/design-system/model/state.mdx",
  "content/design-system/model/structure.mdx",
  "content/design-system/components/button.contract.md",
  "content/design-system/components/input.contract.md",
  "content/design-system/components/badge.contract.md",
  "content/design-system/components/alert.contract.md",
  "content/design-system/components/card.contract.md",
];

function makeTempTarget() {
  return mkdtempSync(join(tmpdir(), "fn-init-test-"));
}

function runInit(args) {
  return spawnSync("node", [INIT, ...args], { encoding: "utf8" });
}

function runEmit(target) {
  return spawnSync(
    "node",
    [EMIT, "--from-dimensional", target, "--out", target, "--name", "test-project"],
    { encoding: "utf8" }
  );
}

test("fn-init writes the canonical scaffold into a fresh target", () => {
  const target = makeTempTarget();
  try {
    const result = runInit(["--name", "test-project", "--target", target, "--force"]);
    assert.equal(result.status, 0, `init failed: ${result.stderr}`);
    for (const f of REQUIRED_FILES) {
      assert.ok(existsSync(join(target, f)), `missing scaffold file: ${f}`);
    }
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test("fn-init substitutes {{project_name}} into CLAUDE.md and DESIGN.md", () => {
  const target = makeTempTarget();
  try {
    const result = runInit(["--name", "blueprint", "--target", target, "--force"]);
    assert.equal(result.status, 0, `init failed: ${result.stderr}`);
    const claude = readFileSync(join(target, "CLAUDE.md"), "utf8");
    const design = readFileSync(join(target, "DESIGN.md"), "utf8");
    assert.match(claude, /^# blueprint$/m, "CLAUDE.md missing project name heading");
    assert.match(design, /^# blueprint — DESIGN$/m, "DESIGN.md missing project name heading");
    assert.doesNotMatch(claude, /\{\{project_name\}\}/, "CLAUDE.md left an unresolved placeholder");
    assert.doesNotMatch(design, /\{\{project_name\}\}/, "DESIGN.md left an unresolved placeholder");
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test("fn-init scaffold round-trips through fn-design-md --from-dimensional", () => {
  const target = makeTempTarget();
  try {
    const initResult = runInit(["--name", "test-project", "--target", target, "--force"]);
    assert.equal(initResult.status, 0, `init failed: ${initResult.stderr}`);

    const emitResult = runEmit(target);
    assert.equal(
      emitResult.status,
      0,
      `emit failed (status=${emitResult.status}): ${emitResult.stderr}`
    );
    assert.match(
      emitResult.stdout,
      /components:\s+5\s+→\s+51\s+variants/,
      "expected scaffold to expand to 5 components / 51 variants"
    );

    const design = readFileSync(join(target, "DESIGN.md"), "utf8");
    assert.match(design, /^---\nversion: alpha\n/, "DESIGN.md missing google-spec frontmatter");
    assert.match(design, /^components:$/m, "DESIGN.md missing components block");
    assert.match(design, /^\s+button:$/m, "DESIGN.md missing button entry");
    assert.match(
      design,
      /<!-- fn-design-md:section:dos-and-donts:end -->/,
      "DESIGN.md missing dos-and-donts section end marker"
    );
    assert.match(
      design,
      /^## Notes$/m,
      "DESIGN.md preserved-content section did not survive emit"
    );
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test("fn-init refuses to overwrite a non-empty target without --force", () => {
  const target = makeTempTarget();
  try {
    const first = runInit(["--name", "first", "--target", target, "--force"]);
    assert.equal(first.status, 0, `first init failed: ${first.stderr}`);

    const second = runInit(["--name", "second", "--target", target]);
    assert.notEqual(second.status, 0, "second init should fail without --force");
    assert.match(second.stderr, /non-empty/, "expected 'non-empty' error message");
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test("fn-init requires --name and --target", () => {
  const noName = runInit(["--target", "/tmp/whatever"]);
  assert.notEqual(noName.status, 0);
  assert.match(noName.stderr, /--name is required/);

  const noTarget = runInit(["--name", "x"]);
  assert.notEqual(noTarget.status, 0);
  assert.match(noTarget.stderr, /--target is required/);
});
