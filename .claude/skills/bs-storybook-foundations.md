---
name: bs-storybook-foundations
description: >-
  Generate Storybook documentation stories for design system foundations --
  color primitives, semantic tokens, spacing scales, typography scales, radii,
  elevation, and motion. Reads CSS token files and generates visual documentation
  pages using the shared helper component library. Triggers on: "document tokens
  in storybook", "storybook docs for primitives", "generate foundation stories",
  "color scale documentation", "token documentation stories", "document
  spacing/typography scale", "storybook pages for design tokens", "foundation
  docs", "document elevation tokens", "motion token stories",
  "foundation documentation", "primitives documentation",
  "color palette docs", "color palette docs", "color ramp",
  "color ramp", "OKLCH ramp", "semantic color docs", "semantic color docs",
  "token pages", "design token documentation", "document the tokens",
  "document the foundations", "document spacing tokens", "document radii",
  "document typography tokens", "document font scale",
  "document shadow tokens", "document elevation", "document motion tokens",
  "document easing curves", "document duration tokens",
  "storybook foundation pages", "foundation stories",
  "create token documentation", "visual token reference",
  "stroke weight documentation", "scale documentation",
  "swatch grid", "tonal ramp story", "lightness profile story",
  "theme comparison story", "accessible pairings story".
---

# Storybook Foundations Documentation

Generate `{foundation}.docs.stories.tsx` files from CSS token files.

Component stories show how a component behaves across its dimensions. Foundation stories show what raw values are *available* and how they relate to each other -- the building blocks that components consume. Without these pages, designers and developers have to grep CSS files to understand the palette or guess spacing values.

## Before you start

Read the helper API reference at `references/storybook-helpers-api.md` (sibling to this file). It documents every available helper component and how to use it. The helpers are the visual language of the documentation -- they enforce consistent layout, typography, and spacing across all pages.

## Inputs

Read the relevant CSS token files before generating:

| File | Contains | Extract |
|------|----------|---------|
| `colors.css` | Primitive color ramps (OKLCH, 12-step per palette) | `--colors-{palette}-{step}` custom properties |
| `semantics.css` | Purpose-driven aliases | `--{element}-{variant}-{state}` custom properties |
| `scale.css` | Spacing, sizing, radii, and stroke weights | `--size-{n}`, `--radii-{name}`, `--stroke-weight-{n}` |
| `typography.css` | Font size, weight, family, leading, tracking | `--font-size-{n}`, `--font-weight-{n}`, `--leading-{name}`, `--tracking-{name}`, `--font-family-{name}` |
| `elevation.css` | Box shadows and layering | `--shadow-{level}`, `--z-{name}` |
| `motion.css` | Easing curves and duration | `--ease-{name}`, `--duration-{name}` |

Match the page type to its source -- not every page needs every file.

## Meta Configuration

Foundation stories document tokens, not components -- no `component` property:

```tsx
import type { Meta } from '@storybook/react';
import { DocPage, Section, SectionHeading, Swatch, SwatchGrid, TonalRamp, TokenTable, DemoBox, Callout } from '../stories/helpers';

const meta = {
  title: 'Foundations/{TopicName}',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
```

## Color Step Roles (12-step OKLCH)

| Step | Role | Typical Use |
|------|------|-------------|
| 50 | App background | Page canvas |
| 100 | Subtle background | Zebra stripes, code blocks |
| 200 | Element background | Card, input default |
| 300 | Hover element | Interactive hover state |
| 400 | Subtle border | Dividers, hairlines |
| 500 | Default border | Input borders, outlines |
| 600 | Strong border | Focus rings, emphasis |
| 700 | Solid background | Primary buttons, badges |
| 800 | Solid hover | Button hover on solid |
| 900 | Low-contrast text | Placeholder, captions |
| 950 | Default text | Body text |
| 1000 | High-contrast text | Headings, emphasis |

## Standard Palettes

`neutral`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `teal`, `cyan`, `blue`, `indigo`, `violet`, `purple`, `pink`

## Page structure pattern

Every story uses the same structural hierarchy. This is what makes the documentation feel cohesive -- every page looks like it belongs to the same system:

