# Storybook Documentation Helpers API

These components live in `stories/helpers/` and are the **only** way to build documentation pages. Do not write inline styles or create local presentation components — every visual pattern has a helper.

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
| `Section` | Section wrapper with consistent bottom margin | — |
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
<TonalRamp
  palette="neutral"
  steps={NEUTRAL_STEPS}
/>
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
    { name: '--size-4', value: '0.25rem', description: '4px — tight spacing' },
    { name: '--size-8', value: '0.5rem', description: '8px — tight spacing' },
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

## Content & Guidance

```tsx
<Callout variant="tip">
  Pair foreground and background tokens from the same family for guaranteed contrast.
</Callout>

<DosDonts
  dos={['Use semantic tokens in components, not primitives directly.']}
  donts={['Do not hardcode hex values — always reference a token.']}
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

// For token data arrays
type DimensionalToken = {
  figmaPath: string;
  cssProperty: string;
  category: 'colour' | 'spacing' | 'typography' | 'structure';
};
```
