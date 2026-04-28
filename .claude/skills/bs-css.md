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

## Foundations (read first)

- [TOKEN-ARCHITECTURE](_foundations/TOKEN-ARCHITECTURE.md)
- [QUALITY-GATES](_foundations/QUALITY-GATES.md)

## The Seven Non-Negotiables

| # | Rule | Violation Example | Correct Example |
|---|------|-------------------|-----------------|
| 1 | **BEM modifiers are structural only** — dimensions arrive via `data-*` attributes | `.button--primary {}` | `[data-emphasis="high"] {}` |
| 2 | **Section order is enforced** — Host > Rest > Interactive > Programmatic > Slots > Children > Motion | Transitions mixed with host | Transitions at end |
| 3 | **Pseudo-classes carry :not() guards** | `:hover {}` | `:hover:not([data-state="disabled"]):not([data-state="resolving"]) {}` |
| 4 | **Focus ring uses component focus-offset token** | `outline: 2px solid var(--ring-color)` | `outline: 2px solid var(--{component}-focus-ring-color); outline-offset: var(--{component}-focus-offset)` |
| 5 | **No margin on components** | `.button { margin: 8px }` | Parent handles spacing via gap/padding |
| 6 | **Logical properties over physical** | `width`, `padding-left`, `margin-right` | `inline-size`, `padding-inline-start`, `margin-inline-end` |
| 7 | **will-change requires justification** | `will-change: transform` (speculative) | Only after measured jank, with comment |

### Why each rule matters

**Rule 1 — No BEM for dimensions:** A `data-*` attribute is set once by React and CSS responds to all of it automatically. BEM requires manually toggling class names in JavaScript for every state change.

**Rule 2 — Section order:** Makes components auditable without running them. A reviewer can scan the file and know exactly where to look for hover states, disabled states, and transitions — no hunting.

**Rule 3 — :not() guards:** Without them, `:hover` fires on disabled and resolving elements, creating a visual state that contradicts the component's semantic state. Users see hover feedback on a button that cannot be activated.

**Rule 5 — No margin:** Margin creates invisible coupling between components. A parent's layout changes should not require editing every child component's stylesheet.

**Rule 6 — Logical properties:** A single RTL language switch breaks every `padding-left` / `padding-right` across the codebase. Logical properties handle directionality automatically.

**Rule 7 — will-change justification:** `will-change` creates a new GPU compositor layer. Applied speculatively across 50 components, it can consume significant memory and actually degrade rendering performance.

## Ambiguity Guidance

| Question | Answer |
|----------|--------|
| Is a BEM modifier structural or dimensional? | Structural: `--full-width`, `--borderless`. Dimensional: `--large`, `--primary` — these are dimensions, use `data-*`. |
| Can I skip the :not() guard? | Yes, on non-interactive display components that have no disabled or resolving state. |
| When is a hardcoded value acceptable? | `border-radius: 50%` for circles. `0` for reset values (`border: 0`, `padding: 0`). Not for colors or spacing. |

## Common Mistakes

```css
/* BEFORE: BEM modifier for dimension (Rule 1) */
.button--large { block-size: 48px; }

/* AFTER: data-attribute selector */
.button[data-size="lg"] { block-size: var(--button-height); }
```

```css
/* BEFORE: hover fires on disabled (Rule 3) */
.button:hover { background: var(--button-bg-hover); }

/* AFTER: :not() guard */
.button:hover:not([data-state="disabled"]):not([data-state="resolving"]) {
  background: var(--button-bg-hover);
}
```

```css
/* BEFORE: margin on component (Rule 5) */
.badge { margin-block-end: 8px; }

/* AFTER: no margin — parent owns spacing */
/* Parent: */ .card__header { display: flex; gap: var(--size-8); }

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

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`.
