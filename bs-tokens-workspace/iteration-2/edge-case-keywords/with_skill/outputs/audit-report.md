===========================================================
TOKEN AUDIT: Tag
Files: Tag.css
===========================================================

COLOR TRACK:
  Sentiment -> Semantic Color:  PASS — Sentiment variants (lines 32–54) alias semantic color tokens (e.g., --color-warning-bg, --color-success-fg, --color-error-border).
  Emphasis -> Sentiment:         PASS — Low emphasis (lines 70–74) overrides --tag-bg, --tag-fg, --tag-border with CSS keywords (transparent, inherit, currentColor), which are legitimate non-token values.
  State -> Emphasis:             PASS — Interactive hover/active states (lines 61–67) alias semantic color tokens (--color-surface-hover, --color-surface-active).

STRUCTURAL TRACK:
  Spacing -> Size:               FAIL — Component spacing tokens alias --space-* tokens (e.g., --space-200, --space-100) instead of the expected --size-* scale tokens.
  Typography -> Semantic Type:   PASS — Font size aliases --font-size-12 (line 14); font weight uses --font-weight-500 (line 26); line height uses --leading-tight (line 27).
  Radius -> Semantic Scale:      PASS — Radius aliases --radii-full (line 13).

HARDCODED VALUES:
  0 found

  NOTE: CSS keywords (transparent, inherit, currentColor, none, 0)
  are NOT hardcoded violations — the following are present and legitimate:
  - Line 71: transparent — low-emphasis variant removes background; valid CSS keyword.
  - Line 72: inherit — low-emphasis variant inherits parent foreground color; valid CSS keyword.
  - Line 73: currentColor — low-emphasis variant border matches text color; valid CSS keyword.
  - Line 79: currentColor — icon slot inherits text color; valid CSS keyword.
  - Line 90: transparent — dismiss button has no background; valid CSS keyword.
  - Line 91: none — dismiss button has no border; valid CSS keyword.
  - Line 92: inherit — dismiss button inherits text color; valid CSS keyword.
  - Line 93: 0 — dismiss button has no padding; valid CSS keyword/zero value.

TOKENS CONSUMED:
  Color:      --color-surface-secondary, --color-text-primary, --color-border-secondary, --color-neutral-bg, --color-neutral-fg, --color-neutral-border, --color-warning-bg, --color-warning-fg, --color-warning-border, --color-success-bg, --color-success-fg, --color-success-border, --color-error-bg, --color-error-fg, --color-error-border, --color-surface-hover, --color-surface-active
  Spacing:    --space-200, --space-100
  Typography: --font-size-12, --font-weight-500, --leading-tight
  Structure:  --radii-full, --border-width-thin

FINDINGS:
  [WARNING] Spacing tokens use --space-* instead of --size-* scale
    Current: Line 11 --space-200, Line 12 --space-100, Line 18 gap: var(--space-100)
    Should be: --size-200 / --size-100 (or the appropriate --size-* equivalents), so that component spacing aliases the Size scale per structural track Rule 4.
    Why: If spacing tokens don't alias the canonical --size-* scale, density mode changes (compact/comfortable/spacious) won't propagate to this component. The Tag will ignore global density adjustments.

CORRECT CHAIN (show for every cascade audit):
  State → Emphasis → Sentiment → Semantic Color

  Color chain for Tag:
    State (hover/active): --tag-bg: var(--color-surface-hover/active)
      → Emphasis (high = default host): --tag-bg: var(--color-surface-secondary)
      → Emphasis (low = outline): --tag-bg: transparent
      → Sentiment (neutral/warning/success/error): --tag-bg: var(--color-{sentiment}-bg)
        → Semantic Color: --color-surface-secondary, --color-{sentiment}-bg, etc.

  Structural chain for Tag:
    --tag-padding-x: var(--space-200)  ← should be --size-* scale
    --tag-padding-y: var(--space-100)  ← should be --size-* scale
    --tag-radius: var(--radii-full)    ✓
    --tag-font-size: var(--font-size-12) ✓

===========================================================
