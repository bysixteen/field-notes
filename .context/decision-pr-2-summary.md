# Decision PR 2 — orchestration-doc realignment summary (2026-04-29)

**Closes:** #167
**Builds on:** #166 (component-schema.mdx, merged via #174) and #172 (architecture review)

## What this PR contains

Snapshots of the rewritten workspace-parent orchestration docs:

- `.context/architecture-2026-04-29.md` — full snapshot of the rewritten `ARCHITECTURE.md`
- `.context/phase-6-execution-contracts-2026-04-29.md` — full snapshot of the rewritten `PHASE-6-EXECUTION-CONTRACTS.md`

The workspace-parent originals (`../ARCHITECTURE.md` and `../PHASE-6-EXECUTION-CONTRACTS.md`, gitignored per the convention CLAUDE.md describes) were updated in lockstep with these snapshots. The two pairs are byte-identical at the time this PR was opened.

## Why this PR exists

#166 ratified a single Markdown sidecar (`<Component>.contract.md`) as the canonical component contract shape. Two orchestration docs that pre-dated that decision still proposed:

- A two-file contract split (foundation `contract.md` + per-component `components/<name>.md`) in `ARCHITECTURE.md`
- Embedded `behaviorContract` in `components.json` plus a foundation `EXECUTION-CONTRACT-DEFAULTS.md` file in `PHASE-6-EXECUTION-CONTRACTS.md`

Both proposals dissolve under the canonical shape. This PR rewrites both docs to match.

The architecture review (#172) also flagged factual drift in `ARCHITECTURE.md` — DESIGN.md size, bs-init's `generate-ramps.ts` claim, components.json schema, the non-existent `EXECUTION-CONTRACT-DEFAULTS.md`, and outdated skill counts. The rewrite corrects all of these.

## What changed

### `ARCHITECTURE.md`

- Three-file stack (DESIGN.md, components.json, per-component `<Component>.contract.md`) replaces the four-file stack.
- `fn-contract` skill proposal removed; per-component contract authoring goes through `fn-component-contract` (renamed from `fn-component-md`).
- Pipeline diagram, status legend, and edges updated to match.
- Skill count corrected: 14 distinct `bs-*` skills + `bs-init` (`bs-design` is an alias stub for `bs-design-md`, not a separate skill).
- DESIGN.md size: was claimed `≤2KB`; corrected to `~5.6KB` (live file is 5,723 bytes / 190 lines).
- bs-init's `generate-ramps.ts` invocation: was claimed as current behaviour; corrected to "today copies templates only; ramp invocation and interactive prompts are tracked in #171".
- components.json: was claimed to carry `applies_to`; corrected to "flat token-slot map; reconcile to thin index tracked in #170".
- Acknowledgements section deleted; all inspiration-source name references stripped throughout.
- Open questions reduced — questions resolved by #166 / #172 are removed; remaining questions point at follow-up issues.
- Pointer added to `content/design-system/tools/component-schema.mdx` as the canonical schema.

### `PHASE-6-EXECUTION-CONTRACTS.md`

- Foundation-defaults file (`_foundations/EXECUTION-CONTRACT-DEFAULTS.md`) and JSON sibling proposals removed.
- Embedded `behaviorContract` in `components.json` proposal removed.
- Replaced with: `## Execution rules` section template for per-component sidecar use, added when real drift surfaces.
- Vocabulary documented as the union of relevant fields a sidecar's `## Execution rules` block can pick from.
- Three-PR sequencing collapsed to a single per-component path; foundation extraction re-evaluation deferred to ≥2 drift cases.
- Origin block, name attribution, and provenance name references stripped.
- Trigger evaluation log preserved; new entry added for 2026-04-29 (reframed; still parked).

## Acceptance criteria (from #167)

- [x] `ARCHITECTURE.md` no longer proposes two contract artifacts
- [x] `ARCHITECTURE.md` no longer references `fn-contract` skill
- [x] `ARCHITECTURE.md` factual inaccuracies corrected (DESIGN.md size, bs-init ramp, components.json schema, EXECUTION-CONTRACT-DEFAULTS.md non-existence, skill count)
- [x] `PHASE-6-EXECUTION-CONTRACTS.md` no longer proposes `EXECUTION-CONTRACT-DEFAULTS.md` or embedded `behaviorContract`
- [x] `PHASE-6-EXECUTION-CONTRACTS.md` documents the execution rules vocabulary as an optional per-component section
- [x] No inspiration-source names in either document
- [x] PR closes the issue

## What this PR deliberately does NOT do

- Does **not** start the bs→fn rename (#168). Mechanical, separate PR.
- Does **not** build the `fn-component-contract` skill (#169).
- Does **not** reconcile `components.json` (#170).
- Does **not** edit `bs-init` (#171).
- Does **not** modify `content/` Fumadocs pages — the canonical schema is already at `content/design-system/tools/component-schema.mdx`.

## Verification notes

- `grep -E "Guisard|Wesolowski|Piotr|Pete"` against both `.context/` snapshots returns zero matches.
- `diff` between each `.context/` snapshot and the workspace-parent original returns identical content.
- `npm run build` passes (no Fumadocs source loader picks up `.context/` markdown).
