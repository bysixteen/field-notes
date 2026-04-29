// template.mjs — load and validate a section template that drives emit.
//
// A template is a small YAML file describing the section ordering, headings,
// disposition (generated vs preserved), and optional inspiration-source
// redactions. The default `references/templates/google-spec.yaml` reproduces
// the historical Google-spec layout. Consumers can supply their own template
// via `--template <path>` for a different section vocabulary or ordering.
//
// Parser is intentionally minimal — no third-party YAML dep. Schema is small
// enough that hand-rolled tokenisation is simpler than depending on js-yaml
// just for this. If the schema grows past a handful of keys, swap to a real
// parser.
//
// Schema (this file is the contract; references/profiles.md is the docs):
//
//   profile_name: <string>
//   sections:
//     - id: <kebab-case identifier, used in section markers>
//       heading: <display heading without the leading "##">
//       disposition: generated | preserved
//       source: <renderer-id>          # required when disposition: generated
//       placeholder: <string, optional> # used on first emit for preserved
//   redactions:                         # optional
//     forbidden_terms_path: <path-relative-to-cwd-or-template>

import { readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";

export const VALID_DISPOSITIONS = new Set(["generated", "preserved"]);

export function loadTemplate(absPath) {
  const text = readFileSync(absPath, "utf8");
  const parsed = parseTemplateYaml(text);
  validateTemplate(parsed, absPath);
  if (parsed.redactions?.forbidden_terms_path) {
    parsed.redactions.forbidden_terms_path = resolveRelativeToTemplate(
      parsed.redactions.forbidden_terms_path,
      absPath
    );
  }
  return parsed;
}

function resolveRelativeToTemplate(p, templatePath) {
  if (isAbsolute(p)) return p;
  return join(dirname(templatePath), p);
}

// Tiny purpose-built parser. Recognises:
//   - top-level scalar:  key: value
//   - top-level list:    sections: \n  - key: value\n    key: value
//   - nested map:        redactions:\n  key: value
//   - block scalar:      placeholder: |\n    line1\n    line2
//   - quoted strings:    "..." or '...'
// Comments (#) at the start of a line are ignored. Inline comments are not
// stripped — keep them out of templates.
export function parseTemplateYaml(text) {
  const lines = text.split("\n");
  const out = { sections: [] };
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, "");
    i++;
    if (line.trim().startsWith("#")) continue;
    if (line.trim() === "") continue;

    if (/^profile_name\s*:/.test(line)) {
      out.profile_name = readScalar(line);
      continue;
    }
    if (/^sections\s*:\s*$/.test(line)) {
      const { entries, next } = readList(lines, i);
      out.sections = entries;
      i = next;
      continue;
    }
    if (/^redactions\s*:\s*$/.test(line)) {
      const { entry, next } = readMapBlock(lines, i, 2);
      out.redactions = entry;
      i = next;
      continue;
    }
    throw new Error(`template: unrecognised top-level line: "${line.trim()}"`);
  }

  return out;
}

function readScalar(line) {
  const idx = line.indexOf(":");
  return stripQuotes(line.slice(idx + 1).trim());
}

function readList(lines, start) {
  const entries = [];
  let i = start;
  let current = null;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, "");
    if (line.trim().startsWith("#")) { i++; continue; }
    if (line.trim() === "") { i++; continue; }
    // Stop at any line that is not indented as a list item or list-item child.
    const itemMatch = line.match(/^(\s+)-\s+(\S.*)$/);
    const childMatch = line.match(/^(\s+)(\S.*)$/);
    if (itemMatch) {
      if (current) entries.push(current);
      current = {};
      // First key on the list-item line itself, e.g. "  - id: overview".
      addEntryKey(current, lines, i, itemMatch[2]);
      i++;
      continue;
    }
    if (childMatch && current) {
      // Could be a continuation key for the current item or end of list.
      // Heuristic: if indent is greater than the bullet's indent we're still
      // inside the item.
      const consumed = addEntryKey(current, lines, i, childMatch[2], childMatch[1].length);
      i += consumed;
      continue;
    }
    break;
  }
  if (current) entries.push(current);
  return { entries, next: i };
}

