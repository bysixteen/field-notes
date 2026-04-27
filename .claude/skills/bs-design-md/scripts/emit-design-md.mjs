#!/usr/bin/env node
// emit-design-md.mjs — project a DTCG tokens.json into a Google DESIGN.md
// plus a passthrough DTCG sidecar.
//
// Usage:
//   emit-design-md.mjs --tokens <path> --components <path> --out <dir> [--name <name>]
//
// Inputs:
//   --tokens      path to a DTCG tokens.json (Format Module 2025.10 shape).
//                 Recognised top-level groups: color, typography, spacing,
//                 borderRadius, dimension. Other groups are passed through to
//                 the sidecar but not emitted to DESIGN.md.
//   --components  path to a JSON file mapping component name to property map.
//                 Property keys must be from the DESIGN.md spec:
//                 backgroundColor, textColor, typography, rounded, padding,
//                 size, height, width. Values can be hex strings or
//                 {token.path} references.
//   --out         output directory. Will contain DESIGN.md and tokens.json.
//   --name        product/brand name for the YAML name field. Defaults to
//                 the basename of --out.
//
// Lossy projection:
//   - OKLCH, Display P3, and rgba() colours are converted to closest hex sRGB
//     for DESIGN.md. The original values are preserved in the sidecar.
//   - Anything in the input that DESIGN.md cannot model (motion, elevation,
//     borders, theme variants) is preserved in the sidecar only.
//
// The OKLCH → sRGB conversion is inline (no deps) and clips out-of-gamut
// colours. For round-trip preservation, always use the sidecar.

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "node:fs";
import { basename, resolve, join, dirname } from "node:path";
import { createInterface } from "node:readline";
import {
  classifyExistingFile,
  composeFresh,
  composeWithMerge,
  decideWriteAction,
} from "./lib/preserve.mjs";
import {
  splitDesignMd,
  defaultDisposition,
  parseDispositionYaml,
  validateDispositions,
  buildMigrated,
  alreadyMigrated,
} from "./lib/migrate.mjs";

// ─── arg parsing ────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const args = {};
const flags = new Set();
let subcommand = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith("--")) {
    if (subcommand === null) subcommand = a;
    continue;
  }
  const key = a.slice(2);
  const next = argv[i + 1];
  if (next !== undefined && !next.startsWith("--")) {
    args[key] = next;
    i++;
  } else {
    flags.add(key);
  }
}

// ─── migrate subcommand ────────────────────────────────────────────────────
// Wraps an existing hand-authored DESIGN.md in preservation markers based on
// per-section disposition. One-time path for consumers adopting the skill.

if (subcommand === "migrate") {
  await runMigrate({
    inPath: args.in,
    nonInteractive: flags.has("non-interactive"),
    dispositionPath: args.disposition,
  });
  process.exit(0);
}

const required = ["tokens", "components", "out"];
for (const k of required) {
  if (!args[k]) {
    console.error(`missing required --${k}`);
    process.exit(64);
  }
}

const tokens = JSON.parse(readFileSync(resolve(args.tokens), "utf8"));
const components = JSON.parse(readFileSync(resolve(args.components), "utf8"));
const outDir = resolve(args.out);
const name = args.name ?? basename(outDir);

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// ─── colour conversion ──────────────────────────────────────────────────────

// Parse a CSS colour string into linear-light sRGB triple [0..1].
// Supports: #RGB, #RRGGBB, #RRGGBBAA (alpha dropped), rgb()/rgba(),
// oklch(L C h), oklab(L a b). Returns null on parse failure.
function parseColor(s) {
  if (typeof s !== "string") return null;
  s = s.trim();

  // Hex
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 8) hex = hex.slice(0, 6);
    if (hex.length !== 6) return null;
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  }

  // rgb() / rgba()
  let m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(/[,/\s]+/).filter(Boolean).slice(0, 3);
    if (parts.length !== 3) return null;
    const [r, g, b] = parts.map((p) => {
      if (p.endsWith("%")) return parseFloat(p) / 100;
      return parseFloat(p) / 255;
    });
    return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  }

  // oklch(L C h)
  m = s.match(/^oklch\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(/[,/\s]+/).filter(Boolean);
    if (parts.length < 3) return null;
    let L = parseFloat(parts[0]);
    if (parts[0].endsWith("%")) L = L / 100;
    const C = parseFloat(parts[1]);
    const h = parseFloat(parts[2]);
    return oklchToLinearSrgb(L, C, h);
  }

  // oklab(L a b)
  m = s.match(/^oklab\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(/[,/\s]+/).filter(Boolean);
    if (parts.length < 3) return null;
    let L = parseFloat(parts[0]);
    if (parts[0].endsWith("%")) L = L / 100;
    const a = parseFloat(parts[1]);
    const b = parseFloat(parts[2]);
    return oklabToLinearSrgb(L, a, b);
  }

  return null;
}

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// OKLab → linear sRGB (Björn Ottosson's matrix)
function oklabToLinearSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

function oklchToLinearSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  return oklabToLinearSrgb(L, C * Math.cos(h), C * Math.sin(h));
}

function clip01(c) {
  return Math.max(0, Math.min(1, c));
}

// Render a parsed linear-sRGB triple to #RRGGBB. Out-of-gamut clips.
function toHex(rgb) {
  if (!rgb) return null;
  const hex = rgb
    .map((c) => {
      const v = Math.round(clip01(linearToSrgb(c)) * 255);
      return v.toString(16).padStart(2, "0");
    })
    .join("");
  return `#${hex.toUpperCase()}`;
}

function colourToHex(s) {
  return toHex(parseColor(s));
}

// ─── DTCG walker ────────────────────────────────────────────────────────────

// Walk a DTCG tree, calling visit(path, node) for every leaf token (a node with
// $value). Group containers are walked recursively; metadata keys ($schema,
// $description, etc.) are skipped.
function walkTokens(node, path, visit) {
  if (node && typeof node === "object" && "$value" in node) {
    visit(path, node);
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      walkTokens(v, [...path, k], visit);
    }
  }
}

function flattenTokens(group) {
  const out = {};
  walkTokens(group, [], (path, node) => {
    out[path.join(".")] = node;
  });
  return out;
}

// ─── DTCG → DESIGN.md projection ────────────────────────────────────────────

function projectColors(group) {
  if (!group) return {};
  const flat = flattenTokens(group);
  const out = {};
  for (const [path, node] of Object.entries(flat)) {
    const v = node.$value;
    const hex = typeof v === "string" ? colourToHex(v) : null;
    if (hex) out[kebab(path)] = hex;
  }
  return out;
}

function projectTypography(group) {
  if (!group) return {};
  const flat = flattenTokens(group);
  const out = {};
  for (const [path, node] of Object.entries(flat)) {
    const v = node.$value;
    if (!v || typeof v !== "object") continue;
    const entry = {};
    if (v.fontFamily) entry.fontFamily = Array.isArray(v.fontFamily) ? v.fontFamily.join(", ") : v.fontFamily;
    if (v.fontSize) entry.fontSize = formatDimension(v.fontSize);
    if (v.fontWeight) entry.fontWeight = Number(v.fontWeight);
    if (v.lineHeight !== undefined) entry.lineHeight = typeof v.lineHeight === "number" ? v.lineHeight : formatDimension(v.lineHeight);
    if (v.letterSpacing) entry.letterSpacing = formatDimension(v.letterSpacing);
    out[kebab(path)] = entry;
  }
  return out;
}

function projectScale(group, kind) {
  if (!group) return {};
  const flat = flattenTokens(group);
  const out = {};
  for (const [path, node] of Object.entries(flat)) {
    const v = node.$value;
    out[kebab(path)] = formatDimension(v);
  }
  return out;
}

function formatDimension(v) {
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string") return v;
  if (v && typeof v === "object" && "value" in v && "unit" in v) return `${v.value}${v.unit}`;
  return String(v);
}

