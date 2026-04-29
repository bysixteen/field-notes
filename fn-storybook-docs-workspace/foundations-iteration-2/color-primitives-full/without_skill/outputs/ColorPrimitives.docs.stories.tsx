import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import {
  Callout,
  DemoBox,
  DocPage,
  Swatch,
  TokenTable,
} from '../../../../../evals/files/stories/helpers';

/* ─── Step data ────────────────────────────────────────────────────────────── */

type StepEntry = {
  readonly step: number;
  readonly cssProperty: string;
  readonly oklch: string;
  readonly role: string;
};

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const;

const STEP_ROLES: Record<number, string> = {
  50: 'App background',
  100: 'Subtle background',
  200: 'Element background',
  300: 'Hover element',
  400: 'Subtle border',
  500: 'Default border',
  600: 'Strong border',
  700: 'Solid background',
  800: 'Solid hover',
  900: 'Low-contrast text',
  950: 'Default text',
  1000: 'High-contrast text',
};

const STEP_RANGE_LABELS: { range: string; role: string; steps: string }[] = [
  { range: '50\u2013100', role: 'Background', steps: 'App background, subtle background' },
  { range: '200\u2013300', role: 'Surface', steps: 'Element background, hover element' },
  { range: '400\u2013600', role: 'Border', steps: 'Subtle border, default border, strong border' },
  { range: '700\u2013800', role: 'Solid', steps: 'Solid background, solid hover' },
  { range: '900\u20131000', role: 'Text', steps: 'Low-contrast text, default text, high-contrast text' },
];

/* ─── Palette definitions (derived from colors.css) ───────────────────────── */

type PaletteConfig = {
  name: string;
  label: string;
  hue: number;
  description: string;
  values: Record<number, string>;
};

const PALETTES: PaletteConfig[] = [
  {
    name: 'neutral',
    label: 'Neutral',
    hue: 264,
    description: 'Low-chroma grey scale used for text, borders, and backgrounds',
    values: {
      50: 'oklch(0.985 0.002 264)',
      100: 'oklch(0.967 0.003 264)',
      200: 'oklch(0.928 0.006 264)',
      300: 'oklch(0.872 0.010 264)',
      400: 'oklch(0.708 0.015 264)',
      500: 'oklch(0.556 0.018 264)',
      600: 'oklch(0.439 0.020 264)',
      700: 'oklch(0.371 0.017 264)',
      800: 'oklch(0.269 0.013 264)',
      900: 'oklch(0.216 0.010 264)',
      950: 'oklch(0.178 0.008 264)',
      1000: 'oklch(0.145 0.006 264)',
    },
  },
  {
    name: 'brand',
    label: 'Brand',
    hue: 250,
    description: 'Primary brand color for interactive elements and emphasis',
    values: {
      50: 'oklch(0.980 0.010 250)',
      100: 'oklch(0.955 0.025 250)',
      200: 'oklch(0.910 0.055 250)',
      300: 'oklch(0.845 0.090 250)',
      400: 'oklch(0.700 0.140 250)',
      500: 'oklch(0.560 0.175 250)',
      600: 'oklch(0.450 0.165 250)',
      700: 'oklch(0.380 0.140 250)',
      800: 'oklch(0.285 0.100 250)',
      900: 'oklch(0.230 0.075 250)',
      950: 'oklch(0.195 0.055 250)',
      1000: 'oklch(0.160 0.040 250)',
    },
  },
  {
    name: 'red',
    label: 'Red',
    hue: 25,
    description: 'Danger and error states',
    values: {
      50: 'oklch(0.980 0.012 25)',
      100: 'oklch(0.955 0.030 25)',
      200: 'oklch(0.910 0.065 25)',
      300: 'oklch(0.845 0.110 25)',
      400: 'oklch(0.700 0.160 25)',
      500: 'oklch(0.560 0.195 25)',
      600: 'oklch(0.450 0.180 25)',
      700: 'oklch(0.380 0.155 25)',
      800: 'oklch(0.285 0.110 25)',
      900: 'oklch(0.230 0.080 25)',
      950: 'oklch(0.195 0.060 25)',
      1000: 'oklch(0.160 0.042 25)',
    },
  },
  {
    name: 'amber',
    label: 'Amber',
    hue: 85,
    description: 'Warning and caution states',
    values: {
      50: 'oklch(0.980 0.015 85)',
      100: 'oklch(0.955 0.040 85)',
      200: 'oklch(0.910 0.085 85)',
      300: 'oklch(0.845 0.130 85)',
      400: 'oklch(0.700 0.155 85)',
      500: 'oklch(0.560 0.140 85)',
      600: 'oklch(0.450 0.120 85)',
      700: 'oklch(0.380 0.100 85)',
      800: 'oklch(0.285 0.075 85)',
      900: 'oklch(0.230 0.055 85)',
      950: 'oklch(0.195 0.040 85)',
      1000: 'oklch(0.160 0.030 85)',
    },
  },
  {
    name: 'green',
    label: 'Green',
    hue: 155,
    description: 'Success and positive states',
    values: {
      50: 'oklch(0.980 0.012 155)',
      100: 'oklch(0.955 0.030 155)',
      200: 'oklch(0.910 0.060 155)',
      300: 'oklch(0.845 0.100 155)',
      400: 'oklch(0.700 0.145 155)',
      500: 'oklch(0.560 0.155 155)',
      600: 'oklch(0.450 0.140 155)',
      700: 'oklch(0.380 0.120 155)',
      800: 'oklch(0.285 0.085 155)',
      900: 'oklch(0.230 0.065 155)',
      950: 'oklch(0.195 0.048 155)',
      1000: 'oklch(0.160 0.035 155)',
    },
  },
];