function addEntryKey(target, lines, idx, keyValue, indent) {
  const colonIdx = keyValue.indexOf(":");
  if (colonIdx === -1) {
    throw new Error(`template: expected "key: value" inside list, got: "${keyValue}"`);
  }
  const key = keyValue.slice(0, colonIdx).trim();
  const rest = keyValue.slice(colonIdx + 1).trim();
  if (rest === "|") {
    const { value, consumed } = readBlockScalar(lines, idx + 1, indent ?? 4);
    target[key] = value;
    return 1 + consumed;
  }
  if (rest === "") {
    // Nested map under this key — read child block.
    const { entry, next } = readMapBlock(lines, idx + 1, (indent ?? 2) + 2);
    target[key] = entry;
    return next - idx;
  }
  target[key] = stripQuotes(rest);
  return 1;
}

function readMapBlock(lines, start, baseIndent) {
  const entry = {};
  let i = start;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.replace(/\s+$/, "");
    if (line.trim().startsWith("#")) { i++; continue; }
    if (line.trim() === "") { i++; continue; }
    const m = line.match(/^(\s+)(\S.*)$/);
    if (!m) break;
    const indent = m[1].length;
    if (indent < baseIndent) break;
    const colonIdx = m[2].indexOf(":");
    if (colonIdx === -1) {
      throw new Error(`template: expected "key: value" in map, got: "${m[2]}"`);
    }
    const key = m[2].slice(0, colonIdx).trim();
    const rest = m[2].slice(colonIdx + 1).trim();
    entry[key] = stripQuotes(rest);
    i++;
  }
  return { entry, next: i };
}

// `parentIndent` is the indent of the line carrying `key: |`. Block-scalar
// content must be more indented than that. The actual content indent is
// detected from the first non-blank line — matches YAML 1.2 behaviour.
function readBlockScalar(lines, start, parentIndent) {
  const collected = [];
  let i = start;
  let contentIndent = null;
  while (i < lines.length) {
    const raw = lines[i];
    if (raw.trim() === "") {
      collected.push("");
      i++;
      continue;
    }
    const m = raw.match(/^(\s+)(.*)$/);
    if (!m) break;
    const lineIndent = m[1].length;
    if (lineIndent <= parentIndent) break;
    if (contentIndent === null) contentIndent = lineIndent;
    if (lineIndent < contentIndent) break;
    collected.push(raw.slice(contentIndent));
    i++;
  }
  while (collected.length && collected[collected.length - 1].trim() === "") {
    collected.pop();
  }
  return { value: collected.join("\n"), consumed: i - start };
}

function stripQuotes(s) {
  if (s.length >= 2) {
    const first = s[0], last = s[s.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return s.slice(1, -1).replace(/\\"/g, '"');
    }
  }
  return s;
}

export function validateTemplate(t, sourcePath) {
  const where = sourcePath ? ` (in ${sourcePath})` : "";
  if (!t.profile_name || typeof t.profile_name !== "string") {
    throw new Error(`template: missing required \`profile_name\`${where}`);
  }
  if (!Array.isArray(t.sections) || t.sections.length === 0) {
    throw new Error(`template: \`sections\` must be a non-empty list${where}`);
  }
  const seen = new Set();
  for (const s of t.sections) {
    if (!s.id) throw new Error(`template: section is missing \`id\`${where}`);
    if (!/^[a-z][a-z0-9-]*$/.test(s.id)) {
      throw new Error(`template: section id "${s.id}" must be kebab-case${where}`);
    }
    if (seen.has(s.id)) {
      throw new Error(`template: duplicate section id "${s.id}"${where}`);
    }
    seen.add(s.id);
    if (!s.heading) throw new Error(`template: section "${s.id}" missing \`heading\`${where}`);
    if (!VALID_DISPOSITIONS.has(s.disposition)) {
      throw new Error(
        `template: section "${s.id}" has invalid disposition "${s.disposition}" — expected generated|preserved${where}`
      );
    }
    if (s.disposition === "generated" && !s.source) {
      throw new Error(`template: section "${s.id}" is generated but has no \`source\`${where}`);
    }
  }
}

// Stable marker strings used in DESIGN.md for per-section preservation.
export function sectionStartMarker(id) {
  return `<!-- fn-design-md:section:${id}:start -->`;
}
export function sectionEndMarker(id) {
  return `<!-- fn-design-md:section:${id}:end -->`;
}

// Anchored regexes used by the parser-side helpers to extract section bodies.
export function sectionMarkerPattern(id) {
  const start = sectionStartMarker(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const end = sectionEndMarker(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${start}\\n([\\s\\S]*?)\\n${end}`, "m");
}
