# Button — contract

Source: `tokens.json` group `button`. Conforms to [`component-schema.mdx`](/design-system/tools/component-schema).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; primary label text |
| sentiment | `neutral` \| `warning` \| `highlight` \| `new` \| `positive` | `neutral` | semantic intent |
| emphasis | `high` \| `medium` \| `low` | `high` | visual weight of the sentiment |
| state | `rest` \| `hover` \| `active` \| `selected` \| `disabled` \| `resolving` \| `pending` | `rest` | runtime interaction state |
| size | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | fixed footprint |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning, highlight, new, positive | neutral |
| emphasis | data-emphasis | high, medium, low | high |
| state | data-state | rest, hover, active, selected, disabled, resolving, pending | rest |
| size | data-size | xs, sm, md, lg, xl | md |

## Token bindings

- `--button-bg` → background fill
- `--button-fg` → label and icon colour
- `--button-border` → border colour at every emphasis level
- `--button-radius` → corner radius
- `--button-padding-x` → horizontal inset
- `--button-padding-y` → vertical inset
- `--button-height` → resolved height per size step

## Usage rules

Use Button for actions that change application state — submitting a form, opening a dialog, triggering a mutation. For navigation between pages or routes, use Link.

Do not stack two `emphasis='high'` Buttons in the same action group — pick one primary action and demote the rest. Do not nest a Button inside another interactive element.
