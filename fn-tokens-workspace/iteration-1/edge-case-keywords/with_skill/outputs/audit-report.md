===========================================================
TOKEN AUDIT: Tag
Files: Tag.css
===========================================================

COLOR TRACK:
  Sentiment -> Semantic Color:  PASS — All sentiment variants (neutral, warning, success, error) alias semantic color globals (e.g., `--color-warning-bg`, `--color-success-fg`).
  Emphasis -> Sentiment:         PASS — Low emphasis variant (`data-emphasis='low'`) overrides `--tag-bg`, `--tag-fg`, `--tag-border` with CSS keywords (`transparent`, `inherit`, `currentColor`), which is legitimate for an outline/ghost variant — no primitives used.
  State -> Emphasis:             PASS — Interactive hover/active states alias semantic surface tokens (`--color-surface-hover`, `--color-surface-active`), not primitives.

STRUCTURAL TRACK:
  Spacing -> Size:               WARNING — `--tag-padding-x` and `--tag-padding-y` alias `--space-200` and `--space-100`; `gap` uses `--space-100`. These use `--space-*` tokens rather than the expected `--size-*` pattern from the token naming convention. If `--space-*` is an accepted alias for `--size-*` in this project, this is a PASS; otherwise the tokens should map to `--size-*`.
  Typography -> Semantic Type:   PASS — `--tag-font-size` aliases `--font-size-12`; `font-weight` uses `--font-weight-500`; `line-height` uses `--leading-tight`. All follow semantic typography token patterns.
  Radius -> Semantic Scale:      PASS — `--tag-radius` aliases `--radii-full`.

HARDCODED VALUES:
  0 blocking (no hex, rgb, oklch values)
  0 serious (no raw pixel values for spacing or font-size)
  0 warning (no raw pixel values for border-radius)

  NOTE: The following CSS keyword values appear in the file but are NOT hardcoded violations:
  - Line 71: `transparent` — legitimate CSS keyword for outline/ghost variant background
  - Line 72: `inherit` — legitimate CSS keyword for inheriting parent color
  - Line 73: `currentColor` — legitimate CSS keyword for border matching text color
  - Line 79: `currentColor` — icon inherits parent text color
  - Line 90: `transparent` — dismiss button reset (background removal)
  - Line 91: `none` — dismiss button reset (border removal)
  - Line 92: `inherit` — dismiss button inherits parent color
  - Line 93: `0` — dismiss button padding reset

  These are structural CSS resets and intentional inheritance patterns, not design token violations.

TOKENS CONSUMED:
  Color:      --color-surface-secondary, --color-text-primary, --color-border-secondary, --color-neutral-bg, --color-neutral-fg, --color-neutral-border, --color-warning-bg, --color-warning-fg, --color-warning-border, --color-success-bg, --color-success-fg, --color-success-border, --color-error-bg, --color-error-fg, --color-error-border, --color-surface-hover, --color-surface-active
  Spacing:    --space-200, --space-100
  Typography: --font-size-12, --font-weight-500, --leading-tight
  Structure:  --radii-full, --border-width-thin

FINDINGS:
  [WARNING] Spacing tokens use `--space-*` instead of `--size-*`
    Current: `--space-200`, `--space-100` for padding and gap
    Should be: `--size-*` tokens per the token naming convention (e.g., `--size-16`, `--size-8`), unless `--space-*` is an accepted project alias for the size scale.

  [WARNING] Color token naming uses `--color-*` prefix instead of bare `--bg-*`/`--fg-*`
    Current: `--color-surface-secondary`, `--color-text-primary`, `--color-border-secondary`, etc.
    Should be: Per the token naming convention, semantic globals follow `--bg-*`, `--fg-*` patterns (e.g., `--bg-surface`, `--fg-primary`). If the project has standardized on `--color-*` as its semantic global prefix, this is acceptable — but it diverges from the documented convention.

  [WARNING] Border width token uses `--border-width-thin` — not documented in the token naming table
    Current: `--border-width-thin` (line 23)
    Should be: `--stroke-weight-*` per the token naming convention (e.g., `--stroke-weight-1`), unless `--border-width-*` is an accepted project alias.

SUMMARY:
  The Tag component has zero hardcoded values. All colors, spacing, typography, radius, and border-width values reference design tokens. The CSS keyword values (`transparent`, `inherit`, `currentColor`, `none`, `0`) are used appropriately for the outline variant and button resets — these are not token violations.

  Three naming-convention warnings were flagged where consumed token names diverge from the documented naming patterns. These may reflect project-level naming decisions rather than actual violations — verify against the project's token definitions.

===========================================================
