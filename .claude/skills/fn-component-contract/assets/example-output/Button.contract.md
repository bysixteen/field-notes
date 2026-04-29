# Button — contract

Source: `Button.tsx`, `Button.types.ts`, `Button.css`. Conforms to [`component-schema.mdx`](../../../../../content/design-system/tools/component-schema.mdx).

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| children | React.ReactNode | — | required; primary label text |
| sentiment | ButtonSentiment | neutral | neutral \| warning \| highlight \| success \| error |
| emphasis | ButtonEmphasis | high | high \| medium \| low |
| state | ButtonState | rest | rest \| hover \| active \| disabled \| resolving |
| size | ButtonSize | md | xs \| sm \| md \| lg \| xl |
| structure | ButtonStructure | standard | standard \| icon-only \| split |
| prefix | React.ReactNode | — | optional leading slot |
| suffix | React.ReactNode | — | optional trailing slot |
| onClick | (event: React.MouseEvent\<HTMLButtonElement\>) => void | — | optional |
| type | 'button' \| 'submit' \| 'reset' | button | HTML form-association |
| aria-label | string | — | required when `structure='icon-only'` |

## Dimension encoding

| Dimension | data-* attribute | Values | Default |
|-----------|------------------|--------|---------|
| sentiment | data-sentiment | neutral, warning, highlight, success, error | neutral |
| emphasis | data-emphasis | high, medium, low | high |
| state | data-state | rest, hover, active, disabled, resolving | rest |
| size | data-size | xs, sm, md, lg, xl | md |
| structure | data-structure | standard, icon-only, split | standard |

## Token bindings

- `--btn/color/bg/rest` → background fill
- `--btn/color/fg/rest` → label and icon colour
- `--btn/color/border/rest` → border colour at every emphasis level
- `--btn/spacing/padding-x` → horizontal inset
- `--btn/spacing/padding-y` → vertical inset
- `--btn/spacing/gap` → spacing between prefix, label, suffix
- `--btn/typography/font-size` → label font size per size step
- `--btn/typography/font-weight` → label font weight
- `--btn/typography/line-height` → label line height
- `--btn/structure/border-radius` → corner radius
- `--btn/structure/border-width` → border thickness
- `--btn/structure/min-height` → resolved height per size step

## Usage rules

Use Button for actions that change application state — submitting a form, opening a dialog, triggering a mutation. For navigation between pages or routes, use Link. For toggle-style controls within a related group, use ToggleGroup.

Do not pass a `loading` boolean — use `state='resolving'` instead. Do not introduce `isPrimary` / `isGhost` booleans — emphasis is an enum (`high` / `medium` / `low`). Do not render a Button with `structure='icon-only'` without an `aria-label`. Do not stack two `emphasis='high'` Buttons in the same action group — pick one primary action and demote the rest. Do not nest a Button inside another interactive element.

Built on the native `<button>` element. Inherits implicit role, keyboard activation (Enter, Space), and form-association behaviour. When `state='disabled'` or `state='resolving'`, the rendered element sets the native `disabled` attribute and suppresses `onClick`; `state='resolving'` additionally sets `aria-busy="true"` for assistive-technology announcements.
