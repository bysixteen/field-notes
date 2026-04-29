# Architecture and next steps — field-notes

A consolidated plan for the next phase of field-notes. Captures the architectural vision (the three-file stack, with per-component sidecars), the changes we want to make (bs→fn rename, the `fn-component-contract` skill, updated `fn-init` UX), and the open questions where Claude Code's input remains useful.

This is the orchestration doc — workspace-level, not tracked. ROADMAP.md, INVENTORY.md, FIX-MISSING-ELEMENTS.md, PHASE-6-EXECUTION-CONTRACTS.md are siblings.

> **Status:** Aligned 2026-04-29 with the canonical contract shape ratified in #166 (`content/design-system/tools/component-schema.mdx`) and the architecture review in #172. Supersedes the 2026-04-28 draft's two-file split and `fn-contract` proposal.

> **Canonical reference:** the per-component contract schema lives at [`content/design-system/tools/component-schema.mdx`](content/design-system/tools/component-schema.mdx). This document mirrors that shape; if the two ever drift, component-schema.mdx wins.

---

## Pipeline diagram (structured for tool use)

Canonical machine-readable description for `generate_diagram` and the FigJam build. The prose flow in "## The flow — top to bottom" is the human version of the same thing.

### Nodes

| ID | Type | Label | Status |
|---|---|---|---|
| user-intent | artifact | User intent (anchor colors, dimensional axes) | exists |
| fn-init | skill | `fn-init <project> <dir>` | revise |
| seed-files | artifact | Seed files (tokens.json, dimensional MDX, components.json index, DESIGN.md placeholder, CLAUDE.md) | exists |
| user-refine | skill | User defines real values | human action |
| fn-design-md | skill | `fn-design-md --from-dimensional` | exists |
| design-md | artifact | `DESIGN.md` — system prompt (~5.6KB) | exists |
| fn-component-contract | skill | `fn-component-contract <primitive>` | new |
| component-contract | artifact | `<Component>.contract.md` — per-component sidecar colocated with `.tsx` | new |
| fn-component-scaffold | skill | `fn-component-scaffold <primitive>` | exists |
| component-code | artifact | Component code (.tsx + .css + .test + .stories) | exists |

### Edges

Main pipeline:
`user-intent → fn-init → seed-files → user-refine → fn-design-md → design-md → fn-component-contract → component-contract → fn-component-scaffold → component-code`

Cross-stage (consumed as input):
- `design-md ⇢ fn-component-contract`
- `design-md ⇢ fn-component-scaffold`
- `component-contract ⇢ fn-component-scaffold`

### Annotation

- `user-refine` connects to Prism MCP at `ws://localhost:7890` ↔ Figma anchor variables.
- `fn-init`'s status is `revise`: today it copies templates only; the proposed inline `generate-ramps.ts` invocation and interactive anchor-color prompts are tracked in #171.

### Status legend

- **exists** — exists today (default; unmarked in change-focused renders)
- **new** — doesn't exist yet
- **revise** — exists but needs rework
- **human action** — not a skill invocation

---

## Where we are

