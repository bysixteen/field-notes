---
name: fn-design-md
description: >-
  Use when generating, validating, or updating a `DESIGN.md` file — either by
  extracting tokens and components from a reference site URL, or by projecting
  an existing dimensional design system (sentiment, emphasis, state, size,
  structure) into the Google DESIGN.md spec. Covers the lossy projection from
  OKLCH to hex sRGB with a DTCG `tokens.json` sidecar that preserves wide-gamut
  colour, the flat component naming convention for variants, the `## Do's and
  Don'ts` carrier for dimensional rules the schema can't enforce, and validation
  via the `@google/design.md` linter. Also use when documenting a layered
  CLAUDE.md / AGENTS.md / DESIGN.md / tokens.json context stack for an external
  agent to consume, or when bootstrapping a new product from a reference site.
---

# DESIGN.md (Google spec) — extract, project, validate

## Foundations (read first)

- [DESIGN-INTENT](../_foundations/DESIGN-INTENT.md)
- [DIMENSIONAL-MODEL](../_foundations/DIMENSIONAL-MODEL.md)
- [TOKEN-ARCHITECTURE](../_foundations/TOKEN-ARCHITECTURE.md)
- [QUALITY-GATES](../_foundations/QUALITY-GATES.md)

## Three Modes

This skill orchestrates three workflows that converge on the same emitter:

- **Extract mode** — point at a live site URL, get a usable `DESIGN.md` plus DTCG `tokens.json` sidecar. Used to bootstrap a new product from a reference site.
- **Project mode (`--tokens` + `--components`)** — take an existing DTCG `tokens.json` plus a `components.json` thin index, emit a spec-compliant `DESIGN.md`. The thin index records each primitive's contract sidecar path, Radix base, and CSS custom-property namespace; per-component token wiring is derived from the namespace × `tokens.json` lookup. Used when the consumer hand-curates the components list.
- **Dimensional mode (`--from-dimensional <root>`)** — walk the consumer's `tokens.json` + `components.json` thin index + each component's `<Component>.contract.md` sidecar (`## Dimension encoding` section) + the five model MDX islands, and synthesise the flat per-variant `components` block via the cap policy in `references/dimensional-mapping.md`. Used when the consumer wants the matrix derived from the dimensional vocabulary.

All three modes share the same output contract and accept the same `--template <path>` flag for choosing between the default Google-spec profile and consumer-specific profiles. See `references/profiles.md` for the schema.

### `components.json` — thin index

`components.json` is a registry of design-system primitives, not a wiring table. Each entry records where the component's contract sidecar lives, which Radix primitive (if any) it composes, and which CSS custom-property namespace it owns:

```json
{
  "button": {
    "contract": "packages/design-system/src/components/Button/Button.contract.md",
    "radixBase": "@radix-ui/react-slot",
    "tokenNamespace": "button"
  },
  "input": {
    "contract": "packages/design-system/src/components/Input/Input.contract.md",
    "radixBase": null,
    "tokenNamespace": "input"
  }
}
```

Token-slot wiring (`backgroundColor`, `textColor`, `padding`, etc.) lives in the component's `.contract.md` sidecar under `## Token bindings`, not here. Dimensional applicability (`applies_to`) lives in the same sidecar's `## Dimension encoding` section. State variants (`button-hover`, `button-disabled`, …) are runtime conditions, not top-level entries — they are derived by the cap policy from each component's `## Dimension encoding`.

> **Transitional state.** The thin-index shape is canonical from #170 forward. The current emitter (`scripts/emit-design-md.mjs`) and dimensional walker (`scripts/lib/dimensional-walker.mjs`) still read the legacy shape (flat `{ backgroundColor, … }` for project mode; `{ applies_to, properties }` for dimensional mode). Reconciliation — teaching the emitter to derive token wiring from `tokenNamespace` × `tokens.json` and to read `applies_to` from each contract sidecar — is the follow-up issue. Until then, regenerating `DESIGN.md` from a thin-index `components.json` will fail; treat the documented shape here as the input contract that `--components` and `--from-dimensional` will accept once the emitter is reconciled.

> **Aliases.** This skill is also reachable as `fn-design`. The canonical path is `fn-design-md/SKILL.md`; a one-line redirect lives at `fn-design/SKILL.md`. See `.claude/skills/README.md` for the full skill index.

## Why Two Files (DESIGN.md + tokens.json)

The Google `DESIGN.md` spec is alpha and **hex sRGB only**. It cannot represent OKLCH, Display P3, or the orthogonal dimensional model (Sentiment × Emphasis × State × Size × Structure) without flattening. The DTCG `tokens.json` sidecar (Format Module 2025.10) preserves OKLCH and is what other tools should round-trip through.

