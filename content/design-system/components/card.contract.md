# Card — contract

Source: `tokens.json` group `card`. Conforms to [`component-schema.mdx`](/design-system/tools/component-schema).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; card body |
| size | `sm` \| `md` \| `lg` | `md` | controls internal padding scale |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| size | data-size | sm, md, lg | md |

## Token bindings

- `--card-bg` → background fill
- `--card-fg` → default text colour
- `--card-border` → outline at low elevation
- `--card-radius` → corner radius
- `--card-padding` → internal inset per size step

## Usage rules

Use Card to group related content with a clear surface boundary — a media tile, a metric, a form section. Cards are non-interactive containers; place a Button inside the card for primary actions rather than making the entire card clickable. Avoid nesting cards inside cards.
