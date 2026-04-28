---
name: bs-storybook-foundations
description: >-
  Generate Storybook documentation stories for design system foundations:
  colour primitives, semantic tokens, spacing scales, typography scales, radii,
  elevation, and motion. Reads CSS token files and generates visual documentation
  pages using the shared helper component library. Triggers on: "document tokens
  in storybook", "storybook docs for primitives", "generate foundation stories",
  "colour scale documentation", "token documentation stories", "document
  spacing/typography scale", "storybook pages for design tokens", "foundation
  docs", "document elevation tokens", "motion token stories".
---

# Storybook Foundations Documentation

## Foundations (read first)

- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)
- [TOKEN-ARCHITECTURE](_foundations/TOKEN-ARCHITECTURE.md)

Generate `{foundation}.docs.stories.tsx` files from CSS token files.

Component stories show how a component behaves across its dimensions. Foundation stories show what raw values are *available* and how they relate to each other. Without these pages, designers and developers have to grep CSS files to understand the palette or guess spacing values.

When invoked via the `bs-storybook-ds` orchestrator, the helper API is already loaded. When invoked independently, read `bs-storybook-helpers` first for the complete helper component catalogue.

## Inputs

Read the relevant CSS token files before generating:

| File | Contains | Extract |
|------|----------|---------|
| `colors.css` | Primitive colour ramps (OKLCH, 12-step per palette) | `--colors-{palette}-{step}` custom properties |
| `semantics.css` | Purpose-driven aliases | `--{element}-{variant}-{state}` custom properties |
| `scale.css` | Spacing, sizing, radii, and stroke weights | `--size-{n}`, `--radii-{name}`, `--stroke-weight-{n}` |
| `typography.css` | Font size, weight, family, leading, tracking | `--font-size-{n}`, `--font-weight-{n}`, `--leading-{name}`, `--tracking-{name}`, `--font-family-{name}` |
| `elevation.css` | Box shadows and layering | `--shadow-{level}`, `--z-{name}` |
| `motion.css` | Easing curves and duration | `--ease-{name}`, `--duration-{name}` |

Match the page type to its source. Not every page needs every file.

## Meta Configuration

Foundation stories document tokens, not components. No `component` property:

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

## Page structure pattern

Every story uses the same structural hierarchy. This is what makes the documentation feel cohesive:

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

**Critical: never write inline styles.** Every visual pattern has a helper. If you find yourself writing `style={{ ... }}`, stop and use the appropriate helper component instead.

## Cross-referencing

Every token table entry must include both the CSS custom property and its Figma variable path:

```tsx
const NEUTRAL_TOKENS = [
  {
    name: '--colors-neutral-500',
    value: 'oklch(0.65 0 0)',
    figmaPath: 'Primitives/colors/neutral/500',
    description: 'Default border',
  },
];
```

Use `FigmaRef` alongside token entries so designers can locate each variable in the Figma file.

Where applicable, note which components consume each token:

```tsx
<Callout variant="note">
  Used by: Button (border-rest), Input (border-default), Card (border-subtle).
</Callout>
```

## Foundation page types

### Colour Primitives (`ColourPrimitives.docs.stories.tsx`)

Source: `colors.css`

Build a data array for each palette from the CSS custom properties. Every palette must include all 12 steps with their step role annotation:

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

