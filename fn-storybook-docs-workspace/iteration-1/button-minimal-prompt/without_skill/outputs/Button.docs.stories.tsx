import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../evals/files/button-component';
import type {
  ButtonSentiment,
  ButtonEmphasis,
  ButtonSize,
  ButtonStructure,
} from '../../../evals/files/button-component';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Button — primary interactive element for triggering actions. Uses the dimensional model: sentiment, emphasis, state, size, and structure. All dimensions are expressed via `data-*` attributes for CSS targeting.',
      },
    },
  },
  argTypes: {
    children: {
      description: 'Primary label text.',
      control: 'text',
    },
    sentiment: {
      description: 'Communicates the intent or tone of the action.',
      control: 'select',
      options: ['neutral', 'warning', 'highlight', 'success', 'error'],
      table: {
        defaultValue: { summary: 'neutral' },
      },
    },
    emphasis: {
      description: 'Visual prominence within a layout.',
      control: 'select',
      options: ['high', 'medium', 'low'],
      table: {
        defaultValue: { summary: 'high' },
      },
    },
    state: {
      description: 'Interactive state driven by user interaction or logic.',
      control: 'select',
      options: ['rest', 'hover', 'active', 'disabled', 'resolving'],
      table: {
        defaultValue: { summary: 'rest' },
      },
    },
    size: {
      description: 'Physical footprint on the screen.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    structure: {
      description: 'Layout variant of the button.',
      control: 'select',
      options: ['standard', 'icon-only', 'split'],
      table: {
        defaultValue: { summary: 'standard' },
      },
    },
    prefix: {
      description: 'Optional leading icon slot.',
      control: false,
    },
    suffix: {
      description: 'Optional trailing icon slot.',
      control: false,
    },
    onClick: {
      description: 'Click handler.',
      action: 'clicked',
    },
    type: {
      description: 'HTML `type` attribute.',
      control: 'select',
      options: ['button', 'submit', 'reset'],
      table: {
        defaultValue: { summary: 'button' },
      },
    },
    'aria-label': {
      description: "Accessible label — required when `structure` is `'icon-only'`.",
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ── Default ───────────────────────────────────────────────────────── */

/** The default button with all dimensions at their initial values. */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/* ── Sentiment ─────────────────────────────────────────────────────── */

const sentiments: ButtonSentiment[] = [
  'neutral',
  'warning',
  'highlight',
  'success',
  'error',
];

/** Demonstrates all five sentiment variants side by side. */
export const Sentiments: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {sentiments.map((sentiment) => (
        <Button key={sentiment} sentiment={sentiment}>
          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

/* ── Emphasis ──────────────────────────────────────────────────────── */

const emphases: ButtonEmphasis[] = ['high', 'medium', 'low'];

/** Shows the three emphasis levels: high (filled), medium (outlined), and low (ghost). */
export const EmphasisLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {emphases.map((emphasis) => (
        <Button key={emphasis} emphasis={emphasis}>
          {emphasis.charAt(0).toUpperCase() + emphasis.slice(1)} emphasis
        </Button>
      ))}
    </div>
  ),
};

/* ── Sizes ─────────────────────────────────────────────────────────── */

const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/** All five size options from extra-small to extra-large. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      {sizes.map((size) => (
        <Button key={size} size={size}>
          Size {size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

/* ── States ────────────────────────────────────────────────────────── */

/** Button in each interactive state: rest, hover, active, disabled, and resolving. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button state="rest">Rest</Button>
      <Button state="hover">Hover</Button>
      <Button state="active">Active</Button>
      <Button state="disabled">Disabled</Button>
      <Button state="resolving">Resolving</Button>
    </div>
  ),
};

/* ── Structure ─────────────────────────────────────────────────────── */

const structures: ButtonStructure[] = ['standard', 'icon-only', 'split'];

/** Layout structure variants. Note that `icon-only` requires an `aria-label`. */
export const Structures: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button structure="standard">Standard</Button>
      <Button structure="icon-only" aria-label="Settings" prefix={<span>⚙</span>}>
        {/* label hidden in icon-only */}
        Settings
      </Button>
      <Button structure="split" suffix={<span>▾</span>}>
        Split
      </Button>
    </div>
  ),
};

/* ── With prefix and suffix ────────────────────────────────────────── */

/** Buttons with leading and/or trailing icon slots populated. */
export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button prefix={<span>←</span>}>Back</Button>
      <Button suffix={<span>→</span>}>Next</Button>
      <Button prefix={<span>📎</span>} suffix={<span>↓</span>}>
        Download
      </Button>
    </div>
  ),
};

/* ── Disabled ──────────────────────────────────────────────────────── */

/** Disabled state prevents click events and applies muted styling. */
export const Disabled: Story = {
  args: {
    children: 'Cannot click',
    state: 'disabled',
  },
};

/* ── Resolving / Loading ───────────────────────────────────────────── */

/** Resolving state shows a spinner overlay and prevents interaction. */
export const Resolving: Story = {
  args: {
    children: 'Saving…',
    state: 'resolving',
  },
};

/* ── Sentiment × Emphasis matrix ───────────────────────────────────── */

/** A matrix showing every sentiment combined with every emphasis level. */
export const SentimentEmphasisMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {sentiments.map((sentiment) => (
        <div key={sentiment} style={{ display: 'flex', gap: '0.75rem' }}>
          {emphases.map((emphasis) => (
            <Button key={`${sentiment}-${emphasis}`} sentiment={sentiment} emphasis={emphasis}>
              {sentiment} / {emphasis}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
