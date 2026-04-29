#!/usr/bin/env node
// emit-design-md.mjs — project a DTCG tokens.json into DESIGN.md plus a
// passthrough DTCG sidecar, driven by a section template.
//
// Usage:
//   emit-design-md.mjs --tokens <path> --components <path> --out <dir>
//                      [--name <name>] [--template <path>] [--init]
//   emit-design-md.mjs --from-dimensional <root> --out <dir>
//                      [--name <name>] [--template <path>] [--init]
//   emit-design-md.mjs migrate --in <path> [--non-interactive --disposition <yaml>]
//
// Template (default: references/templates/google-spec.yaml):
//   A YAML file naming the sections to emit, their headings, and whether
//   each is `generated` (regenerated every run) or `preserved` (seeded once
//   from `placeholder`, then kept verbatim across regenerates). Optional
//   `redactions.forbidden_terms_path` halts the emit if the rendered prose
//   contains any of the listed terms — used by consumers who must keep
//   inspiration-source names out of the public DESIGN.md.
//
// Lossy projection:
//   - OKLCH, Display P3, and rgba() colours are converted to closest hex sRGB
//     for DESIGN.md. Original values stay in the sidecar tokens.json.
//   - Anything DESIGN.md cannot model (motion, elevation, borders, theme
//     variants) is preserved in the sidecar only.

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from "node:fs";
import { basename, resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import {
  classifyExistingFile,
  composeFresh,
  composeWithMerge,
  decideWriteAction,
  extractPreservedBody,
  extractLegacySuffix,
  FILE_STATE,
} from "./lib/preserve.mjs";
import {
  splitDesignMd,
  defaultDisposition,
  parseDispositionYaml,
  validateDispositions,
  buildMigrated,
  alreadyMigrated,
} from "./lib/migrate.mjs";
import { walkDimensionalSource } from "./lib/dimensional-walker.mjs";
import { flattenComponentMatrix } from "./lib/cascade.mjs";
import { loadTemplate } from "./lib/template.mjs";
import { getRenderer } from "./lib/sections.mjs";
import { loadForbiddenTerms, scanForbidden, formatHalt } from "./lib/redact.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, "..");
const DEFAULT_TEMPLATE = join(SKILL_ROOT, "references", "templates", "google-spec.yaml");

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

if (subcommand === "migrate") {
  await runMigrate({
    inPath: args.in,
    nonInteractive: flags.has("non-interactive"),
    dispositionPath: args.disposition,
  });
  process.exit(0);
}

if (!args.out) {
  console.error("missing required --out");
  process.exit(64);
}

let tokens, components;

if (args["from-dimensional"]) {
  if (args.tokens || args.components) {
    console.error("✗ --from-dimensional is mutually exclusive with --tokens / --components");
    process.exit(64);
  }
  const root = resolve(args["from-dimensional"]);
  let walked;
  try {
    walked = walkDimensionalSource(root);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(65);
  }
  tokens = walked.tokens;
  components = expandComponentsToVariants(walked);
  printDimensionalSummary(walked, components);
} else {
  if (!args.tokens || !args.components) {
    console.error("✗ either --from-dimensional <root> OR both --tokens and --components are required");
    process.exit(64);
  }
  tokens = JSON.parse(readFileSync(resolve(args.tokens), "utf8"));
  components = JSON.parse(readFileSync(resolve(args.components), "utf8"));
}

const outDir = resolve(args.out);
const name = args.name ?? basename(outDir);

const templatePath = args.template ? resolve(args.template) : DEFAULT_TEMPLATE;
let template;
try {
  template = loadTemplate(templatePath);
} catch (err) {
  console.error(`✗ template: ${err.message}`);
  process.exit(65);
}

function expandComponentsToVariants(walked) {
  const flat = {};
  for (const [component, def] of Object.entries(walked.components)) {
    const variantNames = flattenComponentMatrix({
      component,
      applies_to: def.applies_to,
      defaults: walked.defaults,
    });
    for (const variant of variantNames) {
      flat[variant] = def.properties;
    }
  }
  return flat;
}

function printDimensionalSummary(walked, flatComponents) {
  const v = walked.vocab;
  console.log(`Discovered vocabulary:`);
  console.log(`  sentiment:  ${v.sentiment.length} (${v.sentiment.join(", ")})`);
  console.log(`  emphasis:   ${v.emphasis.length} (${v.emphasis.join(", ")})`);
  console.log(`  size:       ${v.size.length} (${v.size.join(", ")})`);
  console.log(`  state:      ${v.state.length} (${v.state.join(", ")})`);
  console.log(`  components: ${Object.keys(walked.components).length} → ${Object.keys(flatComponents).length} variants`);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// ─── colour conversion ──────────────────────────────────────────────────────

function parseColor(s) {
  if (typeof s !== "string") return null;
  s = s.trim();

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

function projectScale(group) {
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

// Thin-index entries (introduced in #170/#178) carry build-time wiring
// fields (`contract`, `radixBase`, `tokenNamespace`) plus an optional
// `properties` map for the DESIGN.md emitter. We extract `properties`
// when present and ignore the wiring fields silently. Legacy flat
// entries — where the property map is the entry itself — keep working
// unchanged.
const THIN_INDEX_FIELDS = new Set(["contract", "radixBase", "tokenNamespace"]);

function isThinIndexEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  for (const k of THIN_INDEX_FIELDS) {
    if (k in entry) return true;
  }
  return false;
}

function projectComponents(comps) {
  const out = {};
  for (const [name, raw] of Object.entries(comps)) {
    const thin = isThinIndexEntry(raw);
    const props = thin && raw.properties ? raw.properties : raw;
    const entry = {};
    for (const [k, v] of Object.entries(props)) {
      if (THIN_INDEX_FIELDS.has(k)) continue;
      if (k === "properties") continue;
      if (!VALID_COMPONENT_PROPS.has(k)) {
        console.warn(`warn: component "${name}" has unsupported property "${k}" — dropped`);
        continue;
      }
      entry[k] = v;
    }
    if (thin && !raw.properties) {
      console.warn(
        `warn: component "${name}" is a thin-index entry without a \`properties\` block — emitting empty body. Add a \`properties\` map to components.json or switch to --from-dimensional.`
      );
    }
    out[name] = entry;
  }
  return out;
}

// ─── main ───────────────────────────────────────────────────────────────────

const projectedColors = projectColors(tokens.color ?? tokens.colors);
const projectedTypography = projectTypography(tokens.typography);
const projectedSpacing = projectScale(tokens.spacing);
const projectedRounded = projectScale(tokens.borderRadius ?? tokens.rounded);

if (!projectedColors.primary) {
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

const designPath = join(outDir, "DESIGN.md");
const sidecarPath = join(outDir, "tokens.json");

const existingContents = existsSync(designPath) ? readFileSync(designPath, "utf8") : null;
const fileState = classifyExistingFile(existingContents);

let designMd;
try {
  const decision = decideWriteAction({ state: fileState, init: flags.has("init"), designPath });
  const resolvedSections = resolveSections({
    template,
    name,
    frontmatter,
    existingContents,
    isMerge: decision.action === "merge",
    isLegacy: fileState === FILE_STATE.HAS_LEGACY_MARKERS,
  });
  enforceRedactions({ template, sections: resolvedSections });
  if (decision.action === "write-fresh") {
    designMd = composeFresh({ frontmatterBlock, sections: resolvedSections });
  } else {
    const legacySuffix = fileState === FILE_STATE.HAS_LEGACY_MARKERS
      ? extractLegacySuffix(existingContents)
      : "";
    designMd = composeWithMerge({ frontmatterBlock, sections: resolvedSections, legacySuffix });
  }
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(65);
}

writeFileSync(designPath, designMd);
writeFileSync(sidecarPath, JSON.stringify(tokens, null, 2));

console.log(`✓ wrote ${designPath} (profile: ${template.profile_name})`);
console.log(`✓ wrote ${sidecarPath}`);
console.log(`  colors:     ${Object.keys(projectedColors).length}`);
console.log(`  typography: ${Object.keys(projectedTypography).length}`);
console.log(`  spacing:    ${Object.keys(projectedSpacing).length}`);
console.log(`  rounded:    ${Object.keys(projectedRounded).length}`);
console.log(`  components: ${Object.keys(projectedComponents).length}`);
console.log(`\nnext: lint with scripts/lint.sh ${designPath} (google-spec) or scripts/lint-template.mjs ${designPath} ${templatePath}`);

// ─── helpers ────────────────────────────────────────────────────────────────

// Resolve the template's section list into concrete `{ id, heading, body }`
// records ready for the renderer. Generated sections invoke their renderer;
// preserved sections take their body from existing per-section markers if
// present, fall back to the template placeholder, else leave empty.
function resolveSections({ template, name, frontmatter, existingContents, isMerge, isLegacy }) {
  return template.sections.map((s) => {
    if (s.disposition === "generated") {
      const renderer = getRenderer(s.source);
      return { id: s.id, heading: s.heading, body: renderer(name, frontmatter) };
    }
    // preserved
    let body = "";
    if (isMerge && !isLegacy && existingContents) {
      const extracted = extractPreservedBody(existingContents, s.id);
      if (extracted !== null) body = extracted;
      else if (s.placeholder) body = s.placeholder.trim();
    } else if (s.placeholder) {
      body = s.placeholder.trim();
    }
    return { id: s.id, heading: s.heading, body };
  });
}

// Run the redaction pass against every rendered section. Halts (throws) on
// the first hit with a useful, copy-pasteable error pointing at the section
// and line. The caller catches the throw and exits non-zero.
function enforceRedactions({ template, sections }) {
  if (!template.redactions?.forbidden_terms_path) return;
  const terms = loadForbiddenTerms(template.redactions.forbidden_terms_path);
  if (terms.length === 0) return;
  for (const s of sections) {
    const hits = scanForbidden(`## ${s.heading}\n\n${s.body}`, terms);
    if (hits.length) throw new Error(formatHalt({ sectionId: s.id, hits }));
  }
}

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