/** Build a ramp array for a given palette. */
function buildRamp(palette: PaletteConfig): StepEntry[] {
  return STEPS.map((step) => ({
    step,
    cssProperty: `--colors-${palette.name}-${step}`,
    oklch: palette.values[step],
    role: STEP_ROLES[step],
  }));
}

/* ─── Dark theme overrides (neutral only, as defined in colors.css) ───────── */

const NEUTRAL_DARK_VALUES: Record<number, string> = {
  50: 'oklch(0.145 0.006 264)',
  100: 'oklch(0.178 0.008 264)',
  200: 'oklch(0.216 0.010 264)',
  300: 'oklch(0.269 0.013 264)',
  400: 'oklch(0.371 0.017 264)',
  500: 'oklch(0.439 0.020 264)',
  600: 'oklch(0.556 0.018 264)',
  700: 'oklch(0.708 0.015 264)',
  800: 'oklch(0.872 0.010 264)',
  900: 'oklch(0.928 0.006 264)',
  950: 'oklch(0.967 0.003 264)',
  1000: 'oklch(0.985 0.002 264)',
};

/* ─── Meta ─────────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Foundations/Color Primitives',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ─── Stories ──────────────────────────────────────────────────────────────── */

/**
 * All palettes at a glance — one row per palette, all 12 steps.
 * Use this story to compare ramps side by side and verify visual consistency.
 */
export const Overview: Story = {
  render: () => (
    <DocPage
      title="Color Primitives"
      subtitle="OKLCH 12-step ramps across five palettes"
    >
      <Callout>
        Every palette follows a 12-step lightness ramp from 50 (lightest) to
        1000 (darkest). Steps map to functional roles — backgrounds, surfaces,
        borders, solids, and text — ensuring consistent usage across the design
        system.
      </Callout>

      <h3>Step Role Map</h3>
      <TokenTable
        headers={['Range', 'Role', 'Steps']}
        rows={STEP_RANGE_LABELS.map(({ range, role, steps }) => [range, role, steps])}
      />

      {PALETTES.map((palette) => {
        const ramp = buildRamp(palette);
        return (
          <section key={palette.name} style={{ marginBottom: '2rem' }}>
            <h3>
              {palette.label}{' '}
              <span style={{ fontWeight: 400, fontSize: '0.875rem', opacity: 0.7 }}>
                Hue {palette.hue} &middot; {palette.description}
              </span>
            </h3>
            <DemoBox>
              {ramp.map(({ step, cssProperty, role }) => (
                <Swatch
                  key={step}
                  token={cssProperty}
                  label={`${step}`}
                  sublabel={role}
                />
              ))}
            </DemoBox>
          </section>
        );
      })}
    </DocPage>
  ),
};

/**
 * Full 12-step ramp for Neutral with OKLCH values and step roles.
 */
export const Neutral: Story = {
  render: () => {
    const ramp = buildRamp(PALETTES[0]);
    return (
      <DocPage title="Neutral" subtitle="Hue 264 &middot; Low-chroma grey scale">
        <Callout>
          The neutral palette has near-zero chroma, providing a clean grey scale
          for text, borders, and backgrounds. It is the only palette with dark
          theme overrides defined in colors.css.
        </Callout>
        <DemoBox>
          {ramp.map(({ step, cssProperty, role }) => (
            <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
          ))}
        </DemoBox>
        <TokenTable
          headers={['Step', 'CSS Property', 'OKLCH Value', 'Role']}
          rows={ramp.map(({ step, cssProperty, oklch, role }) => [
            String(step),
            cssProperty,
            oklch,
            role,
          ])}
        />
      </DocPage>
    );
  },
};

/**
 * Full 12-step ramp for Brand with OKLCH values and step roles.
 */
