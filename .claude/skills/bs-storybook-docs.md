---
name: bs-storybook-docs
description: >-
  Generate comprehensive Storybook documentation stories for a design system
  component. Reads the component source, types, and CSS to produce dimension
  matrix stories, token tables, anatomy breakdowns, and usage guidance.
  Triggers on: "generate storybook docs", "document this component in storybook",
  "create documentation stories", "storybook documentation for X",
  "add docs stories".
---

# Storybook Documentation Generation

Generate a `{component}.docs.stories.tsx` from the component's source files.

## Inputs

Read these files before generating:

| File | Extract |
|------|---------|
| `{component}.tsx` | Props interface, defaults, JSX structure (elements, slots) |
| `{component}.types.ts` | Dimension unions and their modes |
| `{component}.css` | CSS custom properties consumed, section structure |

## Output Structure

A single CSF3 story file with these named exports:

| Story | Content |
|-------|---------|
| `Default` | Component at all defaults |
| `Sentiments` | Grid of all sentiment modes (if applicable) |
| `Emphases` | Grid of all emphasis levels (if applicable) |
| `Sizes` | Grid of all size modes (if applicable) |
| `States` | Grid of all state modes (if applicable) |
| `AllCombinations` | Sentiment × emphasis matrix at default size |
| `TokenReference` | Programmatic token table from CSS custom properties |
| `Anatomy` | Numbered element breakdown from JSX structure |
| `UsageGuidance` | Do/Don't examples derived from dimensions and a11y |
| `DarkMode` | Light and dark theme side by side |

Only include dimension stories for dimensions the component uses.

## Meta Configuration

```tsx
const meta = {
  title: 'Components/{ComponentName}',
  component: ComponentName,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    // Dimensions — control: 'select', options from types
    // Content — string/ReactNode props
    // Events — action annotations
  },
} satisfies Meta<typeof ComponentName>;
```

Group argTypes into: **Dimensions**, **Content**, **Events**.

## Token Map Pattern

Extract CSS custom properties from the stylesheet. Build a typed array:

```tsx
const COMPONENT_TOKENS = [
  { figmaPath: 'collection/path', cssProperty: '--prop-name', category: 'colour' },
] satisfies DimensionalToken[];
```

Categories: `colour`, `spacing`, `typography`, `structure`.

Render with `TokenTable` from `stories/helpers/`. Include `FigmaRef` for each entry.

## Anatomy Pattern

Derive from JSX structure. Number each element:

| # | Element | Role | Type |
|---|---------|------|------|
| 1 | Root | Container, data-* attributes | Fixed |
| 2 | Prefix | Leading slot | Optional |
| 3 | Label | Primary content | Required |

## Rules

1. **No hardcoded values** — every token name, dimension mode, and element comes from reading source files
2. **Helpers only** — use `DocPage`, `TokenTable`, `Swatch`, `DemoBox`, `DosDonts`, `FigmaRef`, `Callout` from `stories/helpers/`
3. **CSF3 + TypeScript** — `satisfies Meta<typeof Component>`, `StoryObj` types
4. **Fullscreen layout** — documentation stories use `layout: 'fullscreen'`
5. **Theme aware** — all specimens must work with the global theme decorator

## Validation Checklist

- [ ] Every dimension from types file has a story
- [ ] Token table matches CSS custom properties exactly
- [ ] Anatomy matches JSX element structure
- [ ] All imports resolve
- [ ] No hardcoded colour/spacing values
- [ ] Autodocs tag present

Full documentation: [Storybook Documentation Rules](/design-system/storybook-documentation-rules)
