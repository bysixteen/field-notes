# Dimensional Model — foundations

Every component's visual appearance is the product of up to **five independent, orthogonal dimensions**. No two dimensions ever control the same CSS property simultaneously.

Canonical source: [`/content/design-system/model/index.mdx`](../../../content/design-system/model/index.mdx). This file summarises; that file is authoritative.

## The five dimensions

| Dimension | Controls | Decided when | Canonical values |
|---|---|---|---|
| **Sentiment** | What the component communicates | Composition time | `neutral`, `warning`, `highlight`, `new`, `positive` |
| **Emphasis** | How loudly the component communicates | Composition time | `low`, `medium`, `high` |
| **Size** | Spatial footprint (height, padding scale, touch target) | Composition time | `xs`, `sm`, `md`, `lg`, `xl` |
| **Structure** | Fixed anatomical shape (radius, fixed gaps, font-family) | Build time | Component-defined |
| **State** | Interactive surface changes | Runtime only | `rest`, `hover`, `active`, `selected`, `disabled`, `resolving`, `pending` |

## Color vs structural split

The five dimensions group into two kinds:

- **Color dimensions (cascading)** — Sentiment, Emphasis, State. Each layer aliases the one below; see [TOKEN-ARCHITECTURE](TOKEN-ARCHITECTURE.md#color-cascade).
- **Structural dimensions (independent)** — Size, Structure. They never alias the color cascade.

## Decision order

When composing a variant, reason in this order:

> Sentiment → Emphasis → Size → Structure → State

Start with meaning, then volume, then scale, then skeleton. State is never a composition decision — it appears at runtime.

## Coordinate addressing

A specific variant is addressed by its dimension coordinates:

```
Button[state=hover, emphasis=high, sentiment=highlight]
```

Omitted dimensions use defaults. The resolver handles fallback when an exact combination has no explicit token.

## Density is not a dimension

Density was considered as a sixth dimension and rejected. The Size dimension already encodes spatial footprint; introducing Density would create ambiguity (`size="sm" density="compact"` would have two attributes competing for the same CSS properties). Use a smaller `data-size` for compact layouts.

Full rationale: [`/content/design-system/model/density-note.mdx`](../../../content/design-system/model/density-note.mdx).

## Vocabulary checks (use these when auditing)

A skill auditing component API or token usage should flag:

- Booleans masquerading as dimensions (`isPrimary`, `large`) — must be enums.
- Visual names instead of dimension names (`primary`, `secondary`) — must be `emphasis="high"`, `emphasis="medium"`, etc.
- Non-canonical values (`emphasis="loud"`, `sentiment="danger"`) — must be from the canonical list.
- A dimension absent from a component that should have one (e.g. an interactive component with no `state`).

The exact severity for each violation lives in [QUALITY-GATES.md](QUALITY-GATES.md).
