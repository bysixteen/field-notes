// redact.mjs — load a forbidden-terms list and scan rendered prose.
//
// Drives the inspiration-source rule from issue #173: a consumer commits a
// plain-text list of terms (typically reference/inspiration sources whose
// names must not leak into the emitted DESIGN.md). The emitter loads the
// list, scans each rendered section, and HALTS on any match — never silently
// strips. Halt is the safer behaviour: silent strip would be re-introduced by
// the next regen and quietly drift.
//
// File format:
//   # comments and blank lines ignored
//   PlainSubstring        # matched case-insensitively as a substring
//   regex:/pattern/flags  # JavaScript regex with optional flags
//
// Match results carry the term, line, and column so the emitter can produce a
// useful error pointing the author at the source content to edit.

import { readFileSync } from "node:fs";

export function loadForbiddenTerms(absPath) {
  if (!absPath) return [];
  const text = readFileSync(absPath, "utf8");
  return parseForbiddenTermsText(text);
}

export function parseForbiddenTermsText(text) {
  const out = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    const m = line.match(/^regex:\/(.+)\/([gimsuy]*)$/);
    if (m) {
      out.push({ kind: "regex", source: m[1], flags: m[2] });
    } else {
      out.push({ kind: "substring", term: line });
    }
  }
  return out;
}

// Scan `text` for any of `terms`. Returns an array of hits. Empty array means
// nothing matched. Caller decides whether to halt.
export function scanForbidden(text, terms) {
  const hits = [];
  for (const t of terms) {
    if (t.kind === "substring") {
      collectSubstring(text, t.term, hits);
    } else {
      collectRegex(text, t, hits);
    }
  }
  return hits;
}

function collectSubstring(text, term, hits) {
  const lowerHay = text.toLowerCase();
  const needle = term.toLowerCase();
  if (!needle.length) return;
  let idx = 0;
  while ((idx = lowerHay.indexOf(needle, idx)) !== -1) {
    const { line, column } = locate(text, idx);
    hits.push({ term, kind: "substring", line, column });
    idx += needle.length;
  }
}

function collectRegex(text, t, hits) {
  const flags = t.flags.includes("g") ? t.flags : t.flags + "g";
  let re;
  try {
    re = new RegExp(t.source, flags);
  } catch (err) {
    throw new Error(`redact: invalid regex /${t.source}/${t.flags} — ${err.message}`);
  }
  let m;
  while ((m = re.exec(text)) !== null) {
    const { line, column } = locate(text, m.index);
    hits.push({ term: m[0], kind: "regex", line, column });
    if (m.index === re.lastIndex) re.lastIndex++;
  }
}

function locate(text, offset) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

// Format a halt message. The emitter exits non-zero with this on the way out.
export function formatHalt({ sectionId, hits }) {
  const lines = [
    `redact: forbidden term${hits.length === 1 ? "" : "s"} found in section "${sectionId}"`,
  ];
  for (const h of hits) {
    lines.push(`  - "${h.term}" at line ${h.line}, column ${h.column} (${h.kind})`);
  }
  lines.push(
    `Edit the underlying source (token comments, contract sidecars, model MDX, prose template) to remove the term, then re-run.`
  );
  return lines.join("\n");
}
