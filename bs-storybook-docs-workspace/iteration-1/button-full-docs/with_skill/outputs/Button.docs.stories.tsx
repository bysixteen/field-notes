import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { Button } from '../button-component';
import type {
  ButtonSentiment,
  ButtonEmphasis,
  ButtonState,
  ButtonSize,
  ButtonStructure,
} from '../button-component';
import {
  DocPage,
  TokenTable,
  Swatch,
  DemoBox,
  DosDonts,
  FigmaRef,
  Callout,
} from '../stories/helpers';
import type { DimensionalToken } from '../stories/helpers';

/* =================================================================
   Meta
   ================================================================= */

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    /* ── Dimensions ─────────────────────────────────────────────── */
    sentiment: {
      control: 'select',
      options: ['neutral', 'warning', 'highlight', 'success', 'error'] satisfies ButtonSentiment[],
      table: { category: 'Dimensions' },
    },
    emphasis: {
      control: 'select',
      options: ['high', 'medium', 'low'] satisfies ButtonEmphasis[],
      table: { category: 'Dimensions' },
    },
    state: {
      control: 'select',
      options: ['rest', 'hover', 'active', 'disabled', 'resolving'] satisfies ButtonState[],
      table: { category: 'Dimensions' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies ButtonSize[],
      table: { category: 'Dimensions' },
    },
    structure: {
      control: 'select',
      options: ['standard', 'icon-only', 'split'] satisfies ButtonStructure[],
      table: { category: 'Dimensions' },
    },

    /* ── Content ────────────────────────────────────────────────── */
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
    prefix: {
      control: 'text',
      table: { category: 'Content' },
    },
    suffix: {
      control: 'text',
      table: { category: 'Content' },
    },
    'aria-label': {
      control: 'text',
      table: { category: 'Content' },
    },

    /* ── Events ─────────────────────────────────────────────────── */
    onClick: {
      action: 'clicked',
      table: { category: 'Events' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* =================================================================
   Dimension values (derived from types)
   ================================================================= */

const SENTIMENTS: ButtonSentiment[] = ['neutral', 'warning', 'highlight', 'success', 'error'];
const EMPHASES: ButtonEmphasis[] = ['high', 'medium', 'low'];
const STATES: ButtonState[] = ['rest', 'hover', 'active', 'disabled', 'resolving'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const STRUCTURES: ButtonStructure[] = ['standard', 'icon-only', 'split'];

/* =================================================================
   Token map (derived from CSS custom properties)
   ================================================================= */

const BUTTON_TOKENS: DimensionalToken[] = [
  /* Colour */
  { figmaPath: 'button/colour/bg/rest', cssProperty: '--btn/colour/bg/rest', category: 'colour' },
  { figmaPath: 'button/colour/fg/rest', cssProperty: '--btn/colour/fg/rest', category: 'colour' },
  { figmaPath: 'button/colour/border/rest', cssProperty: '--btn/colour/border/rest', category: 'colour' },

  /* Spacing */
  { figmaPath: 'button/spacing/padding-x', cssProperty: '--btn/spacing/padding-x', category: 'spacing' },
  { figmaPath: 'button/spacing/padding-y', cssProperty: '--btn/spacing/padding-y', category: 'spacing' },
  { figmaPath: 'button/spacing/gap', cssProperty: '--btn/spacing/gap', category: 'spacing' },

  /* Typography */
  { figmaPath: 'button/typography/font-size', cssProperty: '--btn/typography/font-size', category: 'typography' },
  { figmaPath: 'button/typography/font-weight', cssProperty: '--btn/typography/font-weight', category: 'typography' },
  { figmaPath: 'button/typography/line-height', cssProperty: '--btn/typography/line-height', category: 'typography' },

  /* Structure */
  { figmaPath: 'button/structure/border-radius', cssProperty: '--btn/structure/border-radius', category: 'structure' },
  { figmaPath: 'button/structure/border-width', cssProperty: '--btn/structure/border-width', category: 'structure' },
  { figmaPath: 'button/structure/min-height', cssProperty: '--btn/structure/min-height', category: 'structure' },
] satisfies DimensionalToken[];

/* =================================================================
   Stories
   ================================================================= */

/** Component rendered with all default props. */
export const Default: Story = {
  args: {
    children: 'Button',
    sentiment: 'neutral',
    emphasis: 'high',
    state: 'rest',
    size: 'md',
    structure: 'standard',
    onClick: action('clicked'),
  },
};

/** Grid of all sentiment modes at default emphasis, size and state. */
export const Sentiments: Story = {
  render: () => (
    <DocPage title="Sentiments">
      <DemoBox>
        {SENTIMENTS.map((sentiment) => (
          <Button key={sentiment} sentiment={sentiment}>
            {sentiment}
          </Button>
        ))}
      </DemoBox>
    </DocPage>
  ),
};

/** Grid of all emphasis levels at default sentiment, size and state. */
export const Emphases: Story = {
  render: () => (
    <DocPage title="Emphases">
      <DemoBox>
        {EMPHASES.map((emphasis) => (
          <Button key={emphasis} emphasis={emphasis}>
            {emphasis}
          </Button>
        ))}
      </DemoBox>
    </DocPage>
  ),
};

/** Grid of all size modes. */
export const Sizes: Story = {
  render: () => (
    <DocPage title="Sizes">
      <DemoBox>
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </DemoBox>
    </DocPage>
  ),
};

/** Grid of all interactive state modes. */
export const States: Story = {
  render: () => (
    <DocPage title="States">
      <DemoBox>
        {STATES.map((state) => (
          <Button key={state} state={state}>
            {state}
          </Button>
        ))}
      </DemoBox>
    </DocPage>
  ),
};

/** Grid of all structure variants. */
export const Structures: Story = {
  render: () => (
    <DocPage title="Structures">
      <DemoBox>
        {STRUCTURES.map((structure) => (
          <Button key={structure} structure={structure} aria-label={structure}>
            {structure}
          </Button>
        ))}
      </DemoBox>
    </DocPage>
  ),
};

/** Sentiment x emphasis matrix at default size. */
export const AllCombinations: Story = {
  render: () => (
    <DocPage title="Sentiment × Emphasis Matrix">
      <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${EMPHASES.length}, 1fr)`, gap: '1rem', alignItems: 'center' }}>
        {/* Header row */}
        <div />
        {EMPHASES.map((emphasis) => (
          <strong key={emphasis}>{emphasis}</strong>
        ))}

        {/* Data rows */}
        {SENTIMENTS.map((sentiment) => (
          <React.Fragment key={sentiment}>
            <strong>{sentiment}</strong>
            {EMPHASES.map((emphasis) => (
              <Button key={`${sentiment}-${emphasis}`} sentiment={sentiment} emphasis={emphasis}>
                {sentiment}
              </Button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </DocPage>
  ),
};

/** Programmatic token table from CSS custom properties. */
export const TokenReference: Story = {
  render: () => (
    <DocPage title="Token Reference">
      <Callout>
        All values are inherited from global design tokens and respond to theme changes.
      </Callout>
      <TokenTable tokens={BUTTON_TOKENS} />
      {BUTTON_TOKENS.map((token) => (
        <FigmaRef key={token.cssProperty} path={token.figmaPath} />
      ))}
    </DocPage>
  ),
};

/** Numbered element breakdown from JSX structure. */
export const Anatomy: Story = {
  render: () => (
    <DocPage title="Anatomy">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Element</th>
            <th>Class</th>
            <th>Role</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Root</td>
            <td><code>.btn</code></td>
            <td>Container, carries data-sentiment, data-emphasis, data-state, data-size, data-structure attributes</td>
            <td>Fixed</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Prefix</td>
            <td><code>.btn__prefix</code></td>
            <td>Leading icon/content slot</td>
            <td>Optional</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Label</td>
            <td><code>.btn__label</code></td>
            <td>Primary text content</td>
            <td>Required (hidden when structure is icon-only)</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Suffix</td>
            <td><code>.btn__suffix</code></td>
            <td>Trailing icon/content slot</td>
            <td>Optional</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Spinner</td>
            <td><code>.btn__spinner</code></td>
            <td>Resolving state loading indicator (aria-hidden)</td>
            <td>Conditional (state = resolving)</td>
          </tr>
        </tbody>
      </table>
    </DocPage>
  ),
};

/** Do/Don't examples derived from dimensions and accessibility requirements. */
export const UsageGuidance: Story = {
  render: () => (
    <DocPage title="Usage Guidance">
      <DosDonts
        dos={[
          'Use a single high-emphasis button for the primary action in a view.',
          'Provide an aria-label when using the icon-only structure.',
          'Use the resolving state to indicate asynchronous operations.',
          'Pair sentiment with meaning — error for destructive actions, success for confirmations.',
          'Use size consistently within a region — avoid mixing xs and xl in the same toolbar.',
        ]}
        donts={[
          'Do not place multiple high-emphasis buttons side by side — demote secondary actions to medium or low.',
          'Do not use the disabled state to hide functionality — explain why the action is unavailable.',
          'Do not omit children when structure is standard — label text is required.',
          'Do not rely solely on colour to communicate sentiment — pair with an icon or label.',
          'Do not override token values with hardcoded colours.',
        ]}
      />
    </DocPage>
  ),
};

/** Light and dark theme side by side. */
export const DarkMode: Story = {
  render: () => (
    <DocPage title="Theme Comparison">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <DemoBox>
          <div data-theme="light" style={{ padding: '1.5rem' }}>
            <strong>Light</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {SENTIMENTS.map((sentiment) => (
                <Button key={sentiment} sentiment={sentiment}>
                  {sentiment}
                </Button>
              ))}
            </div>
          </div>
        </DemoBox>
        <DemoBox>
          <div data-theme="dark" style={{ padding: '1.5rem' }}>
            <strong>Dark</strong>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {SENTIMENTS.map((sentiment) => (
                <Button key={sentiment} sentiment={sentiment}>
                  {sentiment}
                </Button>
              ))}
            </div>
          </div>
        </DemoBox>
      </div>
    </DocPage>
  ),
};