Field-notes Phase 1–5 closed cleanly via the seven-session FIX-MISSING-ELEMENTS arc. Audit gate (PR #154) confirmed all expected flips. Five issues remain open, all defer-labelled — the queue is parked.

Phase 6 is reframed (see PHASE-6-EXECUTION-CONTRACTS.md). The foundation-defaults file and embedded `behaviorContract` are not built; the execution-rules vocabulary becomes an optional per-component sidecar section when real drift surfaces.

The toolkit is stable but hasn't been battle-tested with a second consumer beyond lanefour. The journey leg articulated weeks ago — *field-notes as project-agnostic reference, then integrate Bolton Metro* — is the next genuine test.

---

## The architectural vision — three-file stack

Each file has one job, one source of generation, one reason to exist.

### `DESIGN.md` — system prompt

Always-loaded compact reference. The everyday answer to "what's the primary color, what dimensions matter, what primitives exist."

- **Format:** plain markdown; ~5.6KB; LLM-friendly
- **Contains:** semantic token map (color/typography/spacing/radius), the dimensional axes (Sentiment × Emphasis × Size × Structure × State), the canonical primitives list
- **Generated from:** `tokens.json` + `components.json` + dimensional MDX, via `bs-design-md --from-dimensional` (existing)
- **Status:** in production; field-notes ships this today

### `components.json` — primitive index

A thin index of which primitives the system carries. Machine-read first, hand-edited when adding or removing primitives.

- **Format:** JSON
- **Contains:** primitives list and the path to each primitive's contract sidecar
- **Generated from:** `bs-init` seeds placeholders; `bs-component-scaffold` updates when adding new primitives; humans hand-edit for project-specific wiring
- **Status:** the live shape today is a flat token-slot map (6 entries, 3 of which are pseudo-primitive state variants of button — `button-hover`, `button-active`, `button-disabled`). It does not carry `applies_to` and does not carry `behaviorContract`. Reconciling to a thin primitive index — and stripping the token-slot wiring that belongs in DESIGN.md or per-component contracts — is tracked in #170.
- **Note:** name stays plural — it's the index of all components; the per-component file (singular) is `<Component>.contract.md`.

### `<Component>.contract.md` — per-component sidecar

The artifact that tells humans, agents, and tooling how a single component is meant to be used. One Markdown file per component, colocated with `<Component>.tsx`. Hand-authored when scaffolding; updated when the component evolves.

- **Format:** structured markdown — see [`component-schema.mdx`](content/design-system/tools/component-schema.mdx) for the canonical schema
- **Required sections (4):** `## Props` · `## Dimension encoding` · `## Token bindings` · `## Usage rules`
- **Recommended sections (gated by trigger):** `## A11y`, `## Behavior` — added when the component has a Radix base, focus management, or non-trivial keyboard interaction. Static-display primitives skip these.
- **Deferred section:** `## Execution rules` — added per-component only when real drift surfaces (vocabulary in PHASE-6-EXECUTION-CONTRACTS.md). Foundation-level defaults stay parked until ≥2 drift cases warrant extraction.
- **Generated from:** `fn-component-contract` skill (guided template first; see "New skills to author")
- **Status:** does not exist yet; this is the new layer

### What this stack is not

- **No separate `contract.md`.** The earlier draft proposed a foundation `contract.md` plus a per-component narrative `components/<name>.md`. Both collapse into the per-component sidecar. A foundation contract file is not built.
- **No JSON sibling per component.** Markdown is the source of truth; the `.tsx` signature stays the ultimate authority on props.
- **No embedded `behaviorContract` in `components.json`.** Execution rules are a per-component sidecar concern, not a centralised manifest field.

---

## How this works for from-scratch

A from-scratch design system authors structured inputs first (tokens, dimensional MDX, components.json index), then generates a contract sidecar per primitive against those inputs. There is no Figma extraction step — Prism handles the one-way tokens sync (Figma↔code) and that's enough.

| Mature DS retrofit | Field-notes / from-scratch |
|---|---|
| DS exists; mine Figma for facts | DS doesn't exist; author from intent |
| Stage 1 input: layer tree, variants, tokens, semantic patterns | Stage 1 input: tokens.json + DESIGN.md + components.json + dimensional MDX + user prose intent |
| Stage 2: agents reason about extracted dump | Stage 2: agents reason about already-structured inputs |
| Risk: layer tree doesn't carry semantic meaning | Risk: lower — token names mean something; dimensional values are explicit |
| Needs Figma extraction plugin | **Doesn't need one.** Prism handles tokens; everything else is authored. |

The key insight: **field-notes front-loads into authored, structured inputs the very things a retrofit pipeline would spend effort recovering from Figma.** From-scratch is *easier* than retrofit, not harder, as long as we commit to authoring the structured inputs first.

This means **we do not need a Figma extraction plugin.** Prism stays as the tokens sync (one-way Figma↔code) and that's enough.

---

## The flow — top to bottom

1. **`fn-init <project> <target-dir>`** (renamed from bs-init)
   - **Today:** copies seed templates only (`tokens.json`, `components.json`, dimensional MDX, `DESIGN.md` with empty preservation markers, `CLAUDE.md` starter).
   - **Proposed (#171):** prompts user for anchor colors (primary + neutral minimum; positive/warning/danger default to sensible hexes), invokes `generate-ramps.ts` inline so `tokens.json` has real OKLCH ramps from day one, and supports a non-interactive `--prompt` mode.
2. **User defines real values** — fills dimensional MDX (which sentiments matter, which states exist), refines anchor colors via Prism Figma sync, edits `components.json` if non-default wiring needed.
3. **`fn-design-md --from-dimensional`** projects the system into populated `DESIGN.md`.
4. **`fn-component-contract <primitive>`** (new skill) generates `<Component>.contract.md` per primitive — guided template, hand-finished. After 5+ contracts ship by hand, evaluate whether to promote to a generator.
5. **`fn-component-scaffold <primitive>`** consumes `DESIGN.md` + `<Component>.contract.md` → emits `.tsx` + `.css` + `.test` + `.stories`.

Each step's output is a stable input for the next. The whole chain is generated from things field-notes already knows how to seed and the user already knows how to fill.

---

## Changes we want to make

### bs → fn rename (high priority, time-sensitive)

Rename every `bs-*` skill to `fn-*` (field-notes). Rationale:

- "fn" is universal; "bs" only makes sense if you know "by Sixteen" (and reads as British slang for bullshit, which is unfortunate)
- field-notes IS the canonical name of the toolkit
- **Time-sensitive:** before Bolton Metro integration cements `bs-*` in a second consumer's `.claude/skills/` folder. After Bolton Metro, the rename touches three repos at once. Today it touches one.

Scope, with current counts (live worktree, 2026-04-29):

- **15 distinct skills under `.claude/skills/`** — 14 `bs-*` skill files/directories (`bs-accessibility`, `bs-component-api`, `bs-component-scaffold`, `bs-css`, `bs-design-md`, `bs-html`, `bs-init`, `bs-react-patterns`, `bs-review`, `bs-storybook-docs`, `bs-storybook-ds`, `bs-storybook-foundations`, `bs-storybook-helpers`, `bs-testing`, `bs-tokens`) plus `bs-design` as an alias stub for `bs-design-md` (counted in directory listings but not a distinct skill)
- 15 directories under `field-notes-toolkit/skills/` (same set; the alias stub is or isn't present depending on packaging)
- All references in skill prose, tests, fixture files
- `dist/field-notes-toolkit.plugin` packaging
- `bs-init`'s seed-copy step (so new projects get `fn-*` names)
- `start-issue` and `start-work` (workflow skills) — keep their names; they don't conform to the bs-* category and don't need to

Do NOT bundle category reorganization (e.g. `fn-spec-*` / `fn-build-*` / `fn-review-*`) into this rename. Two large changes at once is the bad bundling we've been disciplined about. Prefix swap is mechanical; category reorg is judgment. Sequence them — prefix first, defer category reorg until after Bolton Metro lands.

Tracked in #168.

### New skills to author

- **`fn-component-contract`** — generates a per-component `<Component>.contract.md` sidecar.
  - **Inputs:** `.tsx` signature (authoritative for `## Props`), `tokens.json` (token names for `## Token bindings`), `DESIGN.md` (dimensional vocabulary for `## Dimension encoding`), `components.json` (which primitives exist).
  - **Output:** one Markdown file colocated with the `.tsx`, conforming to the schema in [`component-schema.mdx`](content/design-system/tools/component-schema.mdx).
  - **Approach:** **guided template first.** Ship 5+ hand-authored contracts before assessing what is repetitive enough to warrant generation. Promote to generator only if the repetitive surface is real. (Resolved in #172 §6.2; tracked in #169.)

The earlier draft proposed a separate `fn-contract` skill for a foundation `contract.md`. That skill is not built — it collapses into `fn-component-contract`, which lives at the per-component level only.

### Existing skills to update

- **`fn-design-md`** — manifest emitter. Stays as the canonical generator for `DESIGN.md` from tokens + dimensional MDX + components.json. Schema mismatch with the live `components.json` is tracked in #170.
- **`fn-component-scaffold`** — consumes `<Component>.contract.md` as a primary input alongside `DESIGN.md`.
- **`fn-init`** — currently copies templates only (no `generate-ramps.ts` invocation). Tracked in #171: add inline ramp invocation, interactive anchor-color prompts, and `--prompt`/`--non-interactive` modes; seed sidecar templates for the default primitives.

### Files / patterns to keep as-is

- **MD vs MDX split.** MDX for the Fumadocs site (interactive React components — token explorers, color swatches, live demos); MD for skills, specs, foundation docs (universal, LLM-friendly, no toolchain). Don't consolidate. The split is intentional.
- **`components.json` plural.** It's the index; per-component sidecars are singular (`<Component>.contract.md`). Plural-vs-singular usefully signals "index vs item."
- **Workspace-level orchestration docs.** ROADMAP, INVENTORY, FIX-MISSING-ELEMENTS, PHASE-6-EXECUTION-CONTRACTS, ARCHITECTURE — all stay at workspace parent. Discoverable via the CLAUDE.md pointer (added in PR #164).

---

## Self-review pattern for component creation

The current `_foundations/SELF-REVIEW.md` (closed via #145) is a single end-of-session pass. For `fn-component-contract` specifically, the guided-template-first approach lowers the stakes for an automated review pass — humans hand-finish each contract.

Once 5+ contracts ship and we evaluate promoting `fn-component-contract` to a generator, a multi-pass review pattern (specialist authors in parallel → specialist reviewers in parallel → reconcile → re-run if anything changed) becomes worth defining. Park that until the trigger (5+ hand-authored contracts) is met.

---

## Manifest research — what goes where

The schema question is largely resolved: per-component artefact contents are settled in [`component-schema.mdx`](content/design-system/tools/component-schema.mdx). Foundation-level concerns (DESIGN.md / components.json index) are settled in this doc.

Open research areas — pursue only when the trigger fires:

- **Motion specs** — flexible per-component content for now. Revisit (`motion.md` at system level vs. per-component) once we hit a component where motion behaviour is non-trivial.
- **Content / voice / tone** — currently absent from the stack. Revisit if a consumer surfaces this as a real need.

No `MANIFEST-RESEARCH.md` artefact required; the canonical answer for "what truly makes a component" is the sidecar schema.

---

## Web tool exploration (parked)

A standalone interactive web tool that walks a user through creating their design system from scratch — anchor colors with OKLCH ramp preview, dimensional value selection, primitive choice, contract authoring, per-component spec generation. Output: zip of the three-file stack + per-component sidecars + LLM bootstrap script.

This would lower the barrier to adopting field-notes from "Claude Code user comfortable with plugins" to "anyone who wants a design system bootstrap."

But park it. Three reasons:

1. The thing it generates isn't fully proven yet (the three-file stack needs at least one second consumer)
2. Field-notes hasn't been battle-tested with a second consumer (Bolton Metro is the trigger)
3. It's a different product with different audience expectations (hosting, updates, support)

**Trigger conditions for building:**

- This document settled and referenced by at least one merged PR
- bs→fn rename complete (#168)
- `fn-component-contract` skill built (#169)
- `components.json` reconciled to thin index (#170)
- `fn-init` updated (#171)
- Bolton Metro integration produces working output (validates the toolkit on a real second consumer)

When all triggers fire, the web tool becomes a serious next product. Until then, capture as `IDEAS/web-tool-bootstrap.md`.

---

## Open questions (for Claude Code's review)

These are the places worth pressure-testing before committing to session-by-session work. Several questions from the prior draft have been resolved by #166 and #172; what remains:

1. **bs→fn rename — what's the actual blast radius?** Concrete file count. Beyond skill files, does the rename touch:
   - Test fixtures
   - Public Fumadocs MDX content (do skills get referenced by name in pages?)
   - Plugin packaging script (`pack-plugin.mjs`)
   - bs-init's seed-copy step
   - lanefour's existing `.claude/skills/` (if so, that's a coordinated change)
   Tracked under #168.
2. **`components.json` format.** Should it stay JSON or move to YAML/TOML for human authoring? JSON is machine-friendly but painful to hand-edit (no comments, strict trailing-commas, etc.). YAML is more authorable but adds a parse step. Keep, change, or split (canonical JSON + human YAML source)? Tracked under #170.
3. **`fn-init` interactive UX.** Anchor color prompts — does Claude Code in skill-execution context support this cleanly, or do we need a wrapper? What's the fallback if the user wants non-interactive (`fn-init --non-interactive`)? Tracked under #171.
4. **Bolton Metro integration as trigger.** What's the minimum viable test — single button component end-to-end, or full primitive set (button, input, badge, alert, card)? What's "working output" — passes Storybook? Renders correctly? No execution-level drift?
5. **Skill abstraction.** Do we have enough abstraction in field-notes to absorb a second consumer's needs without cross-contamination? What's the discipline for keeping bolton-metro-specific decisions out of the toolkit?
6. **Sequencing.** Suggested order:
   1. **#166** Decision PR 1 — `component-schema.mdx` (DONE, merged via #174)
   2. **#167** Decision PR 2 — this realignment (in progress)
   3. **#168** bs→fn rename — mechanical, can run parallel with #170
   4. **#170** `components.json` reconcile — strip token-slot wiring, become thin index
   5. **#169** `fn-component-contract` skill — guided template
   6. **#171** `fn-init` update — ramp invocation + interactive prompts
   7. Bolton Metro integration
   Anything that should run earlier or later?

---

## What stays parked

- **Phase 6 foundation defaults** — behind ≥2 drift cases. The vocabulary stays available as a per-component sidecar section; the foundation file is not built. See PHASE-6-EXECUTION-CONTRACTS.md.
- **Phase 3 lanefour calibration** — design-judgment work, scheduled separately.
- **Skill category reorganization** (`fn-spec-*` / `fn-build-*` / `fn-review-*`) — defer until after Bolton Metro lands. Don't bundle with the prefix swap.
- **Web tool** — parked behind the trigger conditions in `IDEAS/web-tool-bootstrap.md`.
- **Figma extraction plugin** — not needed for from-scratch; revisit only if a future consumer needs retrofit support.
- **The 5 already-defer-labelled GitHub issues** (#38, #91, #98, #101, #106) — left alone unless a real trigger surfaces.

---

## Summary

The next phase of field-notes adds the per-component contract sidecar as a single Markdown file colocated with each component's `.tsx`. It renames bs→fn while it's still cheap, reconciles `components.json` to a thin primitive index, updates `fn-init` so a fresh project ships real OKLCH ramps from day one, and reframes Phase 6 as an optional per-component sidecar section rather than a foundation file. The web tool stays parked until Bolton Metro proves the toolkit on a real second consumer.

The earlier proposal of a foundation `contract.md`, a separate `components/<name>.md` narrative layer, and a `fn-contract` skill is superseded — all three collapse into the per-component sidecar.

---

## Provenance

- Aligned 2026-04-29 with #166 (component-schema.mdx) and #172 (architecture review)
- Status: aligned with the canonical contract schema; ready for sequenced follow-ups (#168, #169, #170, #171)
