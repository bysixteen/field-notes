import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  DocPage,
  TokenTable,
  Swatch,
  DemoBox,
  DosDonts,
  Callout,
} from '../stories/helpers';
import type { DimensionalToken } from '../stories/helpers';

/* =================================================================
   Meta
   ================================================================= */

const meta = {
  title: 'Foundations/Color Primitives',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* =================================================================
   Palette definitions — 12-step OKLCH ramps
   ================================================================= */

const PALETTES = ['neutral', 'brand', 'red', 'amber', 'green'] as const;
type Palette = (typeof PALETTES)[number];

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const;
type Step = (typeof STEPS)[number];

/** Human-readable role for each step in the ramp. */
const STEP_ROLES: Record<Step, string> = {
  50: 'Background — lightest tint, used for surface fills',
  100: 'Background subtle — slightly stronger surface or hover state',
  200: 'Border light — low-contrast separators and outlines',
  300: 'Border — standard-weight borders and dividers',
  400: 'Border strong — high-contrast borders and focus rings',
  500: 'Solid — primary fill color (anchor step)',
  600: 'Solid strong — pressed / active variant of the solid fill',
  700: 'Text subtle — secondary text on light backgrounds',
  800: 'Text — primary readable text on light backgrounds',
  900: 'Text strong — high-emphasis headings on light backgrounds',
  950: 'Contrast subtle — near-black for maximum contrast contexts',
  1000: 'Contrast — darkest value, used sparingly for maximum weight',
};

/** Build a CSS variable reference for a given palette and step. */
const cssVar = (palette: Palette, step: Step): string =>
  `var(--colors-${palette}-${step})`;

/** Build a token list for a single palette. */
const buildPaletteTokens = (palette: Palette): DimensionalToken[] =>
  STEPS.map((step) => ({
    figmaPath: `colors/${palette}/${step}`,
    cssProperty: `--colors-${palette}-${step}`,
    category: 'color' as const,
  }));

/** All color tokens across every palette. */
const ALL_COLOR_TOKENS: DimensionalToken[] = PALETTES.flatMap(buildPaletteTokens);

/* =================================================================
   Shared styles
   ================================================================= */

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`,
  gap: '0.25rem',
};

const swatchStyle = (palette: Palette, step: Step): React.CSSProperties => ({
  backgroundColor: cssVar(palette, step),
  borderRadius: '0.375rem',
  aspectRatio: '1',
  minHeight: '3rem',
});

const labelStyle: React.CSSProperties = {
  fontSize: '0.625rem',
  textAlign: 'center',
  marginTop: '0.25rem',
  fontFamily: 'monospace',
  color: 'var(--colors-neutral-700)',
};

const paletteTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: '0.875rem',
  textTransform: 'capitalize',
  marginBottom: '0.5rem',
  marginTop: '1.5rem',
};

/* =================================================================
   Helper component — renders a full 12-step ramp for one palette
   ================================================================= */

const PaletteRamp: React.FC<{ palette: Palette }> = ({ palette }) => (
  <div>
    <div style={paletteTitleStyle}>{palette}</div>
    <div style={gridStyle}>
      {STEPS.map((step) => (
        <div key={step}>
          <Swatch
            color={cssVar(palette, step)}
            label={`${palette}-${step}`}
          />
        </div>
      ))}
    </div>
    <div style={gridStyle}>
      {STEPS.map((step) => (
        <div key={step} style={labelStyle}>
          {step}
        </div>
      ))}
    </div>
  </div>
);

/* =================================================================
   Stories
   ================================================================= */

/** Overview of all five palettes rendered as 12-step OKLCH ramps. */
export const Overview: Story = {
  render: () => (
    <DocPage title="Color Primitives">
      <Callout>
        All color primitives use the OKLCH color space for perceptually
        uniform lightness across every palette. Each palette provides a 12-step
        ramp (50–1000) generated from anchor definitions.
      </Callout>
      {PALETTES.map((palette) => (
        <PaletteRamp key={palette} palette={palette} />
      ))}
    </DocPage>
  ),
};

/** Neutral palette — the foundation greyscale used for text, borders, and surfaces. */
export const Neutral: Story = {
  render: () => (
    <DocPage title="Neutral Palette">
      <Callout>
        The neutral palette carries a subtle blue hue (OKLCH hue 264) to stay
        visually cohesive with the brand. It is the most frequently used palette,
        powering text, borders, backgrounds, and surface hierarchy.
      </Callout>
      <PaletteRamp palette="neutral" />
    </DocPage>
  ),
};

/** Brand palette — primary brand identity color. */
export const Brand: Story = {
  render: () => (
    <DocPage title="Brand Palette">
      <Callout>
        The brand palette (OKLCH hue 250) is reserved for primary actions,
        active states, and brand-forward UI. Use sparingly to maintain visual
        hierarchy.
      </Callout>
      <PaletteRamp palette="brand" />
    </DocPage>
  ),
};

/** Red palette — used for error, danger, and destructive semantics. */
export const Red: Story = {
  render: () => (
    <DocPage title="Red Palette">
      <Callout>
        The red palette (OKLCH hue 25) maps to error, danger, and destructive
        semantic tokens. Pair with an icon or label — do not rely on color
        alone.
      </Callout>
      <PaletteRamp palette="red" />
    </DocPage>
  ),
};

/** Amber palette — used for warning and caution semantics. */
export const Amber: Story = {
  render: () => (
    <DocPage title="Amber Palette">
      <Callout>
        The amber palette (OKLCH hue 85) maps to warning and caution semantic
        tokens. Mid-range steps (400–600) offer strong visibility without the
        urgency of red.
      </Callout>
      <PaletteRamp palette="amber" />
    </DocPage>
  ),
};

/** Green palette — used for success and positive semantics. */
export const Green: Story = {
  render: () => (
    <DocPage title="Green Palette">
      <Callout>
        The green palette (OKLCH hue 155) maps to success and positive semantic
        tokens. Use the 500 step as the primary solid fill and lighter steps
        for background accents.
      </Callout>
      <PaletteRamp palette="green" />
    </DocPage>
  ),
};

/** Documents the role of each of the 12 steps in every ramp. */
export const StepRoles: Story = {
  render: () => (
    <DocPage title="Step Roles">
      <Callout>
        Every palette follows the same 12-step structure. The roles below
        describe the intended usage at each lightness level so that palettes
        remain interchangeable.
      </Callout>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid var(--colors-neutral-200)' }}>
              Step
            </th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid var(--colors-neutral-200)' }}>
              Role
            </th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid var(--colors-neutral-200)' }}>
              Swatches
            </th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((step) => (
            <tr key={step}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--colors-neutral-100)', fontFamily: 'monospace' }}>
                {step}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--colors-neutral-100)' }}>
                {STEP_ROLES[step]}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--colors-neutral-100)' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {PALETTES.map((palette) => (
                    <div
                      key={palette}
                      style={{
                        backgroundColor: cssVar(palette, step),
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid var(--colors-neutral-200)',
                      }}
                      title={`${palette}-${step}`}
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocPage>
  ),
};

/** Light vs dark theme comparison — shows how the neutral ramp inverts. */
export const DarkThemeComparison: Story = {
  render: () => (
    <DocPage title="Dark Theme Comparison">
      <Callout>
        In dark mode the neutral ramp is fully inverted (50 becomes the darkest
        value, 1000 becomes the lightest). Chromatic palettes (brand, red,
        amber, green) are unchanged — their OKLCH lightness already provides
        sufficient contrast in both themes.
      </Callout>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Light theme */}
        <DemoBox>
          <div data-theme="light" style={{ padding: '1.5rem' }}>
            <strong style={{ display: 'block', marginBottom: '1rem' }}>Light</strong>
            {PALETTES.map((palette) => (
              <div key={palette} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                  {palette}
                </div>
                <div style={{ display: 'flex', gap: '0.125rem' }}>
                  {STEPS.map((step) => (
                    <div
                      key={step}
                      style={{
                        backgroundColor: cssVar(palette, step),
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '0.125rem',
                      }}
                      title={`${palette}-${step}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DemoBox>

        {/* Dark theme */}
        <DemoBox>
          <div data-theme="dark" style={{ padding: '1.5rem', backgroundColor: 'var(--colors-neutral-50)', color: 'var(--colors-neutral-1000)' }}>
            <strong style={{ display: 'block', marginBottom: '1rem' }}>Dark</strong>
            {PALETTES.map((palette) => (
              <div key={palette} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                  {palette}
                </div>
                <div style={{ display: 'flex', gap: '0.125rem' }}>
                  {STEPS.map((step) => (
                    <div
                      key={step}
                      style={{
                        backgroundColor: cssVar(palette, step),
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '0.125rem',
                      }}
                      title={`${palette}-${step}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DemoBox>
      </div>
    </DocPage>
  ),
};

/** Full token reference table for all color primitives. */
export const TokenReference: Story = {
  render: () => (
    <DocPage title="Token Reference">
      <Callout>
        All CSS custom properties follow the pattern{' '}
        <code>--colors-&#123;palette&#125;-&#123;step&#125;</code>. Values are
        defined in OKLCH and respond to theme via{' '}
        <code>[data-theme=&quot;dark&quot;]</code> overrides.
      </Callout>
      <TokenTable tokens={ALL_COLOR_TOKENS} />
    </DocPage>
  ),
};

/** Usage guidance — do and don't rules for color primitive usage. */
export const UsageGuidance: Story = {
  render: () => (
    <DocPage title="Usage Guidance">
      <DosDonts
        dos={[
          'Use semantic tokens (mapped from primitives) in component styles rather than referencing primitives directly.',
          'Rely on the step roles to choose the correct value — e.g. 500 for solid fills, 50 for surface backgrounds.',
          'Test both light and dark themes when selecting primitive values.',
          'Keep neutral as the default palette; use chromatic palettes only to convey meaning.',
          'Pair chromatic colors with a text label or icon — do not rely on color alone for semantics.',
        ]}
        donts={[
          'Do not hardcode OKLCH values in component CSS — always reference the custom property.',
          'Do not mix steps from different palettes to construct a single element (e.g. brand-500 bg with red-700 text).',
          'Do not use low-step values (50–200) for text on light backgrounds — contrast will be insufficient.',
          'Do not invent new steps outside the 12-step ramp — extend the generation script instead.',
          'Do not assume chromatic palettes invert in dark mode — only neutral is remapped.',
        ]}
      />
    </DocPage>
  ),
};
