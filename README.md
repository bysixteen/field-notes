```
       ███████ ██ ███████ ██      ██████
       ██      ██ ██      ██      ██   ██
       █████   ██ █████   ██      ██   ██
       ██      ██ ██      ██      ██   ██
       ██      ██ ███████ ███████ ██████

       ██   ██  ██████  ████████ ███████ ███████
       ████  ██ ██    ██    ██    ██      ██
       ██ ██ ██ ██    ██    ██    █████   ███████
       ██  ████ ██    ██    ██    ██           ██
       ██   ███  ██████     ██    ███████ ███████

              Design engineering reference
```

Design engineering knowledge, distilled — and the toolkit that produces it.

> Start with [`INVENTORY.md`](./INVENTORY.md) for a plain-prose orientation map of this repo, the lanefour consumer, and how the two relate.

## Two distribution paths

This repo ships in two shapes. They cover different needs; you usually want both.

| Path | What it is | When to reach for it |
|------|------------|----------------------|
| **`field-notes-toolkit.plugin`** (the plugin) | A Claude Code plugin built from `dist/field-notes-toolkit.plugin`. Bundles the 15 `bs-*` skills, the shared `_foundations/` docs, the `start-issue` / `start-work` workflow skills, and the token-pipeline scripts. | When you're *doing* design-system work — scaffolding a new project, building a component, regenerating tokens, running a review. |
| **The Fumadocs reference site** at [bysixteen.github.io/field-notes](https://bysixteen.github.io/field-notes/) | A static site generated from `content/{domain}/*.mdx`. Agent-consumable via `llms.txt`. | When you're *looking up* a pattern, principle, or rationale — the durable reference an agent reads through `llms.txt`. |

Reach for the plugin to *do*, the site to *look up*.

### For agents

Add this to any project's `CLAUDE.md` so agents can pull patterns on demand:

```markdown
See https://bysixteen.github.io/field-notes/llms.txt for design engineering pattern index
```

Two machine-readable files are generated on every build:

- **`llms.txt`** — structured index of all pages with descriptions (use this one)
- **`llms-full.txt`** — full content dump (avoid — burns ~65K tokens of context)

## What's in the toolkit

The plugin bundles three layers under `.claude/skills/`.

**`_foundations/`** — the shared mental model every `bs-*` skill leans on. Five files: `DESIGN-INTENT.md`, `DIMENSIONAL-MODEL.md` (the Sentiment × Emphasis × Size × Structure × State vocabulary), `TOKEN-ARCHITECTURE.md` (the four-layer cascade), `QUALITY-GATES.md` (severity model and verdict logic), `README.md`. If a skill references "the dimensional model" or "the cascade", it points here.

**`bs-*` skills** — 15 entries (`bs-design` is a one-line redirect stub to `bs-design-md`; functionally 14 distinct skills). Grouped by purpose:

- **Specification.** `bs-design-md` projects tokens + components into the Google `DESIGN.md` spec. `bs-tokens` covers consuming, auditing, and reasoning about design tokens.
- **Bootstrap.** `bs-init` scaffolds a fresh project's canonical context stack (see *Quickstart* below).
- **Component creation.** `bs-component-api` defines the input shape (props, types, defaults). `bs-component-scaffold` generates React/CSS/Stories/Tests boilerplate from that API. `bs-css` audits component CSS against the token system. `bs-html` decides element semantics and ARIA.
- **Review.** `bs-review` orchestrates a six-stage scored review (component-api, react-patterns, html, accessibility, tokens, css). `bs-accessibility` is the WCAG 2.2 AA audit. `bs-react-patterns` reviews modern React idioms. `bs-testing` covers the unit + a11y + visual-regression triad.
- **Storybook docs.** `bs-storybook-ds` orchestrates. `bs-storybook-foundations` documents primitives. `bs-storybook-docs` documents individual components. `bs-storybook-helpers` is the catalogue of helper components (DocPage, TokenTable, Swatch, etc.).

**Workflow skills.** `start-issue` (branch + plan + implement + verify + PR for a GitHub issue) and `start-work` (work brief + branch, no PR).

**Token-pipeline scripts** under `scripts/`:

- `generate-ramps.ts` — the token producer. Anchor colours → 12-step OKLCH ramps → CSS custom properties, JSON, Figma variable schemas, and DTCG `tokens.json` at repo root.
- `generate-manifest.mjs` — the orchestrator. Calls `generate-ramps.ts`, then the `bs-design-md` emitter, then the lint. This is the closed regenerate loop.
- `figma-push.sh` / `figma-pull.sh` — one-way Figma sync via the Prism MCP bridge (`ws://localhost:7890`). Push sends generated tokens into Figma; pull retrieves anchor variables out.
- `generate-llms-txt.mjs` — produces `llms.txt` and `llms-full.txt` from MDX content.
- `pack-plugin.mjs` — builds the plugin artefact at `dist/field-notes-toolkit.plugin`.

## Quickstart for a new project

```sh
node .claude/skills/bs-init/scripts/init.mjs --name <project-name> --target <dir>
```

`bs-init` scaffolds the canonical four-piece context stack a downstream project needs to consume `bs-design-md --from-dimensional`:

| Artefact | Purpose |
|----------|---------|
| `tokens.json` | DTCG 2025.10 token source. Six placeholder anchor colours (primary, neutral, warning, danger, positive, on-primary). Replace with real values. |
| `components.json` | Five canonical primitives (`button`, `input`, `badge`, `alert`, `card`) declared with `applies_to: all`, so every dimensional combination expands. |
| `content/design-system/model/{sentiment,emphasis,size,state,structure}.mdx` | The five-dimensional vocabulary, each with a `dimensional_values: { default, values }` frontmatter block. `structure.mdx` carries `informational: true` so its values don't appear in variant names. |
| `CLAUDE.md` | Starter system-prompt pointing at the field-notes toolkit, the four-layer context stack, and `llms.txt`. |
| `DESIGN.md` | Empty preservation markers in place (`<!-- bs-design-md:generated:start -->` … `<!-- bs-design-md:generated:end -->`) so the first `bs-design-md` run fills the generated portion and any prose written after the `:end` marker survives regenerations. |

Round-trip: after `bs-init`, run `bs-design-md --from-dimensional <root>` against the same directory and the scaffold immediately produces a valid `DESIGN.md`. Replace placeholder anchor colours, prose, and the model-MDX value lists with the real vocabulary before treating the scaffold as canonical.

## Closing the design loop

`bs-design-md` has three modes; the new one is the closer:

- **Extract mode** — point at a live site URL, get a `DESIGN.md` plus DTCG `tokens.json` sidecar. Bootstraps a new product from a reference.
- **Project mode** (`--tokens` + `--components`) — take an existing DTCG `tokens.json` plus a hand-authored `components.json`, emit the spec-compliant pair.
- **Dimensional mode** (`--from-dimensional <root>`) — walk the consumer's `tokens.json`, `components.json` (with `applies_to`), and the five model MDX files, then synthesise the flat per-variant components block via the cap policy in `references/dimensional-mapping.md`. Variant names drop any segment that equals its dimension's `default` — so `(neutral, high, md, rest)` becomes `button`, and `(warning, high, md, rest)` becomes `button-warning`.

### Preservation markers

Outputs from any mode wrap the generated prose in stable HTML-comment markers so consumer-authored sections survive regeneration:

```
---
<frontmatter>           <- replaced wholesale on every emit
---

<!-- bs-design-md:generated:start -->
## Overview
... generated prose ...
## Do's and Don'ts
<!-- bs-design-md:generated:end -->

## Identity              <- consumer-authored prose lives below :end
## Aesthetic direction
```

Two rules govern the markers:

- **Prose-only preservation** — anything below `<!-- bs-design-md:generated:end -->` is preserved verbatim across regenerations. Use this region for project-specific narrative (Identity, Aesthetic direction, Surfaces, etc.).
- **Frontmatter is wholesale-replaced** — the YAML at the top is re-derived on every emit. Hand-edits to keys *inside* will be overwritten without warning. Project metadata that must survive goes in a `## Metadata` (or any name) section below `:end`.

### `migrate` — one-time legacy adoption

For a project with a hand-authored `DESIGN.md` (no markers), run once:

```sh
node scripts/emit-design-md.mjs migrate --in DESIGN.md
```

For each `## ` heading the runner prompts `[g]enerated / [p]reserved / [s]kip-skill`. Boilerplate (`## Overview`, `## Colors`, `## Typography`, `## Spacing`, `## Components`, `## Do's and Don'ts`) defaults to `g`; everything else defaults to `p`. After migrate, regular emits merge into the markered file and preserve everything below `:end`. Idempotent — running it again on a markered file is a no-op.

### Tier-aware loading (the Token Trap)

The toolkit treats the design system as three tiers so agents don't load the whole token universe on every prompt:

- **Tier 1 — `/DESIGN.md`** — compact, always-loaded system prompt.
- **Tier 2 — `/.context/INDEX.md`** — routing map; load on demand.
- **Tier 3 — `/tokens.json`** — full DTCG; query specific tokens, never load whole.

Regenerate the manifest only when the design system changes (`npm run generate:manifest`). Full rationale in [`content/design-system/manifest-architecture.mdx`](./content/design-system/manifest-architecture.mdx).

## Domains (the Fumadocs reference site)

| Domain | Route | Description | Pages |
|--------|-------|-------------|-------|
| Design System | `/design-system` | Token model, composition rules, naming conventions, constraints | 49 |
| Principles | `/principles` | Core principles, synthesis & validation, journey mapping | 8 |
| Claude & AI | `/claude` | Context engineering, CLAUDE.md playbook, workflow architectures | 10 |
| Platform | `/platform` | Architecture patterns, monorepo structure, data and auth | 12 |

## Build & generate commands

```bash
npm run dev                # Start development server
npm run build              # Static export to out/ (includes llms.txt generation)
npm run generate:llms      # Regenerate llms.txt and llms-full.txt only
npm run generate:ramps     # Regenerate colour ramps and tokens.json
npm run generate:manifest  # Regenerate DESIGN.md and tokens.json (the Token Trap manifest)
```

## Live site

[bysixteen.github.io/field-notes](https://bysixteen.github.io/field-notes/) — deployed to GitHub Pages on every push to `main`.

## Acknowledgements

Field Notes builds on work from many people, projects, and design systems. See [`ATTRIBUTION.md`](./ATTRIBUTION.md) for the canonical credits log — the file other bysixteen repos link back to.

## Contributing

- Content lives in `content/{domain}/` as `.mdx` files
- Every page needs `title` and `description` frontmatter
- Add filenames (without extension) to the directory's `meta.json`
- Lowercase kebab-case filenames, project-agnostic content only
- Run `npm run generate:llms` after content changes
