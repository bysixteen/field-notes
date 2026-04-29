# field-notes-toolkit

A Claude plugin sliced from the [bysixteen/field-notes](https://github.com/bysixteen/field-notes) reference repo. This is the *toolkit* half of field-notes (the half consumers *do things with*). The other half — the Fumadocs reference site — stays as a deployed site and is consumed via `llms.txt`.

> **Two artefacts, one repo, two distribution paths.** This plugin makes the toolkit installable. The site makes the reference readable.

## What's in this plugin

### Skills

The 15 design-system skills (`fn-*`), grouped by purpose:

**Specification**
- `fn-design-md` — project tokens + components into the Google `DESIGN.md` spec format (with `--from-dimensional` mode for projecting a Sentiment × Emphasis × Size × Structure × State system into the flat `DESIGN.md` namespace; preservation markers; `migrate` subcommand for legacy files).
- `fn-design` — alias of `fn-design-md`.
- `fn-tokens` — consume, audit, and reason about design tokens.

**Component creation**
- `fn-component-api` — define the input shape (props, types, defaults).
- `fn-component-scaffold` — generate React/CSS/Stories/Tests boilerplate from that API.
- `fn-css` — write and audit component CSS against the token system.
- `fn-html` — element semantics and ARIA.

**Review**
- `fn-review` — orchestrate a six-stage review (component-api, react-patterns, html, accessibility, tokens, css) with a scored report.
- `fn-accessibility` — WCAG 2.2 AA audit.
- `fn-react-patterns` — modern React idioms.
- `fn-testing` — unit + a11y + visual-regression triad.

**Storybook docs**
- `fn-storybook-ds` — orchestrator.
- `fn-storybook-foundations` — primitive docs (colour, type, spacing).
- `fn-storybook-docs` — per-component docs.
- `fn-storybook-helpers` — DocPage, TokenTable, Swatch, etc.

The two workflow skills:

- `start-work` — work brief + branch, no PR.
- `start-issue` — branch + plan + implement + verify + PR for a GitHub issue.

The shared mental-model layer:

- `_foundations/DESIGN-INTENT.md` — what `DESIGN.md` is for.
- `_foundations/DIMENSIONAL-MODEL.md` — the Sentiment × Emphasis × Size × Structure × State vocabulary.
- `_foundations/TOKEN-ARCHITECTURE.md` — the four-layer cascade.
- `_foundations/QUALITY-GATES.md` — severity model and verdict logic.

### Scripts

Pipeline scripts under `scripts/`:

- `generate-ramps.ts` — anchor colour definitions → 12-step OKLCH ramps → CSS custom properties, JSON, Figma variable schemas, DTCG `tokens.json`.
- `figma-pull.sh` / `figma-push.sh` — Prism MCP bridge (WebSocket on `localhost:7890`). Pull retrieves anchor variables out of Figma; push sends generated tokens in.
- `_prism-call.mjs` — internal Prism call helper used by `figma-pull.sh` / `figma-push.sh`.

### Script duplication

These four files currently exist as byte-identical copies in both `scripts/` (repo root) and `field-notes-toolkit/scripts/`:

- `generate-ramps.ts`
- `figma-pull.sh`
- `figma-push.sh`
- `_prism-call.mjs`

Root `scripts/` is canonical: `scripts/pack-plugin.mjs` (lines 45–50) packages these files from root into the plugin artefact, and root `package.json` invokes `tsx scripts/generate-ramps.ts` from root. The toolkit copies are unused duplicates kept temporarily so the working tree matches the historical layout.

The follow-up issue [#188](https://github.com/bysixteen/field-notes/issues/188) will collapse the duplication by deleting the `field-notes-toolkit/scripts/` copies.

## What's *not* in this plugin

The slice is deliberately tight. Excluded:

- The Fumadocs site under `content/` — distributed as a deployed site (`llms.txt` / `llms-full.txt`), not a plugin.
- `DESIGN.md` and `tokens.json` at the field-notes repo root — those are *reference outputs* of the toolkit, not the toolkit itself.
- `scripts/generate-manifest.mjs` and `scripts/generate-llms-txt.mjs` — internal to the field-notes repo's own publishing pipeline.

## Installing

The plugin works two ways:

**As a Claude plugin** (skills + workflows). Until this is published to a marketplace, build the artefact with `node scripts/pack-plugin.mjs` (run from the repo root) and install from the resulting `.plugin` artefact in `dist/`.

**As an npm package** (so the pipeline scripts are reachable from a consumer project's `node_modules/`). Until this is published to npm, link locally:

```sh
# in field-notes-toolkit/
npm link

# in the consumer project
npm link field-notes-toolkit
```

This puts the toolkit at `node_modules/field-notes-toolkit/`, exposing the canonical paths the Phase 3 prompts cite — e.g.:

```sh
node node_modules/field-notes-toolkit/scripts/emit-design-md.mjs --from-dimensional ./ --out ./
```

`scripts/emit-design-md.mjs` is a thin shim that delegates to the canonical CLI inside `skills/fn-design-md/scripts/`.

## Using

After install, every `fn-*` skill, `start-issue`, and `start-work` are available in your Claude session. Reference `_foundations/` from your project's `CLAUDE.md` so the dimensional model and token architecture load as shared context.

## Source

The canonical source for every skill in this plugin is:

```
bysixteen/field-notes  →  field-notes-toolkit/
```

Changes happen there and flow into the plugin via a slice-and-pack step. The originals also live under `.claude/skills/` in the field-notes repo so the field-notes Fumadocs site can use them locally; the plugin path is the distribution copy.

## License

MIT. See repository.
