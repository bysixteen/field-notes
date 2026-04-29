# Inventory

> Last verified: 2026-04-27. Worktree mtimes and version numbers go stale fast — re-check the bullets in *What's stale or unclear* before trusting them.

A plain-prose map of what you've built across the field-notes workspace. Read once, refer back. Anything I describe here exists today; anything I leave out either doesn't exist or wasn't surfaced by my sweep.

---

## The repo and its worktrees

**field-notes** is your reference project — a project-agnostic knowledge base and a toolkit of skills. The live worktree is whichever Conductor session spawned this checkout — identify via `pwd`. Older worktrees in the workspace folder are dead; ignore them. (Canonical-worktree pointer was retired 2026-04-28; live-by-current-cwd is the rule.) `karachi-v1/` is the archived predecessor that lives alongside it; it has its own git history and its own skill copies, plus evaluation workspaces (`fn-storybook-docs-workspace`, `fn-tokens-workspace`) used to benchmark the skills before they were promoted forward. Treat karachi-v1 as a museum: useful for tracing how things evolved, not where to make changes.

**Worktree convention.** Conductor creates a fresh worktree per task; the live one is whichever Conductor session spawned the current checkout (identify via `pwd`). Older worktrees move to `/Users/danielcork/conductor/archived-contexts/field-notes/<name>/` once their work has merged — those archived directories preserve the worktree's `.context/` state but not the full source tree. When auditing field-notes, work from the cwd; treat anything in `archived-contexts/` as historical reference only.

---

## field-notes: the skills (your toolkit)

Skills live under `.claude/skills/`. There are three layers:

The **`_foundations/` layer** is the shared mental model every other skill leans on. Five files: `DESIGN-INTENT.md` (what `DESIGN.md` is for), `DIMENSIONAL-MODEL.md` (the Sentiment × Emphasis × Size × Structure × State vocabulary), `TOKEN-ARCHITECTURE.md` (the four-layer cascade), `QUALITY-GATES.md` (severity model and verdict logic), `README.md`. If a skill references "the dimensional model" or "the cascade", it's pointing here.

The **`fn-*` skills** are the design-system toolkit, all project-agnostic, all consumed by consumer projects via that consumer's `CLAUDE.md`. Grouped by purpose:

