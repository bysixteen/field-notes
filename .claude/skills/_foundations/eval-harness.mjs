#!/usr/bin/env node
// Static-rubric eval harness for SKILL.md files.
//
// Scores each skill against four deterministic axes (0/1/2 each, total /8):
//   - frontmatter   completeness (name + substantive description)
//   - trigger       clarity (when to use, ideally with examples / SKIP)
//   - output        contract (what the skill produces)
//   - inputs        / required fields (what the skill needs)
//
// Verdict thresholds: Strong 7-8, Adequate 4-6, Weak 0-3.
// Tiebreak (e.g. for bottom-3 selection): alphabetical by skill name.
//
// Modes:
//   --self-check         run synthetic-stub assertions, exit 0/1
//   --skill <name>       score one skill, write report
//   --all                score every in-scope skill + write reports + print bottom 3
//
// Reports land at <repo-root>/.context/evals/<skill>.md.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..', '..', '..');
const SKILLS_DIR = join(REPO_ROOT, '.claude', 'skills');
const EVALS_DIR = join(REPO_ROOT, '.context', 'evals');

const IN_SCOPE = [
  'fn-accessibility', 'fn-component-api', 'fn-component-contract',
  'fn-component-scaffold', 'fn-css', 'fn-design-md', 'fn-html',
  'fn-init', 'fn-react-patterns', 'fn-review', 'fn-storybook-docs',
  'fn-storybook-ds', 'fn-storybook-foundations', 'fn-storybook-helpers',
  'fn-testing', 'fn-tokens', 'start-issue', 'start-work',
];
const ALIASES = { 'fn-design': 'fn-design-md' };

// ─── frontmatter parser (minimal, handles `key: value` and `key: >- multi-line`) ───

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { fm: {}, body: source };
  const block = match[1];
  const body = source.slice(match[0].length);
  const fm = {};
  const lines = block.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let val = kv[2];
    // folded scalar (`>-`, `>`, `|`, `|-`) — collect indented continuation
    if (/^[>|][-+]?\s*$/.test(val)) {
      const folded = val[0] === '>';
      const parts = [];
      i++;
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        parts.push(lines[i].replace(/^\s+/, ''));
        i++;
      }
      fm[key] = folded ? parts.join(' ') : parts.join('\n');
      continue;
    }
    val = val.replace(/^["'](.*)["']$/, '$1').trim();
    fm[key] = val;
    i++;
  }
  return { fm, body };
}

// ─── rubric scoring ───

const TRIGGER_HINTS = [
  /\buse\s+(when|this|to)\b/i, /\btrigger(s|ed|ing)?\s+(when|on|by)\b/i,
  /\bwhen\s+(the\s+)?user\b/i, /\binvoke\b.*\bwhen\b/i,
  /\bwhenever\b/i, /\bat\s+the\s+start\s+of\b/i,
];
const SKIP_HINTS = [
  /\bskip\b/i, /\bdo\s+not\s+use\b/i, /\bavoid\b.*\bwhen\b/i,
  /\bnot\s+for\b/i, /\bwon't\s+use\b/i,
];
const EXAMPLE_HINTS = [
  /\bexample(s)?:/i, /\be\.g\.\b/i, /\bfor\s+example\b/i,
  /\bsuch\s+as\b/i, /^\s*-\s+/m,
];
const OUTPUT_HINTS = [
  /\boutput(s)?\b/i, /\bproduce(s|d)?\b/i, /\bemit(s|ted)?\b/i,
  /\bwrite(s)?\b.*\.(md|json|mjs|ts|tsx|css)\b/i, /\bcreate(s|d)?\b.*\bfile\b/i,
  /\bgenerate(s|d)?\b/i, /\bdeliverable(s)?\b/i, /\breport\b/i,
  /\bresult(s)?\b/i, /\breturn(s)?\b/i,
];
const OUTPUT_SECTION_HINTS = [
  /^#+\s*(output|deliverables?|produces?|results?|emit)\b/im,
];
const INPUT_HINTS = [
  /\binput(s)?\b/i, /\barg(s|ument(s)?)?\b/i, /\brequire(s|d)?\b/i,
  /\bprecondition(s)?\b/i, /\bexpect(s|ed)?\b/i, /\bgiven\b/i,
  /\bbefore\s+(running|invoking|using)\b/i, /\bparameter(s)?\b/i,
];
const INPUT_SECTION_HINTS = [
  /^#+\s*(input(s)?|arg(s|uments)?|preconditions?|requirements?|parameters?|expects?)\b/im,
];