export const Brand: Story = {
  render: () => {
    const ramp = buildRamp(PALETTES[1]);
    return (
      <DocPage title="Brand" subtitle="Hue 250 &middot; Primary brand color">
        <Callout>
          The brand palette anchors interactive elements, call-to-action buttons,
          and primary emphasis. Use steps 700-800 for solid backgrounds and
          50-100 for subtle tints.
        </Callout>
        <DemoBox>
          {ramp.map(({ step, cssProperty, role }) => (
            <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
          ))}
        </DemoBox>
        <TokenTable
          headers={['Step', 'CSS Property', 'OKLCH Value', 'Role']}
          rows={ramp.map(({ step, cssProperty, oklch, role }) => [
            String(step),
            cssProperty,
            oklch,
            role,
          ])}
        />
      </DocPage>
    );
  },
};

/**
 * Full 12-step ramp for Red with OKLCH values and step roles.
 */
export const Red: Story = {
  render: () => {
    const ramp = buildRamp(PALETTES[2]);
    return (
      <DocPage title="Red" subtitle="Hue 25 &middot; Danger / error states">
        <Callout>
          Reserved for destructive actions, error messages, and validation
          failures. Pair light background steps (50-100) with dark text steps
          (900-1000) for accessible error banners.
        </Callout>
        <DemoBox>
          {ramp.map(({ step, cssProperty, role }) => (
            <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
          ))}
        </DemoBox>
        <TokenTable
          headers={['Step', 'CSS Property', 'OKLCH Value', 'Role']}
          rows={ramp.map(({ step, cssProperty, oklch, role }) => [
            String(step),
            cssProperty,
            oklch,
            role,
          ])}
        />
      </DocPage>
    );
  },
};

/**
 * Full 12-step ramp for Amber with OKLCH values and step roles.
 */
export const Amber: Story = {
  render: () => {
    const ramp = buildRamp(PALETTES[3]);
    return (
      <DocPage title="Amber" subtitle="Hue 85 &middot; Warning states">
        <Callout>
          Used for warnings, caution notices, and non-blocking alerts. The higher
          chroma at lower steps ensures amber tints remain visually distinct from
          neutral backgrounds.
        </Callout>
        <DemoBox>
          {ramp.map(({ step, cssProperty, role }) => (
            <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
          ))}
        </DemoBox>
        <TokenTable
          headers={['Step', 'CSS Property', 'OKLCH Value', 'Role']}
          rows={ramp.map(({ step, cssProperty, oklch, role }) => [
            String(step),
            cssProperty,
            oklch,
            role,
          ])}
        />
      </DocPage>
    );
  },
};

/**
 * Full 12-step ramp for Green with OKLCH values and step roles.
 */
export const Green: Story = {
  render: () => {
    const ramp = buildRamp(PALETTES[4]);
    return (
      <DocPage title="Green" subtitle="Hue 155 &middot; Success states">
        <Callout>
          Communicates success, confirmation, and positive outcomes. Use steps
          100-200 for success banners and steps 700-800 for solid success
          indicators.
        </Callout>
        <DemoBox>
          {ramp.map(({ step, cssProperty, role }) => (
            <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
          ))}
        </DemoBox>
        <TokenTable
          headers={['Step', 'CSS Property', 'OKLCH Value', 'Role']}
          rows={ramp.map(({ step, cssProperty, oklch, role }) => [
            String(step),
            cssProperty,
            oklch,
            role,
          ])}
        />
      </DocPage>
    );
  },
};

/**
 * Visual representation of how OKLCH lightness progresses across each
 * palette's 12-step ramp. All palettes share the same lightness curve.
 */
