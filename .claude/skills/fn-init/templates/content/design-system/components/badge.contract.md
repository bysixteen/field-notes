# Badge — contract

Starter contract for the `badge` primitive. Source: `tokens.json` group `badge`. Replace placeholder content with project-specific rules.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; short label content |
| sentiment | `neutral` \| `primary` \| `positive` \| `warning` \| `danger` | `neutral` | semantic intent |
| emphasis | `high` \| `medium` | `medium` | filled or tonal — no low emphasis |
| size | `sm` \| `md` | `md` | only two size steps for badges |
| state | `rest` | `rest` | non-interactive |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, primary, positive, warning, danger | neutral |
| emphasis | data-emphasis | high, medium | medium |
| size | data-size | sm, md | md |
| state | data-state | rest | rest |

## Token bindings

- `--badge-bg` → background fill
- `--badge-fg` → label colour
- `--badge-radius` → corner radius
- `--badge-padding` → inset
- `--badge-typography` → label type ramp

## Usage rules

Use Badge to mark counts, statuses, or short labels alongside other content. Badges are decorative — they should not be the only signal for an interactive state.

Keep label text under three words; for longer messages use Alert.
