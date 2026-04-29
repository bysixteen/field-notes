# Alert — contract

Starter contract for the `alert` primitive. Source: `tokens.json` group `alert`. Replace placeholder content with project-specific rules.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; alert body content |
| sentiment | `positive` \| `warning` \| `danger` | `warning` | semantic intent — alerts always communicate something non-neutral |
| emphasis | `medium` | `medium` | tonal surface; no high or low emphasis |
| size | `md` | `md` | single fixed size |
| state | `rest` | `rest` | non-interactive |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | positive, warning, danger | warning |
| emphasis | data-emphasis | medium | medium |
| size | data-size | md | md |
| state | data-state | rest | rest |

## Token bindings

- `--alert-bg` → background fill
- `--alert-fg` → body text colour
- `--alert-radius` → corner radius
- `--alert-padding` → inset
- `--alert-typography` → body type ramp

## Usage rules

Use Alert to surface a non-blocking message — a success confirmation, a recoverable warning, an error explaining what went wrong. Pair the colour cue with explicit text — colour alone is not sufficient signal.

For blocking interactions (must-acknowledge errors, destructive confirmations), use a Dialog instead.
