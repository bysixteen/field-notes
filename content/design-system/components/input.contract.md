# Input — contract

Source: `tokens.json` group `input`. Conforms to [`component-schema.mdx`](/design-system/tools/component-schema).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| value | string | `""` | controlled value |
| onChange | `(event: ChangeEvent) => void` | — | controlled change handler |
| state | `rest` \| `hover` \| `active` \| `disabled` | `rest` | runtime interaction state |
| size | `sm` \| `md` \| `lg` | `md` | fixed footprint |
| placeholder | string | — | placeholder text |
| aria-label | string | — | required when no visible label is associated |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| state | data-state | rest, hover, active, disabled | rest |
| size | data-size | sm, md, lg | md |

## Token bindings

- `--input-bg` → background fill
- `--input-fg` → text colour
- `--input-border` → border colour
- `--input-radius` → corner radius
- `--input-padding-x` → horizontal inset
- `--input-padding-y` → vertical inset
- `--input-height` → resolved height per size step

## Usage rules

Use Input for free-form text entry. For constrained values, use Select or Combobox. Always provide a label, either visible or via `aria-label`. Do not use Input for displaying read-only data — render plain text instead.
