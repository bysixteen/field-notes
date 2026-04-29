# Field Notes

Multi-domain knowledge hub built with Fumadocs (MDX + Next.js).

> **Start here:** read `/INVENTORY.md` for a map of this repo and how the toolkit is structured.

## Commands

- `npm run dev` — start development server
- `npm run build` — static export to `out/` (includes llms.txt generation)
- `npm run generate:llms` — regenerate llms.txt and llms-full.txt only
- `npm run generate:ramps` — regenerate colour ramps and `/tokens.json`
- `npm run generate:manifest` — regenerate `/DESIGN.md` and `/tokens.json` (Token Trap manifest); run only when the design system changes

## Tiered design-system context (Token Trap)

The design system is loaded in tiers to avoid loading the whole token system on every prompt. Read `content/design-system/manifest-architecture.mdx` for the full rationale.

- **Tier 1 — `/DESIGN.md`** — compact, always-loaded system prompt.
- **Tier 2 — `/.context/INDEX.md`** — routing map; load on demand.
- **Tier 3 — `/tokens.json`** (or Prism `scan_tokens` with a filter) — full DTCG; query specific tokens, never load whole.

Skills enforce this discipline (`bs-tokens`, `bs-design-md`, `.claude/rules/prism-mcp.md`). Do not dump the token system into context.

## Structure

Four domains: `design-system`, `principles`, `claude`, `platform`. Each has its own source in `source.config.ts`, loader in `lib/source.ts`, and route in `app/{domain}/`.

## Git

- Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- Commits: Conventional Commits — `type(scope): description`

## Content

- All `.mdx` files in `content/{domain}/`, lowercase kebab-case
- Frontmatter requires `title` and `description`
- Add filenames (without extension) to directory's `meta.json`
- All content must be project-agnostic
- Run `npm run generate:llms` after content changes

## Deployment

Static site on GitHub Pages. Push to `main` triggers deploy.
Live at: `https://bysixteen.github.io/field-notes/`

## Orchestration docs (workspace-level, not tracked here)

ROADMAP.md, FIX-MISSING-ELEMENTS.md, PHASE-6-EXECUTION-CONTRACTS.md
live one level above this worktree (workspace parent), NOT in this repo.
Intentional — orchestration scratch that evolves fast, doesn't need team consensus.
If a prompt references one of these and the path isn't in your worktree,
look at the workspace parent.
