#!/usr/bin/env node
// fn-init — scaffold a greenfield project with the canonical bysixteen
// design-system context stack (tokens.json + components.json + five model
// MDX files + CLAUDE.md + DESIGN.md with preservation markers).
//
// Usage:
//   node init.mjs --name <project-name> --target <dir> [--force]

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "..", "templates");

export function init({ name, target, force = false } = {}) {
  if (!name) throw new Error("fn-init: --name is required");
  if (!target) throw new Error("fn-init: --target is required");
  if (isNonEmpty(target) && !force) {
    throw new Error(`fn-init: target ${target} is non-empty. Pass --force to overwrite.`);
  }
  copyDir(TEMPLATES, target, { project_name: name });
  return { target, written: true };
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
  const takeValue = (flag, i) => {
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      throw new Error(`fn-init: ${flag} requires a value`);
    }
    return next;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--name") {
      out.name = takeValue("--name", i);
      i++;
    } else if (arg === "--target") {
      out.target = takeValue("--target", i);
      i++;
    } else if (arg === "--force") out.force = true;
    else if (arg === "--help" || arg === "-h") out.help = true;
    else throw new Error(`fn-init: unknown flag ${arg}`);
  }
  return out;
}

function help() {
  console.log("fn-init — scaffold canonical design-system context stack");
  console.log("");
  console.log("Usage: node init.mjs --name <project-name> --target <dir> [--force]");
  console.log("");
  console.log("  --name <name>     Project name; substituted into {{project_name}} placeholders.");
  console.log("  --target <dir>    Directory to write into. Created if missing.");
  console.log("  --force           Overwrite a non-empty target.");
  console.log("");
  console.log("After scaffolding, run:");
  console.log("  node .claude/skills/fn-design-md/scripts/emit-design-md.mjs \\");
  console.log("    --from-dimensional <dir> --out <dir> --name <project-name>");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      help();
      process.exit(0);
    }
    const result = init(args);
    console.log(`fn-init: wrote canonical scaffold to ${result.target}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
