## Card CSS Token Audit Summary

**File:** `Card.css` in `fn-tokens-workspace/evals/files/broken-card/`

**7 hardcoded values found, 8 correct token usages. ~53% token compliance.**

### Hardcoded Values

| Line | Property | Value | Category |
|------|----------|-------|----------|
| 8 | `background` | `#f5f5f5` | Color |
| 9 | `color` | `rgb(51, 51, 51)` | Color |
| 11 | `border-radius` | `8px` | Radius |
| 12 | `padding` | `16px 24px` | Spacing |
| 13 | `font-size` | `14px` | Typography |
| 31 | `font-size` | `18px` | Typography |
| 33 | `color` | `#1a1a1a` | Color |

### Correct Token Usages
The file correctly uses tokens for: `--border-width-thin`, `--color-border-primary`, `--color-border-secondary`, `--font-family-sans`, `--font-weight-600`, `--leading-normal`, `--space-200`, and `--space-300`.

### Key Risks
- Hardcoded colors will not respond to theme/dark-mode changes
- Raw pixel spacing and font-sizes bypass the design system scale
- Border radius won't update if the radius scale changes
