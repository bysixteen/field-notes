# Inventory

> Last verified: 2026-04-27. Worktree mtimes and version numbers go stale fast — re-check the bullets in *What's stale or unclear* before trusting them.

A plain-prose map of what you've built across the field-notes and lanefour workspaces. Read once, refer back. Anything I describe here exists today; anything I leave out either doesn't exist or wasn't surfaced by my sweep.

---

## The repo and its worktrees

**field-notes** is your reference project — a knowledge base and a toolkit of skills. The live worktree is whichever Conductor session spawned this checkout — identify via `pwd`. Older worktrees in the workspace folder are dead; ignore them. (Canonical-worktree pointer was retired 2026-04-28; live-by-current-cwd is the rule.) `karachi-v1/` is the archived predecessor that lives alongside it; it has its own git history and its own skill copies, plus evaluation workspaces (`bs-storybook-docs-workspace`, `bs-tokens-workspace`) used to benchmark the skills before they were promoted forward. Treat karachi-v1 as a museum: useful for tracing how things evolved, not where to make changes.

**Worktree convention.** Conductor creates a fresh worktree per task; the live one is whichever Conductor session spawned the current checkout (identify via `pwd`). Older worktrees move to `/Users/danielcork/conductor/archived-contexts/field-notes/<name>/` once their work has merged — those archived directories preserve the worktree's `.context/` state but not the full source tree. When auditing field-notes, work from the cwd; treat anything in `archived-contexts/` as historical reference only.

**lanefour** is the Bolton Metro Swimming Club management platform — your actual product. It's a pnpm + Turborepo monorepo with four apps (admin portal, public site, Fumadocs wiki, marketing site) and seven packages (`design-system`, `auth`, `config`, `pipeline`, `results`, `gocardless`, `email-templates`). Tech stack: Next.js 15, React 19, Supabase, Radix Primitives + Pattern A CSS. Current focus per MASTER_PLAN.md (v6) is Phase 2 — Core Data and Meet Management.

**Important wrinkle.** lanefour has *six* git worktrees in the same workspace folder: `gwangju-v3`, `charlotte-v1`, `rio-de-janeiro-v2`, `dallas-v3`, `calgary-v1`, `cody`. They are all clones of the same upstream repo at different points in time. The "latest" worktree changes as you work — by mtime as of 2026-04-27, that's **`calgary-v1`** (last touched 15:58), with `cody`, `dallas-v3`, and `charlotte-v1` close behind, and `gwangju-v3` and `rio-de-janeiro-v2` days older. Earlier conversations referenced `charlotte-v1` and then `gwangju-v3` as the consumer for the bs-design-md work; those names now refer to stale worktrees, not the live project. When you do real work, do it in whichever worktree has the freshest commits. The others are noise.

---

## field-notes: the skills (your toolkit)

Skills live under `kigali-v2/.claude/skills/`. There are three layers:

The **`_foundations/` layer** is the shared mental model every other skill leans on. Five files: `DESIGN-INTENT.md` (what `DESIGN.md` is for), `DIMENSIONAL-MODEL.md` (the Sentiment × Emphasis × Size × Structure × State vocabulary), `TOKEN-ARCHITECTURE.md` (the four-layer cascade), `QUALITY-GATES.md` (severity model and verdict logic), `README.md`. If a skill references "the dimensional model" or "the cascade", it's pointing here.

The **`bs-*` skills** are the design-system toolkit, all project-agnostic, all consumed by lanefour or any future consumer via that consumer's `CLAUDE.md`. Grouped by purpose:

