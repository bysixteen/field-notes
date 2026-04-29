# Input — contract

Starter contract for the `input` primitive. Source: `tokens.json` group `input`. Replace placeholder content with project-specific rules.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| value | string | — | controlled value |
| onChange | (value: string) => void | — | change handler |
| sentiment | `neutral` \| `danger` | `neutral` | semantic intent (danger for invalid state) |
| emphasis | `medium` | `medium` | inputs render at a single emphasis level |
| size | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | fixed footprint |
| state | `rest` \| `hover` \| `active` \| `disabled` | `rest` | runtime interaction state |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, danger | neutral |
| emphasis | data-emphasis | medium | medium |
| size | data-size | xs, sm, md, lg, xl | md |
| state | data-state | rest, hover, active, disabled | rest |

## Token bindings

- `--input-bg` → background fill
- `--input-fg` → entered text colour
- `--input-radius` → corner radius
- `--input-padding` → resolved inset per size step
- `--input-typography` → text type ramp

## Usage rules

Use Input for free-form single-line text entry. For multi-line content use a textarea; for constrained choices use Select or RadioGroup.

Pair `sentiment='danger'` with a visible validation message — colour alone is not sufficient signal.
