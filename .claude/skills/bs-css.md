---
name: bs-css
description: >-
  Write, review, and audit CSS/SCSS for design system components. Use when
  writing component styles, reviewing existing CSS for convention violations,
  or answering questions about how CSS and the token system interact. Covers
  section ordering, BEM modifiers, logical properties, focus-visible patterns,
  the margin ban, data-attribute selectors, transitions, and the
  prefers-reduced-motion motion section. Also use when auditing a stylesheet
  for hardcoded values or non-standard property usage.
---

# CSS Authoring Rules

## The Seven Non-Negotiables

| # | Rule | Violation Example | Correct Example |
|---|------|-------------------|-----------------|
| 1 | **BEM modifiers are structural only** -- dimensions arrive via `data-*` attributes | `.button--primary {}` | `[data-emphasis="high"] {}` |
| 2 | **Section order is enforced** -- Host > Rest > Interactive > Programmatic > Slots > Children > Motion | Transitions mixed with host | Transitions at end |
| 3 | **Pseudo-classes carry :not() guards** | `:hover {}` | `:hover:not([data-state="disabled"]):not([data-state="resolving"]) {}` |
| 4 | **Focus ring uses component focus-offset token** | `outline: 2px solid var(--ring-color)` | `outline: 2px solid var(--{component}-focus-ring-color); outline-offset: var(--{component}-focus-offset)` |
| 5 | **No margin on components** | `.button { margin: 8px }` | Parent handles spacing via gap/padding |
| 6 | **Logical properties over physical** | `width`, `padding-left`, `margin-right` | `inline-size`, `padding-inline-start`, `margin-inline-end` |
| 7 | **will-change requires justification** | `will-change: transform` (speculative) | Only after measured jank, with comment |

## Section Order (Mandatory)

```css
/* ============================================
   1. HOST -- layout invariants
   display, position, box-sizing, overflow
   ============================================ */

/* ============================================
   2. REST STATE -- token reads
   block-size, padding, background, color, border, border-radius, font
   ============================================ */

/* ============================================
   3. INTERACTIVE STATES -- pseudo-classes with :not() guards
   :hover, :active, :focus-visible
   ============================================ */

/* ============================================
   4. PROGRAMMATIC STATES -- data-attribute selectors
   [data-state="disabled"], [data-state="resolving"], [data-state="selected"]
   ============================================ */

/* ============================================
   5. SLOT CONTAINERS -- rest state only
   .{component}__prefix, .{component}__suffix
   ============================================ */

/* ============================================
   6. CHILD ELEMENTS -- label, icon, sub-elements
   .{component}__label, .{component}__icon
   ============================================ */

/* ============================================
   7. MOTION -- bare transition declarations
   transition, @keyframes, prefers-reduced-motion
   ============================================ */
```

## Logical Property Mapping

| Physical (do not use) | Logical (use this) |
|-----------------------|-------------------|
| `width` | `inline-size` |
| `height` | `block-size` |
| `min-width` | `min-inline-size` |
| `max-height` | `max-block-size` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `padding-top` | `padding-block-start` |
| `padding-bottom` | `padding-block-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `top` | `inset-block-start` |
| `right` | `inset-inline-end` |
| `bottom` | `inset-block-end` |
| `left` | `inset-inline-start` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |

## :not() Guard Template

```css
/* Hover */
.component:hover:not([data-state="disabled"]):not([data-state="resolving"]) { }

/* Active / pressed */
.component:active:not([data-state="disabled"]):not([data-state="resolving"]) { }

/* Focus */
.component:focus-visible { }
/* Focus never needs :not() guard -- disabled elements don't receive focus */
```

## Token Ownership Rules

| Stylesheet... | Does | Does NOT |
|---------------|------|----------|
| Read tokens | `var(--component-bg)` | Resolve/compute token values |
| Apply dimensions | `[data-emphasis="high"]` | Own dimensional variants |
| Style children | `.component__label` | Position itself in parent context |
| Declare transitions | `transition: background 150ms` | Use `will-change` without justification |

## Motion Section Template

```css
/* 7. Motion */
.component {
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .component {
    transition-duration: 0.01ms;
  }
}
```

## Audit Checklist

| Check | Severity | Section |
|-------|----------|---------|
| BEM modifier used for dimension | BLOCKING | 1 |
| Sections out of order | BLOCKING | All |
| Pseudo-class missing :not() guard | BLOCKING | 3 |
| Focus ring reads global token directly | SERIOUS | 3 |
| Margin on component root | SERIOUS | 1 |
| Physical property used | SERIOUS | All |
| will-change without justification | SERIOUS | 7 |
| Hardcoded color/spacing value | SERIOUS | 2 |
| Missing prefers-reduced-motion | MODERATE | 7 |
| Missing focus-visible styles | MODERATE | 3 |

## Output Format Template

```
===========================================================
CSS AUDIT: {ComponentName}
File: {path}
===========================================================

SECTION ORDER: {CORRECT | OUT OF ORDER: details}

FINDINGS:
  [{BLOCKING|SERIOUS|MODERATE}] Non-negotiable #{n}: {description}
    Line {n}: {code snippet}
    Fix: {specific remediation}

TOKEN READS:
  {list of CSS custom properties consumed}

PHYSICAL PROPERTIES FOUND:
  Line {n}: {property} --> should be {logical equivalent}

===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-tokens` | CSS reads token values -- audit token cascade integrity alongside CSS |
| `bs-accessibility` | Focus ring rules and :not() guards directly affect a11y compliance |
| `bs-component-scaffold` | Scaffold generates CSS file following these rules |
| `bs-review` | Full review runs CSS audit as Stage 5 |
| `bs-html` | HTML semantics determine which selectors are appropriate |

Applies to CSS and SCSS. See your project's design system documentation for the full CSS authoring reference.
