# Content Audit — Phase 4.2 (2026-04)

Classification of every `.mdx` page under `content/{design-system,claude,platform,principles}/` against the post-Phase-1 state of the toolkit (`.claude/skills/`, `_foundations/`, `bs-init`, refreshed README) and the canonical dimensional vocabulary (`model/sentiment.mdx`, `model/state.mdx`, `model/emphasis.mdx`, `model/size.mdx`, `model/structure.mdx`).

Scope: classification only. Session 6 acts on this list. Methodology: one read per page during planning, plus targeted greps on dimensional-vocabulary lists (sentiment, state, emphasis, size, structure) to surface single-cause-multiple-pages drift.

**Confirmed clean** — emphasis (`high|medium|low`), size (`xs|sm|md|lg|xl`), the 4-point semantic-naming scale (`weaker→weak→standard→strong`), and the "structure never exposed as prop" rule are consistent across all 79 pages. The drift cluster is sentiment + state value lists, plus one structure-prose row in `density-note.mdx`. The design system's core vocabulary didn't rotate — only the sentiment/state lists did. This bounds Session 6's regen scope.

| | Count |
|---|---|
| Total pages | 79 |
| Current | 69 |
| Stale | 10 |
| Delete | 0 |

## design-system/ (49 pages)

### Top-level (14)

- `design-system/index.mdx` — **Current**. Five-dimension intro; matches `_foundations/DIMENSIONAL-MODEL.md`.
- `design-system/concepts-manifest.mdx` — **Current**. Reserved sentiments (`destructive`, `success`, `info`) accurately flagged as future-state.
- `design-system/manifest-architecture.mdx` — **Current**. Three-tier Token Trap architecture matches `CLAUDE.md` and `.context/INDEX.md`.
- `design-system/component-api.mdx` — **Stale**. `ButtonSentiment` enum lists `'success' | 'error'` instead of canonical `positive`. `ButtonState` alias has 6 values; the dimension table 5 lines down has 7 (adds `'selected'`) — internal inconsistency.
- `design-system/component-scaffolding.mdx` — **Stale**. Same vocabulary drift. Type aliases declare `ButtonSentiment = 'neutral' | 'warning' | 'highlight' | 'new' | 'success' | 'error'` and `ButtonState` is missing `'selected'` and `'pending'`. Scaffold output would teach downstream projects the wrong dimension values.
- `design-system/html-semantics.mdx` — **Current**. Aligns with `bs-html` skill.
- `design-system/css-authoring-rules.mdx` — **Current**. Aligns with `bs-css` skill.
- `design-system/testing-strategy.mdx` — **Stale**. `const SENTIMENTS = ['neutral', 'warning', 'highlight', 'success', 'error']` in the test-fixture example — missing `new` and `positive`, includes deprecated `success`/`error`.
- `design-system/accessibility-audit.mdx` — **Current**. Bracket model (B1–B6) matches `bs-accessibility` skill.
- `design-system/token-transform-pipeline.mdx` — **Current**. Matches `generate-ramps.ts` + `generate-manifest.mjs` pipeline per INVENTORY.md.
- `design-system/token-audit.mdx` — **Current**. Severity tiers match `bs-tokens` skill.
- `design-system/prism.mdx` — **Current**. v0.2.0 with v0.3.0+ npm migration noted; aligns with `.claude/rules/prism-mcp.md`.
- `design-system/figma-documentation-rules.mdx` — **Stale**. Sentiment list uses `success, error` not `positive`; State list missing `selected` and `pending`. Figma documentation built from this would teach the wrong vocabulary.
- `design-system/storybook-documentation-rules.mdx` — **Current**. Aligns with `bs-storybook-*` skill suite.

### model/ (9)

- `model/index.mdx` — **Current**. Five canonical dimensions; "developed by Pete and Daniel during BNY design system work" is attribution, not drift.
- `model/color-scale.mdx` — **Current**. 12-step Tailwind 50–1000 / Radix-inspired role mapping.
- `model/sentiment.mdx` — **Current**. Canonical source (`neutral, warning, highlight, new, positive`).
- `model/emphasis.mdx` — **Current**. Three-point scale + four-point naming map.
- `model/state.mdx` — **Current**. Canonical source (`rest, hover, active, selected, disabled, resolving, pending`).
- `model/size.mdx` — **Current**. Absorbs density use cases — consistent with `density-note.mdx` rationale.
- `model/structure.mdx` — **Current**. Canonical source (component-specific, informational; example values `standard, text`).
- `model/theme.mdx` — **Current**. Two-layer model (primitives + semantics).
- `model/density-note.mdx` — **Stale**. Historical-rationale prose is fine, but the "canonical five dimensions" summary table at the bottom drifts on two axes: State row uses `default, hover, active, disabled, loading` (canonical: `rest, hover, active, selected, disabled, resolving, pending`); Structure row uses `filled, outlined, ghost` (canonical structure is component-specific; `model/structure.mdx` examples are `standard, text`). Sentiment row matches.