```tsx
export const PaletteName = {
  render: () => (
    <DocPage title="Neutral" subtitle="12-step OKLCH ramp">
      <Section>
        <SectionHeading>Ramp</SectionHeading>
        <SwatchGrid>
          {NEUTRAL_STEPS.map(({ step, token, role }) => (
            <Swatch key={step} token={token} label={String(step)} sublabel={role} />
          ))}
        </SwatchGrid>
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={NEUTRAL_TOKENS} />
      </Section>
    </DocPage>
  ),
};
```

**Critical: never write inline styles.** Every visual pattern has a helper. If you find yourself writing `style={{ ... }}`, stop and use the appropriate helper component instead. The helpers use `docStyles.ts` constants for consistent typography, spacing, and color.

## Foundation Page Types

### Color Primitives (`ColorPrimitives.docs.stories.tsx`)

Source: `colors.css`

```tsx
const STEP_ROLES = {
  50: 'App background',       100: 'Subtle background',
  200: 'Element background',  300: 'Hover element',
  400: 'Subtle border',       500: 'Default border',
  600: 'Strong border',
  700: 'Solid background',    800: 'Solid hover',
  900: 'Low-contrast text',   950: 'Default text',
  1000: 'High-contrast text',
} as const;
```

| Story | Content | Key Helpers |
|-------|---------|-------------|
| `Overview` | All palettes -- one `TonalRamp` per palette | `TonalRamp` |
| `{PaletteName}` | Full 12-step ramp with swatches and token table | `SwatchGrid`, `Swatch`, `TokenTable` |
| `LightnessProfile` | How lightness progresses across steps | `DemoBox` |
| `ThemeComparison` | Light and dark side by side using `data-theme` wrappers | `DemoBox`, `SwatchGrid` |
| `AccessiblePairings` | Foreground/background combinations meeting contrast | `DemoBox`, `Callout` |

### Semantic Colors (`SemanticColors.docs.stories.tsx`)

Source: `semantics.css`

Group tokens by element (background, foreground, border, overlay) -- not alphabetically.

| Story | Content |
|-------|---------|
| `Overview` | All elements grouped with representative swatches |
| `Backgrounds` | All `--background-*` tokens with their primitive alias |
| `Foregrounds` | All `--foreground-*` tokens |
| `Borders` | All `--border-*` tokens |
| `EmphasisScale` | Weaker -> weak -> standard -> strong progression |
| `StateProgression` | Rest -> hover -> active -> disabled for a representative set |
| `ThemeComparison` | Light and dark side by side |

### Spacing & Scale (`SpacingScale.docs.stories.tsx`)

Source: `scale.css`

Include **all** token types from the file: spacing (`--size-*`), radii (`--radii-*`), and stroke weights (`--stroke-weight-*`).

| Story | Content | Key Helpers |
|-------|---------|-------------|
| `Overview` | Visual ruler of all spacing values | `DemoBox`, `TokenTable` |
| `SpacingTiers` | Grouped by Gestalt tier: tight (4-8), medium (12-20), loose (28-32+) | `Section`, `SectionHeading`, `Callout` |
| `Radii` | Each radius token as a specimen box | `DemoBox`, `SwatchGrid` |
| `StrokeWeights` | Each stroke weight as a line specimen | `DemoBox` |
| `Application` | Where each tier is used (gap, padding, margin) | `DosDonts` |

### Typography (`TypographyScale.docs.stories.tsx`)

Source: `typography.css`

| Story | Content |
|-------|---------|
| `FontFamilies` | Each `--font-family-*` token rendered as a text sample |
| `FontSizes` | Each `--font-size-*` token as text at that size, with rem and px values |
| `FontWeights` | Weight scale at a reference size |
| `LeadingScale` | Line-height values shown with multi-line text blocks |
| `TrackingScale` | Letter-spacing values shown with sample text |
| `TypePairings` | Common heading + body combinations |

### Elevation (`Elevation.docs.stories.tsx`)

Source: `elevation.css` (if present)

| Story | Content |
|-------|---------|
| `Overview` | Stacked cards showing each shadow level |
| `Levels` | Each `--shadow-*` token as a specimen box |
| `ZIndex` | Stacking order scale with visual layers |
| `ThemeComparison` | Light and dark shadow appearance |

