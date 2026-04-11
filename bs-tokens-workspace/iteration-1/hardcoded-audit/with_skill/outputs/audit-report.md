## Token Audit: Card Component

### Hardcoded Values Found

| Line | Value | Severity | Should Be |
|------|-------|----------|-----------|
| 8 | `#f5f5f5` (background) | BLOCKING | `var(--card-bg)` -> `var(--bg-surface)` |
| 9 | `rgb(51, 51, 51)` (color) | BLOCKING | `var(--card-fg)` -> `var(--fg-primary)` |
| 11 | `8px` (border-radius) | WARNING | `var(--card-radius)` -> `var(--radii-sm)` |
| 12 | `16px 24px` (padding) | SERIOUS | `var(--card-padding-y)` / `var(--card-padding-x)` -> `var(--size-*)` |
| 13 | `14px` (font-size) | SERIOUS | `var(--card-font-size)` -> `var(--font-size-14)` |
| 31 | `18px` (font-size) | SERIOUS | `var(--card-title-font-size)` -> `var(--font-size-18)` |
| 33 | `#1a1a1a` (color) | BLOCKING | `var(--card-title-fg)` -> `var(--fg-primary)` |

### Color Track: FAIL
No component-scoped color tokens exist. All three color values are raw hex/rgb, completely bypassing the Sentiment -> Emphasis -> State cascade. Dark mode will not work.

### Structural Track: PARTIAL FAIL
- **Spacing:** Mixed -- `gap` and some padding use `--space-*`, but main card padding is hardcoded.
- **Typography:** Mixed -- `font-family`, `font-weight`, `line-height` use tokens; both `font-size` values are hardcoded.
- **Radius:** Hardcoded `8px`.

### Tokens Consumed Correctly
`--border-width-thin`, `--color-border-primary`, `--color-border-secondary`, `--font-family-sans`, `--font-weight-600`, `--leading-normal`, `--space-200`, `--space-300`

### Summary: 3 BLOCKING, 3 SERIOUS, 1 WARNING