Treat `DESIGN.md` as the **agent-facing context document** and `tokens.json` as the **tooling-facing source of truth**. When they disagree, `tokens.json` wins.

For details on what is preserved versus lost, read `references/lossy-projection.md`.

## Extract Mode — Workflow

When the user supplies a URL or asks to generate a DESIGN.md from an existing site:

1. **Run the extractor.** Use `scripts/extract-from-url.sh <url>` (wraps `npx designlang <url>`). It produces a `raw/` directory with `tokens.json` (DTCG-shaped) and 3–5 viewport screenshots.
2. **Reconcile with vision.** Read the screenshots and the raw `tokens.json` together. Cluster the colour palette down to 4–8 named groups; cut spacing scales to ≤6 steps; identify the typography stack actually in use (not the full system font stack the browser fell back to). Extractors over-tokenise — your job is to dedupe.
3. **Assign dimensional roles.** Map each surviving token to a dimensional role: which colours are sentiments, which are emphasis variants of a single sentiment, which are state shifts? Read `references/dimensional-mapping.md` for the mapping rules. If the source site doesn't have an obvious sentiment palette, default to `neutral` and note the limitation in the Overview prose.
4. **Identify components.** From screenshots, list the component primitives present (button, badge, input, card, link, nav). Note variants you can see (primary/secondary, hover state, selected state). Don't invent components that aren't visible.
5. **Emit.** Run `scripts/emit-design-md.mjs --tokens raw/tokens.json --components <component-list> --out <dir>`. It writes `DESIGN.md` and `tokens.json` to `<dir>`. (For greenfield writes, add `--init`; see "Preserving custom prose" below.)
6. **Validate.** Run `scripts/lint.sh <dir>/DESIGN.md`. Surface any errors. Warnings on `contrast-ratio` and `orphaned-tokens` are expected for an extracted site — flag them but don't block.

**Honest caveats to surface to the user:**
- Component extraction beyond primitives (button/badge/input/card/nav) is unreliable. Treat anything compositional (cards-with-actions, dialogs, navigation patterns) as something the user will hand-author.
- Sentiment assignment is a judgement call. The extractor sees colours, not meaning — confirm with the user before locking in.
- Headless extractors don't see Canvas/WebGL/SVG-as-image content. If the reference site relies on these, the extraction will undercount.

## Project Mode — Workflow

When the user has existing dimensional tokens (this repo, or a DTCG `tokens.json`) and wants to expose them as a DESIGN.md:

