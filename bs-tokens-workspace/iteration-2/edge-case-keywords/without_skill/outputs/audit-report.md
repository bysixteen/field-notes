# Token Compliance Audit: Tag.css

**File:** `edge-case/Tag.css`
**Date:** 2026-03-30
**Auditor:** Claude (without skill)

---

## Summary

The Tag component CSS is well-structured, using local custom properties (scoped `--tag-*` variables) that resolve to design tokens. The majority of declarations are token-compliant. A small number of hardcoded values and CSS keywords require review.

---

## Findings

### Hardcoded Values Flagged

| # | Line / Selector | Property | Value | Issue | Recommendation |
|---|----------------|----------|-------|-------|----------------|
| 1 | `.tag__dismiss` | `padding` | `0` | Hardcoded zero. | Zero padding is generally acceptable since `0` has no unit and maps to "none." **Low risk** -- no token needed, but could use `var(--space-0, 0)` if the token set defines a zero-space token. |
| 2 | `.tag__dismiss` | `border` | `none` | Hardcoded keyword. | Acceptable CSS reset for a button element. **Low risk.** |

### CSS Keywords Requiring Contextual Judgment

| # | Line / Selector | Property | Value | Verdict |
|---|----------------|----------|-------|---------|
| 3 | `.tag[data-emphasis='low']` | `--tag-bg` | `transparent` | **Acceptable.** The file's own section comment acknowledges this as intentional for the outline variant. `transparent` is a valid CSS keyword with no equivalent design token in most systems. |
| 4 | `.tag[data-emphasis='low']` | `--tag-fg` | `inherit` | **Acceptable.** Inheriting color from the parent is the intended semantic behavior for an outline/low-emphasis variant. |
| 5 | `.tag[data-emphasis='low']` | `--tag-border` | `currentColor` | **Acceptable.** Using `currentColor` ties the border to the inherited text color, which is correct for this variant. |
| 6 | `.tag__icon` | `color` | `currentColor` | **Acceptable.** Standard pattern for icon slots to inherit color from the parent component. |
| 7 | `.tag__dismiss` | `color` | `inherit` | **Acceptable.** Same rationale as above -- dismiss button inherits color from the tag. |
| 8 | `.tag__dismiss` | `background` | `transparent` | **Acceptable.** Standard reset for a button element acting as an interactive icon. |

### Layout / Display Keywords

| # | Line / Selector | Property | Value | Verdict |
|---|----------------|----------|-------|---------|
| 9 | `.tag` | `display` | `inline-flex` | **Compliant.** Display mode is structural, not a token concern. |
| 10 | `.tag` | `white-space` | `nowrap` | **Compliant.** Behavioral CSS, not a token concern. |
| 11 | `.tag__icon`, `.tag__dismiss` | `flex-shrink` | `0` | **Compliant.** Flex behavior, not a token concern. |
| 12 | `.tag__label` | `overflow` | `hidden` | **Compliant.** Behavioral CSS, not a token concern. |
| 13 | `.tag__label` | `text-overflow` | `ellipsis` | **Compliant.** Behavioral CSS, not a token concern. |
| 14 | `.tag[data-interactive='true']` | `cursor` | `pointer` | **Compliant.** Behavioral CSS, not a token concern. |

---

## Token Usage (Compliant)

All of the following correctly reference design tokens:

- **Color:** `--color-surface-secondary`, `--color-text-primary`, `--color-border-secondary`, `--color-surface-hover`, `--color-surface-active`, and all sentiment tokens (`neutral`, `warning`, `success`, `error` for `bg`, `fg`, `border`).
- **Spacing:** `--space-200`, `--space-100`
- **Border:** `--border-width-thin`
- **Radius:** `--radii-full`
- **Typography:** `--font-size-12`, `--font-weight-500`, `--leading-tight`

---

## Verdict

| Category | Count |
|----------|-------|
| Total declarations reviewed | ~30 |
| Token-compliant | 28 |
| Hardcoded (flagged) | 2 (both low risk) |
| Intentional CSS keywords | 6 (all acceptable) |

**Overall: PASS.** The file demonstrates strong token discipline. The two hardcoded values (`padding: 0` and `border: none` on `.tag__dismiss`) are standard CSS resets on a button element and pose minimal risk. If the design system defines a `--space-0` token, the padding could optionally be updated for full consistency, but this is not a blocking concern.