function scoreFrontmatter(fm) {
  const name = (fm.name || '').trim();
  const desc = (fm.description || '').trim();
  if (!name || !desc) return { score: 0, reason: name ? 'description missing' : 'name missing' };
  if (desc.length < 50) return { score: 1, reason: `description thin (${desc.length} chars)` };
  return { score: 2, reason: `name + description present (${desc.length} char description)` };
}

function scoreTrigger(fm, body) {
  const desc = (fm.description || '').trim();
  const haystack = `${desc}\n${body}`;
  const hasTrigger = TRIGGER_HINTS.some((re) => re.test(haystack));
  if (!hasTrigger) return { score: 0, reason: 'no when-to-use language found' };
  const indicators = [
    hasTrigger,
    SKIP_HINTS.some((re) => re.test(haystack)),
    EXAMPLE_HINTS.some((re) => re.test(haystack)),
  ].filter(Boolean).length;
  if (indicators >= 2) return { score: 2, reason: `trigger + ${indicators - 1} reinforcer (skip/example)` };
  return { score: 1, reason: 'trigger named but no reinforcers (skip / examples)' };
}

function scoreOutput(body) {
  const hasSection = OUTPUT_SECTION_HINTS.some((re) => re.test(body));
  const hintCount = OUTPUT_HINTS.filter((re) => re.test(body)).length;
  if (hasSection) return { score: 2, reason: 'explicit output / deliverables section' };
  if (hintCount >= 2) return { score: 1, reason: `${hintCount} output mentions in body` };
  if (hintCount === 1) return { score: 1, reason: 'one passing output mention' };
  return { score: 0, reason: 'body never names what the skill produces' };
}

function scoreInputs(body) {
  const hasSection = INPUT_SECTION_HINTS.some((re) => re.test(body));
  const hintCount = INPUT_HINTS.filter((re) => re.test(body)).length;
  if (hasSection) return { score: 2, reason: 'explicit input / preconditions section' };
  if (hintCount >= 2) return { score: 1, reason: `${hintCount} input mentions in body` };
  if (hintCount === 1) return { score: 1, reason: 'one passing input mention' };
  return { score: 0, reason: 'body never names required inputs' };
}

const VERDICT = (total) => total >= 7 ? 'Strong' : total >= 4 ? 'Adequate' : 'Weak';

function evaluate(source) {
  const { fm, body } = parseFrontmatter(source);
  const axes = {
    frontmatter: scoreFrontmatter(fm),
    trigger: scoreTrigger(fm, body),
    output: scoreOutput(body),
    inputs: scoreInputs(body),
  };
  const total = Object.values(axes).reduce((s, a) => s + a.score, 0);
  return { fm, axes, total, verdict: VERDICT(total) };
}

// ─── skill resolution ───

function resolveSkill(name) {
  const flat = join(SKILLS_DIR, `${name}.md`);
  if (existsSync(flat) && statSync(flat).isFile()) return flat;
  const nested = join(SKILLS_DIR, name, 'SKILL.md');
  if (existsSync(nested) && statSync(nested).isFile()) return nested;
  return null;
}

// ─── report rendering ───