### composition/ (4)

- `composition/index.mdx` — **Current**. Composition checklist deterministic order.
- `composition/sentiment-emphasis.mdx` — **Current**. Independent-axes rule; legibility floor concept.
- `composition/spacing-gestalt.mdx` — **Current**. Three-tier spacing semantics.
- `composition/worked-examples.mdx` — **Current**. API key expiry + data table examples.

### approaches/ (7)

- `approaches/index.mdx` — **Current**. Layered vs Flat decision guide.
- `approaches/why-dimensional.mdx` — **Current**. Plain-language rationale.
- `approaches/why-this-works.mdx` — **Current**. Rules + industry validation (Braid, HeroUI, CVA).
- `approaches/flat.mdx` — **Stale**. State enumeration table lists `rest, hover, focus, active, disabled, error` — uses `focus` and `error` which are not in the canonical state vocabulary. Could be deliberate alternative-vocabulary illustration for the flat approach; Session 6 should verify and either align or annotate explicitly.
- `approaches/layered.mdx` — **Current**. Four-layer chain.
- `approaches/component-principles.mdx` — **Current**. Single-responsibility / composition-over-configuration.
- `approaches/industry-research.mdx` — **Current**. "Last scanned: 2026-04-20" — recent enough; periodic re-scan is the maintenance cadence, not staleness.

### naming/ (4)

- `naming/index.mdx` — **Current**. Two-pattern split (primitive vs semantic).
- `naming/primitives.mdx` — **Current**. OKLCH primitives, category list.
- `naming/semantics.mdx` — **Current**. Foreground/background pairing rule.
- `naming/emphasis-scale.mdx` — **Current**. Four-point naming → three-point dimension map.

### token-chain/ (5)

- `token-chain/index.mdx` — **Current**. Four-layer cascade matches `_foundations/TOKEN-ARCHITECTURE.md`.
- `token-chain/primitives.mdx` — **Current**. Layer 1 rules.
- `token-chain/semantics.mdx` — **Stale**. Lists states as `rest, hover, active, inverted, disabled` — `inverted` is not in the canonical state vocabulary. Either drop `inverted` or document it explicitly as a token-naming-only state distinct from the dimension.
- `token-chain/component-slots.mdx` — **Current**. Layer 3 slot model.
- `token-chain/resolver.mdx` — **Current**. Layer 4 lookup engine.

### constraints/ (3)

- `constraints/index.mdx` — **Current**. Core rules.
- `constraints/accessibility.mdx` — **Current**. WCAG AA + 44×44px touch target.
- `constraints/dos-and-donts.mdx` — **Current**. Token + composition do/don'ts.

### tooling/ (2)

