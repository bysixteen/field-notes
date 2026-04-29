#!/usr/bin/env node
// lint-template.mjs — validate a DESIGN.md against a section template.
//
// Custom-vocabulary profiles like dimensional-prose opt out of the
// @google/design.md linter (which mandates the spec section names). This
// script fills the gap by checking what actually matters once the spec
// vocabulary is set aside:
//
//   1. Frontmatter delimiter is on line 1.
//   2. Every section in the template appears in the file, in template order,
//      with matching per-section start/end markers wrapping a `## Heading`.
//   3. No unknown sections are interleaved between template sections.
//   4. Marker pairs are well-formed (start before end, no nesting).
//   5. Redaction pass — if the template references a forbidden-terms list,
//      no listed term appears in the rendered prose.
//
// Exit codes:
//   0 — clean.
//   1 — one or more checks failed; messages printed to stderr.
//   64 — usage error (missing args).
//
// Usage:
//   node scripts/lint-template.mjs <DESIGN.md> <template.yaml>

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadTemplate, sectionStartMarker, sectionEndMarker } from "./lib/template.mjs";
import { loadForbiddenTerms, scanForbidden, formatHalt } from "./lib/redact.mjs";

const [, , designArg, templateArg] = process.argv;

if (!designArg || !templateArg) {
  console.error("usage: lint-template.mjs <DESIGN.md> <template.yaml>");
  process.exit(64);
}

const designPath = resolve(designArg);
const templatePath = resolve(templateArg);

if (!existsSync(designPath)) {
  console.error(`lint-template: file not found: ${designPath}`);
  process.exit(64);
}
if (!existsSync(templatePath)) {
  console.error(`lint-template: file not found: ${templatePath}`);
  process.exit(64);
}

const design = readFileSync(designPath, "utf8");
let template;
try {
  template = loadTemplate(templatePath);
} catch (err) {
  console.error(`lint-template: ${err.message}`);
  process.exit(1);
}

const errors = [];

// 1. Frontmatter on line 1.
if (!design.startsWith("---\n")) {
  errors.push(`frontmatter: file does not begin with "---" delimiter`);
}

// 2 + 3 + 4. Section markers in template order, with no foreign sections
//             interleaved between them.
let cursor = 0;
let lastEnd = -1;
for (const s of template.sections) {
  const start = sectionStartMarker(s.id);
  const end = sectionEndMarker(s.id);
  const startIdx = design.indexOf(start, cursor);
  if (startIdx === -1) {
    errors.push(`sections: missing start marker for "${s.id}" (expected ${start})`);
    continue;
  }
  const endIdx = design.indexOf(end, startIdx + start.length);
  if (endIdx === -1) {
    errors.push(`sections: start marker for "${s.id}" has no matching end marker`);
    continue;
  }
  // Heading check: first non-blank line inside the markers must be `## <heading>`.
  const inner = design.slice(startIdx + start.length, endIdx).trim();
  const firstLine = inner.split("\n")[0]?.trim() ?? "";
  if (firstLine !== `## ${s.heading}`) {
    errors.push(
      `sections: "${s.id}" — expected first line "## ${s.heading}", got "${firstLine}"`
    );
  }
  // Foreign-section check: if there's another section start between the last
  // end and this start, flag it.
  const between = design.slice(lastEnd + 1, startIdx);
  const foreign = between.match(/<!--\s*fn-design-md:section:[a-z][a-z0-9-]*:start\s*-->/g);
  if (foreign) {
    for (const f of foreign) {
      errors.push(`sections: foreign section between template entries: ${f}`);
    }
  }
  lastEnd = endIdx + end.length - 1;
  cursor = endIdx + end.length;
}

// Anything between the last template section and EOF that looks like a
// section marker is also foreign.
const tail = design.slice(cursor);
const tailForeign = tail.match(/<!--\s*fn-design-md:section:[a-z][a-z0-9-]*:start\s*-->/g);
if (tailForeign) {
  for (const f of tailForeign) {
    errors.push(`sections: foreign section after last template entry: ${f}`);
  }
}

// 5. Redaction pass.
if (template.redactions?.forbidden_terms_path) {
  try {
    const terms = loadForbiddenTerms(template.redactions.forbidden_terms_path);
    const hits = scanForbidden(design, terms);
    if (hits.length) {
      errors.push(formatHalt({ sectionId: "<file>", hits }));
    }
  } catch (err) {
    errors.push(`redact: ${err.message}`);
  }
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} lint-template ${errors.length === 1 ? "error" : "errors"}`);
  process.exit(1);
}

console.log(`✓ ${designPath} validates against template "${template.profile_name}"`);
