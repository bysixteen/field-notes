import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LEGACY_MARKER_START,
  LEGACY_MARKER_END,
  FILE_STATE,
  classifyExistingFile,
  composeFresh,
  composeWithMerge,
  decideWriteAction,
  extractPreservedBody,
  extractLegacySuffix,
} from "../preserve.mjs";
import { sectionStartMarker, sectionEndMarker } from "../template.mjs";

const FM = "---\nname: example\n---";

const SECTIONS = [
  { id: "overview", heading: "Overview", body: "First section body." },
  { id: "identity", heading: "Identity", body: "Second section body." },
];

test("classifyExistingFile — null is MISSING", () => {
  assert.equal(classifyExistingFile(null), FILE_STATE.MISSING);
});

test("classifyExistingFile — whitespace-only is EMPTY", () => {
  assert.equal(classifyExistingFile("   \n\n  "), FILE_STATE.EMPTY);
});

test("classifyExistingFile — per-section markers → HAS_SECTION_MARKERS", () => {
  const file = `${FM}\n\n${sectionStartMarker("overview")}\n## Overview\nfoo\n${sectionEndMarker("overview")}\n`;
  assert.equal(classifyExistingFile(file), FILE_STATE.HAS_SECTION_MARKERS);
});

test("classifyExistingFile — legacy single-block markers → HAS_LEGACY_MARKERS", () => {
  const file = `${FM}\n\n${LEGACY_MARKER_START}\n## Overview\nfoo\n${LEGACY_MARKER_END}\n`;
  assert.equal(classifyExistingFile(file), FILE_STATE.HAS_LEGACY_MARKERS);
});

test("classifyExistingFile — non-empty no-markers is NON_EMPTY_NO_MARKERS", () => {
  assert.equal(classifyExistingFile(`${FM}\n\n## Hand-written\n`), FILE_STATE.NON_EMPTY_NO_MARKERS);
});

test("composeFresh wraps each section in its own marker pair", () => {
  const out = composeFresh({ frontmatterBlock: FM, sections: SECTIONS });
  assert.equal(out.split("\n")[0], "---", "frontmatter must start on line 1");
  for (const s of SECTIONS) {
    assert.ok(out.includes(sectionStartMarker(s.id)), `start marker missing for ${s.id}`);
    assert.ok(out.includes(sectionEndMarker(s.id)), `end marker missing for ${s.id}`);
    assert.ok(out.includes(`## ${s.heading}`), `heading missing for ${s.id}`);
    assert.ok(out.includes(s.body), `body missing for ${s.id}`);
  }
});

test("composeFresh — empty body still emits the heading", () => {
  const out = composeFresh({
    frontmatterBlock: FM,
    sections: [{ id: "identity", heading: "Identity", body: "" }],
  });
  assert.ok(out.includes(`${sectionStartMarker("identity")}\n## Identity\n${sectionEndMarker("identity")}`));
});

test("composeWithMerge — produces the same per-section block as composeFresh + optional legacy suffix", () => {
  const out = composeWithMerge({
    frontmatterBlock: FM,
    sections: SECTIONS,
    legacySuffix: "## Suffix\n\nKept from legacy file.\n",
  });
  for (const s of SECTIONS) {
    assert.ok(out.includes(sectionStartMarker(s.id)));
    assert.ok(out.includes(sectionEndMarker(s.id)));
  }
  assert.ok(out.includes("## Suffix"));
  assert.ok(out.includes("Kept from legacy file."));
});

test("composeWithMerge — without legacy suffix, no trailing blank-line spam", () => {
  const out = composeWithMerge({ frontmatterBlock: FM, sections: SECTIONS });
  assert.ok(out.endsWith(`${sectionEndMarker("identity")}\n`));
});

test("extractPreservedBody — pulls the body of a per-section block, stripping the heading line", () => {
  const file = `${FM}\n\n${sectionStartMarker("identity")}\n## Identity\n\nHand-authored prose.\n${sectionEndMarker("identity")}\n`;
  const body = extractPreservedBody(file, "identity");
  assert.equal(body, "Hand-authored prose.");
});

test("extractPreservedBody — returns null when section is absent", () => {
  const file = `${FM}\n\nNo markers here.\n`;
  assert.equal(extractPreservedBody(file, "identity"), null);
});

test("extractLegacySuffix — returns text after legacy :end marker, leading newline trimmed", () => {
  const file = `${FM}\n\n${LEGACY_MARKER_START}\n...\n${LEGACY_MARKER_END}\n\n## Identity\n\nLegacy suffix.\n`;
  const suffix = extractLegacySuffix(file);
  assert.equal(suffix, "## Identity\n\nLegacy suffix.\n");
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

test("decideWriteAction — HAS_SECTION_MARKERS without --init → merge", () => {
  assert.equal(
    decideWriteAction({ state: FILE_STATE.HAS_SECTION_MARKERS, init: false }).action,
    "merge"
  );
});

test("decideWriteAction — HAS_LEGACY_MARKERS without --init → merge (one-shot migration)", () => {
  assert.equal(
    decideWriteAction({ state: FILE_STATE.HAS_LEGACY_MARKERS, init: false }).action,
    "merge"
  );
});

test("decideWriteAction — HAS_SECTION_MARKERS with --init → throws", () => {
  assert.throws(
    () => decideWriteAction({ state: FILE_STATE.HAS_SECTION_MARKERS, init: true }),
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
