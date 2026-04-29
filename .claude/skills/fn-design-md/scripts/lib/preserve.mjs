// preserve.mjs — pure helpers for building and merging DESIGN.md output that
// preserves consumer-authored prose across regenerations.
//
// Contract documented in references/dimensional-mapping.md and the SKILL.md
// "Preserving custom prose" section. Two markers wrap the GENERATED PROSE only;
// the YAML frontmatter sits at the top of the file unmarked, so standard
// frontmatter parsers (gray-matter, remark-frontmatter, fumadocs, MDX, Astro,
// Next.js content) read it unaffected.
//
// File shape:
//
//   ---
//   <frontmatter>
//   ---
//
//   <!-- fn-design-md:generated:start -->
//   ## Overview
//   ...generated prose...
//   <!-- fn-design-md:generated:end -->
//
//   ## Identity            <- consumer-authored prose lives below :end
//   ...

export const MARKER_START = "<!-- fn-design-md:generated:start -->";
export const MARKER_END = "<!-- fn-design-md:generated:end -->";

export const FILE_STATE = {
  MISSING: "missing",
  EMPTY: "empty",
  HAS_MARKERS: "has-markers",
  NON_EMPTY_NO_MARKERS: "non-empty-no-markers",
};

// Decide what state an existing DESIGN.md is in, given its (possibly null)
// contents. Pass null when the file is missing on disk.
export function classifyExistingFile(contents) {
  if (contents === null || contents === undefined) return FILE_STATE.MISSING;
  if (contents.trim().length === 0) return FILE_STATE.EMPTY;
  if (contents.includes(MARKER_START) && contents.includes(MARKER_END)) {
    return FILE_STATE.HAS_MARKERS;
  }
  return FILE_STATE.NON_EMPTY_NO_MARKERS;
}

// Build the bytes to write to disk for a fresh file. Wraps the generated prose
// in markers; frontmatter is unmarked at the top.
export function composeFresh({ frontmatterBlock, generatedProse }) {
  return (
    `${ensureTrailingNewline(frontmatterBlock)}\n` +
    `${MARKER_START}\n\n` +
    `${generatedProse.trim()}\n\n` +
    `${MARKER_END}\n`
  );
}

// Replace the frontmatter and the marker-wrapped generated prose in an
// existing file, preserving any prefix-prose (rare) and suffix-prose (the
// consumer's custom sections below :end).
export function composeWithMerge({ existingContents, frontmatterBlock, generatedProse }) {
  const startIdx = existingContents.indexOf(MARKER_START);
  const endIdx = existingContents.indexOf(MARKER_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error("composeWithMerge: existing file does not contain a valid marker pair");
  }

  // Whatever sits between the end of the YAML close-delimiter and MARKER_START
  // is "prefix prose" — usually empty. We DROP this on regen because the
  // canonical layout has nothing between frontmatter and the marker block. If
  // a consumer needs prose above generated content, they should reorganise.
  // Anything below MARKER_END is "suffix prose" — preserved verbatim.
  const suffix = existingContents.slice(endIdx + MARKER_END.length);
  const suffixTrimmedLeading = suffix.replace(/^\r?\n+/, "");

  const out =
    `${ensureTrailingNewline(frontmatterBlock)}\n` +
    `${MARKER_START}\n\n` +
    `${generatedProse.trim()}\n\n` +
    `${MARKER_END}\n` +
    (suffixTrimmedLeading.length > 0 ? `\n${ensureTrailingNewline(suffixTrimmedLeading)}` : "");
  return out;
}

// Decide what to do with the existing file given the user's flags.
//
// Returns { action: "write-fresh" | "merge", reason } or throws an Error
// describing why the write must be refused (so the CLI can print the message
// and exit non-zero).
export function decideWriteAction({ state, init, designPath = "DESIGN.md" }) {
  switch (state) {
    case FILE_STATE.MISSING:
    case FILE_STATE.EMPTY:
      return { action: "write-fresh", reason: state };
    case FILE_STATE.HAS_MARKERS:
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

function ensureTrailingNewline(s) {
  return s.endsWith("\n") ? s : `${s}\n`;
}
