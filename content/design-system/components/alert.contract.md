# Alert — contract

Source: `tokens.json` group `alert`. Conforms to [`component-schema.mdx`](/design-system/tools/component-schema).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; alert body |
| sentiment | `neutral` \| `warning` \| `highlight` \| `positive` | `neutral` | semantic intent |
| title | string | — | optional alert heading |
| onDismiss | `() => void` | — | renders a close affordance when provided |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning, highlight, positive | neutral |

## Token bindings

- `--alert-bg` → background fill
- `--alert-fg` → body and title colour
- `--alert-border` → leading edge accent
- `--alert-radius` → corner radius
- `--alert-padding` → internal inset

## Usage rules

Use Alert to surface a system message that demands acknowledgement before continuing — validation summaries, transient warnings, success confirmations. For passive metadata, use Badge. Limit one Alert per logical region; nesting alerts inside cards or panels dilutes their signal.
