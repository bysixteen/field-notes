# Badge — contract

Source: `tokens.json` group `badge`. Conforms to [`component-schema.mdx`](/design-system/tools/component-schema).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; label text |
| sentiment | `neutral` \| `warning` \| `highlight` \| `new` \| `positive` | `neutral` | semantic intent |
| size | `sm` \| `md` | `md` | fixed footprint |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning, highlight, new, positive | neutral |
| size | data-size | sm, md | md |

## Token bindings

- `--badge-bg` → background fill
- `--badge-fg` → label colour
- `--badge-radius` → corner radius (full-pill by default)
- `--badge-padding-x` → horizontal inset
- `--badge-padding-y` → vertical inset

## Usage rules

Use Badge to label status or count next to another element. Do not use Badge as an interactive control — use Button or Tag for clickable variants. Avoid using more than two badges side-by-side; collapse to a single composite indicator when possible.
