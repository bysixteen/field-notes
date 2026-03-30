import type { Meta } from '@storybook/react';
import {
  DocPage,
  Section,
  SectionHeading,
  Swatch,
  SwatchGrid,
  TonalRamp,
  TokenTable,
  DemoBox,
  Callout,
} from '../stories/helpers';

const meta = {
  title: 'Foundations/ColourPrimitives',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/* ── Step roles ────────────────────────────────────────────────────── */

const STEP_ROLES = {
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
} as const;

type StepKey = keyof typeof STEP_ROLES;

const STEPS = Object.keys(STEP_ROLES).map(Number) as StepKey[];

/* ── Palette builders ──────────────────────────────────────────────── */

const PALETTE_NAMES = ['neutral', 'brand', 'red', 'amber', 'green'] as const;
type PaletteName = (typeof PALETTE_NAMES)[number];

const buildSteps = (palette: PaletteName) =>
  STEPS.map((step) => ({
    step,
    token: `--colors-${palette}-${step}`,
    role: STEP_ROLES[step],
  }));

const NEUTRAL_STEPS = buildSteps('neutral');
const BRAND_STEPS = buildSteps('brand');
const RED_STEPS = buildSteps('red');
const AMBER_STEPS = buildSteps('amber');
const GREEN_STEPS = buildSteps('green');

const ALL_PALETTES = PALETTE_NAMES.map((name) => ({
  name,
  steps: buildSteps(name),
}));

/* ── Token table data ──────────────────────────────────────────────── */

const buildTokenTableData = (palette: PaletteName) =>
  STEPS.map((step) => ({
    name: `--colors-${palette}-${step}`,
    value: `var(--colors-${palette}-${step})`,
    description: STEP_ROLES[step],
  }));

/* ── Light theme OKLCH values (for reference tables) ───────────────── */

const OKLCH_VALUES: Record<PaletteName, Record<StepKey, string>> = {
  neutral: {
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
  brand: {
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
  red: {
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
  amber: {
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
  green: {
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
};

/* ── Dark theme OKLCH values (neutral only — the only dark overrides in the CSS) */

const DARK_NEUTRAL_OKLCH: Record<StepKey, string> = {
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

/* ══════════════════════════════════════════════════════════════════════
   Stories
   ══════════════════════════════════════════════════════════════════════ */

/** All palettes at a glance — one TonalRamp per palette. */
export const Overview = {
  render: () => (
    <DocPage title="Colour Primitives" subtitle="OKLCH 12-step ramps across 5 palettes">
      <Callout variant="note">
        Every palette follows a consistent 12-step lightness ramp in OKLCH colour space.
        Steps are numbered from 50 (lightest) to 1000 (darkest) and each step has a
        defined role in the interface.
      </Callout>

      {ALL_PALETTES.map(({ name, steps }) => (
        <Section key={name}>
          <SectionHeading>{name.charAt(0).toUpperCase() + name.slice(1)}</SectionHeading>
          <TonalRamp palette={name} steps={steps} />
        </Section>
      ))}

      <Section>
        <SectionHeading>Step Roles</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: String(step),
            value: STEP_ROLES[step],
            description: `Role applied at the ${step} position across all palettes`,
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Neutral — 12-step OKLCH ramp. */
export const Neutral = {
  render: () => (
    <DocPage title="Neutral" subtitle="12-step OKLCH ramp — hue 264">
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
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-neutral-${step}`,
            value: OKLCH_VALUES.neutral[step],
            description: STEP_ROLES[step],
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Brand — 12-step OKLCH ramp. */
export const Brand = {
  render: () => (
    <DocPage title="Brand" subtitle="12-step OKLCH ramp — hue 250">
      <Section>
        <SectionHeading>Ramp</SectionHeading>
        <SwatchGrid>
          {BRAND_STEPS.map(({ step, token, role }) => (
            <Swatch key={step} token={token} label={String(step)} sublabel={role} />
          ))}
        </SwatchGrid>
      </Section>

      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-brand-${step}`,
            value: OKLCH_VALUES.brand[step],
            description: STEP_ROLES[step],
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Red — 12-step OKLCH ramp. */
export const Red = {
  render: () => (
    <DocPage title="Red" subtitle="12-step OKLCH ramp — hue 25">
      <Section>
        <SectionHeading>Ramp</SectionHeading>
        <SwatchGrid>
          {RED_STEPS.map(({ step, token, role }) => (
            <Swatch key={step} token={token} label={String(step)} sublabel={role} />
          ))}
        </SwatchGrid>
      </Section>

      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-red-${step}`,
            value: OKLCH_VALUES.red[step],
            description: STEP_ROLES[step],
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Amber — 12-step OKLCH ramp. */
export const Amber = {
  render: () => (
    <DocPage title="Amber" subtitle="12-step OKLCH ramp — hue 85">
      <Section>
        <SectionHeading>Ramp</SectionHeading>
        <SwatchGrid>
          {AMBER_STEPS.map(({ step, token, role }) => (
            <Swatch key={step} token={token} label={String(step)} sublabel={role} />
          ))}
        </SwatchGrid>
      </Section>

      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-amber-${step}`,
            value: OKLCH_VALUES.amber[step],
            description: STEP_ROLES[step],
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Green — 12-step OKLCH ramp. */
export const Green = {
  render: () => (
    <DocPage title="Green" subtitle="12-step OKLCH ramp — hue 155">
      <Section>
        <SectionHeading>Ramp</SectionHeading>
        <SwatchGrid>
          {GREEN_STEPS.map(({ step, token, role }) => (
            <Swatch key={step} token={token} label={String(step)} sublabel={role} />
          ))}
        </SwatchGrid>
      </Section>

      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-green-${step}`,
            value: OKLCH_VALUES.green[step],
            description: STEP_ROLES[step],
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** How lightness progresses across each step for every palette. */
export const LightnessProfile = {
  render: () => (
    <DocPage
      title="Lightness Profile"
      subtitle="OKLCH lightness (L) progression across steps"
    >
      <Callout variant="note">
        All palettes share the same lightness curve. The L channel decreases from ~0.98 at
        step 50 to ~0.16 at step 1000, providing a perceptually uniform progression.
      </Callout>

      {ALL_PALETTES.map(({ name, steps }) => (
        <Section key={name}>
          <SectionHeading>{name.charAt(0).toUpperCase() + name.slice(1)}</SectionHeading>
          <DemoBox>
            <TokenTable
              tokens={steps.map(({ step, token }) => ({
                name: token,
                value: OKLCH_VALUES[name][step],
                description: `L = ${OKLCH_VALUES[name][step].match(/oklch\(([^ ]+)/)?.[1] ?? '—'}`,
              }))}
            />
          </DemoBox>
        </Section>
      ))}
    </DocPage>
  ),
};

/** Light and dark theme side by side for the neutral palette. */
export const ThemeComparison = {
  render: () => (
    <DocPage
      title="Theme Comparison"
      subtitle="Neutral palette — light vs dark"
    >
      <Callout variant="tip">
        The dark theme inverts the neutral ramp: step 50 becomes the darkest value and
        step 1000 becomes the lightest. This ensures semantic step roles (e.g. &ldquo;App
        background&rdquo; at 50, &ldquo;High-contrast text&rdquo; at 1000) remain correct
        regardless of theme.
      </Callout>

      <Section>
        <SectionHeading>Light Theme</SectionHeading>
        <DemoBox>
          <div data-theme="light">
            <SwatchGrid>
              {NEUTRAL_STEPS.map(({ step, token, role }) => (
                <Swatch key={step} token={token} label={String(step)} sublabel={role} />
              ))}
            </SwatchGrid>
          </div>
        </DemoBox>
      </Section>

      <Section>
        <SectionHeading>Dark Theme</SectionHeading>
        <DemoBox>
          <div data-theme="dark">
            <SwatchGrid>
              {NEUTRAL_STEPS.map(({ step, token, role }) => (
                <Swatch key={step} token={token} label={String(step)} sublabel={role} />
              ))}
            </SwatchGrid>
          </div>
        </DemoBox>
      </Section>

      <Section>
        <SectionHeading>Dark Theme Token Values</SectionHeading>
        <TokenTable
          tokens={STEPS.map((step) => ({
            name: `--colors-neutral-${step}`,
            value: DARK_NEUTRAL_OKLCH[step],
            description: `${STEP_ROLES[step]} (dark override)`,
          }))}
        />
      </Section>
    </DocPage>
  ),
};

/** Foreground/background combinations that meet WCAG contrast requirements. */
export const AccessiblePairings = {
  render: () => (
    <DocPage
      title="Accessible Pairings"
      subtitle="Foreground/background combinations meeting contrast requirements"
    >
      <Callout variant="tip">
        Pair tokens from opposite ends of the ramp for guaranteed contrast. Steps 50-200
        work as backgrounds with steps 900-1000 as foreground text, and vice versa for
        dark contexts.
      </Callout>

      <Section>
        <SectionHeading>Recommended Pairings</SectionHeading>
        <TokenTable
          tokens={[
            {
              name: 'Text on app background',
              value: '950 on 50',
              description: 'Default text on lightest background — highest contrast',
            },
            {
              name: 'Text on subtle background',
              value: '950 on 100',
              description: 'Default text on subtle background',
            },
            {
              name: 'Text on element background',
              value: '950 on 200',
              description: 'Default text on element background',
            },
            {
              name: 'Low-contrast text on app bg',
              value: '900 on 50',
              description: 'Secondary text on lightest background',
            },
            {
              name: 'Inverse text on solid bg',
              value: '50 on 700',
              description: 'Light text on solid background',
            },
            {
              name: 'Inverse text on solid hover',
              value: '50 on 800',
              description: 'Light text on solid hover background',
            },
          ]}
        />
      </Section>

      {PALETTE_NAMES.map((palette) => (
        <Section key={palette}>
          <SectionHeading>
            {palette.charAt(0).toUpperCase() + palette.slice(1)} Pairings
          </SectionHeading>
          <DemoBox>
            <SwatchGrid>
              <Swatch
                token={`--colors-${palette}-950`}
                label="950 on 50"
                sublabel="Default text on app bg"
              />
              <Swatch
                token={`--colors-${palette}-900`}
                label="900 on 100"
                sublabel="Low-contrast text on subtle bg"
              />
              <Swatch
                token={`--colors-${palette}-50`}
                label="50 on 700"
                sublabel="Inverse text on solid bg"
              />
              <Swatch
                token={`--colors-${palette}-50`}
                label="50 on 800"
                sublabel="Inverse text on solid hover"
              />
            </SwatchGrid>
          </DemoBox>
        </Section>
      ))}

      <Callout variant="warning">
        Avoid pairing adjacent steps (e.g. 400 on 500) — the lightness difference is
        insufficient for accessible contrast ratios. Keep at least 5 steps between
        foreground and background tokens.
      </Callout>
    </DocPage>
  ),
};
