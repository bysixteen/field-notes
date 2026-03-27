---
name: bs-css
description: >-
  Write, review, and audit CSS/SCSS for design system components. Use when
  writing component styles, reviewing existing CSS, auditing for violations,
  or answering questions about how CSS and the token system interact. Triggers
  on: "write the styles for", "review this CSS", "is this CSS correct",
  "section order", "BEM modifiers", "focus ring", "logical properties",
  "margin ban", "will-change".
---

# CSS Authoring Rules

## The Seven Non-Negotiables

1. **BEM modifiers are structural only** — dimensions arrive via `data-*` attributes, not BEM
2. **Section order is enforced** — Host → Rest → Interactive → Programmatic → Slots → Children → Motion
3. **Pseudo-classes carry :not() guards** — `:hover:not([data-disabled]):not([data-resolving])`
4. **Focus ring uses component focus-offset token** — never read global `--ring-offset-*` directly
5. **No margin on components** — spacing is the parent's responsibility
6. **Logical properties over physical** — `inline-size` not `width`, `padding-inline` not `padding-left`
7. **will-change requires justification** — never speculative, only after measured jank

## Section Order

```css
/* 1. Host — layout invariants */
/* 2. Rest state — token reads */
/* 3. Interactive states — pseudo-classes with :not() guards */
/* 4. Programmatic states — data-attribute selectors */
/* 5. Slot containers — rest state only */
/* 6. Child elements — label, icon, sub-elements */
/* 7. Motion — bare transition declarations */
```

## Token Ownership

Stylesheet reads pre-resolved CSS custom properties. It never resolves tokens, never owns dimensional variants, never positions itself in parent context.

Full documentation: [CSS Authoring Rules](/design-system/css-authoring-rules)