function kebab(path) {
  return path
    .replace(/\./g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

// ─── YAML emitter ───────────────────────────────────────────────────────────

function yamlScalar(v) {
  if (typeof v === "number") return String(v);
  if (typeof v === "string") {
    // Quote if it contains special chars or starts with # or {
    if (/^[#{]/.test(v) || /[:#@`]/.test(v)) return `"${v.replace(/"/g, '\\"')}"`;
    return v;
  }
  return String(v);
}

function yamlMap(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out += `${pad}${k}:\n${yamlMap(v, indent + 1)}`;
    } else {
      out += `${pad}${k}: ${yamlScalar(v)}\n`;
    }
  }
  return out;
}

// ─── component projection ───────────────────────────────────────────────────

const VALID_COMPONENT_PROPS = new Set([
  "backgroundColor",
  "textColor",
  "typography",
  "rounded",
  "padding",
  "size",
  "height",
  "width",
]);

function projectComponents(comps) {
  const out = {};
  for (const [name, props] of Object.entries(comps)) {
    const entry = {};
    for (const [k, v] of Object.entries(props)) {
      if (!VALID_COMPONENT_PROPS.has(k)) {
        console.warn(`warn: component "${name}" has unsupported property "${k}" — dropped`);
        continue;
      }
      entry[k] = v;
    }
    out[name] = entry;
  }
  return out;
}

// ─── prose sections ─────────────────────────────────────────────────────────

function proseSections(name, frontmatter) {
  const colorCount = Object.keys(frontmatter.colors ?? {}).length;
  const compCount = Object.keys(frontmatter.components ?? {}).length;
  return `
## Overview

${name} is a design system. The values in this file are the source of truth for an AI agent generating new UI; the prose below explains how to apply them.

## Colors

This system defines ${colorCount} colour tokens. The hex values in the YAML frontmatter are sRGB approximations — for wide-gamut OKLCH originals, see the sidecar \`tokens.json\`.

## Typography

Typography tokens map intent (heading, body, label) to specific font, size, weight, and leading. Use the named tokens; do not author one-off values.

## Components

${compCount} component primitives are defined. Variants are sibling keys with related names (e.g. \`button\`, \`button-hover\`). Composition follows: Sentiment → Emphasis → Size → Structure → State.

## Do's and Don'ts

### Composition Model

Every component is the product of up to five independent dimensions: **Sentiment, Emphasis, Size, Structure, State**. Each is orthogonal — it does not conflict with any other dimension.

- Sentiment: what the component communicates (\`neutral\`, \`warning\`, \`highlight\`, \`new\`, \`positive\`)
- Emphasis: how loudly it communicates (\`high\`, \`medium\`, \`low\`)
- Size: physical footprint (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`)
- Structure: fixed anatomical dimensions (radius, gap, internal padding)
- State: interactive condition (\`rest\`, \`hover\`, \`active\`, \`selected\`, \`disabled\`)

**Decision order:** Sentiment → Emphasis → Size → Structure → State. State is never a composition decision — it's a runtime response.

### Cascade and Interpolation

Not every (sentiment × emphasis × size × state) combination is named in this file. When a combination isn't named, find the closest named variant by swapping one dimension at a time toward the default. The colour cascade resolves bottom-up: **State → Emphasis → Sentiment → Semantic Color**.

### Anti-patterns

- Don't apply sentiment colour to non-component surfaces.
- Don't override state colours per component — state shifts come from the cascade.
- Don't use a primitive token directly in a component; always reference the semantic layer.
- Don't combine multiple high-emphasis components on the same surface.

### Wide-gamut colour

The \`colors\` block is hex sRGB only because the DESIGN.md spec mandates it. Original OKLCH/Display P3 values live in the sidecar \`tokens.json\`. When a tool round-trips through DTCG, prefer the sidecar.
`.trim();
}

// ─── main ───────────────────────────────────────────────────────────────────

const projectedColors = projectColors(tokens.color ?? tokens.colors);
const projectedTypography = projectTypography(tokens.typography);
const projectedSpacing = projectScale(tokens.spacing, "spacing");
const projectedRounded = projectScale(tokens.borderRadius ?? tokens.rounded, "rounded");

if (!projectedColors.primary) {
  // pick a reasonable default if there's any colour at all
  const first = Object.entries(projectedColors)[0];
  if (first) {
    projectedColors.primary = first[1];
    console.warn(`warn: no "primary" colour found; defaulting primary = ${first[0]} (${first[1]})`);
  }
}

const frontmatter = {
  version: "alpha",
  name,
};
if (Object.keys(projectedColors).length) frontmatter.colors = projectedColors;
if (Object.keys(projectedTypography).length) frontmatter.typography = projectedTypography;
if (Object.keys(projectedRounded).length) frontmatter.rounded = projectedRounded;
if (Object.keys(projectedSpacing).length) frontmatter.spacing = projectedSpacing;
const projectedComponents = projectComponents(components);
if (Object.keys(projectedComponents).length) frontmatter.components = projectedComponents;

const yamlBody = yamlMap(frontmatter);
const frontmatterBlock = `---\n${yamlBody}---`;
const generatedProse = proseSections(name, frontmatter);

const designPath = join(outDir, "DESIGN.md");
const sidecarPath = join(outDir, "tokens.json");

const existingContents = existsSync(designPath) ? readFileSync(designPath, "utf8") : null;
const fileState = classifyExistingFile(existingContents);

let designMd;
try {
  const decision = decideWriteAction({ state: fileState, init: flags.has("init"), designPath });
  if (decision.action === "write-fresh") {
    designMd = composeFresh({ frontmatterBlock, generatedProse });
  } else {
    designMd = composeWithMerge({ existingContents, frontmatterBlock, generatedProse });
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(65);
}

writeFileSync(designPath, designMd);
writeFileSync(sidecarPath, JSON.stringify(tokens, null, 2));

console.log(`✓ wrote ${designPath}`);
console.log(`✓ wrote ${sidecarPath}`);
console.log(`  colors:     ${Object.keys(projectedColors).length}`);
console.log(`  typography: ${Object.keys(projectedTypography).length}`);
console.log(`  spacing:    ${Object.keys(projectedSpacing).length}`);
console.log(`  rounded:    ${Object.keys(projectedRounded).length}`);
console.log(`  components: ${Object.keys(projectedComponents).length}`);
console.log(`\nnext: lint with scripts/lint.sh ${designPath}`);

// ─── migrate runner ─────────────────────────────────────────────────────────

async function runMigrate({ inPath, nonInteractive, dispositionPath }) {
  if (!inPath) {
    console.error("✗ migrate: missing required --in <path-to-DESIGN.md>");
    process.exit(64);
  }
  const absIn = resolve(inPath);
  if (!existsSync(absIn)) {
    console.error(`✗ migrate: file not found: ${absIn}`);
    process.exit(66);
  }
  const original = readFileSync(absIn, "utf8");

  if (alreadyMigrated(original)) {
    console.log(`✓ ${absIn} already contains preservation markers — nothing to do.`);
    console.log(`  Re-running emit-design-md.mjs without 'migrate' will refresh the generated block.`);
    return;
  }

  const parsed = splitDesignMd(original);
  if (parsed.sections.length === 0) {
    console.error(`✗ migrate: ${absIn} has no \`## \` headings to disposition. Nothing to migrate.`);
    process.exit(65);
  }

  let dispositions;
  if (nonInteractive) {
    if (!dispositionPath) {
      console.error("✗ migrate: --non-interactive requires --disposition <yaml-path>");
      process.exit(64);
    }
    const yamlText = readFileSync(resolve(dispositionPath), "utf8");
    const { dispositions: parsedDisp } = parseDispositionYaml(yamlText);
    dispositions = parsedDisp;
    validateDispositions({ sections: parsed.sections, dispositions });
  } else {
    dispositions = await promptDispositions(parsed.sections);
  }

  const migrated = buildMigrated({
    frontmatterBlock: parsed.frontmatterBlock,
    sections: parsed.sections,
    dispositions,
  });

  if (!nonInteractive) {
    const ok = await confirmFinal(absIn, original, migrated);
    if (!ok) {
      console.log("✗ migrate: aborted; original file unchanged.");
      process.exit(1);
    }
  }

  // Atomic write: temp file in the same directory + rename.
  const tmp = join(dirname(absIn), `.${basename(absIn)}.migrate.tmp`);
  writeFileSync(tmp, migrated);
  renameSync(tmp, absIn);
  const counts = { g: 0, p: 0, s: 0 };
  for (const d of dispositions.values()) counts[d]++;
  const sectionWord = (n) => (n === 1 ? "section" : "sections");
  console.log(`✓ migrated ${absIn}`);
  console.log(`  ${counts.g} ${sectionWord(counts.g)} wrapped in markers`);
  console.log(`  ${counts.p} ${sectionWord(counts.p)} preserved below :end`);
  console.log(`  ${counts.s} ${sectionWord(counts.s)} deleted`);
}

async function promptDispositions(sections) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) =>
    new Promise((res) => rl.question(q, (a) => res(a)));
  const dispositions = new Map();
  console.log(`\nMigrating ${sections.length} sections.`);
  console.log(`For each section, choose:  g = generated (wrap in markers)`);
  console.log(`                            p = preserved (keep verbatim below markers)`);
  console.log(`                            s = skip (delete)\n`);
  for (const s of sections) {
    const def = defaultDisposition(s.heading);
    const preview = s.body.split("\n")[0]?.trim().slice(0, 80) ?? "";
    console.log(`  ${s.heading}`);
    if (preview) console.log(`    ${preview}…`);
    let answer;
    while (true) {
      answer = (await ask(`    [g/p/s, default ${def}]: `)).trim().toLowerCase();
      if (answer === "") answer = def;
      if (["g", "p", "s"].includes(answer)) break;
      console.log(`    invalid — choose g, p, or s.`);
    }
    dispositions.set(s.heading, answer);
  }
  rl.close();
  return dispositions;
}

async function confirmFinal(path, before, after) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) =>
    new Promise((res) => rl.question(q, (a) => res(a)));
  console.log(`\n— migrate diff for ${path} —`);
  console.log(`  before: ${before.length} bytes`);
  console.log(`  after:  ${after.length} bytes`);
  console.log(`  (full diff via \`diff <(echo BEFORE) <(echo AFTER)\` if needed)`);
  const a = (await ask(`Write changes? [y/N]: `)).trim().toLowerCase();
  rl.close();
  return a === "y" || a === "yes";
}