*Specification.* `bs-design-md` projects tokens + components into the Google `DESIGN.md` spec format (the skill we've been planning around — currently fully working in `--tokens`/`--components` mode; `--from-dimensional` is the open work). `bs-tokens` covers everything to do with consuming, auditing, and reasoning about design tokens.

*Component creation.* `bs-component-api` defines the input shape (props, types, defaults). `bs-component-scaffold` generates the actual React/CSS/Stories/Tests boilerplate from that API. `bs-css` covers writing and auditing component CSS against the token system. `bs-html` decides element semantics and ARIA.

*Review.* `bs-review` orchestrates a six-stage review (component-api, react-patterns, html, accessibility, tokens, css) and produces a scored report. `bs-accessibility` is the WCAG 2.2 AA audit. `bs-react-patterns` reviews modern React idioms. `bs-testing` covers the unit + a11y + visual-regression test triad.

*Storybook docs.* `bs-storybook-ds` is the orchestrator. `bs-storybook-foundations` documents primitives (colour, type, spacing). `bs-storybook-docs` documents individual components. `bs-storybook-helpers` is the catalogue of helper components (DocPage, TokenTable, Swatch, etc.) used to build those pages.

The **workflow skills** are `start-work` (work brief + branch, no PR) and `start-issue` (branch + plan + implement + verify + PR for a GitHub issue).

---

## field-notes: the pipelines

Several scripts under `kigali-v2/scripts/` that matter:

`generate-ramps.ts` is the token producer. It takes anchor colour definitions and produces complete 12-step OKLCH ramps, then emits CSS custom properties, JSON, Figma variable schemas, and a DTCG `tokens.json` at the repo root.

`generate-manifest.mjs` is the orchestrator that wraps everything. It calls `generate-ramps.ts` to produce `tokens.json`, then calls `bs-design-md`'s emitter to produce `DESIGN.md`, then runs the lint. This is the closed loop for field-notes itself. Today it requires a hand-authored `components.json`; the bs-design-md `--from-dimensional` work would replace that requirement.

`figma-push.sh` / `figma-pull.sh` connect to Prism (a Figma MCP bridge running on `ws://localhost:7890`). Push sends generated tokens into Figma; pull retrieves anchor variables out of Figma. Prerequisite: Prism MCP running and `.mcp.json` configured. This is the Figma sync layer.

`generate-llms-txt.mjs` produces `llms.txt` and `llms-full.txt` from MDX content — agent-readable indexes of the docs site.

---

## field-notes: the docs site

`kigali-v2/` is itself a Fumadocs (MDX + Next.js 15) site. Four content domains, each with its own meta.json:

*design-system/* — 40+ pages on the dimensional model, token architecture, component APIs, CSS/HTML rules, accessibility, testing, Figma sync, Storybook documentation, composition patterns. This is the bulk.

*claude/* — 10+ pages on agent efficiency, context engineering, Claude Code setup, skills patterns, validation workflows.

*platform/* — Architecture, data, auth/RLS, monorepo patterns, stack decisions, ADR template.

*principles/* — Design philosophy: answer-first, compounding engineering, dissent-as-feature, journey templates, project checklists.

`DESIGN.md` lives at the kigali-v2 root — Google design.md format, alpha version, sections Overview / Colors / Typography / Components / Do's and Don'ts. `tokens.json` is DTCG 2025.10 with light + dark modes via extensions.

`.context/` exists with `INDEX.md` (the routing map) and `README.md` (the three-tier convention). `notes.md` and `todos.md` are empty. There is no `.context/plans/` directory.

---

## lanefour: the project

The live worktree (currently `calgary-v1/`) contains the canonical `CLAUDE.md`, `MASTER_PLAN.md` (under `docs/plans/`, v6), `DESIGN.md` (354 lines, no preservation markers — this is the file the bs-design-md plan is designed to migrate), `CHANGELOG.md`, `AGENTS.md`.

The **design system package** is at `packages/design-system/`. It contains `tokens.json` (DTCG, generated locally by `scripts/emit-tokens.mjs` from CSS source), CSS source under `src/tokens/` (`primitives.css`, `semantics.css`, plus `base`, `fonts`, `layers`, `responsive`, `index`), and a working Storybook v8 setup with a11y and docs addons. Token generation is local to lanefour — it does **not** use field-notes' `generate-ramps.ts`.

The **lanefour skills** under `.claude/skills/` are *different* from the field-notes bs-* set — they're project-specific helpers, not the design-system toolkit. The notable ones: `add-component` (scaffold a component using Pattern A CSS and the five-dimensional API), `component-api` (Pattern A reference), `token-guide` (the two-track architecture: Colour Cascade + Structural Independence), `rams` (the design-review skill that gives WCAG-tagged findings), `pr` / `commit` / `changelog` / `adr` / `plan-complete` (workflow), `migrate-doc` (convert .docx to MDX wiki content), `swimming-context` (Bolton Metro domain knowledge — squads, fees, coaches, GoCardless flow), `email-tone` (British English email voice). Plus ~19 slash-commands under `.claude/commands/` for repeated workflows (sprint creation, email templates, onboarding flows).

`.claude/agents/` has `designer.md` and `developer.md`. `.claude/rules/` has `british-english.md`, `git-workflow.md`, `known-gotchas.md`. `.claude/hooks/block-dangerous.sh` is the safety check.

**Plans in flight** under `.context/plans/`: two intake plans, both about consuming a Claude Design session handoff into Bolton Metro. Both exploratory, neither has completion markers. `notes.md` and `todos.md` are empty.

`apps/wiki/` is a working Fumadocs site, ready for knowledge-base content but mostly empty. Status, owners, and priorities are tracked in **GitHub Projects v2 on `bysixteen/bolton-metro`** — not in repo files.

---

## How field-notes and lanefour relate

field-notes produces *the toolkit*. lanefour *uses* the toolkit. The connection is one-way: lanefour's `CLAUDE.md` references the bs-* skills as installed dependencies (via the field-notes path); changes to the skills happen in field-notes and propagate when lanefour pulls.

`bs-design-md` is the bridge artefact. Today lanefour's `DESIGN.md` is hand-authored and out of sync with its `tokens.json`. The #131 work in field-notes is what makes the regenerate step trustworthy. After that PR lands and lanefour wires `tokens:emit:design`, the design-system loop closes.

---

## Quick "where do I find X"

> Paths use `field-notes/kigali-v2/...` and `lanefour/<live worktree>/...`. The live lanefour worktree as of writing is `calgary-v1` — substitute whichever has the freshest commits when you read this.

The dimensional model: `field-notes/kigali-v2/.claude/skills/_foundations/DIMENSIONAL-MODEL.md`.

How tokens cascade: `field-notes/kigali-v2/.claude/skills/_foundations/TOKEN-ARCHITECTURE.md` (line 48 has the canonical chain).

How `DESIGN.md` should be shaped: `field-notes/kigali-v2/DESIGN.md` (the reference) and `field-notes/kigali-v2/.claude/skills/bs-design-md/SKILL.md` (the contract).

How a component is scaffolded in lanefour: `lanefour/<live worktree>/.claude/skills/add-component/SKILL.md`.

The current lanefour priority and shape: `lanefour/<live worktree>/docs/plans/MASTER_PLAN.md`.

Status of work in flight: GitHub Projects v2 board (`bysixteen/bolton-metro`) for lanefour, GitHub Issues (`bysixteen/field-notes`) for the toolkit.

What "the design loop" should look like end-to-end: `lanefour/<live worktree>/.context/plans/consume-claude-design-handoff-into-the-bolton-metr.md` is the most recent articulation.

---

## What's stale or unclear

`karachi-v1` is archived; nothing should be edited there. The other-than-current lanefour worktrees are stale once a newer one exists; consider whether you want to keep all six or prune to one or two. Six worktrees of the same repo in one folder is a strong cause of "wait, which version am I in?" confusion — this is probably one source of the disorientation.

field-notes keeps the live Conductor worktree under `workspaces/` plus `karachi-v1` (museum). Older workspace worktrees (e.g. `san-juan-v1`) are dead — ignore them. Archived worktrees (`tacoma-v2`, `addis-ababa`, `kigali-v2`, etc.) live under `archived-contexts/field-notes/`. The live-by-cwd rule above is the canonical resolution to "which version am I in?".

Empty `.context/notes.md` and `.context/todos.md` files in both repos suggest a convention that was set up but never adopted. Either start using them or delete them so they stop showing up as "things I should be writing in".

The two `consume-claude-design-handoff-*` plans in lanefour are both intake-phase, both undated as complete, and one is a near-duplicate of the other. Worth a five-minute pass to consolidate or close one out.

---

## What I'd do with this

You said the goal is to direct Claude to build the right thing without it going off course. The single biggest help here isn't a new system — it's the existence of this file. When you start a session, point Claude at this `INVENTORY.md` first, then the specific plan or skill you're working on. That gives the model the same map you have, which is the cheapest hallucination-prevention available.

Two concrete suggestions: prune the lanefour worktrees down to one or two so "go to lanefour" is unambiguous; and put a one-line pointer to this file at the top of both repos' `CLAUDE.md` so any future session loads it before doing anything else. (Field-notes' `CLAUDE.md` already has the pointer as of 2026-04-27; lanefour's still doesn't.)
