---
name: fn-storybook-helpers
description: >-
  Catalogue of documentation helper components used to build Storybook pages.
  Defines the API for every helper (DocPage, Section, TokenTable, Swatch,
  DosDonts, Callout, etc.) and maps each to its Figma documentation component
  equivalent. Loaded by the fn-storybook-ds orchestrator before any documentation
  generation. Triggers on: "what helpers are available", "documentation components",
  "helper API", "which component for this pattern".
---

# Storybook Documentation Helpers API

## Foundations (read first)

- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)

These components live in `stories/helpers/` and are the **only** way to build documentation pages. Do not write inline styles or create local presentation components. Every visual pattern has a helper.

## Page Structure

Every documentation story wraps content in this hierarchy:

```tsx
<DocPage title="Colour Primitives" subtitle="OKLCH 12-step ramps">
  <Section>
    <SectionHeading>Neutral</SectionHeading>
    {/* section content */}
  </Section>
  <Section>
    <SectionHeading>Brand</SectionHeading>
    {/* section content */}
  </Section>
</DocPage>
```

| Component | Purpose | Props |
|-----------|---------|-------|
| `DocPage` | Page wrapper with padding and max-width | `title`, `subtitle` |
| `Section` | Section wrapper with consistent bottom margin | children |
| `SectionHeading` | `h2` with uppercase label treatment and border-bottom | children (text) |

## Colour Display

```tsx
{/* Single swatch */}
<Swatch token="--colors-brand-500" label="500" sublabel="Solid background" />

{/* Grid of swatches */}
<SwatchGrid>
  {steps.map(({ step, token, role }) => (
    <Swatch key={step} token={token} label={String(step)} sublabel={role} />
  ))}
</SwatchGrid>

{/* Full palette ramp strip */}
<TonalRamp palette="neutral" steps={NEUTRAL_STEPS} />
```

| Component | Purpose | Props |
|-----------|---------|-------|
| `Swatch` | Single colour swatch bound to CSS custom property | `token`, `label`, `sublabel` |
| `SwatchGrid` | Flexible grid layout for arranging multiple swatches | children |
| `TonalRamp` | Horizontal strip showing full palette with hex values and auto-contrast text | `palette`, `steps` |

## Token Tables

```tsx
<TokenTable
  tokens={[
    { name: '--size-4', value: '0.25rem', description: '4px spacing' },
    { name: '--size-8', value: '0.5rem', description: '8px spacing' },
  ]}
/>
```

| Component | Purpose | Props |
|-----------|---------|-------|
| `TokenTable` | Table displaying token name, value, and description/preview | `tokens[]` |
| `BreakpointScaleTable` | Token values resolved at each breakpoint | `tokens[]`, `breakpoints[]` |

## Specimen Containers

```tsx
<DemoBox>
  {/* centred, bordered specimen area */}
  <Button sentiment="neutral">Example</Button>
</DemoBox>
```

| Component | Purpose | Props |
|-----------|---------|-------|
| `DemoBox` | Isolated frame with border, centred content | children |

## Content and Guidance

```tsx
<Callout variant="tip">
  Pair foreground and background tokens from the same family for guaranteed contrast.
</Callout>

<DosDonts
  dos={['Use semantic tokens in components, not primitives directly.']}
  donts={['Do not hardcode hex values. Always reference a token.']}
/>

<FigmaRef path="Primitives/colors/neutral/500" />
```

| Component | Purpose | Props |
|-----------|---------|-------|
| `Callout` | Highlighted message block | `variant`: `note` (grey), `warning` (amber), `tip` (green), `danger` (red) |
| `DosDonts` | Side-by-side do/don't guidance | `dos[]`, `donts[]` |
| `FigmaRef` | Figma variable path reference in monospace | `path` |
| `CodeBlock` | Monospace container with optional copy button | `children`, `copyable` |

## Shared Styles

Import layout constants from `docStyles.ts` rather than writing inline styles:

```tsx
import { docStyles } from '../stories/helpers/docStyles';
```

This provides consistent typography, spacing, and layout constants. Never hardcode `fontSize`, `gap`, `padding`, `color`, or `borderRadius` values in stories.

## Type Exports

```tsx
import type { DimensionalToken } from '../stories/helpers';

type DimensionalToken = {
  figmaPath: string;
  cssProperty: string;
  category: 'colour' | 'spacing' | 'typography' | 'structure';
};
```

## Figma Documentation Component Equivalents

When building documentation in Figma (via Prism MCP), each Storybook helper maps to a `.documentation/` Figma component:

| Storybook Helper | Figma Component | Notes |
|------------------|-----------------|-------|
| `DocPage` + `SectionHeading` | `.documentation/Header` | Title, description, status badge, storybook link |
| `TokenTable` | `.documentation/Table` + `.documentation/Table/Row` | Vertical stack of horizontal rows |
| `DemoBox` + numbered annotations | `.documentation/Anatomy` | Image/frame slot + annotation list |
| `DosDonts` | `.documentation/DoAndDont` | Horizontal layout, green/red accent bars |
| Section separator | `.documentation/Divider` | 1px line bound to `border/subtle` |
| `Callout` | No Figma equivalent yet | Use a text frame with rounded border manually |
| `Swatch` / `SwatchGrid` | No Figma equivalent yet | Use native Figma colour swatches bound to variables |
| `TonalRamp` | No Figma equivalent yet | Build manually with auto-layout frames |

The Figma components follow Uber Base style: simple rounded callouts, tabular colour, no accent bars or decorative elements. Status badges use text properties, not booleans.
