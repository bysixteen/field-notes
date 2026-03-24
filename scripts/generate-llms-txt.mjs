/**
 * Generates llms.txt and llms-full.txt from MDX content.
 *
 * llms.txt      — structured index of all pages (title, description, URL)
 * llms-full.txt — full content of every page, concatenated for one-shot ingest
 *
 * Run: node scripts/generate-llms-txt.mjs
 */

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'content');
const PUBLIC_DIR = join(ROOT, 'public');

const DOMAINS = [
  { dir: 'design-system', title: 'Design System', description: 'Multi-dimensional token model, composition rules, naming conventions, and constraints.' },
  { dir: 'principles', title: 'Principles & Frameworks', description: 'Core principles, the Delivery Framework, synthesis and validation methodology.' },
  { dir: 'claude', title: 'Claude & AI Workflows', description: 'Context engineering, CLAUDE.md playbook, Claude Code setup, workflow architectures, skill-based automation.' },
  { dir: 'platform', title: 'Platform Patterns', description: 'Monorepo architecture, data patterns, auth and RLS, scaffolding-first approach.' },
];

async function findMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await findMdxFiles(full));
    else if (entry.name.endsWith('.mdx')) files.push(full);
  }
  return files.sort();
}

function parseMdx(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"')))
        val = val.slice(1, -1);
      meta[key] = val;
    }
  }
  return { meta, body: match[2].trim() };
}

function fileToUrl(filePath, domainDir) {
  const rel = relative(join(CONTENT_DIR, domainDir), filePath)
    .replace(/\.mdx$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '');
  return `/${domainDir}${rel ? '/' + rel : ''}`;
}

function stripMdx(body) {
  return body
    .replace(/^import\s.*$/gm, '')
    .replace(/<[A-Z][^>]*\/>/g, '')
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  const index = [];
  const full = [];
  let totalPages = 0;

  index.push('# Field Notes', '', '> Design engineering knowledge, distilled.', '');
  index.push('This is a personal knowledge hub covering design systems, engineering principles, AI workflows, and platform architecture patterns.', '');

  full.push('# Field Notes — Full Content', '', '> Design engineering knowledge, distilled.', '');

  for (const domain of DOMAINS) {
    const files = await findMdxFiles(join(CONTENT_DIR, domain.dir));
    totalPages += files.length;

    index.push(`## ${domain.title}`, '', domain.description, '');
    full.push('---', '', `## ${domain.title}`, '', domain.description, '');

    for (const file of files) {
      const { meta, body } = parseMdx(await readFile(file, 'utf-8'));
      const url = fileToUrl(file, domain.dir);
      const title = meta.title || url;
      const desc = meta.description || '';

      index.push(`- [${title}](${url}): ${desc}`);
      full.push(`### ${title}`, '');
      if (desc) full.push(`*${desc}*`, '');
      full.push(stripMdx(body), '');
    }
    index.push('');
  }

  await writeFile(join(PUBLIC_DIR, 'llms.txt'), index.join('\n'));
  await writeFile(join(PUBLIC_DIR, 'llms-full.txt'), full.join('\n'));

  const size = (await readFile(join(PUBLIC_DIR, 'llms-full.txt'), 'utf-8')).length;
  console.log(`✓ llms.txt generated (index)`);
  console.log(`✓ llms-full.txt generated (${Math.round(size / 1024)}KB, ${totalPages} pages)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
