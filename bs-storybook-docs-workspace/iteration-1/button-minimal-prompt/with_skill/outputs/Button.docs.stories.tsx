import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import type {
  ButtonSentiment,
  ButtonEmphasis,
  ButtonState,
  ButtonSize,
  ButtonStructure,
} from '../Button.types';
import {
  DocPage,
  TokenTable,
  Swatch,
  DemoBox,
  DosDonts,
  FigmaRef,
  Callout,
} from '../../stories/helpers';
import type { DimensionalToken } from '../../stories/helpers';

/* ================================================================= */
/*  Meta                                                              */
/* ================================================================= */

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

/* ================================================================= */
/*  Dimension values (derived from types)                             */
/* ================================================================= */

const SENTIMENTS: ButtonSentiment[] = ['neutral', 'warning', 'highlight', 'success', 'error'];
const EMPHASES: ButtonEmphasis[] = ['high', 'medium', 'low'];
const STATES: ButtonState[] = ['rest', 'hover', 'active', 'disabled', 'resolving'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const STRUCTURES: ButtonStructure[] = ['standard', 'icon-only', 'split'];

/* ================================================================= */
/*  Token map (derived from CSS custom properties)                    */
/* ================================================================= */

const BUTTON_TOKENS: DimensionalToken[] = [
  { figmaPath: 'btn/colour/bg/rest', cssProperty: '--btn/colour/bg/rest', category: 'colour' },
  { figmaPath: 'btn/colour/fg/rest', cssProperty: '--btn/colour/fg/rest', category: 'colour' },
  { figmaPath: 'btn/colour/border/rest', cssProperty: '--btn/colour/border/rest', category: 'colour' },
  { figmaPath: 'btn/spacing/padding-x', cssProperty: '--btn/spacing/padding-x', category: 'spacing' },
  { figmaPath: 'btn/spacing/padding-y', cssProperty: '--btn/spacing/padding-y', category: 'spacing' },
  { figmaPath: 'btn/spacing/gap', cssProperty: '--btn/spacing/gap', category: 'spacing' },
  { figmaPath: 'btn/typography/font-size', cssProperty: '--btn/typography/font-size', category: 'typography' },
  { figmaPath: 'btn/typography/font-weight', cssProperty: '--btn/typography/font-weight', category: 'typography' },
  { figmaPath: 'btn/typography/line-height', cssProperty: '--btn/typography/line-height', category: 'typography' },
  { figmaPath: 'btn/structure/border-radius', cssProperty: '--btn/structure/border-radius', category: 'structure' },
  { figmaPath: 'btn/structure/border-width', cssProperty: '--btn/structure/border-width', category: 'structure' },
  { figmaPath: 'btn/structure/min-height', cssProperty: '--btn/structure/min-height', category: 'structure' },
] satisfies DimensionalToken[];

/* ================================================================= */
/*  Stories                                                           */
/* ================================================================= */

/** Component rendered with all default props. */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/** Grid of all sentiment modes at default emphasis and size. */
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

/** Grid of all emphasis levels at default sentiment and size. */
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

/** Grid of all size modes at default sentiment and emphasis. */
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

/** Grid of all interactive states. */
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

/** Sentiment x Emphasis matrix at default size. */
export const AllCombinations: Story = {
  render: () => (
    <DocPage title="All Combinations — Sentiment × Emphasis">
      {SENTIMENTS.map((sentiment) => (
        <DemoBox key={sentiment}>
          {EMPHASES.map((emphasis) => (
            <Button key={`${sentiment}-${emphasis}`} sentiment={sentiment} emphasis={emphasis}>
              {sentiment} / {emphasis}
            </Button>
          ))}
        </DemoBox>
      ))}
    </DocPage>
  ),
};

/** Programmatic token table derived from CSS custom properties. */
export const TokenReference: Story = {
  render: () => (
    <DocPage title="Token Reference">
      <TokenTable tokens={BUTTON_TOKENS} />
      {BUTTON_TOKENS.map((token) => (
        <FigmaRef key={token.cssProperty} path={token.figmaPath} />
      ))}
    </DocPage>
  ),
};

/** Numbered anatomy breakdown of the Button JSX structure. */
export const Anatomy: Story = {
  render: () => (
    <DocPage title="Anatomy">
      <Callout>
        The Button comprises five elements, some conditionally rendered.
      </Callout>
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
            <td>Container with data-* dimension attributes</td>
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
            <td>Primary text content (hidden when icon-only)</td>
            <td>Conditional</td>
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
            <td>Loading indicator overlay (resolving state)</td>
            <td>Conditional</td>
          </tr>
        </tbody>
      </table>
    </DocPage>
  ),
};

/** Do/Don't usage guidance derived from dimensions and accessibility rules. */
export const UsageGuidance: Story = {
  render: () => (
    <DocPage title="Usage Guidance">
      <DosDonts
        dos={[
          'Use a single high-emphasis button per section for the primary action.',
          'Provide an aria-label when using the icon-only structure.',
          'Use the resolving state to indicate async operations in progress.',
          'Pair sentiment with context — e.g. error sentiment for destructive actions.',
        ]}
        donts={[
          'Do not place multiple high-emphasis buttons side by side — demote secondary actions to medium or low.',
          'Do not use the disabled state to hide validation errors — show inline feedback instead.',
          'Do not rely on colour alone to convey sentiment — combine with iconography or labelling.',
          'Do not override button tokens with inline styles — use dimension props to change appearance.',
        ]}
      />
    </DocPage>
  ),
};

/** Light and dark theme rendered side by side. */
export const DarkMode: Story = {
  render: () => (
    <DocPage title="Dark Mode">
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div data-theme="light">
          <DemoBox>
            {SENTIMENTS.map((sentiment) => (
              <Button key={sentiment} sentiment={sentiment}>
                {sentiment}
              </Button>
            ))}
          </DemoBox>
        </div>
        <div data-theme="dark">
          <DemoBox>
            {SENTIMENTS.map((sentiment) => (
              <Button key={sentiment} sentiment={sentiment}>
                {sentiment}
              </Button>
            ))}
          </DemoBox>
        </div>
      </div>
    </DocPage>
  ),
};
