# Dimensional → DESIGN.md naming convention

The five canonical dimensions are documented in `content/design-system/model/index.mdx`:

| Dimension | Values | Decided when |
|-----------|--------|--------------|
| Sentiment | `neutral`, `warning`, `highlight`, `new`, `positive` | Composition |
| Emphasis | `high`, `medium`, `low` | Composition |
| State | `rest`, `hover`, `active`, `selected`, `disabled` | Runtime |
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
