# Button — contract

Starter contract for the `button` primitive. Source: `tokens.json` group `button`. Replace placeholder content with project-specific rules.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; primary label text |
| sentiment | `neutral` \| `primary` \| `positive` \| `warning` \| `danger` | `neutral` | semantic intent |
| emphasis | `high` \| `medium` \| `low` | `medium` | visual weight of the sentiment |
| size | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | fixed footprint |
| state | `rest` \| `hover` \| `active` \| `disabled` | `rest` | runtime interaction state |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, primary, positive, warning, danger | neutral |
| emphasis | data-emphasis | high, medium, low | medium |
| size | data-size | xs, sm, md, lg, xl | md |
| state | data-state | rest, hover, active, disabled | rest |

## Token bindings

- `--button-bg` → background fill
- `--button-fg` → label and icon colour
- `--button-radius` → corner radius
- `--button-padding` → resolved inset per size step
- `--button-typography` → label type ramp

## Usage rules

Use Button for actions that change application state — submitting a form, opening a dialog, triggering a mutation. For navigation between pages or routes, use a link element.

Do not stack two `emphasis='high'` Buttons in the same action group — pick one primary action and demote the rest.
