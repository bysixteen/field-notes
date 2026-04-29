# Card — contract

Starter contract for the `card` primitive. Source: `tokens.json` group `card`. Replace placeholder content with project-specific rules.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; card body content |
| sentiment | `neutral` | `neutral` | cards render at neutral sentiment only |
| emphasis | `high` | `high` | filled surface; no tonal or text variant |
| size | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | fixed footprint |
| state | `rest` | `rest` | non-interactive container |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral | neutral |
| emphasis | data-emphasis | high | high |
| size | data-size | xs, sm, md, lg, xl | md |
| state | data-state | rest | rest |

## Token bindings

- `--card-bg` → background fill
- `--card-radius` → corner radius
- `--card-padding` → inset
- `--card-elevation` → shadow depth (when present)

## Usage rules

Use Card to group related content into a single visual surface. Cards are containers — they don't introduce interactivity by themselves. For an interactive container, render a Card and place a Button or link inside it.

Avoid nesting Cards more than one level — repeated surfaces flatten the visual hierarchy.