function renderReport(name, path, result) {
  const lines = [];
  lines.push(`# eval: ${name}`);
  lines.push('');
  lines.push(`- **Path:** \`${path.replace(REPO_ROOT + '/', '')}\``);
  lines.push(`- **Total:** ${result.total} / 8`);
  lines.push(`- **Verdict:** ${result.verdict}`);
  lines.push('');
  lines.push('## Rubric');
  lines.push('');
  lines.push('| Axis | Score | Rationale |');
  lines.push('| --- | --- | --- |');
  for (const [axis, { score, reason }] of Object.entries(result.axes)) {
    lines.push(`| ${axis} | ${score} / 2 | ${reason} |`);
  }
  lines.push('');
  const recs = [];
  if (result.axes.frontmatter.score < 2) recs.push('Tighten frontmatter — ensure `name` and a substantive `description` (≥50 chars) are present.');
  if (result.axes.trigger.score < 2) recs.push('Strengthen trigger language — add explicit "use when" cases plus a SKIP / negative-trigger clause and at least one concrete example.');
  if (result.axes.output.score < 2) recs.push('Add an explicit Output / Deliverables section naming the artefacts the skill produces.');
  if (result.axes.inputs.score < 2) recs.push('Add an explicit Inputs / Preconditions section naming what the skill expects from the caller.');
  if (recs.length === 0) recs.push('No rubric-level improvements; behavioural eval (API-driven) would be needed for deeper signal.');
  lines.push('## Recommendations');
  lines.push('');
  for (const r of recs) lines.push(`- ${r}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`Generated by \`.claude/skills/_foundations/eval-harness.mjs\` against the static rubric. Behavioural eval (output quality on fixture prompts via the Anthropic API) is reserved for follow-up issues on the bottom three; see #49.`);
  lines.push('');
  return lines.join('\n');
}

function writeReport(name, body) {
  if (!existsSync(EVALS_DIR)) mkdirSync(EVALS_DIR, { recursive: true });
  const path = join(EVALS_DIR, `${name}.md`);
  writeFileSync(path, body);
  return path;
}

function aliasNote(alias, target) {
  return [
    `# eval: ${alias}`,
    '',
    `Alias of \`${target}\`. See [\`${target}.md\`](./${target}.md) for the full report.`,
    '',
    `The alias absorbs the recurring "is \`${alias}\` the right path?" confusion; both names point at the same skill, so they share the same score.`,
    '',
  ].join('\n');
}

// ─── self-check ───

const STUB_STRONG = `---
name: fn-test-stub-strong
description: Use this skill when authoring a test fixture that exercises every rubric axis at full strength. Trigger when the user says "stub strong" or "rubric self-check"; skip if the test harness is not loaded.
---

# Strong stub

## Inputs

- A path to the file under test (required precondition: file must exist).
- A flag indicating dry-run vs commit.

## Output

- Writes a one-page Markdown report to \`.context/evals/<name>.md\`.
- Returns total score and verdict.

Use this when the harness needs an exemplar of a fully-specified SKILL.md — for example during \`--self-check\`.
`;

const STUB_WEAK = `---
name: fn-test-stub-weak
description: short
---

# Weak stub

Body says nothing useful.
`;