export const LightnessProfile: Story = {
  render: () => (
    <DocPage
      title="Lightness Profile"
      subtitle="OKLCH lightness (L) progression across each palette"
    >
      <Callout>
        All palettes share an identical lightness curve. Steps 50-100 sit at L
        &asymp; 0.95-0.98 (near white), whilst steps 950-1000 sit at L &asymp;
        0.15-0.18 (near black). This consistent progression ensures predictable
        contrast ratios across all palettes.
      </Callout>

      {PALETTES.map((palette) => {
        const ramp = buildRamp(palette);
        return (
          <section key={palette.name} style={{ marginBottom: '2rem' }}>
            <h3>{palette.label} (Hue {palette.hue})</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '2px',
                height: '160px',
                padding: '0.5rem 0',
              }}
            >
              {ramp.map(({ step, cssProperty, oklch }) => {
                const lightnessMatch = oklch.match(/oklch\(([\d.]+)/);
                const lightness = lightnessMatch ? parseFloat(lightnessMatch[1]) : 0;
                return (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <span style={{ fontSize: '10px', marginBottom: '4px' }}>
                      {lightness.toFixed(3)}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: `${lightness * 140}px`,
                        backgroundColor: `var(${cssProperty})`,
                        border: '1px solid var(--colors-neutral-400)',
                        borderRadius: '2px',
                      }}
                    />
                    <span style={{ fontSize: '10px', marginTop: '4px' }}>{step}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <TokenTable
        headers={['Range', 'Role', 'Approx. Lightness']}
        rows={[
          ['50\u2013100', 'Background', 'L 0.95 \u2013 0.98'],
          ['200\u2013300', 'Surface', 'L 0.84 \u2013 0.93'],
          ['400\u2013600', 'Border', 'L 0.44 \u2013 0.71'],
          ['700\u2013800', 'Solid', 'L 0.27 \u2013 0.38'],
          ['900\u20131000', 'Text', 'L 0.14 \u2013 0.23'],
        ]}
      />
    </DocPage>
  ),
};

/**
 * Light and dark theme side by side for the Neutral palette.
 * The dark theme inverts the lightness ramp as defined in colors.css.
 */
export const ThemeComparison: Story = {
  render: () => {
    const lightRamp = buildRamp(PALETTES[0]);
    const darkRamp: StepEntry[] = STEPS.map((step) => ({
      step,
      cssProperty: `--colors-neutral-${step}`,
      oklch: NEUTRAL_DARK_VALUES[step],
      role: STEP_ROLES[step],
    }));

    return (
      <DocPage
        title="Theme Comparison"
        subtitle="Neutral palette &mdash; light vs dark"
      >
        <Callout>
          The dark theme inverts the neutral lightness ramp: step 50 becomes the
          darkest value and step 1000 becomes the lightest. Semantic roles
          (background, border, text) remain correct regardless of theme &mdash;
          backgrounds are always the subtlest, text always carries the strongest
          contrast.
        </Callout>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Light theme */}
          <section>
            <h3>Light Theme</h3>
            <DemoBox>
              {lightRamp.map(({ step, cssProperty, role }) => (
                <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
              ))}
            </DemoBox>
            <TokenTable
              headers={['Step', 'OKLCH Value', 'Role']}
              rows={lightRamp.map(({ step, oklch, role }) => [String(step), oklch, role])}
            />
          </section>

          {/* Dark theme */}
          <section data-theme="dark">
            <h3>Dark Theme</h3>
            <DemoBox>
              {darkRamp.map(({ step, cssProperty, role }) => (
                <Swatch key={step} token={cssProperty} label={`${step}`} sublabel={role} />
              ))}
            </DemoBox>
            <TokenTable
              headers={['Step', 'OKLCH Value', 'Role']}
              rows={darkRamp.map(({ step, oklch, role }) => [String(step), oklch, role])}
            />
          </section>
        </div>
      </DocPage>
    );
  },
};

/**
 * Foreground/background pairings demonstrating accessible contrast.
 * These combinations use steps from opposite ends of the lightness ramp.
 */
export const AccessiblePairings: Story = {
  render: () => {
    const pairings = [
      { bg: '--colors-neutral-50', fg: '--colors-neutral-950', label: 'Body text on page background' },
      { bg: '--colors-neutral-50', fg: '--colors-neutral-900', label: 'Secondary text on page background' },
      { bg: '--colors-neutral-200', fg: '--colors-neutral-1000', label: 'High-contrast text on surface' },
      { bg: '--colors-brand-700', fg: '--colors-neutral-50', label: 'Inverse text on brand solid' },
      { bg: '--colors-brand-50', fg: '--colors-brand-950', label: 'Brand text on brand tint' },
      { bg: '--colors-red-100', fg: '--colors-red-900', label: 'Error text on error background' },
      { bg: '--colors-amber-100', fg: '--colors-amber-900', label: 'Warning text on warning background' },
      { bg: '--colors-green-100', fg: '--colors-green-900', label: 'Success text on success background' },
    ];

    return (
      <DocPage
        title="Accessible Pairings"
        subtitle="Foreground/background combinations for adequate contrast"
      >
        <Callout>
          These pairings use steps from opposite ends of the lightness ramp to
          ensure sufficient contrast. Background steps (50-300) pair with text
          steps (900-1000) for a minimum of approximately 7:1 contrast ratio,
          meeting WCAG AA requirements for normal text.
        </Callout>

        <DemoBox>
          {pairings.map(({ bg, fg, label }) => (
            <div
              key={label}
              style={{
                backgroundColor: `var(${bg})`,
                color: `var(${fg})`,
                padding: '1rem 1.25rem',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid var(--colors-neutral-300)',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                bg: <code>{bg}</code> &middot; fg: <code>{fg}</code>
              </div>
            </div>
          ))}
        </DemoBox>

        <TokenTable
          headers={['Pairing', 'Background', 'Foreground']}
          rows={pairings.map(({ label, bg, fg }) => [label, bg, fg])}
        />
      </DocPage>
    );
  },
};
