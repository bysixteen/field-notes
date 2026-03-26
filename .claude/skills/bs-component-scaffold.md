---
name: bs-component-scaffold
description: >-
  Scaffold a new design system component with full boilerplate. Generates
  React .tsx, .css, .stories.tsx, .test.tsx, .types.ts, and index.ts using
  the dimensional model vocabulary and CSS custom properties. Use when:
  "create a component", "scaffold X", "new component called Y", "generate
  component boilerplate", "build component from scratch".
---

# Component Scaffold

## Inputs

- **Component name** (kebab-case, e.g. `status-indicator`)
- **Dimensions needed** — determined by component-api decision framework

## File Manifest

| File | Purpose |
|------|---------|
| `{name}.tsx` | React component with props interface |
| `{name}.types.ts` | Type unions for each dimension |
| `{name}.css` | Styles with CSS custom properties + `data-*` selectors |
| `{name}.stories.tsx` | Storybook stories (CSF3, autodocs) |
| `{name}.test.tsx` | Unit + jest-axe tests |
| `index.ts` | Barrel export |

## Dimension Decision

| Question | Dimension |
|----------|-----------|
| Interactive? | `state` + `emphasis` |
| Conveys meaning? | `sentiment` |
| Has size variants? | `size` |

## Pattern

All components use direct CSS custom properties. Multi-dimensional modes switch via `[data-*]` attribute selectors. No runtime resolver.

## Size Scale

| Mode | Height | Padding X | Gap |
|------|--------|-----------|-----|
| `xs` | 24px | 6px | 4px |
| `sm` | 32px | 10px | 6px |
| `md` | 40px | 14px | 8px |
| `lg` | 48px | 18px | 10px |
| `xl` | 56px | 22px | 12px |

## After Scaffold

1. Open in Storybook
2. Iterate on token values visually
3. Verify all dimension combinations
4. Check contrast ratios (4.5:1 text, 3:1 UI)
5. Run accessibility checks

Full documentation: [Component Scaffolding](/design-system/component-scaffolding)
