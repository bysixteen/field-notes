#!/usr/bin/env node
// fn-init — scaffold a greenfield project with the canonical bysixteen
// design-system context stack (tokens.json + components.json + five model
// MDX files + CLAUDE.md + DESIGN.md with preservation markers).
//
// Usage:
//   node init.mjs --name <project-name> --target <dir> [--force]
//   node init.mjs --prompt --target <dir> [--force]              (interactive)
//   node init.mjs --prompt --target <dir> --name <name> [--force] (pre-fill)

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "..", "templates");

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const VALID_THEMES = new Set(["light", "dark"]);
const VALID_SURFACES = new Set(["single", "pair"]);

const DEFAULT_VARS = Object.freeze({
  primary_color: "#0066cc",
  font_family: "Inter",
  default_theme: "light",
  surface_count: "single",
});

const QUESTIONS = [
  {
    key: "project_name",
    label: "Project name",
    flag: "name",
    defaultFrom: ({ target }) => (target ? basename(resolve(target)) : null),
    validate: (v) => (v.length > 0 ? null : "Project name cannot be empty."),
  },
  {
    key: "primary_color",
    label: "Primary anchor colour (hex, e.g. #0066cc)",
    flag: "primary-color",
    default: DEFAULT_VARS.primary_color,
    validate: (v) =>
      HEX_RE.test(v) ? null : "Must be a hex colour like #0066cc or #06c.",
  },
  {
    key: "font_family",
    label: "Typeface (e.g. Inter, system-ui)",
    flag: "font-family",
    default: DEFAULT_VARS.font_family,
    validate: (v) => (v.length > 0 ? null : "Typeface cannot be empty."),
  },
  {
    key: "default_theme",
    label: "Default theme (light/dark)",
    flag: "default-theme",
    default: DEFAULT_VARS.default_theme,
    transform: (v) => v.toLowerCase(),
    validate: (v) =>
      VALID_THEMES.has(v) ? null : "Must be 'light' or 'dark'.",
  },
  {
    key: "surface_count",
    label: "Surfaces (single/pair)",
    flag: "surface-count",
    default: DEFAULT_VARS.surface_count,
    transform: (v) => v.toLowerCase(),
    validate: (v) =>
      VALID_SURFACES.has(v) ? null : "Must be 'single' or 'pair'.",
  },
];

export function init({ name, target, force = false, vars = {} } = {}) {
  if (!name) throw new Error("fn-init: --name is required");
  if (!target) throw new Error("fn-init: --target is required");
  if (isNonEmpty(target) && !force) {
    throw new Error(`fn-init: target ${target} is non-empty. Pass --force to overwrite.`);
  }
  const allVars = { ...DEFAULT_VARS, ...vars, project_name: name };
  copyDir(TEMPLATES, target, allVars);
  return { target, written: true };
}

export async function promptForAnswers({
  presets = {},
  target = null,
  ask = null,
  output = process.stdout,
  isTTY = process.stdin.isTTY,
} = {}) {
  let rl = null;
  let askFn = ask;
  if (!askFn) {
    if (!isTTY) {
      throw new Error(
        "fn-init: --prompt requires an interactive TTY. Pass flags directly or run from a terminal."
      );
    }
    rl = createInterface({ input: process.stdin, output });
    askFn = (q) => new Promise((res) => rl.question(q, res));
  }
  const answers = {};
  for (const q of QUESTIONS) {
    if (presets[q.key] !== undefined && presets[q.key] !== null && presets[q.key] !== "") {
      const transformed = q.transform ? q.transform(presets[q.key]) : presets[q.key];
      const err = q.validate ? q.validate(transformed) : null;
      if (err) {
        throw new Error(`fn-init: invalid value for --${q.flag} (${presets[q.key]}): ${err}`);
      }
      answers[q.key] = transformed;
    }
  }
  try {
    for (const q of QUESTIONS) {
      if (q.key in answers) continue;
      const def =
        typeof q.defaultFrom === "function" ? q.defaultFrom({ target }) : q.default ?? null;
      const prompt = def ? `${q.label} [${def}]: ` : `${q.label}: `;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const raw = ((await askFn(prompt)) ?? "").trim();
        const candidate = raw.length === 0 ? def : raw;
        if (!candidate) {
          output.write("Value required.\n");
          continue;
        }
        const transformed = q.transform ? q.transform(candidate) : candidate;
        const err = q.validate ? q.validate(transformed) : null;
        if (err) {
          output.write(err + "\n");
          continue;
        }
        answers[q.key] = transformed;
        break;
      }
    }
  } finally {
    if (rl) rl.close();
  }
  return answers;
}

