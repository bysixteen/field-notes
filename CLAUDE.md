# Field Notes

A **multi-domain knowledge hub** built with Fumadocs (MDX + Next.js). Personal design engineering reference.

## Structure

Four independent documentation domains:

| Domain | Route | Content Dir |
|--------|-------|-------------|
| Design System | `/design-system` | `content/design-system/` |
| Principles & Frameworks | `/principles` | `content/principles/` |
| Claude & AI | `/claude` | `content/claude/` |
| Platform Patterns | `/platform` | `content/platform/` |

Each domain has its own source collection in `source.config.ts`, loader in `lib/source.ts`, and route in `app/{domain}/`.

## Commands

- `npm run dev` — start development server
- `npm run build` — static export to `out/` (includes llms.txt generation)
- `npm run generate:llms` — regenerate llms.txt and llms-full.txt only

## Git conventions

- Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- Commits: Conventional Commits — `type(scope): description`

## LLM integration

- `public/llms.txt` — structured index of all pages (auto-generated at build)
- `public/llms-full.txt` — full content dump for one-shot AI ingest (auto-generated)
- Regenerate after content changes: `npm run generate:llms`
- To use Field Notes as context in another project, add to that project's CLAUDE.md:
  `See https://bysixteen.github.io/field-notes/llms-full.txt for design engineering patterns`

## Deployment

- Static site deployed to GitHub Pages via `.github/workflows/deploy.yml`
- Push to `main` triggers build and deploy
- Live at: `https://bysixteen.github.io/field-notes/`

## Content conventions

- All content files are `.mdx` in `content/{domain}/`
- Sidebar navigation via `meta.json` files in each directory
- Lowercase kebab-case filenames
- Cross-reference within a domain using relative links
- Cross-reference across domains using absolute paths (e.g., `/principles/answer-first`)
- All content must be project-agnostic — no specific project names, URLs, or team references

## Adding content

1. Choose the appropriate domain directory under `content/`
2. Create `.mdx` file with `title` and `description` frontmatter
3. Add the filename (without extension) to the directory's `meta.json`
4. Run `npm run generate:llms` to update the LLM-consumable files

## Adding a new domain

1. Add `defineDocs()` in `source.config.ts`
2. Add loader in `lib/source.ts` and to `allSources` array
3. Create `app/{domain}/layout.tsx` and `app/{domain}/[[...slug]]/page.tsx`
4. Add nav link in `lib/layout.shared.tsx`
5. Create `content/{domain}/` with `meta.json` and `index.mdx`
6. Add domain entry to `DOMAINS` array in `scripts/generate-llms-txt.mjs`

## Compounding knowledge

- Content frontmatter requires both `title` and `description` — description powers search and llms.txt
- meta.json separator syntax: `"---Label---"` (three dashes each side)
- Filenames in meta.json are without extension (e.g., `"my-page"` not `"my-page.mdx"`)
- Static export (`output: 'export'`) means no server-side API routes — search uses `staticGET`