1. **Locate the source.** This repo's tokens live across `content/design-system/token-chain/` (primitives → semantics) and `content/design-system/model/` (the dimensional definitions). For an external project, expect a `tokens.json` in DTCG format.
2. **Confirm dimensional vocabulary.** Read `content/design-system/model/index.mdx` (or the project's equivalent). Confirm: which sentiments exist, which emphasis levels, which states, which sizes. The five-dimension canonical list is `Sentiment, Emphasis, State, Size, Structure` — if the source defines extras (e.g. `density`), preserve them in the sidecar but note them in `## Do's and Don'ts`.
3. **Produce DTCG.** The emitter consumes a DTCG `tokens.json`. In Field Notes, run `npx tsx scripts/generate-ramps.ts` — it now writes `/tokens.json` at repo root alongside the existing CSS / JSON / Figma outputs. For other projects, hand-author or generate a DTCG file directly.
4. **Emit.** Run `scripts/emit-design-md.mjs --tokens <tokens.json> --components <components.json> --out <dir> [--name <name>]`. The emitter:
   - Downsamples OKLCH to hex sRGB for `DESIGN.md` (keeps OKLCH in the sidecar)
   - Flattens dimensional combinations into named variants (`button-primary`, `button-primary-hover`)
   - Pass-through copies the input `tokens.json` to `<dir>/tokens.json`
5. **Validate.** Run `scripts/lint.sh <dir>/DESIGN.md`. Errors must be zero. The `contrast-ratio` warnings should be reviewed against the source DS — they often indicate genuine accessibility gaps worth fixing upstream.
6. **Round-trip check.** Run `npx @google/design.md export --format dtcg <dir>/DESIGN.md` and diff the output against `<dir>/tokens.json`. Every shared token should match. OKLCH-only tokens will appear in the sidecar but not the export — that's expected.

**Field Notes shortcut:** the entire pipeline is wrapped by `npm run generate:manifest`, which runs steps 3–5 in order. Use that for routine regeneration; this is the Tier 1/3 manifest entry point referenced in `fn-tokens.md` and `.claude/rules/prism-mcp.md`.

## Dimensional Mode — `--from-dimensional <root>`

When the consumer's design system is fully expressed through the dimensional vocabulary (sentiment, emphasis, size, state) and they want the components matrix derived rather than hand-curated:

1. **Confirm prerequisites.** The project root must contain `tokens.json`, `components.json` (thin index — see *`components.json` — thin index* above), one `<Component>.contract.md` sidecar per registered component (carrying the `## Dimension encoding` and `## Token bindings` sections per `content/design-system/tools/component-schema.mdx`), and the five model MDX files at `content/design-system/model/{sentiment,emphasis,size,state,structure}.mdx`, each carrying a `dimensional_values: { default, values }` frontmatter key. The walker fails fast with an actionable error naming any missing file or key.
2. **Each primitive declares its applicable dimensions in its contract sidecar.** From `Button.contract.md`:
   ```markdown
   ## Dimension encoding

   | Dimension | data-* attribute | Values | Default |
   |-----------|------------------|--------|---------|
   | sentiment | data-sentiment | neutral, warning, highlight | neutral |
   | emphasis | data-emphasis | high, medium, low | high |
   | state | data-state | rest, hover, active, disabled | rest |
   | size | data-size | sm, md, lg | md |
   ```
   The walker reads each row to derive the equivalent of the legacy `applies_to` map. A component whose `Values` column for a dimension equals that dimension's full vocabulary (from the model MDX) is treated as `"all"` for that dimension.
3. **Emit.** Run `scripts/emit-design-md.mjs --from-dimensional <root> --out <dir> [--name <name>]`. The mode is mutually exclusive with `--tokens` / `--components`. The emitter prints a discovered-vocabulary summary (sentiments, emphasis, sizes, states, components → variants) before writing.
4. **The cap policy.** For each component, the cap policy in `references/dimensional-mapping.md` produces a tractable variant set (≈25–35 per fully-applicable primitive, fewer for tighter dimension matrices). Variant names drop any segment that equals its dimension's `default` — so `(neutral, high, md, rest)` becomes `button`, and `(warning, high, md, rest)` becomes `button-warning`.
5. **Validate.** Same as project mode — `scripts/lint.sh <dir>/DESIGN.md`.

**Property projection in v1.** Each variant inherits its parent's `## Token bindings` resolutions verbatim. Token references inside those bindings (e.g. `{color.primary}`) are resolved by the existing emit pipeline. Per-variant cascade substitution — where `button-warning` resolves `{color.surface}` against `color.warning` — is a future refinement and not yet implemented.

## Preserving custom prose

The emitter wraps **each section** in its own start/end marker pair so consumer-authored prose can interleave with generated prose under any template ordering:

```
---
<frontmatter>           <- replaced wholesale on every emit
---

<!-- fn-design-md:section:identity:start -->
## Identity
... preserved prose (kept verbatim across regenerates) ...
<!-- fn-design-md:section:identity:end -->

<!-- fn-design-md:section:type:start -->
## Type
... generated content (replaced wholesale every emit) ...
<!-- fn-design-md:section:type:end -->
```

Generated sections are replaced wholesale on every emit; preserved sections keep whatever sits between their markers (seeded once from the template's `placeholder` on first emit). The legacy single-block markers (`fn-design-md:generated:start/end`) from earlier versions are still recognised on read — the next emit migrates them to per-section markers and preserves any prose that lived below the legacy `:end` as a one-shot suffix.

**Frontmatter is fully derived; do not hand-edit.** The YAML frontmatter is replaced on every emit. If you need project metadata that survives regeneration, add a preserved section to the template (or use the suffix slot below the last template section). Hand-edits to keys *inside* the frontmatter will be overwritten without warning. This is intentional — see `references/extended-sections.md` for the rationale.

The emitter classifies the existing file before writing:

| State | Without `--init` | With `--init` |
|---|---|---|
| Missing | write fresh with markers | write fresh with markers |
| Empty (whitespace only) | write fresh with markers | write fresh with markers |
| Has markers | merge: replace frontmatter + generated block, preserve suffix prose | **refused** (not greenfield) |
| Non-empty, no markers | **refused** — recommends `migrate` | **refused** — recommends `migrate` |

`--init` is strictly greenfield. To wrap an existing hand-authored DESIGN.md in markers without losing prose, use the `migrate` subcommand below.

## migrate — one-time legacy adoption

When a consumer already has a hand-authored DESIGN.md (no markers), they run `migrate` once to wrap it in markers and disposition each section:

```
node scripts/emit-design-md.mjs migrate --in DESIGN.md
```

Interactive runner: for each `## ` heading, prompts `[g]enerated / [p]reserved / [s]kip-skill`. Boilerplate-shaped headings (`## Overview`, `## Colors`, `## Typography`, `## Spacing`, `## Components`, `## Do's and Don'ts`) default to `g`; everything else defaults to `p`. The author can override any default.

For CI scripting, supply the disposition as YAML:

```
node scripts/emit-design-md.mjs migrate \
  --in DESIGN.md \
  --non-interactive \
  --disposition disposition.yaml
```

The disposition YAML schema (version 1) is pinned in `references/dimensional-mapping.md`. Migrate is idempotent — running it again on a markered file is a no-op.

After migrate, regular emits (without `--init`) merge into the markered file, preserving everything below `:end`.

## The Output Contract

Every output, from either mode, must include:

| Element | Required | Notes |
|---------|----------|-------|
| YAML frontmatter `name` | yes | The product or brand name |
| YAML `description` | yes | One sentence on the brand or system |
| YAML `colors` | yes | Hex sRGB only. At least `primary` |
| YAML `typography` | yes | At least one entry |
| YAML `rounded`, `spacing` | yes | Even minimal scales |
| YAML `components` | yes | At least button + one other primitive |
| `## Overview` prose | yes | Brand voice + visual character — vision agents need this |
| `## Colors` prose | yes | Sentiment intent, not just hex listings |
| `## Typography` prose | yes | When to use which scale level |
| `## Components` prose | yes | When/how to use each component |
| `## Do's and Don'ts` | yes | The carrier for dimensional rules and patterns the schema can't encode |

For the exact field-by-field schema, read `references/google-spec-summary.md`.

## Validation Gates

Treat the linter output as a release gate:

- **Errors** (e.g. `broken-ref`, malformed colour) — must be zero before handing the file to the user.
- **`missing-primary`, `missing-typography`, `missing-sections`** — must be zero. These are warnings in the linter but indicate the file is incomplete.
- **`contrast-ratio`** — surface count and worst-offender pair, but don't auto-fix. These often reveal genuine accessibility decisions for the user to make.
- **`orphaned-tokens`** — warn if >10% of tokens are unreferenced. Otherwise the source DS likely has unused tokens worth pruning.
- **`section-order`** — fix automatically; the spec defines a canonical order.

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `fn-tokens` | Project mode reads the dimensional token system this skill projects. Run `fn-tokens` audit first to ensure cascade integrity. |
| `fn-component-api` | Components emitted to DESIGN.md should reflect the same dimensional inputs the API documents. |
| `fn-css` | If extracting from a site you also own, run `fn-css` audit on the source first to surface hardcoded values that will pollute extraction. |
| `fn-review` | After project mode, run a `fn-review` pass on the output to verify the lossy projection didn't drop a load-bearing rule. |

## Reference Files

Load these from the `references/` directory only when you need them — they are not in your default context:

- `google-spec-summary.md` — every field of the YAML frontmatter, the component schema, and what the spec explicitly forbids. Read first when authoring the emitter or debugging a `broken-ref` error.
- `profiles.md` — the `--template` schema, the renderer registry, the redaction format, and the linter trade-off. Read when authoring or consuming a non-default profile.
- `dimensional-mapping.md` — how Sentiment × Emphasis × State × Size × Structure flatten into DESIGN.md's flat component naming convention. Read in extract mode (assigning roles) or project mode (generating variant names).
- `do-and-dont-template.md` — carrier patterns for the rules the schema can't encode (cascade rules, dimensional independence, when to use which sentiment). Read when generating the `## Do's and Don'ts` section.
- `lossy-projection.md` — what is preserved between dimensional source → DESIGN.md → DTCG sidecar. Read when explaining trade-offs to the user, or when something looks wrong in a round-trip.
- `extended-sections.md` — the project-agnostic prose conventions consumers commonly add (Identity, Aesthetic direction, Surfaces, Layout, Content fundamentals), and the rationale for the frontmatter clobber footgun. Read when advising consumers on where to put hand-authored prose.
- `templates/google-spec.yaml` — the default profile (Google-spec layout: Overview / Colors / Typography / Components / Do's and Don'ts).
- `templates/dimensional-prose.yaml` — alternative profile (Identity / Type / Colour / Surfaces / Layout / Content fundamentals / Anti-patterns) for products that document their visual moves in their own vocabulary alongside generated token tables.

## Example Output

A complete reference pair lives at `assets/example-output/`. Read it when you need a concrete shape to model new outputs against.

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.