- `tooling/index.mdx` — **Current**. Generic bridge philosophy. Thin (lists only Figma Sync) — could grow when more tooling lands; not stale.
- `tooling/figma-sync.mdx` — **Stale**. Frontmatter/intro say PRISM, but body uses `manus-mcp-cli` and a `.mcp.json` example with `"figma-mcp-server"`. Contradicts `prism.mdx` and INVENTORY.md, both of which say `figma-push.sh`/`figma-pull.sh` were rewritten in commit 81751d4 (#127) to use Prism MCP at `ws://localhost:7890`.

### tools/ (1)

- `tools/component-schema.mdx` — **Stale**. Schema example declares `"sentiment": ["neutral", "warning", "highlight", "new", "success", "error"]` and `"state": ["rest", "hover", "active", "disabled", "resolving", "pending"]` — sentiment uses old `success`/`error` not `positive`; state missing `selected`. The schema is the contract for what `bs-component-api` emits.

## claude/ (10 pages)

- `claude/index.mdx` — **Current**. Generic intro to AI workflows.
- `claude/agent-efficiency.mdx` — **Current**. Reconciles arXiv:2601.20404 with community findings.
- `claude/claude-code-setup.mdx` — **Current**. Says "as of March 2026" — date qualifier, content accurate.
- `claude/claude-md-playbook.mdx` — **Current**. Sizing guidance and study citations remain valid.
- `claude/context-engineering.mdx` — **Current**. Generic LLM-context discipline; project-agnostic.
- `claude/dimensional-and-design-md.mdx` — **Current**. Accurate description of bs-design-md projection model. Cross-link to `/claude/skills-catalogue` becomes valid once that page is fixed in Session 6.
- `claude/research-to-validation.mdx` — **Current**. Five-step pathway; project-agnostic.
- `claude/skills-catalogue.mdx` — **Stale**. Lists `add-domain`, `add-page`, `review-uplift`, `skill-creator`, `new-project`, `new-figma-project` — these are user-level skills (in `~/.claude/skills/`), NOT in the field-notes toolkit. Misses all 15 `bs-*` skills, `bs-init`, and the `_foundations/` layer. Says skills live at `~/.claude/skills/` (user-level path) instead of the toolkit/plugin path.
- `claude/skills-patterns.mdx` — **Current**. Generic skill-creation patterns.
- `claude/workflow-architectures.mdx` — **Current**. Holy Trinity / progressive disclosure pattern still applicable.

## platform/ (12 pages)

- `platform/index.mdx` — **Current**. Generic intro to platform patterns.
- `platform/stack-decisions.mdx` — **Current**. Generic technology decision categories.
- `platform/dependency-catalogue.mdx` — **Current**. Curated package selections; project-agnostic.
- `platform/bootstrap-commands.mdx` — **Current**. Phase 0–2+ scaffolding sequences.
- `platform/monorepo.mdx` — **Current**. pnpm + Turborepo structure.
- `platform/three-app-model.mdx` — **Current**. Admin / Public / Wiki audience model.
- `platform/scaffolding-first.mdx` — **Current**. Phase 1–3 infrastructure-first principle.
- `platform/data-architecture.mdx` — **Current**. Transactional + CMS split.
- `platform/auth-rls.mdx` — **Current**. JWT custom claims + RLS pattern.
- `platform/audit-first.mdx` — **Current**. Append-only events table.
- `platform/documentation-hub.mdx` — **Current**. Multi-collection knowledge base; Field Notes itself is the working implementation.
- `platform/adr-template.mdx` — **Current**. Standard ADR fields.

## principles/ (8 pages)

- `principles/index.mdx` — **Current**. Core principles index.
- `principles/answer-first.mdx` — **Current**. Pyramid Principle (McKinsey, 1960s).
- `principles/compounding-engineering.mdx` — **Current**. Anti-patterns + compounding return.
- `principles/dissent-as-feature.mdx` — **Current**. Challenger role + dissent register.
- `principles/journey-template.mdx` — **Current**. Journey map structure template.
- `principles/new-project-checklist.mdx` — **Current**. Bootstrap sequence; "CLAUDE.md under 150 lines" guidance still valid.
- `principles/synthesis-validation.mdx` — **Current**. Sprint Synthesis + four-pillar validation framework.
- `principles/verification-over-instruction.mdx` — **Current**. Test suites / browser testing / bash validation.

## Stale summary — Session 6 work

**Toolkit/distribution drift (2):** independent edits.

1. `claude/skills-catalogue.mdx` — replace user-level skill list with field-notes toolkit (15 bs-* + start-issue + start-work + bs-init); fix install path; reflect 2026-04 toolkit shape.
2. `design-system/tooling/figma-sync.mdx` — reconcile body with frontmatter/intro: scripts use Prism MCP (`ws://localhost:7890`), not `manus-mcp-cli` against `figma-mcp-server`. Update `.mcp.json` example, tool-discovery commands, error table.

**Dimensional-vocabulary drift (8) — single coordinated sweep.** Canonical sources:

- `model/sentiment.mdx`: `neutral, warning, highlight, new, positive`
- `model/state.mdx`: `rest, hover, active, selected, disabled, resolving, pending`
- `model/structure.mdx`: component-specific, informational; examples `standard, text`

Pages frozen at older revisions:

3. `design-system/component-api.mdx` (sentiment + state)
4. `design-system/component-scaffolding.mdx` (sentiment + state)
5. `design-system/testing-strategy.mdx` (sentiment fixture)
6. `design-system/figma-documentation-rules.mdx` (sentiment + state)
7. `design-system/tools/component-schema.mdx` (sentiment + state)
8. `design-system/token-chain/semantics.mdx` (state — uses `inverted`)
9. `design-system/approaches/flat.mdx` (state — uses `focus`/`error`; may be intentional)
10. `design-system/model/density-note.mdx` (state + structure rows in summary table)

Session 6 should make these eight edits as one coordinated pass — same root cause, same fix shape — rather than treating them as eight independent items.

## Gaps

Content that should exist but doesn't. Not for Session 5 to author; Session 6 to decide.

- **`bs-init` quickstart page** under `/claude` or `/design-system`. README describes the bootstrap command and four-piece scaffold (`tokens.json`, `components.json`, model MDX, `CLAUDE.md`, `DESIGN.md`); the docs site has no page covering it.
- **Preservation-markers convention** under `/claude` or `/design-system`. README documents the `<!-- bs-design-md:generated:start --> … :end -->` markers and their preservation rules; `dimensional-and-design-md.mdx` references the system but doesn't fully describe the markers.
- **Plugin distribution** under `/claude`. README describes `dist/field-notes-toolkit.plugin` as one of two distribution shapes; the docs site doesn't mention plugin packaging.
- **README's domain-page-count table is wrong.** It claims 16/19/8/10 (DS/Platform/Claude/Principles); actuals are 49/12/10/8 (33% undercount overall). Out of scope for Session 5 — but should land as a small post-Session-5 housekeeping issue rather than sit indefinitely.
