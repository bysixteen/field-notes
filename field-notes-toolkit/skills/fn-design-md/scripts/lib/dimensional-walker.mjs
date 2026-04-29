// dimensional-walker.mjs — walk a project's dimensional vocabulary and
// produce the inputs needed by the projection pipeline.
//
// Reads:
//   <root>/tokens.json
//   <root>/components.json    (extended `applies_to` shape, see references/dimensional-mapping.md)
//   <root>/content/design-system/model/{sentiment,emphasis,size,state,structure}.mdx
//
// Returns:
//   { tokens, components, vocab, defaults, structuralInformational }
//
// Where:
//   vocab = { sentiment: [...], emphasis: [...], size: [...], state: [...], structure: [...] }
//   defaults = { sentiment, emphasis, size, state, structure }
//   components is the migrated shape ({ name: { applies_to, properties } }), with
//             `applies_to: "all"` resolved to the dimension's full vocab.
//
// Fail-fast errors on:
//   - missing or malformed `dimensional_values` frontmatter on any of the five files
//   - `applies_to` referencing a value absent from the dimension's `values` list
//
// This module has no I/O side effects beyond fs reads. It accepts an optional
// `fs` injection for testability.

import { readFileSync as nodeReadFileSync } from "node:fs";
import { join } from "node:path";
import { extractDimensionalValues } from "./frontmatter.mjs";

const DIMENSIONS = ["sentiment", "emphasis", "size", "state", "structure"];

export function walkDimensionalSource(root, options = {}) {
  const readFileSync = options.readFileSync ?? nodeReadFileSync;

  const modelDir = options.modelDir ?? join(root, "content", "design-system", "model");
  const tokensPath = options.tokensPath ?? join(root, "tokens.json");
  const componentsPath = options.componentsPath ?? join(root, "components.json");

  const tokens = JSON.parse(readFileSync(tokensPath, "utf8"));
  const componentsRaw = JSON.parse(readFileSync(componentsPath, "utf8"));

  const vocab = {};
  const defaults = {};
  const structuralInformational = {};

  for (const dim of DIMENSIONS) {
    const path = join(modelDir, `${dim}.mdx`);
    let source;
    try {
      source = readFileSync(path, "utf8");
    } catch (err) {
      throw new Error(
        `dimensional-walker: cannot read ${path}: ${err.message}.\n` +
          `Every project using --from-dimensional must have a ${dim}.mdx with a dimensional_values frontmatter key.`
      );
    }
    const extracted = extractDimensionalValues(source, path);
    if (!extracted) {
      throw new Error(
        `dimensional-walker: ${path} has no 'dimensional_values' frontmatter key.\n` +
          `Add a frontmatter block of the form:\n` +
          `  dimensional_values:\n` +
          `    default: <value>\n` +
          `    values: [<value>, ...]\n`
      );
    }
    vocab[dim] = extracted.values;
    defaults[dim] = extracted.default;
    if (extracted.informational) structuralInformational[dim] = true;
  }

  const components = migrateAndValidateComponents(componentsRaw, vocab, componentsPath);

  return { tokens, components, vocab, defaults, structuralInformational };
}

// Accepts either the legacy flat shape or the new `applies_to`/`properties` shape
// and returns the new shape with `applies_to: "all"` expanded to vocab arrays.
// Mutates nothing; returns a fresh object preserving author key order.
export function migrateAndValidateComponents(componentsRaw, vocab, sourceLabel = "<components.json>") {
  const out = {};
  for (const [name, raw] of Object.entries(componentsRaw)) {
    if (!raw || typeof raw !== "object") {
      throw new Error(`${sourceLabel}: component '${name}' must be an object, got ${typeof raw}`);
    }

    let applies_to;
    let properties;

    if ("applies_to" in raw && "properties" in raw) {
      applies_to = raw.applies_to;
      properties = raw.properties;
    } else if ("applies_to" in raw && !("properties" in raw)) {
      throw new Error(
        `${sourceLabel}: component '${name}' has 'applies_to' but no 'properties' — partial migration is not supported`
      );
    } else {
      // legacy flat shape
      applies_to = { sentiment: "all", emphasis: "all", size: "all", state: "all" };
      properties = raw;
    }

    out[name] = {
      applies_to: resolveAppliesTo(applies_to, vocab, name, sourceLabel),
      properties,
    };
  }
  return out;
}

function resolveAppliesTo(applies_to, vocab, componentName, sourceLabel) {
  if (!applies_to || typeof applies_to !== "object") {
    throw new Error(
      `${sourceLabel}: component '${componentName}' has invalid 'applies_to' (must be an object)`
    );
  }
  const out = {};
  for (const dim of ["sentiment", "emphasis", "size", "state"]) {
    const decl = applies_to[dim];
    if (decl === undefined || decl === "all") {
      out[dim] = vocab[dim].slice();
      continue;
    }
    if (!Array.isArray(decl)) {
      throw new Error(
        `${sourceLabel}: component '${componentName}'.applies_to.${dim} must be "all" or an array, got ${typeof decl}`
      );
    }
    const islandValues = vocab[dim];
    const orphans = decl.filter((v) => !islandValues.includes(v));
    if (orphans.length > 0) {
      throw new Error(
        `${sourceLabel}: component '${componentName}'.applies_to.${dim} includes [${orphans.join(", ")}]\n` +
          `  but ${dim}.mdx values are [${islandValues.join(", ")}].`
      );
    }
    out[dim] = decl.slice();
  }
  return out;
}
