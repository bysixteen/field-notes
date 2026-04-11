===========================================================
TOKEN AUDIT: Alert
Files: bs-tokens-workspace/evals/files/broken-cascade/Alert.css
===========================================================

COLOR TRACK:
  Sentiment -> Semantic Color:  PASS — Sentiment variants (warning, error, success) alias semantic color globals (e.g., --color-warning-bg, --color-error-fg) which are Semantic Color tokens.
  Emphasis -> Sentiment:         FAIL — Emphasis variants (high, medium, low) alias Semantic Color globals directly (e.g., --bg-surface-bold, --fg-primary), skipping the Sentiment layer entirely.
  State -> Emphasis:             FAIL — State variants (hover, active) alias primitive color tokens (--colors-blue-100, --colors-blue-300), skipping the Emphasis layer entirely.

STRUCTURAL TRACK:
  Spacing -> Size:               PASS — Padding tokens alias --space-* tokens (--space-400, --space-300, --space-100). Gap uses --space-300.
  Typography -> Semantic Type:   PASS — Font size aliases --font-size-14, a semantic typography token.
  Radius -> Semantic Scale:      PASS — Radius aliases --radii-md, a semantic scale token.

HARDCODED VALUES:
  0 found

  NOTE: CSS keywords (transparent, inherit, currentColor, none, 0)
  are NOT hardcoded violations — listed below with explanation:
  - Line 66: `transparent` for --alert-bg — intentional "no background" for low emphasis
  - Line 68: `transparent` for --alert-border — intentional "no border" for low emphasis
  - Line 100: `none` for background on .alert__dismiss — reset for button element
  - Line 101: `none` for border on .alert__dismiss — reset for button element

TOKENS CONSUMED:
  Color:      --color-surface-primary, --color-text-primary, --color-border-primary, --color-fg-secondary, --color-warning-bg, --color-warning-fg, --color-warning-border, --color-warning-icon, --color-error-bg, --color-error-fg, --color-error-border, --color-error-icon, --color-success-bg, --color-success-fg, --color-success-border, --color-success-icon, --bg-surface-bold, --fg-on-bold, --border-bold, --bg-surface-subtle, --fg-primary, --border-default, --colors-blue-100, --colors-blue-200, --colors-blue-300, --colors-blue-400
  Spacing:    --space-400, --space-300, --space-100
  Typography: --font-size-14
  Structure:  --radii-md, --border-width-thin

FINDINGS:
  [BLOCKING] Emphasis layer aliases Semantic Color directly, skipping Sentiment layer
    Current: Lines 53–57 — .alert[data-emphasis='high'] sets --alert-bg: var(--bg-surface-bold), --alert-fg: var(--fg-on-bold), --alert-border: var(--border-bold). Lines 59–63 — .alert[data-emphasis='medium'] sets --alert-bg: var(--bg-surface-subtle), --alert-fg: var(--fg-primary), --alert-border: var(--border-default).
    Should be: Emphasis must alias Sentiment tokens, not Semantic Color globals. For example: --alert-bg: var(--alert-sentiment-bg), --alert-fg: var(--alert-sentiment-fg), --alert-border: var(--alert-sentiment-border) — where --alert-sentiment-* are the Sentiment-layer tokens set by the sentiment selectors (lines 30–49).
    Why: When a sentiment is active (e.g., data-sentiment="error") and emphasis is also set, the emphasis override will clobber the sentiment value with a generic Semantic Color global. Sentiment changes will not propagate through emphasis variants — switching from "error" to "success" will have no visible effect when emphasis is "high" or "medium" because the emphasis layer points directly at theme-level globals instead of the sentiment layer.

  [BLOCKING] State layer aliases primitive color tokens directly, skipping Emphasis layer
    Current: Lines 73–76 — .alert[data-state='hover'] sets --alert-bg: var(--colors-blue-100), --alert-border: var(--colors-blue-300). Lines 78–81 — .alert[data-state='active'] sets --alert-bg: var(--colors-blue-200), --alert-border: var(--colors-blue-400).
    Should be: State must alias Emphasis tokens, not primitives. For example: --alert-bg: var(--alert-bg-hover), where --alert-bg-hover aliases the Emphasis-layer --alert-bg with a state modification (e.g., a hover overlay or shifted value). Primitives (--colors-blue-*) must never appear in component CSS.
    Why: Using primitives means (1) theme changes will not propagate — switching from light to dark mode will not update hover/active colors because --colors-blue-100 is a fixed palette value, (2) sentiment changes will not propagate — hovering an error alert will show blue instead of a red-derived hover state, and (3) emphasis changes will not propagate — the state layer is completely disconnected from the rest of the cascade.

CORRECT CHAIN (show for every cascade audit):
  State → Emphasis → Sentiment → Semantic Color

  Expected alias path for Alert:
    --alert-bg-hover (State)
      → --alert-bg (Emphasis)
        → --alert-sentiment-bg (Sentiment, e.g., --color-warning-bg)
          → Semantic Color global (e.g., --color-surface-primary)

    --alert-bg-active (State)
      → --alert-bg (Emphasis)
        → --alert-sentiment-bg (Sentiment)
          → Semantic Color global

    --alert-border-hover (State)
      → --alert-border (Emphasis)
        → --alert-sentiment-border (Sentiment, e.g., --color-error-border)
          → Semantic Color global (e.g., --color-border-primary)

===========================================================
