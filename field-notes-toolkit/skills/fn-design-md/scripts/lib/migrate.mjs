// migrate.mjs — pure helpers for the `migrate` subcommand. Wraps an existing
// hand-authored DESIGN.md in preservation markers based on a per-section
// disposition (`g` = generated, `p` = preserved, `s` = skip/delete).
//
// Contract documented in references/dimensional-mapping.md ("Disposition YAML
// shape"). The interactive runner in emit-design-md.mjs prompts the author
// section-by-section; the non-interactive runner reads a YAML disposition.
//
// Output layout:
//
//   ---
//   <frontmatter>     // unchanged from source
//   ---
//
//   <!-- fn-design-md:generated:start -->
//   <all 'g' sections in source order>
//   <!-- fn-design-md:generated:end -->
//
//   <all 'p' sections in source order>

import { MARKER_START, MARKER_END } from "./preserve.mjs";

// Boilerplate-shaped headings whose default disposition is `g`. Everything
// else defaults to `p`. The author can override during interactive migrate.
export const BOILERPLATE_HEADINGS = new Set([
  "## Overview",
  "## Colors",
  "## Color",
  "## Typography",
  "## Spacing",
  "## Components",
  "## Do's and Don'ts",
  "## Dos and Don'ts",
  "## Borders",
  "## Border Radius",
]);

