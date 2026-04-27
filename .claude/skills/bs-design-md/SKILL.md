---
name: bs-design-md
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

## Two Modes

This skill orchestrates two workflows that converge on the same emitter:

- **Extract mode** — point at a live site URL, get a usable `DESIGN.md` plus DTCG `tokens.json` sidecar. Used to bootstrap a new product from a reference site.
- **Project mode** — take an existing dimensional design system (this repo's tokens, or any DTCG `tokens.json`), emit a spec-compliant `DESIGN.md` plus DTCG `tokens.json` sidecar. Used to expose an internal DS to external agents.

Both modes converge on the same emitter: `dimensional roles → flat DESIGN.md with named variants + DTCG tokens.json sidecar`.

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
5. **Emit.** Run `scripts/emit-design-md.mjs --from-tokens raw/tokens.json --components <component-list> --out <dir>`. It writes `DESIGN.md` and `tokens.json` to `<dir>`.
6. **Validate.** Run `scripts/lint.sh <dir>/DESIGN.md`. Surface any errors. Warnings on `contrast-ratio` and `orphaned-tokens` are expected for an extracted site — flag them but don't block.

**Honest caveats to surface to the user:**
- Component extraction beyond primitives (button/badge/input/card/nav) is unreliable. Treat anything compositional (cards-with-actions, dialogs, navigation patterns) as something the user will hand-author.
- Sentiment assignment is a judgement call. The extractor sees colours, not meaning — confirm with the user before locking in.
- Headless extractors don't see Canvas/WebGL/SVG-as-image content. If the reference site relies on these, the extraction will undercount.

## Project Mode — Workflow

When the user has existing dimensional tokens (this repo, or a DTCG `tokens.json`) and wants to expose them as a DESIGN.md:

1. **Locate the source.** This repo's tokens live across `content/design-system/token-chain/` (primitives → semantics) and `content/design-system/model/` (the dimensional definitions). For an external project, expect a `tokens.json` in DTCG format.
2. **Confirm dimensional vocabulary.** Read `content/design-system/model/index.mdx` (or the project's equivalent). Confirm: which sentiments exist, which emphasis levels, which states, which sizes. The five-dimension canonical list is `Sentiment, Emphasis, State, Size, Structure` — if the source defines extras (e.g. `density`), preserve them in the sidecar but note them in `## Do's and Don'ts`.
3. **Emit.** Run `scripts/emit-design-md.mjs --from-dimensional <source-path> --out <dir>`. The emitter:
   - Downsamples OKLCH to hex sRGB for `DESIGN.md` (keeps OKLCH in the sidecar)
   - Flattens dimensional combinations into named variants (`button-primary`, `button-primary-hover`)
   - Generates a `## Do's and Don'ts` section from the dimensional rules — read `references/do-and-dont-template.md` for the carrier patterns
4. **Validate.** Run `scripts/lint.sh <dir>/DESIGN.md`. Errors must be zero. The `contrast-ratio` warnings should be reviewed against the source DS — they often indicate genuine accessibility gaps worth fixing upstream.
5. **Round-trip check.** Run `npx @google/design.md export --format dtcg <dir>/DESIGN.md` and diff the output against `<dir>/tokens.json`. Every shared token should match. OKLCH-only tokens will appear in the sidecar but not the export — that's expected.

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
| `bs-tokens` | Project mode reads the dimensional token system this skill projects. Run `bs-tokens` audit first to ensure cascade integrity. |
| `bs-component-api` | Components emitted to DESIGN.md should reflect the same dimensional inputs the API documents. |
| `bs-css` | If extracting from a site you also own, run `bs-css` audit on the source first to surface hardcoded values that will pollute extraction. |
| `bs-review` | After project mode, run a `bs-review` pass on the output to verify the lossy projection didn't drop a load-bearing rule. |

## Reference Files

Load these from the `references/` directory only when you need them — they are not in your default context:

- `google-spec-summary.md` — every field of the YAML frontmatter, the component schema, and what the spec explicitly forbids. Read first when authoring the emitter or debugging a `broken-ref` error.
- `dimensional-mapping.md` — how Sentiment × Emphasis × State × Size × Structure flatten into DESIGN.md's flat component naming convention. Read in extract mode (assigning roles) or project mode (generating variant names).
- `do-and-dont-template.md` — carrier patterns for the rules the schema can't encode (cascade rules, dimensional independence, when to use which sentiment). Read when generating the `## Do's and Don'ts` section.
- `lossy-projection.md` — what is preserved between dimensional source → DESIGN.md → DTCG sidecar. Read when explaining trade-offs to the user, or when something looks wrong in a round-trip.

## Example Output

A complete reference pair lives at `assets/example-output/`. Read it when you need a concrete shape to model new outputs against.
