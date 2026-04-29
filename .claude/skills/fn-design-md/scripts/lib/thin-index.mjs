// thin-index.mjs — helpers shared between the emitter and the dimensional
// walker for handling the thin-index components.json shape introduced in #170.
//
// A thin-index entry carries `contract`, `radixBase`, and/or `tokenNamespace`
// instead of inline wiring. Wiring is derived from `tokens.json[tokenNamespace]`;
// `applies_to` (for dimensional mode) is parsed out of the contract sidecar's
// `## Dimension encoding` table.

const THIN_INDEX_KEYS = ["contract", "radixBase", "tokenNamespace"];

export function isThinIndexEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  return THIN_INDEX_KEYS.some((k) => k in entry);
}

// Look up a token namespace in tokens.json and return a flat
// { propertyName: "$value" } map suitable for DESIGN.md projection.
//
// Namespace resolution: exact top-level key match. So `tokenNamespace: "button"`
// reads `tokens.button`. No prefix matching, no fallback — keeps the rule
// predictable and avoids the ambiguity flagged in #189's open design choices.
//
// Each leaf must be a DTCG token node (object with `$value`). Nested groups
// inside the namespace are flattened with dot-joined keys, so
// `tokens.button.hover.backgroundColor` becomes `hover-backgroundColor`. In
// practice the v1 spec only nests one level, so this is mostly a guard.
export function lookupNamespaceTokens(tokens, namespace) {
  if (!tokens || !namespace || typeof tokens !== "object") return {};
  const group = tokens[namespace];
  if (!group || typeof group !== "object") return {};
  const out = {};
  walk(group, [], (path, node) => {
    if (node?.$value === undefined) return;
    const key = path.join("-");
    out[key] = node.$value;
  });
  return out;
}

function walk(node, path, visit) {
  if (node && typeof node === "object" && "$value" in node) {
    visit(path, node);
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      walk(v, [...path, k], visit);
    }
  }
}

// Parse the `## Dimension encoding` table from a `<Component>.contract.md` and
// return a partial `applies_to` map. Only the four orthogonal dimensions are
// extracted (sentiment / emphasis / size / state) — `structure` is informational.
//
// A row whose `Values` column equals the dimension's full vocab is collapsed
// to the sentinel `"all"` so it survives the walker's `resolveAppliesTo` path
// unchanged.
//
// Returns `null` if the section is missing or malformed — the caller decides
// whether to fall back to `applies_to: all`.
export function parseDimensionEncoding(markdown, vocab) {
  if (typeof markdown !== "string") return null;
  const sectionRe = /(^|\n)##\s+Dimension encoding\s*\n([\s\S]*?)(?=\n##\s|$)/;
  const m = markdown.match(sectionRe);
  if (!m) return null;
  const tableLines = m[2]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (tableLines.length < 3) return null;

  // Canonical column order per content/design-system/tools/component-schema.mdx:
  //   | Dimension | data-* attribute | Values | Default |
  // Values lives at index 2; rows with fewer cells are dropped as malformed.
  const out = {};
  for (let i = 2; i < tableLines.length; i++) {
    const cells = splitRow(tableLines[i]);
    if (cells.length < 4) continue;
    const dimension = cells[0].toLowerCase();
    if (!["sentiment", "emphasis", "size", "state"].includes(dimension)) continue;
    const values = cells[2]
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) continue;
    const islandValues = vocab?.[dimension] ?? null;
    const isFullVocab =
      islandValues &&
      values.length === islandValues.length &&
      values.every((v) => islandValues.includes(v));
    out[dimension] = isFullVocab ? "all" : values;
  }
  return Object.keys(out).length ? out : null;
}

function splitRow(line) {
  // Strip the leading and trailing pipes, then split on `|`.
  const inner = line.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}
