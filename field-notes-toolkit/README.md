# field-notes-toolkit

A Claude plugin sliced from the [bysixteen/field-notes](https://github.com/bysixteen/field-notes) reference repo. This is the *toolkit* half of field-notes (the half consumers *do things with*). The other half — the Fumadocs reference site — stays as a deployed site and is consumed via `llms.txt`.

> **Two artefacts, one repo, two distribution paths.** This plugin makes the toolkit installable. The site makes the reference readable.

## What's in this plugin

### Skills

The 15 design-system skills (`bs-*`), grouped by purpose:

**Specification**
- `bs-design-md` — project tokens + components into the Google `DESIGN.md` spec format (with `--from-dimensional` mode for projecting a Sentiment × Emphasis × Size × Structure × State system into the flat `DESIGN.md` namespace; preservation markers; `migrate` subcommand for legacy files).
- `bs-design` — alias of `bs-design-md`.
- `bs-tokens` — consume, audit, and reason about design tokens.

**Component creation**
- `bs-component-api` — define the input shape (props, types, defaults).
- `bs-component-scaffold` — generate React/CSS/Stories/Tests boilerplate from that API.
- `bs-css` — write and audit component CSS against the token system.
- `bs-html` — element semantics and ARIA.

**Review**
- `bs-review` — orchestrate a six-stage review (component-api, react-patterns, html, accessibility, tokens, css) with a scored report.
- `bs-accessibility` — WCAG 2.2 AA audit.
- `bs-react-patterns` — modern React idioms.
- `bs-testing` — unit + a11y + visual-regression triad.

**Storybook docs**
- `bs-storybook-ds` — orchestrator.
- `bs-storybook-foundations` — primitive docs (colour, type, spacing).
- `bs-storybook-docs` — per-component docs.
- `bs-storybook-helpers` — DocPage, TokenTable, Swatch, etc.

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

## What's *not* in this plugin

The slice is deliberately tight. Excluded:

- The Fumadocs site under `content/` — distributed as a deployed site (`llms.txt` / `llms-full.txt`), not a plugin.
- `DESIGN.md` and `tokens.json` at the field-notes repo root — those are *reference outputs* of the toolkit, not the toolkit itself.
- `scripts/generate-manifest.mjs` and `scripts/generate-llms-txt.mjs` — internal to the field-notes repo's own publishing pipeline.

## Installing

The plugin works two ways:

**As a Claude plugin** (skills + workflows). Until this is published to a marketplace, install from the packed `.plugin` artefact at `/Users/danielcork/conductor/workspaces/field-notes/dist/field-notes-toolkit.plugin`.

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

`scripts/emit-design-md.mjs` is a thin shim that delegates to the canonical CLI inside `skills/bs-design-md/scripts/`.

## Using

After install, every `bs-*` skill, `start-issue`, and `start-work` are available in your Claude session. Reference `_foundations/` from your project's `CLAUDE.md` so the dimensional model and token architecture load as shared context.

## Source

The canonical source for every skill in this plugin is:

```
bysixteen/field-notes  →  field-notes-toolkit/
```

Changes happen there and flow into the plugin via a slice-and-pack step. The originals also live under `.claude/skills/` in the field-notes repo so the field-notes Fumadocs site can use them locally; the plugin path is the distribution copy.

## License

MIT. See repository.