function copyDir(src, dst, vars) {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const dstPath = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath, vars);
    } else {
      const raw = readFileSync(srcPath, "utf8");
      writeFileSync(dstPath, applyVars(raw, vars));
    }
  }
}

function applyVars(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{{${key}}}`
  );
}

function isNonEmpty(dir) {
  if (!existsSync(dir)) return false;
  return readdirSync(dir).length > 0;
}

function parseArgs(argv) {
  const out = {};
  const valueFlags = new Map([
    ["--name", "name"],
    ["--target", "target"],
    ["--primary-color", "primary_color"],
    ["--font-family", "font_family"],
    ["--default-theme", "default_theme"],
    ["--surface-count", "surface_count"],
  ]);
  const takeValue = (flag, i) => {
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      throw new Error(`fn-init: ${flag} requires a value`);
    }
    return next;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (valueFlags.has(arg)) {
      out[valueFlags.get(arg)] = takeValue(arg, i);
      i++;
    } else if (arg === "--force") out.force = true;
    else if (arg === "--prompt") out.prompt = true;
    else if (arg === "--help" || arg === "-h") out.help = true;
    else throw new Error(`fn-init: unknown flag ${arg}`);
  }
  return out;
}

function help() {
  console.log("fn-init — scaffold canonical design-system context stack");
  console.log("");
  console.log("Usage:");
  console.log("  node init.mjs --name <project-name> --target <dir> [--force]");
  console.log("  node init.mjs --prompt --target <dir> [--force] [pre-fill flags]");
  console.log("");
  console.log("Flags:");
  console.log("  --name <name>            Project name; substituted into {{project_name}}.");
  console.log("  --target <dir>           Directory to write into. Created if missing.");
  console.log("  --force                  Overwrite a non-empty target.");
  console.log("  --prompt                 Walk through the question set interactively.");
  console.log("                           Pre-fills any answer passed via flags.");
  console.log("                           Requires a TTY; fails otherwise.");
  console.log("");
  console.log("Pre-fill flags (also valid in non-prompt mode):");
  console.log("  --primary-color <hex>    Primary anchor colour (default #0066cc).");
  console.log("  --font-family <name>     Typeface for typography.label-md (default Inter).");
  console.log("  --default-theme <theme>  light | dark (default light).");
  console.log("  --surface-count <count>  single | pair (default single).");
  console.log("");
  console.log("After scaffolding, run:");
  console.log("  node .claude/skills/fn-design-md/scripts/emit-design-md.mjs \\");
  console.log("    --from-dimensional <dir> --out <dir> --name <project-name>");
}

async function main(args) {
  if (args.help) {
    help();
    return;
  }
  if (args.prompt) {
    if (!args.target) throw new Error("fn-init: --target is required");
    const presets = {
      project_name: args.name,
      primary_color: args.primary_color,
      font_family: args.font_family,
      default_theme: args.default_theme,
      surface_count: args.surface_count,
    };
    const answers = await promptForAnswers({ presets, target: args.target });
    const result = init({
      name: answers.project_name,
      target: args.target,
      force: args.force,
      vars: {
        primary_color: answers.primary_color,
        font_family: answers.font_family,
        default_theme: answers.default_theme,
        surface_count: answers.surface_count,
      },
    });
    console.log(`fn-init: wrote canonical scaffold to ${result.target}`);
    return;
  }
  const result = init({
    name: args.name,
    target: args.target,
    force: args.force,
    vars: {
      primary_color: args.primary_color,
      font_family: args.font_family,
      default_theme: args.default_theme,
      surface_count: args.surface_count,
    },
  });
  console.log(`fn-init: wrote canonical scaffold to ${result.target}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  (async () => {
    try {
      const args = parseArgs(process.argv.slice(2));
      await main(args);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  })();
}
