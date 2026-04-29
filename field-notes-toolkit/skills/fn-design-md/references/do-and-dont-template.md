# `## Do's and Don'ts` carrier patterns

The DESIGN.md schema cannot encode rules — only token values. Anything that is a **rule** rather than a **value** lives in the `## Do's and Don'ts` prose section. This file defines the carrier patterns for the rules a dimensional system depends on.

The agent reading the DESIGN.md will infer behaviour from these statements, so they must be unambiguous and load-bearing — not aesthetic preferences.

## Required sections

A complete `## Do's and Don'ts` includes at minimum:

1. **The dimensional model** — what the dimensions are and how they compose
2. **Sentiment selection** — when to use which sentiment
3. **Emphasis selection** — when to use which emphasis level
4. **State application** — what changes at each state, and what doesn't
5. **Composition order** — the canonical decision sequence
6. **Cascade behaviour** — how interpolation works when an exact variant isn't named
7. **Anti-patterns** — what NOT to do, with the reason

## Template

```markdown
## Do's and Don'ts

### Composition Model

Every component is the product of up to five independent dimensions: **Sentiment, Emphasis, Size, Structure, State**. Each is orthogonal — it does not conflict with any other dimension. No two dimensions ever control the same CSS property simultaneously.

- Sentiment: what the component communicates (`neutral`, `warning`, `highlight`, `new`, `positive`)
- Emphasis: how loudly it communicates (`high`, `medium`, `low`)
- Size: physical footprint (`xs`, `sm`, `md`, `lg`, `xl`)
- Structure: fixed anatomical dimensions (radius, gap, internal padding)
- State: interactive condition (`rest`, `hover`, `active`, `selected`, `disabled`)

**Decision order:** Sentiment → Emphasis → Size → Structure → State.
Start with meaning, then volume, then scale, then skeleton. State is never a composition decision — it's a runtime response.

### Sentiment Selection

| Sentiment | Use when |
|-----------|----------|
| `neutral` | No specific signal needed. The default. |
| `warning` | The user must be cautioned before proceeding. |
| `highlight` | The element is featured or recommended. |
| `new` | The element was recently added; promotional only. |
| `positive` | An action resolved successfully or is the safe path. |

Don't use sentiment for branding or decoration — that's what `colors.brand` is for.

### Emphasis Selection

| Emphasis | Use when |
|----------|----------|
| `high` | The primary action or first thing to see on the surface. |
| `medium` | A secondary or supporting action. |
| `low` | A tertiary, ambient, or destructive-but-rare action. |

A surface should rarely have more than one `high`-emphasis component competing for attention.

### State Application

State is applied at runtime in response to user interaction. Do not pre-compose state into a variant intentionally — pick the rest variant and let the framework apply the state.

- `rest` — default
- `hover` — pointer over the component
- `active` — being clicked / pressed
- `selected` — toggled on
- `disabled` — unavailable; reduced opacity, no pointer events

State never affects size or structure — only colour and (occasionally) elevation.

### Cascade and Interpolation

Not every (sentiment × emphasis × size × state) combination is named in this file. When a combination isn't named:

- Find the closest named variant by swapping one dimension at a time toward the default.
- The colour cascade resolves bottom-up: **State → Emphasis → Sentiment → Semantic Color**. A `warning low hover` is `warning low` with the hover state shift applied.
- Structure tokens (radius, fixed gaps) do not change with sentiment, emphasis, or state.

### Anti-patterns

- **Don't apply sentiment colour to non-component surfaces.** Surfaces (cards, panels, sheets) use semantic colours, not sentiments. Sentiments are for components that communicate.
- **Don't override state colours per component.** State shifts come from the cascade. If a button needs a different hover, the cascade is broken upstream.
- **Don't use a primitive token (e.g. `colors.blue-500`) directly in a component.** Always reference through the semantic layer so theme switches propagate.
- **Don't combine emphasis levels on the same surface.** A `high` button next to a `medium` button is fine; two `high` buttons compete for attention.
```

## Customising for an extracted site

When emitting from extract mode, you usually don't have full dimensional vocabulary inferred from a third-party site. In that case:

- Replace the Sentiment Selection table with whatever sentiment palette you actually identified (often just `neutral` and one accent).
- Drop dimensions that aren't represented (most extracted sites have no formal emphasis system — just primary/secondary buttons).
- Keep the Composition Model paragraph as-is — it teaches the reading agent what the dimensional model is, even if the extracted system doesn't fully embody it. This sets up future expansion.
- Add an explicit note: "This DESIGN.md was extracted from <url>. The source system does not formally distinguish <missing dimensions>; treat any new component additions as opportunities to introduce the missing dimensions."

## What NOT to put in `## Do's and Don'ts`

- Hex values, font sizes, spacing values — those go in the YAML frontmatter.
- Vague style preferences ("be modern", "feel premium") — agents can't act on these.
- Marketing copy or brand voice — those belong in `## Overview`.