const NEUTRAL_STEPS = Object.entries(STEP_ROLES).map(([step, role]) => ({
  step: Number(step),
  token: `--colors-neutral-${step}`,
  role,
}));
```

| Story | Content | Key helpers |
|-------|---------|-------------|
| `Overview` | All palettes as one `TonalRamp` per palette | `TonalRamp` |
| `{PaletteName}` | Full 12-step ramp with swatches and token table | `SwatchGrid`, `Swatch`, `TokenTable` |
| `LightnessProfile` | How lightness progresses across steps | `DemoBox` |
| `ThemeComparison` | Light and dark side by side using `data-theme` wrappers | `DemoBox`, `SwatchGrid` |
| `AccessiblePairings` | Foreground/background combinations meeting contrast | `DemoBox`, `Callout` |
| `InContext` | Tokens applied to a real UI composition (card with heading, body, border) | `DemoBox`, real components |

### Semantic Colours (`SemanticColours.docs.stories.tsx`)

Source: `semantics.css`

Group tokens by element (background, foreground, border, overlay). Not alphabetically.

| Story | Content |
|-------|---------|
| `Overview` | All elements grouped with representative swatches |
| `Backgrounds` | All `--background-*` tokens with their primitive alias |
| `Foregrounds` | All `--foreground-*` tokens |
| `Borders` | All `--border-*` tokens |
| `EmphasisScale` | Weaker to weak to standard to strong progression |
| `StateProgression` | Rest to hover to active to disabled for a representative set |
| `ThemeComparison` | Light and dark side by side |
| `InContext` | A complete UI panel using only semantic tokens |

### Spacing and Scale (`SpacingScale.docs.stories.tsx`)

Source: `scale.css`

Include **all** token types from the file: spacing (`--size-*`), radii (`--radii-*`), and stroke weights (`--stroke-weight-*`).

```tsx
const SPACING_SCALE = [
  { name: '--size-0', px: 0, rem: '0rem', tier: 'zero' },
  { name: '--size-4', px: 4, rem: '0.25rem', tier: 'tight' },
  { name: '--size-8', px: 8, rem: '0.5rem', tier: 'tight' },
  { name: '--size-12', px: 12, rem: '0.75rem', tier: 'medium' },
  // ... extract ALL values from the CSS file
] as const;
```

| Story | Content | Key helpers |
|-------|---------|-------------|
| `Overview` | Visual ruler of all spacing values | `DemoBox`, `TokenTable` |
| `SpacingTiers` | Grouped by Gestalt tier: tight (4-8), medium (12-20), loose (28-32+) | `Section`, `SectionHeading`, `Callout` |
| `Radii` | Each radius token as a specimen box | `DemoBox`, `SwatchGrid` |
| `StrokeWeights` | Each stroke weight as a line specimen | `DemoBox` |
| `Application` | Where each tier is used (gap, padding, margin) | `DosDonts` |

### Typography (`TypographyScale.docs.stories.tsx`)

Source: `typography.css`

Include **all** token categories: font families, font sizes, font weights, leading (line-height), and tracking (letter-spacing).

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

## Anti-patterns

These patterns produce inconsistent documentation. Every one has a helper that does the job better:

| Don't | Do instead |
|-------|-----------|
| `style={{ display: 'flex', gap: '1rem' }}` | Use `SwatchGrid` or `DemoBox` |
| `style={{ fontSize: '10px', color: '#6b7280' }}` | Use `SectionHeading` or `Callout` |
| `<div style={{ padding: '2rem' }}>` | Use `DocPage` or `Section` |
| `const ScaleBar = () => ...` (local component) | Use `DemoBox` with `TokenTable` |
| Hardcoded hex colours (`#94a3b8`) | Use `var(--colors-*)` CSS custom properties |
| `<table style={{ ... }}>` with inline cell styles | Use `TokenTable` component |

## Rules

1. **Derive everything from CSS files.** Parse custom properties, don't hardcode token names or values.
2. **Helpers only.** Use exclusively the components from `stories/helpers/`. No inline styles, no local presentation components.
3. **CSF3 + TypeScript.** `satisfies Meta`, no component type parameter for foundations.
4. **Fullscreen layout.** `parameters: { layout: 'fullscreen' }` and `tags: ['autodocs']`.
5. **Theme aware.** Colour specimens must show both light and dark via `data-theme` wrappers.
6. **Step roles.** Annotate every colour step with its semantic role.
7. **Group by purpose.** Semantic tokens grouped by element, not alphabetically.
8. **Complete extraction.** Include ALL tokens from the source file, including radii and stroke weights from `scale.css`, font families from `typography.css`.
9. **Cross-reference.** Every token table includes Figma variable paths. Note which components consume each token where applicable.
10. **Real UI context.** Each foundation page includes at least one `InContext` story showing tokens applied to actual UI compositions.

## Validation Checklist

- [ ] Every CSS custom property from the source file appears in a story
- [ ] Colour swatches use `Swatch` component with `token` prop (not hardcoded hex)
- [ ] Step roles annotated for all 12 steps per palette
- [ ] Theme comparison uses `data-theme="light"` and `data-theme="dark"` wrappers
- [ ] Spacing values include both px and rem
- [ ] All radii and stroke weights from `scale.css` are documented
- [ ] All font families from `typography.css` are documented
- [ ] Token tables include Figma variable paths for every entry
- [ ] At least one InContext story per foundation page
- [ ] Design rationale callout present explaining a key decision
- [ ] Zero inline `style={{ }}` attributes in story JSX
- [ ] All imports from `stories/helpers/` resolve
- [ ] `autodocs` tag and `fullscreen` layout present