// Split a DESIGN.md text into { frontmatterBlock, preamble, sections }.
// frontmatterBlock includes the surrounding --- lines (or "" if no frontmatter).
// preamble is any prose between the frontmatter close and the first `## `
// heading. sections is an array of { heading, body } where body excludes the
// heading line itself.
export function splitDesignMd(contents) {
  const { frontmatterBlock, body } = splitFrontmatter(contents);
  const lines = body.split("\n");
  const sections = [];
  const preambleLines = [];
  let current = null;

  for (const line of lines) {
    if (/^## /.test(line)) {
      if (current) sections.push(finalizeSection(current));
      current = { heading: line.trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    } else {
      preambleLines.push(line);
    }
  }
  if (current) sections.push(finalizeSection(current));

  return {
    frontmatterBlock,
    preamble: preambleLines.join("\n").trim(),
    sections,
  };
}

function finalizeSection(s) {
  return { heading: s.heading, body: s.body.join("\n").trim() };
}

function splitFrontmatter(contents) {
  if (!contents.startsWith("---\n")) {
    return { frontmatterBlock: "", body: contents };
  }
  const close = contents.indexOf("\n---\n", 4);
  const closeAtEnd = contents.endsWith("\n---") && contents.indexOf("\n---", 4) !== -1;
  if (close === -1 && !closeAtEnd) {
    return { frontmatterBlock: "", body: contents };
  }
  const end = close !== -1 ? close + "\n---".length : contents.length;
  const frontmatterBlock = contents.slice(0, end);
  const body = close !== -1 ? contents.slice(close + "\n---\n".length) : "";
  return { frontmatterBlock, body };
}

// Default disposition for a heading. Boilerplate-shaped headings default to
// `g`; everything else defaults to `p`. Used by the interactive prompt to
// pre-fill the suggestion.
export function defaultDisposition(heading) {
  return BOILERPLATE_HEADINGS.has(heading) ? "g" : "p";
}

// Parse a disposition YAML into { version, dispositions: Map<heading, 'g'|'p'|'s'> }.
// Throws on unknown version, malformed entries, or invalid disposition values.
//
// Schema (version 1) — see references/dimensional-mapping.md:
//   version: 1
//   sections:
//     - heading: "## Overview"
//       disposition: g
export function parseDispositionYaml(text) {
  const lines = text.split("\n");
  let version = null;
  const dispositions = new Map();
  let inSections = false;
  let currentEntry = null;

  for (const raw of lines) {
    // Don't strip "#"-comments — `## Heading` literals embed `#` and would be eaten.
    const line = raw.trimEnd();
    if (!line.trim()) continue;

    const versionMatch = line.match(/^version:\s*(\d+)\s*$/);
    if (versionMatch && !inSections) {
      version = Number(versionMatch[1]);
      continue;
    }
    if (/^sections:\s*$/.test(line)) {
      inSections = true;
      continue;
    }
    if (!inSections) continue;

    const itemMatch = line.match(/^\s*-\s*heading:\s*(.+?)\s*$/);
    if (itemMatch) {
      if (currentEntry) commitEntry(currentEntry, dispositions);
      currentEntry = { heading: stripQuotes(itemMatch[1]) };
      continue;
    }
    // Match disposition with any value first, validate the value in commitEntry —
    // this gives the per-heading error message authors actually need to fix the file.
    const dispMatch = line.match(/^\s+disposition:\s*(\S+)\s*$/);
    if (dispMatch && currentEntry) {
      currentEntry.disposition = dispMatch[1];
      continue;
    }
    if (currentEntry && line.trim()) {
      throw new Error(`Disposition YAML: unexpected line: ${line.trim()}`);
    }
  }
  if (currentEntry) commitEntry(currentEntry, dispositions);

  if (version === null) {
    throw new Error("Disposition YAML: missing required `version` field");
  }
  if (version !== 1) {
    throw new Error(`Disposition YAML: unsupported version ${version} (this build supports version 1)`);
  }
  return { version, dispositions };
}

function commitEntry(entry, map) {
  if (!entry.heading) {
    throw new Error("Disposition YAML: section entry missing `heading`");
  }
  if (!entry.disposition) {
    throw new Error(`Disposition YAML: section "${entry.heading}" missing \`disposition\``);
  }
  if (!"gps".includes(entry.disposition)) {
    throw new Error(
      `Disposition YAML: "${entry.heading}" has invalid disposition "${entry.disposition}" (expected g, p, or s)`
    );
  }
  map.set(entry.heading, entry.disposition);
}

function stripQuotes(s) {
  if (s.length < 2) return s;
  const isDouble = s.startsWith('"') && s.endsWith('"');
  const isSingle = s.startsWith("'") && s.endsWith("'");
  return isDouble || isSingle ? s.slice(1, -1) : s;
}

// Validate that the disposition map and the source file's headings line up
// exactly. Throws an Error listing every mismatch (missing or extra) so the
// author can fix them in one pass.
export function validateDispositions({ sections, dispositions }) {
  const sourceHeadings = new Set(sections.map((s) => s.heading));
  const dispHeadings = new Set(dispositions.keys());
  const missing = [...sourceHeadings].filter((h) => !dispHeadings.has(h));
  const extra = [...dispHeadings].filter((h) => !sourceHeadings.has(h));
  if (missing.length === 0 && extra.length === 0) return;
  const msg = ["Disposition YAML does not match source file headings:"];
  if (missing.length) {
    msg.push("  Headings in source but missing from YAML:");
    for (const h of missing) msg.push(`    - ${h}`);
  }
  if (extra.length) {
    msg.push("  Headings in YAML but absent from source:");
    for (const h of extra) msg.push(`    - ${h}`);
  }
  throw new Error(msg.join("\n"));
}

// Compose the migrated file. `g` sections go inside the marker pair in source
// order; `p` sections go below `:end` in source order; `s` sections are
// dropped. Frontmatter is passed through unchanged. Preamble (rare) is
// dropped — the canonical layout has nothing between frontmatter and markers.
export function buildMigrated({ frontmatterBlock, sections, dispositions }) {
  const generated = [];
  const preserved = [];
  for (const s of sections) {
    const d = dispositions.get(s.heading);
    if (d === "g") generated.push(renderSection(s));
    else if (d === "p") preserved.push(renderSection(s));
    // 's' = drop
  }

  const fmBlock = frontmatterBlock ? ensureTrailingNewline(frontmatterBlock) + "\n" : "";
  const generatedBody = generated.join("\n\n").trim();
  const preservedBody = preserved.join("\n\n").trim();

  let out =
    fmBlock +
    `${MARKER_START}\n\n` +
    (generatedBody.length > 0 ? `${generatedBody}\n\n` : "") +
    `${MARKER_END}\n`;
  if (preservedBody.length > 0) {
    out += `\n${preservedBody}\n`;
  }
  return out;
}

function renderSection(s) {
  return s.body.length > 0 ? `${s.heading}\n\n${s.body}` : s.heading;
}

function ensureTrailingNewline(s) {
  return s.endsWith("\n") ? s : `${s}\n`;
}

// Detect whether a file already contains the marker pair, so the migrate
// runner can refuse (or no-op) idempotently. The canonical regen flow handles
// markered files; migrate is for legacy ones only.
export function alreadyMigrated(contents) {
  return contents.includes(MARKER_START) && contents.includes(MARKER_END);
}
