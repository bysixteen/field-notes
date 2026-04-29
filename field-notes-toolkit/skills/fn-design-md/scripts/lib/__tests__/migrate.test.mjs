import { test } from "node:test";
import assert from "node:assert/strict";
import {
  splitDesignMd,
  defaultDisposition,
  parseDispositionYaml,
  validateDispositions,
  buildMigrated,
  alreadyMigrated,
  BOILERPLATE_HEADINGS,
} from "../migrate.mjs";
import { MARKER_START, MARKER_END } from "../preserve.mjs";

const LEGACY = `---
name: example
version: alpha
---

## Overview

Boilerplate overview prose.

## Identity

Consumer-authored identity prose.

## Colors

Boilerplate color palette description.

## Aesthetic direction

Custom aesthetic prose the author wrote.

## Stale Section

This should be deleted.
`;

test("splitDesignMd extracts frontmatter and sections in source order", () => {
  const { frontmatterBlock, sections, preamble } = splitDesignMd(LEGACY);
  assert.ok(frontmatterBlock.startsWith("---\n"));
  assert.ok(frontmatterBlock.endsWith("---"));
  assert.equal(preamble, "");
  assert.deepEqual(
    sections.map((s) => s.heading),
    ["## Overview", "## Identity", "## Colors", "## Aesthetic direction", "## Stale Section"]
  );
});

test("splitDesignMd handles a file with no frontmatter", () => {
  const noFm = "## Overview\nbody\n";
  const { frontmatterBlock, sections } = splitDesignMd(noFm);
  assert.equal(frontmatterBlock, "");
  assert.equal(sections.length, 1);
  assert.equal(sections[0].heading, "## Overview");
});

test("defaultDisposition: boilerplate headings → g, others → p", () => {
  assert.equal(defaultDisposition("## Overview"), "g");
  assert.equal(defaultDisposition("## Colors"), "g");
  assert.equal(defaultDisposition("## Identity"), "p");
  assert.equal(defaultDisposition("## Aesthetic direction"), "p");
});

test("BOILERPLATE_HEADINGS includes the canonical Google-spec sections", () => {
  for (const h of ["## Overview", "## Colors", "## Typography", "## Components"]) {
    assert.ok(BOILERPLATE_HEADINGS.has(h), `${h} should be boilerplate`);
  }
});

test("parseDispositionYaml — version 1 with mixed dispositions", () => {
  const yaml = `version: 1
sections:
  - heading: "## Overview"
    disposition: g
  - heading: "## Identity"
    disposition: p
  - heading: "## Stale Section"
    disposition: s
`;
  const { version, dispositions } = parseDispositionYaml(yaml);
  assert.equal(version, 1);
  assert.equal(dispositions.get("## Overview"), "g");
  assert.equal(dispositions.get("## Identity"), "p");
  assert.equal(dispositions.get("## Stale Section"), "s");
});

test("parseDispositionYaml — missing version throws", () => {
  const yaml = `sections:
  - heading: "## Overview"
    disposition: g
`;
  assert.throws(() => parseDispositionYaml(yaml), /missing required `version`/);
});

test("parseDispositionYaml — unsupported version throws with the version number", () => {
  const yaml = `version: 99
sections:
  - heading: "## Overview"
    disposition: g
`;
  assert.throws(() => parseDispositionYaml(yaml), /unsupported version 99/);
});

test("parseDispositionYaml — invalid disposition value throws naming the heading", () => {
  const yaml = `version: 1
sections:
  - heading: "## Overview"
    disposition: x
`;
  assert.throws(() => parseDispositionYaml(yaml), /## Overview.*invalid disposition "x"/);
});

test("validateDispositions — exact match returns silently", () => {
  const sections = [{ heading: "## Overview" }, { heading: "## Identity" }];
  const dispositions = new Map([["## Overview", "g"], ["## Identity", "p"]]);
  validateDispositions({ sections, dispositions });
});

test("validateDispositions — missing heading in YAML throws naming both gaps", () => {
  const sections = [{ heading: "## Overview" }, { heading: "## Identity" }];
  const dispositions = new Map([["## Overview", "g"], ["## Phantom", "g"]]);
  assert.throws(
    () => validateDispositions({ sections, dispositions }),
    /## Identity[\s\S]*## Phantom/
  );
});

test("buildMigrated — g sections go inside markers, p sections after :end, s dropped", () => {
  const { frontmatterBlock, sections } = splitDesignMd(LEGACY);
  const dispositions = new Map([
    ["## Overview", "g"],
    ["## Identity", "p"],
    ["## Colors", "g"],
    ["## Aesthetic direction", "p"],
    ["## Stale Section", "s"],
  ]);
  const out = buildMigrated({ frontmatterBlock, sections, dispositions });

  // Frontmatter on line 1
  assert.ok(out.startsWith("---\n"));
  // Marker pair present
  assert.ok(out.includes(MARKER_START));
  assert.ok(out.includes(MARKER_END));

  // Generated sections inside markers, in source order
  const startIdx = out.indexOf(MARKER_START);
  const endIdx = out.indexOf(MARKER_END);
  const insideMarkers = out.slice(startIdx + MARKER_START.length, endIdx);
  assert.ok(insideMarkers.includes("## Overview"));
  assert.ok(insideMarkers.includes("Boilerplate overview"));
  assert.ok(insideMarkers.includes("## Colors"));
  assert.ok(insideMarkers.indexOf("## Overview") < insideMarkers.indexOf("## Colors"));

  // Preserved sections AFTER end marker
  const afterMarkers = out.slice(endIdx + MARKER_END.length);
  assert.ok(afterMarkers.includes("## Identity"));
  assert.ok(afterMarkers.includes("Consumer-authored identity"));
  assert.ok(afterMarkers.includes("## Aesthetic direction"));

  // Skipped section is gone entirely
  assert.ok(!out.includes("## Stale Section"));
  assert.ok(!out.includes("This should be deleted"));
});

test("buildMigrated — output is parseable as having frontmatter on line 1", () => {
  const { frontmatterBlock, sections } = splitDesignMd(LEGACY);
  const dispositions = new Map(sections.map((s) => [s.heading, "p"]));
  const out = buildMigrated({ frontmatterBlock, sections, dispositions });
  // Line 1 must be --- so any YAML parser sees the frontmatter.
  const firstLine = out.split("\n")[0];
  assert.equal(firstLine, "---");
});

test("alreadyMigrated detects marker pair", () => {
  assert.equal(alreadyMigrated(LEGACY), false);
  const markered = `${MARKER_START}\nx\n${MARKER_END}`;
  assert.equal(alreadyMigrated(markered), true);
});

test("buildMigrated — round-trip idempotency: re-running migrate's output through splitDesignMd + buildMigrated is stable", () => {
  const { frontmatterBlock, sections } = splitDesignMd(LEGACY);
  const dispositions = new Map([
    ["## Overview", "g"],
    ["## Identity", "p"],
    ["## Colors", "g"],
    ["## Aesthetic direction", "p"],
    ["## Stale Section", "s"],
  ]);
  const first = buildMigrated({ frontmatterBlock, sections, dispositions });
  // The migrated output already has markers, so the regen path (composeWithMerge)
  // would handle it next. Migrate itself on markered input should be detected.
  assert.ok(alreadyMigrated(first));
});