*Specification.* `fn-design-md` projects tokens + components into the Google `DESIGN.md` spec format (the skill we've been planning around — currently fully working in `--tokens`/`--components` mode; `--from-dimensional` is the open work). `fn-tokens` covers everything to do with consuming, auditing, and reasoning about design tokens.

*Component creation.* `fn-component-api` defines the input shape (props, types, defaults). `fn-component-scaffold` generates the actual React/CSS/Stories/Tests boilerplate from that API. `fn-css` covers writing and auditing component CSS against the token system. `fn-html` decides element semantics and ARIA.

*Review.* `fn-review` orchestrates a six-stage review (component-api, react-patterns, html, accessibility, tokens, css) and produces a scored report. `fn-accessibility` is the WCAG 2.2 AA audit. `fn-react-patterns` reviews modern React idioms. `fn-testing` covers the unit + a11y + visual-regression test triad.

*Storybook docs.* `fn-storybook-ds` is the orchestrator. `fn-storybook-foundations` documents primitives (colour, type, spacing). `fn-storybook-docs` documents individual components. `fn-storybook-helpers` is the catalogue of helper components (DocPage, TokenTable, Swatch, etc.) used to build those pages.

The **workflow skills** are `start-work` (work brief + branch, no PR) and `start-issue` (branch + plan + implement + verify + PR for a GitHub issue).

---

## field-notes: the pipelines

Several scripts under `scripts/` that matter:

`generate-ramps.ts` is the token producer. It takes anchor colour definitions and produces complete 12-step OKLCH ramps, then emits CSS custom properties, JSON, Figma variable schemas, and a DTCG `tokens.json` at the repo root.

`generate-manifest.mjs` is the orchestrator that wraps everything. It calls `generate-ramps.ts` to produce `tokens.json`, then calls `fn-design-md`'s emitter to produce `DESIGN.md`, then runs the lint. This is the closed loop for field-notes itself. Today it requires a hand-authored `components.json`; the fn-design-md `--from-dimensional` work would replace that requirement.

`figma-push.sh` / `figma-pull.sh` connect to Prism (a Figma MCP bridge running on `ws://localhost:7890`). Push sends generated tokens into Figma; pull retrieves anchor variables out of Figma. Prerequisite: Prism MCP running and `.mcp.json` configured. This is the Figma sync layer.

`generate-llms-txt.mjs` produces `llms.txt` and `llms-full.txt` from MDX content — agent-readable indexes of the docs site.

---

## field-notes: the docs site

The repo is itself a Fumadocs (MDX + Next.js 15) site. Four content domains, each with its own meta.json:

*design-system/* — 40+ pages on the dimensional model, token architecture, component APIs, CSS/HTML rules, accessibility, testing, Figma sync, Storybook documentation, composition patterns. This is the bulk.

*claude/* — 10+ pages on agent efficiency, context engineering, Claude Code setup, skills patterns, validation workflows.

*platform/* — Architecture, data, auth/RLS, monorepo patterns, stack decisions, ADR template.

*principles/* — Design philosophy: answer-first, compounding engineering, dissent-as-feature, journey templates, project checklists.

`DESIGN.md` lives at the repo root — Google design.md format, alpha version, sections Overview / Colors / Typography / Components / Do's and Don'ts. `tokens.json` is DTCG 2025.10 with light + dark modes via extensions.

`.context/` exists with `INDEX.md` (the routing map) and `README.md` (the three-tier convention). `notes.md` and `todos.md` are empty. There is no `.context/plans/` directory.

---

## How consumer projects use the toolkit

field-notes produces *the toolkit*. Consumer projects *use* the toolkit. The connection is one-way: a consumer's `CLAUDE.md` references the fn-* skills as installed dependencies (via the field-notes path); changes to the skills happen in field-notes and propagate when the consumer pulls.

`fn-design-md` is the bridge artefact. When a consumer wires `tokens:emit:design` to invoke the skill, the design-system loop closes, ensuring the consumer's `DESIGN.md` stays in sync with its `tokens.json`.

---

## Quick "where do I find X"

The dimensional model: `.claude/skills/_foundations/DIMENSIONAL-MODEL.md`.

How tokens cascade: `.claude/skills/_foundations/TOKEN-ARCHITECTURE.md` (line 48 has the canonical chain).

How `DESIGN.md` should be shaped: `DESIGN.md` (the reference) and `.claude/skills/fn-design-md/SKILL.md` (the contract).

Status of work in flight: GitHub Issues (`bysixteen/field-notes`) for the toolkit.

---

## What's stale or unclear

`karachi-v1` is archived; nothing should be edited there.

field-notes keeps the live Conductor worktree under `workspaces/` plus `karachi-v1` (museum). Older workspace worktrees (e.g. `san-juan-v1`) are dead — ignore them. Archived worktrees (`tacoma-v2`, `addis-ababa`, `kigali-v2`, etc.) live under `archived-contexts/field-notes/`. The live-by-cwd rule above is the canonical resolution to "which version am I in?".

Empty `.context/notes.md` and `.context/todos.md` files in the repo suggest a convention that was set up but never adopted. Either start using them or delete them so they stop showing up as "things I should be writing in".

---

## What I'd do with this

You said the goal is to direct Claude to build the right thing without it going off course. The single biggest help here isn't a new system — it's the existence of this file. When you start a session, point Claude at this `INVENTORY.md` first, then the specific plan or skill you're working on. That gives the model the same map you have, which is the cheapest hallucination-prevention available.
