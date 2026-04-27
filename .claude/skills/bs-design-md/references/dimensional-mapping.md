# Dimensional → DESIGN.md naming convention

The five canonical dimensions are documented in `content/design-system/model/index.mdx`:

| Dimension | Values | Decided when |
|-----------|--------|--------------|
| Sentiment | `neutral`, `warning`, `highlight`, `new`, `positive` | Composition |
| Emphasis | `high`, `medium`, `low` | Composition |
| State | `rest`, `hover`, `active`, `selected`, `disabled`, `resolving`, `pending` | Runtime |
| Size | `xs`, `sm`, `md`, `lg`, `xl` | Composition |
| Structure | (fixed; no variants) | Build |

The DESIGN.md spec has no dimensional vocabulary. It has a single flat namespace for component entries. This file documents how to project a dimensional system into that namespace without losing reader comprehension.

## Naming convention

```
{component}-{sentiment}-{emphasis}-{size}-{state}
```

Drop any segment that is the default. Defaults:

| Dimension | Default |
|-----------|---------|
| Sentiment | `neutral` |
| Emphasis | `high` |
| Size | `md` |
| State | `rest` |

Examples:

| Coordinate | DESIGN.md key |
|------------|---------------|
| Button, neutral, high, md, rest | `button` |
| Button, warning, high, md, rest | `button-warning` |
| Button, neutral, low, md, rest | `button-low` |
| Button, neutral, high, md, hover | `button-hover` |
| Button, warning, low, sm, hover | `button-warning-low-sm-hover` |
| Button, positive, medium, lg, rest | `button-positive-medium-lg` |

The order is fixed: **sentiment, emphasis, size, state**. Always omit defaults. Always use lowercase.

## What to emit, what to skip

A 5-sentiment × 3-emphasis × 5-size × 5-state matrix produces 375 button entries per component. Don't emit all of them — that wrecks readability and bloats agent context for no gain.

Emit:

- **Every sentiment + emphasis combination at default size + rest state** (15 entries per component) — these are the load-bearing composition decisions.
- **Each size at the default sentiment + emphasis + rest state** (5 entries per component) — show the size scale.
- **Each state at the default sentiment + emphasis + size** (5 entries per component) — show the state palette.
- **Disabled state for every sentiment** — disabled often has different colour treatment.

Skip:

- Cross-products beyond the above — the agent can interpolate. Note in `## Do's and Don'ts` that any combination is valid and follows the sentiment × emphasis × state cascade.
- Size variants in non-default sentiments — agent can interpolate.

This typically produces 25–35 entries per component, not 375. Readable, complete enough.

## Mapping the colour cascade into the flat namespace

The dimensional system uses a four-layer colour cascade: **State → Emphasis → Sentiment → Semantic Color**. DESIGN.md's flat namespace can't model the cascade directly, but you can preserve the **resolved values** at each named coordinate:

```yaml
components:
  # Resolved value: neutral high rest = primary
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"

  # Resolved value: neutral high hover = primary darker
  button-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"

  # Resolved value: warning high rest = warning palette
  button-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-warning}"
```

Document the cascade rule in `## Do's and Don'ts` so an agent reading the file understands that `button-warning-hover` would derive from `colors.warning-hover`, not from `button-hover`.

## Structure dimension

`Structure` (radius, fixed gaps, fixed heights) doesn't vary at runtime, so it doesn't appear in component variant names. It does appear in the `rounded` and `spacing` token groups and in the per-component `rounded` / `padding` properties.

## Size dimension — semantic vs scale

Two ways to express size:

- **Semantic** (`xs`, `sm`, `md`, `lg`, `xl`) — composition decision; appears in component variant names.
- **Scale** (`size-4`, `size-8`, `size-12`) — primitive values in the `spacing` token group.

Always express in `components.*` properties as semantic references when possible:

```yaml
components:
  button-sm:
    height: "{spacing.size-32}"   # primitive
    padding: "{spacing.padding-sm}"  # semantic — preferred
```

## When the source has dimensions DESIGN.md can't carry

If the source system uses additional dimensions beyond the canonical five (e.g. `density`, `intent`, `prominence`):

- Preserve them in the DTCG `tokens.json` sidecar in their original shape.
- In `DESIGN.md`, fold them into compound variant names where they materially change the output (`button-compact-sm` if compact density changes the visible component).
- Note the additional dimension in `## Do's and Don'ts` and link to the sidecar for the full system.

## `dimensional_values` MDX-frontmatter convention

For `--from-dimensional` mode, the walker discovers each dimension's vocabulary from the project's `content/design-system/model/<dim>.mdx` files via a `dimensional_values` frontmatter key. This is the **single source of truth** — no regex/table fallback, no fenced-code conventions. If the key is missing or malformed for any of the five model files, the walker fails fast with an actionable error.

