// preserve.mjs — pure helpers for building and merging DESIGN.md output that
// preserves consumer-authored prose across regenerations.
//
// Each section gets its own marker pair so generated and preserved sections
// can interleave under any template ordering. The legacy single-block
// `:generated:start/end` pair from earlier versions is still recognised on
// read — a one-shot merge migrates it to per-section markers and keeps the
// suffix prose below the old `:generated:end` intact (placed at the bottom of
// the new file, beneath all template-driven sections).
//
// File shape under the new scheme:
//
//   ---
//   <frontmatter>
//   ---
//
//   <!-- fn-design-md:section:overview:start -->
//   ## Overview
//   ...generated or preserved body...
//   <!-- fn-design-md:section:overview:end -->
//
//   <!-- fn-design-md:section:colors:start -->
//   ## Colors
//   ...
//   <!-- fn-design-md:section:colors:end -->
//
//   <legacy-suffix prose preserved below all sections>

import { sectionStartMarker, sectionEndMarker } from "./template.mjs";

// Legacy markers from the single-block era. Read-only; we never write these.
export const LEGACY_MARKER_START = "<!-- fn-design-md:generated:start -->";
export const LEGACY_MARKER_END = "<!-- fn-design-md:generated:end -->";

// Re-export under the historical names so external callers (tests, the
// migrate subcommand) keep working. New code should use the per-section
// helpers below.
export const MARKER_START = LEGACY_MARKER_START;
export const MARKER_END = LEGACY_MARKER_END;

export const FILE_STATE = {
  MISSING: "missing",
  EMPTY: "empty",
  HAS_SECTION_MARKERS: "has-section-markers",
  HAS_LEGACY_MARKERS: "has-legacy-markers",
  NON_EMPTY_NO_MARKERS: "non-empty-no-markers",
};

const ANY_SECTION_MARKER = /<!--\s*fn-design-md:section:[a-z][a-z0-9-]*:start\s*-->/;

export function classifyExistingFile(contents) {
  if (contents === null || contents === undefined) return FILE_STATE.MISSING;
  if (contents.trim().length === 0) return FILE_STATE.EMPTY;
  if (ANY_SECTION_MARKER.test(contents)) return FILE_STATE.HAS_SECTION_MARKERS;
  if (contents.includes(LEGACY_MARKER_START) && contents.includes(LEGACY_MARKER_END)) {
    return FILE_STATE.HAS_LEGACY_MARKERS;
  }
  return FILE_STATE.NON_EMPTY_NO_MARKERS;
}

// Decide what to do given the file state and the user's flags. Returns
// { action, reason } or throws Error. The "merge" action covers both
// per-section and legacy migration — the writer inspects the existing file
// to decide which it is.
export function decideWriteAction({ state, init, designPath = "DESIGN.md" }) {
  switch (state) {
    case FILE_STATE.MISSING:
    case FILE_STATE.EMPTY:
      return { action: "write-fresh", reason: state };
    case FILE_STATE.HAS_SECTION_MARKERS:
    case FILE_STATE.HAS_LEGACY_MARKERS:
      if (init) {
        throw new Error(
          `${designPath} already contains generated markers — --init is for greenfield files only.\n` +
            `Run without --init to merge into the existing markered file.`
        );
      }
      return { action: "merge", reason: state };
    case FILE_STATE.NON_EMPTY_NO_MARKERS:
      if (init) {
        throw new Error(
          `${designPath} is non-empty and has no generated markers — --init refuses to clobber existing content.\n` +
            `Run \`emit-design-md.mjs migrate --in ${designPath}\` to wrap existing prose in markers,\n` +
            `then re-run without --init.`
        );
      }
      throw new Error(
        `${designPath} exists but has no generated markers. Refusing to overwrite.\n` +
          `Options:\n` +
          `  • Run \`emit-design-md.mjs migrate --in ${designPath}\` to wrap existing prose in markers (interactive).\n` +
          `  • Delete ${designPath} and re-run with --init to start greenfield.`
      );
    default:
      throw new Error(`decideWriteAction: unknown state '${state}'`);
  }
}

// Render a single section block: start marker, heading, body, end marker.
// Returns the bytes to splice into the output. Body may be empty.
function renderSectionBlock({ id, heading, body }) {
  const start = sectionStartMarker(id);
  const end = sectionEndMarker(id);
  const inner = body && body.trim().length > 0
    ? `## ${heading}\n\n${body.trim()}`
    : `## ${heading}`;
  return `${start}\n${inner}\n${end}`;
}

// Compose a fresh file from template-resolved sections. Each section is a
// `{ id, heading, body }`. Body is either generated prose (from a renderer)
// or a preserved-section placeholder/seed.
export function composeFresh({ frontmatterBlock, sections }) {
  const blocks = sections.map(renderSectionBlock).join("\n\n");
  return `${ensureTrailingNewline(frontmatterBlock)}\n${blocks}\n`;
}

// Extract the body of a section from existing file contents, given the
// section id. Returns the body text (heading line stripped) or null if the
// section's marker pair is missing. The caller decides whether to fall back
// to a placeholder.
export function extractPreservedBody(existingContents, id) {
  const start = sectionStartMarker(id);
  const end = sectionEndMarker(id);
  const startIdx = existingContents.indexOf(start);
  if (startIdx === -1) return null;
  const endIdx = existingContents.indexOf(end, startIdx + start.length);
  if (endIdx === -1) return null;
  const inner = existingContents.slice(startIdx + start.length, endIdx).trim();
  // Strip the heading line; we put it back when rendering.
  const lines = inner.split("\n");
  if (lines.length > 0 && /^##\s+/.test(lines[0].trim())) {
    return lines.slice(1).join("\n").trim();
  }
  return inner;
}

// Extract whatever prose sits below the legacy `:generated:end` marker. Used
// once during the legacy → per-section migration so we don't lose
// hand-authored suffix content. Returns "" if there is no suffix.
export function extractLegacySuffix(existingContents) {
  const endIdx = existingContents.indexOf(LEGACY_MARKER_END);
  if (endIdx === -1) return "";
  return existingContents.slice(endIdx + LEGACY_MARKER_END.length).replace(/^\r?\n+/, "");
}

// Compose the merged output. Generated sections are always re-rendered.
// Preserved sections take the body from existing per-section markers if
// present, fall back to the template placeholder, else leave empty.
// `legacySuffix` is appended after all sections — lets a one-shot legacy
// migration keep prose that lived below the old single-block marker.
export function composeWithMerge({
  frontmatterBlock,
  sections,
  legacySuffix = "",
}) {
  const blocks = sections.map(renderSectionBlock).join("\n\n");
  const suffix = legacySuffix && legacySuffix.trim().length > 0
    ? `\n${ensureTrailingNewline(legacySuffix.trimStart())}`
    : "";
  return `${ensureTrailingNewline(frontmatterBlock)}\n${blocks}\n${suffix}`;
}

function ensureTrailingNewline(s) {
  return s.endsWith("\n") ? s : `${s}\n`;
}
