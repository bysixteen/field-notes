import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MARKER_START,
  MARKER_END,
  FILE_STATE,
  classifyExistingFile,
  composeFresh,
  composeWithMerge,
  decideWriteAction,
} from "../preserve.mjs";

const FM = "---\nname: example\n---";
const PROSE = "## Overview\nGenerated content here.\n## Do's and Don'ts\nAvoid this.";

test("classifyExistingFile — null is MISSING", () => {
  assert.equal(classifyExistingFile(null), FILE_STATE.MISSING);
});

test("classifyExistingFile — whitespace-only is EMPTY", () => {
  assert.equal(classifyExistingFile("   \n\n  "), FILE_STATE.EMPTY);
});

test("classifyExistingFile — markered file is HAS_MARKERS", () => {
  const file = `${FM}\n\n${MARKER_START}\nfoo\n${MARKER_END}\n`;
  assert.equal(classifyExistingFile(file), FILE_STATE.HAS_MARKERS);
});

test("classifyExistingFile — non-empty no-markers is NON_EMPTY_NO_MARKERS", () => {
  assert.equal(classifyExistingFile(`${FM}\n\n## Hand-written\n`), FILE_STATE.NON_EMPTY_NO_MARKERS);
});

test("composeFresh wraps prose in markers, frontmatter sits unmarked at top", () => {
  const out = composeFresh({ frontmatterBlock: FM, generatedProse: PROSE });
  // Frontmatter parsers must see --- on line 1 — verify by line index
  const lines = out.split("\n");
  assert.equal(lines[0], "---");
  assert.ok(out.includes(MARKER_START));
  assert.ok(out.includes(MARKER_END));
  // The marker pair encloses only the prose
  const startIdx = out.indexOf(MARKER_START);
  const endIdx = out.indexOf(MARKER_END);
  const wrapped = out.slice(startIdx + MARKER_START.length, endIdx).trim();
  assert.equal(wrapped, PROSE.trim());
});

test("composeWithMerge replaces generated block, preserves suffix prose", () => {
  const existing =
    `${FM}\n\n${MARKER_START}\n\nold prose\n\n${MARKER_END}\n\n## Identity\n\nConsumer wrote this.\n`;
  const out = composeWithMerge({
    existingContents: existing,
    frontmatterBlock: "---\nname: refreshed\n---",
    generatedProse: "## Overview\nNew generated body.",
  });
  assert.ok(out.startsWith("---\nname: refreshed\n---\n"));
  assert.ok(out.includes("New generated body"));
  assert.ok(!out.includes("old prose"), "old prose should be replaced");
  assert.ok(out.includes("## Identity"), "consumer suffix should be preserved");
  assert.ok(out.includes("Consumer wrote this."));
});

test("composeWithMerge — empty suffix produces no trailing blank-line spam", () => {
  const existing = `${FM}\n\n${MARKER_START}\n\nold\n\n${MARKER_END}\n`;
  const out = composeWithMerge({
    existingContents: existing,
    frontmatterBlock: FM,
    generatedProse: "new",
  });
  // Should end at MARKER_END + single newline, no extra blank lines
  assert.ok(out.endsWith(`${MARKER_END}\n`));
});

test("composeWithMerge throws when markers are missing or out of order", () => {
  assert.throws(
    () => composeWithMerge({ existingContents: "no markers here", frontmatterBlock: FM, generatedProse: "" }),
    /does not contain a valid marker pair/
  );
  // End before start
  const reversed = `${MARKER_END} ${MARKER_START}`;
  assert.throws(
    () => composeWithMerge({ existingContents: reversed, frontmatterBlock: FM, generatedProse: "" }),
    /does not contain a valid marker pair/
  );
});

test("decideWriteAction — MISSING → write-fresh", () => {
  assert.deepEqual(decideWriteAction({ state: FILE_STATE.MISSING, init: false }), {
    action: "write-fresh",
    reason: FILE_STATE.MISSING,
  });
});

test("decideWriteAction — EMPTY → write-fresh (with or without --init)", () => {
  assert.equal(decideWriteAction({ state: FILE_STATE.EMPTY, init: false }).action, "write-fresh");
  assert.equal(decideWriteAction({ state: FILE_STATE.EMPTY, init: true }).action, "write-fresh");
});

test("decideWriteAction — HAS_MARKERS without --init → merge", () => {
  assert.equal(
    decideWriteAction({ state: FILE_STATE.HAS_MARKERS, init: false }).action,
    "merge"
  );
});

test("decideWriteAction — HAS_MARKERS with --init → throws (--init is greenfield-only)", () => {
  assert.throws(
    () => decideWriteAction({ state: FILE_STATE.HAS_MARKERS, init: true }),
    /--init is for greenfield files only/
  );
});

test("decideWriteAction — NON_EMPTY_NO_MARKERS without --init → throws and recommends migrate", () => {
  assert.throws(
    () => decideWriteAction({ state: FILE_STATE.NON_EMPTY_NO_MARKERS, init: false }),
    /Refusing to overwrite[\s\S]*emit-design-md\.mjs migrate/
  );
});

test("decideWriteAction — NON_EMPTY_NO_MARKERS with --init → throws (still refuses)", () => {
  assert.throws(
    () => decideWriteAction({ state: FILE_STATE.NON_EMPTY_NO_MARKERS, init: true }),
    /--init refuses to clobber existing content/
  );
});