Required shape:

```yaml
---
title: Sentiment
description: What a component communicates...
dimensional_values:
  default: neutral
  values: [neutral, warning, highlight, new, positive]
---
```

Canonical defaults (must match the values listed in this document at lines 23–28):

| Dimension | `default` | `values` |
|-----------|-----------|----------|
| Sentiment | `neutral` | `[neutral, warning, highlight, new, positive]` |
| Emphasis | `high` | `[high, medium, low]` |
| Size | `md` | `[xs, sm, md, lg, xl]` |
| State | `rest` | `[rest, hover, active, selected, disabled, resolving, pending]` |
| Structure | (informational) | (component-specific; not used for variant flattening) |

`structure.mdx`'s `dimensional_values` is informational only — Structure does not appear in variant names (see "Structure dimension" above).

The `default` field is **load-bearing**, not decorative. The cap policy in this document references it at runtime — changing `default: rest` to `default: hover` in `state.mdx` shifts which combinations the walker emits, with no code edits. There is no second copy of "rest" in walker code.

## `applies_to` per-primitive applicability matrix

Without an explicit per-primitive declaration, the walker has no way to know that (e.g.) a `card` is sentiment-agnostic or a `tooltip` only ships in two sizes. Inferring from primitive name is fragile; emitting the full cap-policy cross-product produces orphans the linter rejects.

`components.json` extends to declare an `applies_to` shape per component:

```json
{
  "button": {
    "applies_to": {
      "sentiment": "all",
      "emphasis": "all",
      "size": "all",
      "state": "all"
    },
    "properties": {
      "backgroundColor": "{colors.primary}",
      "textColor": "{colors.on-primary}"
    }
  },
  "tooltip": {
    "applies_to": {
      "sentiment": ["neutral"],
      "emphasis": ["medium"],
      "size": ["sm", "md"],
      "state": ["rest", "hover"]
    },
    "properties": { "...": "..." }
  }
}
```

Rules:
- `"all"` resolves to "the values list from the dimension's `dimensional_values` frontmatter".
- Explicit arrays must be a strict subset of the dimension's `values` list. The walker fails fast if an explicit array names a value absent from the island, printing both lists side-by-side.
- The legacy flat shape (no `applies_to`, properties at the top level) is supported via a one-time pre-walk migration that infers `applies_to: all` for every dimension and emits a deprecation warning.

## Tie-break policy

Determinism rules consumed by `cascade.mjs`:

1. **Cascade collisions where two paths produce the same resolved hex after OKLCH→sRGB clipping** — keep the variant from the more specific dimensional path; if specificity ties, the lexicographically-lower variant name wins. Worked example: if `button-warning-low-sm-hover` and `button-warning-low-sm-active` both clip to `#9A4F1A`, both are emitted (specificity ties; the active state has its own row); but if a `button-warning-low` row would also clip to the same value, the more specific variants win and the `button-warning-low` row drops to avoid duplication.
2. **Iteration order across merged sources** — sort all object keys lexicographically before YAML emit. Pinned by the `emit-twice` round-trip test.
3. **Defaulted vs explicit primitive ordering in `components.json`** — author order in `components.json` wins. The legacy-shape migration shim preserves order.

## Implementation note — `cascade.mjs`

`_foundations/TOKEN-ARCHITECTURE.md` is the **canonical contract** for the cascade order (State → Emphasis → Sentiment → Semantic Color, line 48). `scripts/lib/cascade.mjs` is a **new implementation** of that contract — there is no pre-existing walker to reuse. The implementation reads `default` and `values` from each dimension's `dimensional_values` frontmatter at runtime, never embedding literal strings in code.

## `migrate` disposition YAML — canonical shape

Used by `--non-interactive --disposition <path>` for CI scripting of the `migrate` subcommand:

```yaml
version: 1
sections:
  - heading: "## Overview"        # exact heading text from the source file
    disposition: g                # g = generated, p = preserved, s = skip (delete)
  - heading: "## Colors"
    disposition: g
  - heading: "## The Five Dimensions"
    disposition: p
  - heading: "## Identity"
    disposition: p
  - heading: "## Stale Section"
    disposition: s
```

Rules:
- `version: 1` is required; future format changes bump this and `migrate` refuses unknown versions.
- `heading` matches the section heading verbatim, including the `## ` prefix. `migrate` errors if the YAML names a heading absent from the source, or if a source heading has no entry.
- `disposition` must be one of `g`, `p`, `s`. Any other value errors.
- Order in the YAML is informational; the source file's heading order is preserved on output.
