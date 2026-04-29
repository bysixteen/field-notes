#!/usr/bin/env node
// Pack the field-notes toolkit into a Claude plugin zip.
// Slice rules: ROADMAP Phase 2.1 — fn-* skills, _foundations/, start-issue/,
// start-work/, fn-init/, plus the token-pipeline + Figma sync scripts.
// Output: ../dist/field-notes-toolkit.plugin (workspace-level dist/, outside the worktree).

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const workspaceRoot = resolve(repoRoot, '..');
const distDir = join(workspaceRoot, 'dist');
const outputPath = join(distDir, 'field-notes-toolkit.plugin');
const stagingDir = join(distDir, '.staging-toolkit');

const SKILLS_INCLUDE = [
  'README.md',
  '_foundations',
  'fn-accessibility.md',
  'fn-component-api.md',
  'fn-component-scaffold.md',
  'fn-css.md',
  'fn-html.md',
  'fn-react-patterns.md',
  'fn-review.md',
  'fn-storybook-docs.md',
  'fn-storybook-ds.md',
  'fn-storybook-foundations.md',
  'fn-storybook-helpers.md',
  'fn-testing.md',
  'fn-tokens.md',
  'fn-design',
  'fn-design-md',
  'fn-init',
  'start-issue',
  'start-work',
];

// fn-design-md.skill (a packaged .skill zip) is intentionally excluded — its
// contents are already covered by the fn-design-md/ directory above.

const SCRIPTS_INCLUDE = [
  'generate-ramps.ts',
  'generate-manifest.mjs',
  'figma-pull.sh',
  'figma-push.sh',
  '_prism-call.mjs',
];

mkdirSync(distDir, { recursive: true });
if (existsSync(stagingDir)) rmSync(stagingDir, { recursive: true, force: true });
mkdirSync(join(stagingDir, '.claude/skills'), { recursive: true });
mkdirSync(join(stagingDir, 'scripts'), { recursive: true });

const missing = [];

for (const entry of SKILLS_INCLUDE) {
  const src = join(repoRoot, '.claude/skills', entry);
  if (!existsSync(src)) {
    missing.push(`skills/${entry}`);
    continue;
  }
  cpSync(src, join(stagingDir, '.claude/skills', entry), { recursive: true });
}

for (const entry of SCRIPTS_INCLUDE) {
  const src = join(repoRoot, 'scripts', entry);
  if (!existsSync(src)) {
    missing.push(`scripts/${entry}`);
    continue;
  }
  cpSync(src, join(stagingDir, 'scripts', entry));
}

if (missing.length) {
  console.error('Missing slice entries:');
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}

if (existsSync(outputPath)) rmSync(outputPath);
execSync(`zip -rq "${outputPath}" .`, { cwd: stagingDir, stdio: 'inherit' });
rmSync(stagingDir, { recursive: true, force: true });

const list = execSync(`unzip -l "${outputPath}"`, { encoding: 'utf8' });
const count = (pattern) => list.split('\n').filter((l) => l.includes(pattern)).length;

console.log(`packed: ${outputPath}`);
console.log(`  fn-init entries:      ${count('skills/fn-init/')}`);
console.log(`  _foundations entries: ${count('skills/_foundations/')}`);
console.log(`  fn-design-md entries: ${count('skills/fn-design-md/')}`);
console.log(`  scripts entries:      ${count('scripts/')}`);
