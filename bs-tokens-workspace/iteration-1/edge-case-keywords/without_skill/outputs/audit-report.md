# Tag Component CSS Token Compliance Audit

**File:** `bs-tokens-workspace/evals/files/edge-case/Tag.css`
**Date:** 2026-03-30
**Method:** Manual review (no skill framework)

---

## Summary

The Tag component CSS is **largely token-compliant**. It uses design token custom properties for colors, spacing, radii, typography, and borders throughout. However, several hardcoded values and CSS keywords were identified that warrant review.

**Total declarations reviewed:** ~40
**Token-backed declarations:** ~30
**Hardcoded values flagged:** 8
**Intentional/legitimate CSS keywords:** 5

---

## Flagged Hardcoded Values

### 1. `padding: 0` (line 93)

```css
.tag__dismiss {
  padding: 0;
}
```

**Severity:** Low
**Recommendation:** Replace with `var(--space-0)` or equivalent zero-spacing token if one exists in the token set. If the system defines no zero-value spacing token, `0` is acceptable since `0` is unit-agnostic and unambiguous.

### 2. `border: none` (line 91)

```css
.tag__dismiss {
  border: none;
}
```

**Severity:** Low
**Recommendation:** This is a CSS reset for the dismiss button (likely a `<button>` element). While `none` is a keyword rather than a design token, this is standard practice for resetting native button styles. Acceptable as-is, though some systems prefer `border: 0` or `border-width: 0`.

### 3. `cursor: pointer` (lines 58, 89)

```css
.tag[data-interactive='true'] { cursor: pointer; }
.tag__dismiss { cursor: pointer; }
```

**Severity:** None (acceptable)
**Recommendation:** `cursor` values are not typically tokenized. These are appropriate as hardcoded values.

### 4. `white-space: nowrap` (line 28)

```css
.tag { white-space: nowrap; }
```

**Severity:** None (acceptable)
**Recommendation:** Layout behavior keyword, not a candidate for tokenization.

### 5. `overflow: hidden` (line 83)

```css
.tag__label { overflow: hidden; }
```

**Severity:** None (acceptable)
**Recommendation:** Layout behavior keyword, not a candidate for tokenization.

### 6. `text-overflow: ellipsis` (line 84)

```css
.tag__label { text-overflow: ellipsis; }
```

**Severity:** None (acceptable)
**Recommendation:** Layout behavior keyword, not a candidate for tokenization.

### 7. `flex-shrink: 0` (lines 78, 88)

```css
.tag__icon { flex-shrink: 0; }
.tag__dismiss { flex-shrink: 0; }
```

**Severity:** None (acceptable)
**Recommendation:** Flexbox layout property, not a candidate for tokenization.

### 8. `display: inline-flex` (lines 16, 94)

```css
.tag { display: inline-flex; }
.tag__dismiss { display: inline-flex; }
```

**Severity:** None (acceptable)
**Recommendation:** Layout mode keyword, not a candidate for tokenization.

---

## Edge-Case Keywords Requiring Judgment

These CSS keywords appear as token *values* (assigned to component-scoped custom properties) and require careful evaluation:

### A. `transparent` (lines 71, 90)

```css
.tag[data-emphasis='low'] { --tag-bg: transparent; }
.tag__dismiss { background: transparent; }
```

**Assessment:** The file itself comments (line 69) that `transparent` is used "legitimately" for the outline variant. This is a valid semantic choice -- the low-emphasis tag intentionally has no background fill. The dismiss button's `transparent` is a standard button reset. Both are **acceptable** -- `transparent` is a CSS-native keyword that represents a deliberate design decision, not a missing token.

However, if the design system defines a `--color-transparent` or `--color-surface-transparent` token, those should be preferred for consistency and auditability.

### B. `inherit` (line 72)

```css
.tag[data-emphasis='low'] { --tag-fg: inherit; }
```

**Assessment:** Used so the low-emphasis tag inherits its text color from its parent context. This is **acceptable** -- it is a deliberate cascade decision. A token cannot meaningfully replace `inherit` since its value is context-dependent.

### C. `currentColor` (lines 73, 79)

```css
.tag[data-emphasis='low'] { --tag-border: currentColor; }
.tag__icon { color: currentColor; }
```

**Assessment:** `currentColor` ties the border/icon color to the computed `color` property, which is itself token-backed. This is a **legitimate CSS pattern** for maintaining color coherence without duplicating token references. Acceptable as-is.

### D. `color: inherit` (line 92)

```css
.tag__dismiss { color: inherit; }
```

**Assessment:** Same as B above -- the dismiss button inherits color from the tag host. **Acceptable.**

---

## Compliance Scorecard

| Category | Status |
|---|---|
| **Colors** | All token-backed via `--color-*` custom properties |
| **Spacing** | All token-backed via `--space-*` (except `padding: 0` on dismiss) |
| **Border radius** | Token-backed via `--radii-full` |
| **Border width** | Token-backed via `--border-width-thin` |
| **Typography (size)** | Token-backed via `--font-size-12` |
| **Typography (weight)** | Token-backed via `--font-weight-500` |
| **Typography (line-height)** | Token-backed via `--leading-tight` |
| **Layout properties** | Hardcoded (acceptable -- not tokenizable) |
| **Resets (border/padding)** | Hardcoded `none` / `0` (low severity) |

---

## Recommendations

1. **`padding: 0` on `.tag__dismiss`** -- If a `--space-0` token exists, use it for consistency. Otherwise, leave as-is.
2. **`transparent` usage** -- If the token system includes a semantic transparent color token (e.g., `--color-transparent`), prefer it. Otherwise, the raw keyword is fine.
3. **No action needed** on `inherit`, `currentColor`, `cursor`, `display`, `overflow`, `white-space`, `flex-shrink`, or `text-overflow` -- these are CSS behavior keywords, not design values.

**Overall verdict:** This file demonstrates strong token discipline. The hardcoded values are limited to CSS layout/behavior keywords and standard element resets, which are generally outside the scope of design token systems.
