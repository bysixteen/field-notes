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

# Storybook Component Documentation

## Foundations (read first)

- [DESIGN-INTENT](_foundations/DESIGN-INTENT.md)
- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)

Generate a `{component}.docs.stories.tsx` from the component's source files.

When invoked via the `bs-storybook-ds` orchestrator, the helper API is already loaded. When invoked independently, read `bs-storybook-helpers` first for the complete helper component catalogue.

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
| `AllCombinations` | Sentiment x emphasis matrix at default size |
| `TokenReference` | Programmatic token table from CSS custom properties |
| `Anatomy` | Numbered element breakdown from JSX structure |
| `UsageGuidance` | Do/Don't examples derived from dimensions and a11y |
| `RealUIContext` | Component shown in an actual UI composition |
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
    // Dimensions: control 'select', options from types
    // Content: string/ReactNode props
    // Events: action annotations
  },
} satisfies Meta<typeof ComponentName>;
```

Group argTypes into: **Dimensions**, **Content**, **Events**.

## Token Map Pattern

Extract CSS custom properties from the stylesheet. Build a typed array that includes both the Figma variable path and the CSS property name:

```tsx
const COMPONENT_TOKENS = [
  {
    figmaPath: 'Semantic Color/background/neutral',
    cssProperty: '--background-rest',
    category: 'colour',
  },
  {
    figmaPath: 'Scale/space/16',
    cssProperty: '--padding-block',
    category: 'spacing',
  },
] satisfies DimensionalToken[];
```

Categories: `colour`, `spacing`, `typography`, `structure`.

Render with `TokenTable` from `stories/helpers/`. Include `FigmaRef` for each entry so designers can locate the variable in Figma.

## Anatomy Pattern

Derive from JSX structure. Number each element in the component tree:

| # | Element | Role | Type |
|---|---------|------|------|
| 1 | Root | Container, hosts data-* dimension attributes | Fixed |
| 2 | Prefix | Leading slot (icon, avatar) | Optional |
| 3 | Label | Primary text content | Required |
| 4 | Suffix | Trailing slot (badge, chevron) | Optional |

Type column values: `Fixed` (always rendered), `Required` (must have content), `Optional` (can be empty/absent).

## Design Rationale

Include at least one `Callout variant="note"` that explains a non-obvious design decision. Place it after the specimen it explains:

```tsx
<Callout variant="note">
  The button uses emphasis rather than variant naming because emphasis maps
  directly to token collection modes, enabling the mixing desk to resolve
  colours without conditional logic.
</Callout>
```

## Real UI Context

The `RealUIContext` story shows the component in an actual layout composition, not in isolation. For example:

- A Button inside a card footer alongside secondary actions
- A Select inside a form with label, helper text, and error state
- A Modal containing a form with submit/cancel buttons

Use real component imports, not mocked HTML. This demonstrates how tokens cascade in context.

## Rules

1. **No hardcoded values.** Every token name, dimension mode, and element comes from reading source files. Never guess.
2. **Helpers only.** Use exclusively the components from `stories/helpers/`. No inline styles, no local presentation components.
3. **CSF3 + TypeScript.** `satisfies Meta<typeof Component>`, `StoryObj` types.
4. **Fullscreen layout.** Documentation stories use `layout: 'fullscreen'`.
5. **Theme aware.** All specimens must work with the global theme decorator. DarkMode story uses `data-theme` wrappers.
6. **Cross-reference.** Token tables must include Figma paths. Mention which foundation page covers the tokens this component consumes.

## Validation Checklist

- [ ] Every dimension from types file has a story
- [ ] Token table matches CSS custom properties exactly
- [ ] Token table includes Figma variable paths for every entry
- [ ] Anatomy matches JSX element structure with # / Element / Role / Type columns
- [ ] At least one design rationale callout present
- [ ] Real UI context story included
- [ ] Do/Don't examples present for behavioural rules
- [ ] Dark mode comparison included
- [ ] All imports resolve
- [ ] No hardcoded colour/spacing values
- [ ] Zero inline style attributes
- [ ] Autodocs tag present