### Motion (`Motion.docs.stories.tsx`)

Source: `motion.css` (if present)

| Story | Content |
|-------|---------|
| `EasingCurves` | Each `--ease-*` token visualised as an animation curve |
| `Durations` | Each `--duration-*` token as an animated specimen |
| `ReducedMotion` | How `prefers-reduced-motion` affects each |

## Available Helpers

| Helper | Purpose |
|--------|---------|
| `DocPage` | Page wrapper with title and subtitle |
| `Section` | Content section with consistent padding |
| `SectionHeading` | Section title typography |
| `Swatch` | Color swatch with token, label, sublabel |
| `SwatchGrid` | Grid layout for swatches |
| `TonalRamp` | Horizontal palette ramp visualization |
| `TokenTable` | Table of token names, values, categories |
| `DemoBox` | Labeled specimen container |
| `DosDonts` | Side-by-side do/don't examples |
| `Callout` | Highlighted note or warning |

## Anti-patterns

| Don't | Do Instead |
|-------|-----------|
| `style={{ display: 'flex', gap: '1rem' }}` | Use `SwatchGrid` or `DemoBox` |
| `style={{ fontSize: '10px', color: '#6b7280' }}` | Use `SectionHeading` or `Callout` |
| `<div style={{ padding: '2rem' }}>` | Use `DocPage` or `Section` |
| `const ScaleBar = () => ...` (local component) | Use `DemoBox` with `TokenTable` |
| Hardcoded hex colors (`#94a3b8`) | Use `var(--colors-*)` CSS custom properties |
| `<table style={{ ... }}>` with inline cell styles | Use `TokenTable` component |

## Rules

1. **Derive everything from CSS files** -- parse custom properties, don't hardcode token names or values
2. **Helpers only** -- read `references/storybook-helpers-api.md` and use exclusively those components. No inline styles, no local presentation components
3. **CSF3 + TypeScript** -- `satisfies Meta`, no component type parameter for foundations
4. **Fullscreen layout** -- `parameters: { layout: 'fullscreen' }` and `tags: ['autodocs']`
5. **Theme aware** -- color specimens must show both light and dark via `data-theme` wrappers
6. **Step roles** -- annotate every color step with its semantic role
7. **Group by purpose** -- semantic tokens grouped by element, not alphabetically
8. **Complete extraction** -- include ALL tokens from the source file, including radii and stroke weights from `scale.css`, font families from `typography.css`

## Validation Checklist

- [ ] Every CSS custom property from the source file appears in a story
- [ ] Color swatches use `Swatch` component with `token` prop (not hardcoded hex)
- [ ] Step roles annotated for all 12 steps per palette
- [ ] Theme comparison uses `data-theme="light"` and `data-theme="dark"` wrappers
- [ ] Spacing values include both px and rem
- [ ] All radii and stroke weights from `scale.css` are documented
- [ ] All font families from `typography.css` are documented
- [ ] Zero inline `style={{ }}` attributes in story JSX
- [ ] All imports from `stories/helpers/` resolve
- [ ] `autodocs` tag and `fullscreen` layout present

## Output Format Template

```
===========================================================
FOUNDATION DOCS: {TopicName}
Output: {path}/{topic}.docs.stories.tsx
Source: {css file(s) read}
===========================================================

STORIES GENERATED:
  [x] {StoryName} -- {description}
  ...

TOKENS DOCUMENTED: {count}
HELPERS USED: {list}
PALETTES COVERED: {list, if color}

VALIDATION:
  [x] All tokens from source file included
  [x] Step roles annotated
  [x] Theme comparison present
  [x] Zero inline styles
  [x] Helpers only
===========================================================
```

## Cross-References

| Related Skill | When to Use Together |
|---------------|---------------------|
| `bs-storybook-docs` | For component-specific documentation (not foundations) |
| `bs-tokens` | Token architecture knowledge helps understand cascade and naming |
| `bs-css` | CSS custom property conventions apply to token file parsing |
| `bs-accessibility` | Accessible pairings story requires contrast ratio knowledge |
| `bs-component-scaffold` | Scaffold references token values defined in foundations |

Full documentation: [Storybook Documentation Rules](/design-system/storybook-documentation-rules)