function selfCheck() {
  const strong = evaluate(STUB_STRONG);
  const weak = evaluate(STUB_WEAK);

  assert.equal(strong.axes.frontmatter.score, 2, 'strong stub: frontmatter should score 2');
  assert.equal(strong.axes.trigger.score, 2, 'strong stub: trigger should score 2');
  assert.equal(strong.axes.output.score, 2, 'strong stub: output should score 2');
  assert.equal(strong.axes.inputs.score, 2, 'strong stub: inputs should score 2');
  assert.equal(strong.total, 8, 'strong stub: total should be 8/8');
  assert.equal(strong.verdict, 'Strong', 'strong stub: verdict should be Strong');

  assert.equal(weak.axes.frontmatter.score, 1, 'weak stub: frontmatter should score 1 (description thin)');
  assert.equal(weak.axes.trigger.score, 0, 'weak stub: trigger should score 0');
  assert.equal(weak.axes.output.score, 0, 'weak stub: output should score 0');
  assert.equal(weak.axes.inputs.score, 0, 'weak stub: inputs should score 0');
  assert.equal(weak.total, 1, 'weak stub: total should be 1/8');
  assert.equal(weak.verdict, 'Weak', 'weak stub: verdict should be Weak');

  // tiebreak: alphabetical when totals are equal
  const ranked = [
    { name: 'zebra', total: 3 }, { name: 'alpha', total: 3 }, { name: 'mango', total: 3 },
  ].sort((a, b) => a.total - b.total || a.name.localeCompare(b.name));
  assert.deepEqual(ranked.map((r) => r.name), ['alpha', 'mango', 'zebra'], 'tiebreak: alphabetical');

  // round-trip the strong stub through the report renderer
  const report = renderReport('fn-test-stub-strong', '/tmp/strong.md', strong);
  assert.match(report, /Total:\*\* 8 \/ 8/, 'report renders total');
  assert.match(report, /Verdict:\*\* Strong/, 'report renders verdict');

  const selfCheckReport = [
    '# eval: _self-check',
    '',
    '- **Total (strong stub):** 8 / 8',
    '- **Total (weak stub):** 1 / 8',
    '- **Tiebreak:** alphabetical by skill name',
    '',
    'Synthetic-stub assertions in `eval-harness.mjs` validate the rubric:',
    '- A deliberately strong SKILL.md scores 8/8 (Strong) across all four axes.',
    '- A deliberately weak SKILL.md scores 1/8 (Weak) — frontmatter thin, no trigger / output / input language.',
    '- Bottom-three ordering tiebreaks alphabetically when totals match.',
    '',
    'Run via `node .claude/skills/_foundations/eval-harness.mjs --self-check`. Exit code 0 on success, 1 on assertion failure.',
    '',
  ].join('\n');
  writeReport('_self-check', selfCheckReport);

  console.log('eval-harness self-check: OK (strong=8/8, weak=1/8, tiebreak verified, report shape verified)');
}

// ─── CLI ───

function runOne(name) {
  const path = resolveSkill(name);
  if (!path) throw new Error(`Skill not found: ${name} (looked at ${SKILLS_DIR}/${name}.md and ${SKILLS_DIR}/${name}/SKILL.md)`);
  const source = readFileSync(path, 'utf8');
  const result = evaluate(source);
  const reportPath = writeReport(name, renderReport(name, path, result));
  return { name, path, reportPath, ...result };
}

function runAll() {
  const results = IN_SCOPE.map(runOne);

  // alias note
  for (const [alias, target] of Object.entries(ALIASES)) {
    writeReport(alias, aliasNote(alias, target));
  }

  // bottom three: ascending by total, alphabetical tiebreak
  const ranked = [...results].sort((a, b) => a.total - b.total || a.name.localeCompare(b.name));
  const bottom = ranked.slice(0, 3);

  console.log('\n=== eval baseline summary ===');
  for (const r of ranked) console.log(`${String(r.total).padStart(2)} / 8  ${r.verdict.padEnd(8)}  ${r.name}`);
  console.log('\n=== bottom three (file as follow-up issues) ===');
  for (const r of bottom) console.log(`- ${r.name} (${r.total}/8, ${r.verdict})`);

  return { results, bottom };
}

const args = process.argv.slice(2);
if (args.includes('--self-check')) {
  try { selfCheck(); process.exit(0); }
  catch (err) { console.error('eval-harness self-check FAILED:', err.message); process.exit(1); }
} else if (args.includes('--all')) {
  runAll();
} else if (args.includes('--skill')) {
  const name = args[args.indexOf('--skill') + 1];
  if (!name) { console.error('--skill requires a name'); process.exit(2); }
  const r = runOne(name);
  console.log(`${r.name}: ${r.total}/8 (${r.verdict}) → ${r.reportPath.replace(REPO_ROOT + '/', '')}`);
} else {
  console.error('usage: eval-harness.mjs [--self-check | --skill <name> | --all]');
  process.exit(2);
}
