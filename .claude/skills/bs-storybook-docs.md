---
name: bs-storybook-docs
description: >-
  Generate comprehensive Storybook documentation stories for a design system
  component. Reads the component source, types, and CSS to produce dimension
  matrix stories, token tables, anatomy breakdowns, and usage guidance.
  Triggers on: "generate storybook docs", "document this component in storybook",
  "create documentation stories", "storybook documentation for X",
  "add docs stories", "storybook docs", "docs stories", "documentation story",
  "write storybook documentation", "create docs.stories.tsx",
  "component documentation", "generate stories for",
  "document this component", "storybook page for",
  "add documentation to storybook", "create a storybook page",
  "dimension matrix story", "token table story", "anatomy story",
  "usage guidance story", "do dont story", "dos and donts",
  "CSF3 docs", "autodocs", "component storybook page",
  "visual documentation", "design system documentation".
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

| Story | Content | When to Include |
|-------|---------|----------------|
| `Default` | Component at all defaults | Always |
| `Sentiments` | Grid of all sentiment modes | Has sentiment dimension |
| `Emphases` | Grid of all emphasis levels | Has emphasis dimension |
| `Sizes` | Grid of all size modes | Has size dimension |
| `States` | Grid of all state modes | Has state dimension |
| `AllCombinations` | Sentiment x emphasis matrix at default size | Has both dimensions |
| `TokenReference` | Programmatic token table from CSS custom properties | Always |
| `Anatomy` | Numbered element breakdown from JSX structure | Always |
| `UsageGuidance` | Do/Don't examples derived from dimensions and a11y | Always |
| `DarkMode` | Light and dark theme side by side | Always |

## Meta Configuration Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './component-name';

const meta = {
  title: 'Components/{ComponentName}',
  component: ComponentName,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    // -- Dimensions --
    emphasis: { control: 'select', options: ['high', 'medium', 'low'] },
    sentiment: { control: 'select', options: ['neutral', 'warning', 'highlight', 'new', 'success', 'error'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    // -- Content --
    children: { control: 'text' },
    // -- Events --
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

## Dimension Grid Story Template

```tsx
export const Sentiments: Story = {
  render: () => (
    <DocPage title="Sentiments" subtitle="All sentiment modes at default emphasis and size">
      <Section>
        <SwatchGrid>
          {(['neutral', 'warning', 'highlight', 'new', 'success', 'error'] as const).map(
            (sentiment) => (
              <DemoBox key={sentiment} label={sentiment}>
                <ComponentName sentiment={sentiment}>Label</ComponentName>
              </DemoBox>
            ),
          )}
        </SwatchGrid>
      </Section>
    </DocPage>
  ),
};
```

## Combination Matrix Template

```tsx
export const AllCombinations: Story = {
  render: () => (
    <DocPage title="All Combinations" subtitle="Sentiment x Emphasis matrix">
      <Section>
        {(['high', 'medium', 'low'] as const).map((emphasis) => (
          <div key={emphasis}>
            <SectionHeading>{emphasis} emphasis</SectionHeading>
            <SwatchGrid>
              {SENTIMENTS.map((sentiment) => (
                <DemoBox key={sentiment} label={sentiment}>
                  <ComponentName emphasis={emphasis} sentiment={sentiment}>
                    Label
                  </ComponentName>
                </DemoBox>
              ))}
            </SwatchGrid>
          </div>
        ))}
      </Section>
    </DocPage>
  ),
};
```

## Token Map Pattern

Extract CSS custom properties from the stylesheet. Build a typed array:

```tsx
const COMPONENT_TOKENS = [
  { figmaPath: 'collection/path', cssProperty: '--component-bg', category: 'color' },
  { figmaPath: 'collection/path', cssProperty: '--component-fg', category: 'color' },
  { figmaPath: 'collection/path', cssProperty: '--component-padding-x', category: 'spacing' },
  { figmaPath: 'collection/path', cssProperty: '--component-height', category: 'spacing' },
  { figmaPath: 'collection/path', cssProperty: '--component-radius', category: 'structure' },
  { figmaPath: 'collection/path', cssProperty: '--component-font-size', category: 'typography' },
] satisfies DimensionalToken[];
```

Categories: `color`, `spacing`, `typography`, `structure`.

Render with `TokenTable` from `stories/helpers/`. Include `FigmaRef` for each entry.

## Anatomy Pattern

Derive from JSX structure. Number each element:

| # | Element | Role | Type |
|---|---------|------|------|
| 1 | Root | Container, data-* attributes | Fixed |
| 2 | Prefix | Leading slot | Optional |
| 3 | Label | Primary content | Required |
| 4 | Suffix | Trailing slot | Optional |

## Available Helpers

| Helper | Purpose |
|--------|---------|
| `DocPage` | Page wrapper with title and subtitle |
| `Section` | Content section with consistent padding |
| `SectionHeading` | Section title typography |
| `TokenTable` | Table of token names, values, categories |
| `Swatch` | Color swatch with label |
| `SwatchGrid` | Grid layout for swatches or demo items |
| `DemoBox` | Labeled specimen container |
| `DosDonts` | Side-by-side do/don't examples |
| `FigmaRef` | Link to Figma source |
| `Callout` | Highlighted note or warning |

## Rules

1. **No hardcoded values** -- every token name, dimension mode, and element comes from reading source files
2. **Helpers only** -- use components from `stories/helpers/`, no inline styles
3. **CSF3 + TypeScript** -- `satisfies Meta<typeof Component>`, `StoryObj` types
4. **Fullscreen layout** -- documentation stories use `layout: 'fullscreen'`
5. **Theme aware** -- all specimens must work with the global theme decorator

## Validation Checklist

- [ ] Every dimension from types file has a story
- [ ] Token table matches CSS custom properties exactly
- [ ] Anatomy matches JSX element structure
- [ ] All imports resolve
- [ ] No hardcoded color/spacing values
- [ ] Autodocs tag present
- [ ] Zero inline `style={{ }}` attributes

## Output Format Template

```
===========================================================
STORYBOOK DOCS: {ComponentName}
Output: {path}/{component}.docs.stories.tsx
===========================================================

STORIES GENERATED:
  [x] Default
  [x] Sentiments (6 modes)
  [x] Emphases (3 modes)
  [x] Sizes (5 modes)
  [x] States (7 modes)
  [x] AllCombinations (18 cells)
  [x] TokenReference ({n} tokens)
  [x] Anatomy ({n} elements)
  [x] UsageGuidance
  [x] DarkMode

TOKENS DOCUMENTED: {count}
HELPERS USED: {list}

VALIDATION:
  [x] All dimensions covered
  [x] Token table complete
  [x] Anatomy matches JSX
  [x] No hardcoded values
  [x] Autodocs tag present
===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-storybook-foundations` | For foundation/token documentation (not component-specific) |
| `bs-component-api` | API defines dimensions that become stories |
| `bs-tokens` | Token audit verifies the tokens documented in TokenReference |
| `bs-component-scaffold` | Scaffold generates initial stories file; docs stories are richer |
| `bs-review` | Run review first; docs stories should reflect final component state |
| `bs-accessibility` | UsageGuidance story should include a11y do/don'ts from audit |

Full documentation: [Storybook Documentation Rules](/design-system/storybook-documentation-rules)
