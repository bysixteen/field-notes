// frontmatter.mjs — minimal MDX frontmatter extractor for the
// `dimensional_values` shape used by --from-dimensional.
//
// We don't depend on gray-matter; the shape we need is fixed and tiny:
//   ---
//   <other keys>
//   dimensional_values:
//     default: <scalar>
//     values: [<scalar>, ...]
//     informational: true                # optional
//   <other keys>
//   ---
//
// Returns { default, values, informational } or null if the key is absent.
// Throws on malformed shapes so callers can fail fast with a clear message.

export function extractDimensionalValues(source, sourceLabel = "<input>") {
  const fm = extractFrontmatterBlock(source);
  if (fm === null) {
    throw new Error(`${sourceLabel}: no YAML frontmatter found (expected '---' delimited block at top of file)`);
  }
  const block = extractMappingBlock(fm, "dimensional_values");
  if (!block) return null;

  const result = {};
  const defaultMatch = block.match(/^\s*default:\s*(.+)\s*$/m);
  if (!defaultMatch) {
    throw new Error(`${sourceLabel}: dimensional_values is missing required 'default' key`);
  }
  result.default = stripQuotes(defaultMatch[1].trim());

  const valuesMatch = block.match(/^\s*values:\s*\[([^\]]*)\]\s*$/m);
  if (!valuesMatch) {
    throw new Error(`${sourceLabel}: dimensional_values is missing required 'values' inline-array (expected 'values: [a, b, c]')`);
  }
  result.values = valuesMatch[1]
    .split(",")
    .map((v) => stripQuotes(v.trim()))
    .filter(Boolean);
  if (result.values.length === 0) {
    throw new Error(`${sourceLabel}: dimensional_values.values is empty`);
  }
  if (!result.values.includes(result.default)) {
    throw new Error(
      `${sourceLabel}: dimensional_values.default '${result.default}' is not in values [${result.values.join(", ")}]`
    );
  }

  const informationalMatch = block.match(/^\s*informational:\s*(true|false)\s*$/m);
  if (informationalMatch) result.informational = informationalMatch[1] === "true";

  return result;
}

function extractFrontmatterBlock(source) {
  if (!source.startsWith("---")) return null;
  const end = source.indexOf("\n---", 3);
  if (end === -1) return null;
  return source.slice(3, end).replace(/^\r?\n/, "");
}

// Extract a top-level mapping block by key name. Returns the block body
// (everything indented under `<key>:` until the next top-level key) or null.
function extractMappingBlock(frontmatter, key) {
  const lines = frontmatter.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith(`${key}:`)) {
      // collect indented lines that follow
      const block = [];
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (next.length === 0) {
          block.push(next);
          i++;
          continue;
        }
        // top-level key (not indented) ends the block
        if (!/^\s/.test(next)) break;
        block.push(next);
        i++;
      }
      return block.join("\n");
    }
    i++;
  }
  return null;
}

function stripQuotes(s) {
  if (s.length < 2) return s;
  const isDouble = s.startsWith('"') && s.endsWith('"');
  const isSingle = s.startsWith("'") && s.endsWith("'");
  return isDouble || isSingle ? s.slice(1, -1) : s;
}
