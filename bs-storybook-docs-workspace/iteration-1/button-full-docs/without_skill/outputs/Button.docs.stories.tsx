import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button-component';
import type {
  ButtonSentiment,
  ButtonEmphasis,
  ButtonState,
  ButtonSize,
  ButtonStructure,
} from '../button-component';
import { DocPage, TokenTable, DemoBox, DosDonts, Callout } from '../stories/helpers';

/**
 * # Button
 *
 * Primary interactive element for triggering actions.
 *
 * The Button component uses a **dimensional model** with five independent axes:
 *
 * | Dimension   | Purpose                                  | Default     |
 * |-------------|------------------------------------------|-------------|
 * | Sentiment   | Communicates intent or tone              | `neutral`   |
 * | Emphasis    | Visual prominence within a layout        | `high`      |
 * | State       | Interactive state (user or programmatic) | `rest`      |
 * | Size        | Physical footprint on screen             | `md`        |
 * | Structure   | Layout variant                           | `standard`  |
 *
 * All dimensions are expressed as `data-*` attributes on the underlying
 * `<button>` element, making them fully targetable from CSS.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    sentiment: {
      control: 'select',
      options: ['neutral', 'warning', 'highlight', 'success', 'error'] satisfies ButtonSentiment[],
      description: 'Communicates the intent or tone of the action.',
      table: {
        defaultValue: { summary: 'neutral' },
        type: { summary: 'ButtonSentiment' },
      },
    },
    emphasis: {
      control: 'select',
      options: ['high', 'medium', 'low'] satisfies ButtonEmphasis[],
      description: 'Visual prominence within a layout.',
      table: {
        defaultValue: { summary: 'high' },
        type: { summary: 'ButtonEmphasis' },
      },
    },
    state: {
      control: 'select',
      options: ['rest', 'hover', 'active', 'disabled', 'resolving'] satisfies ButtonState[],
      description: 'Interactive state driven by user interaction or logic.',
      table: {
        defaultValue: { summary: 'rest' },
        type: { summary: 'ButtonState' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies ButtonSize[],
      description: 'Physical footprint on the screen.',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'ButtonSize' },
      },
    },
    structure: {
      control: 'select',
      options: ['standard', 'icon-only', 'split'] satisfies ButtonStructure[],
      description: 'Layout variant of the button.',
      table: {
        defaultValue: { summary: 'standard' },
        type: { summary: 'ButtonStructure' },
      },
    },
    children: {
      control: 'text',
      description: 'Primary label text.',
    },
    prefix: {
      control: false,
      description: 'Optional leading icon slot.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    suffix: {
      control: false,
      description: 'Optional trailing icon slot.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler.',
      table: { type: { summary: '(event: MouseEvent) => void' } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML type attribute.',
      table: {
        defaultValue: { summary: 'button' },
        type: { summary: "'button' | 'submit' | 'reset'" },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label — required when structure is icon-only.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Primary interactive element for triggering actions. Built on a five-axis dimensional model: sentiment, emphasis, state, size, and structure.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ─── Default / Playground ─────────────────────────────────────────── */

/** The default Button with all props at their initial values. Use the controls panel to explore every dimension. */
export const Default: Story = {
  args: {
    children: 'Button',
    sentiment: 'neutral',
    emphasis: 'high',
    state: 'rest',
    size: 'md',
    structure: 'standard',
  },
};

/* ─── Sentiment ────────────────────────────────────────────────────── */

/**
 * ## Sentiment
 *
 * The `sentiment` prop communicates intent or tone. Each value maps to a
 * distinct colour palette via design tokens.
 */
export const Sentiments: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {(['neutral', 'warning', 'highlight', 'success', 'error'] as const).map(
        (sentiment) => (
          <Button key={sentiment} sentiment={sentiment}>
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </Button>
        ),
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All five sentiment values rendered side-by-side. Use `neutral` for general-purpose actions, `highlight` for primary calls to action, `success` for confirmations, `warning` for cautionary actions, and `error` for destructive operations.',
      },
    },
  },
};

/* ─── Emphasis ─────────────────────────────────────────────────────── */

/**
 * ## Emphasis
 *
 * Controls visual prominence. Use `high` for primary actions, `medium` for
 * secondary, and `low` for tertiary or inline actions.
 */
export const EmphasisLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'centre' }}>
      {(['high', 'medium', 'low'] as const).map((emphasis) => (
        <Button key={emphasis} emphasis={emphasis}>
          {emphasis.charAt(0).toUpperCase() + emphasis.slice(1)} emphasis
        </Button>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'High emphasis uses a filled background, medium uses a bordered style, and low uses a text-only (ghost) appearance with a transparent border.',
      },
    },
  },
};

/* ─── Size ─────────────────────────────────────────────────────────── */

/**
 * ## Size
 *
 * Five sizes from `xs` to `xl`. Each adjusts padding, font size, and
 * minimum height via design tokens.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'centre' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} size={size}>
          {size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Size tokens control `padding-x`, `padding-y`, `font-size`, and `min-height`. The default is `md`.',
      },
    },
  },
};

/* ─── State ────────────────────────────────────────────────────────── */

/**
 * ## State
 *
 * Interactive states are set via the `state` prop. In practice, `hover`
 * and `active` are driven by CSS pseudo-classes, but can be forced for
 * testing. `disabled` and `resolving` disable the click handler.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'centre' }}>
      {(['rest', 'hover', 'active', 'disabled', 'resolving'] as const).map(
        (state) => (
          <Button key={state} state={state}>
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </Button>
        ),
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Both `disabled` and `resolving` states set `disabled` on the underlying HTML element and suppress click events. The `resolving` state additionally sets `aria-busy="true"` and renders a spinner overlay.',
      },
    },
  },
};

/* ─── Structure ────────────────────────────────────────────────────── */

/**
 * ## Structure
 *
 * Layout variants: `standard` (label with optional icon slots), `icon-only`
 * (square button requiring `aria-label`), and `split` (removes gap between slots).
 */
export const Structures: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'centre' }}>
      <Button structure="standard">Standard</Button>
      <Button structure="icon-only" aria-label="Settings">
        &#9881;
      </Button>
      <Button structure="split" prefix={<span>&#9881;</span>}>
        Split
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`icon-only` hides the label slot and enforces a 1:1 aspect ratio. Always provide an `aria-label` for icon-only buttons. `split` removes the gap between prefix/label/suffix slots.',
      },
    },
  },
};

/* ─── With prefix and suffix ───────────────────────────────────────── */

/**
 * ## Prefix and Suffix Slots
 *
 * Use `prefix` and `suffix` to place icons or other elements alongside
 * the label.
 */
export const WithPrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Button prefix={<span>&#8592;</span>}>Back</Button>
      <Button suffix={<span>&#8594;</span>}>Next</Button>
      <Button prefix={<span>&#9733;</span>} suffix={<span>&#8595;</span>}>
        Both slots
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Prefix and suffix slots accept any `ReactNode`. They render as flex-shrink-0 inline containers so icons maintain their intrinsic size.',
      },
    },
  },
};

/* ─── Resolving state ──────────────────────────────────────────────── */

/**
 * ## Resolving (Loading)
 *
 * The resolving state disables interaction and overlays a spinner.
 */
export const Resolving: Story = {
  args: {
    children: 'Saving...',
    state: 'resolving',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `state="resolving"`, the button becomes disabled, `aria-busy` is set to `true`, and an animated spinner appears over the content. The spinner uses `currentcolor` so it adapts to the active colour scheme.',
      },
    },
  },
};

/* ─── Disabled state ───────────────────────────────────────────────── */

/** A disabled button reduces opacity and uses a `not-allowed` cursor. */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    state: 'disabled',
  },
};

/* ─── Sentiment × Emphasis matrix ──────────────────────────────────── */

/**
 * ## Sentiment x Emphasis Matrix
 *
 * Demonstrates how sentiment and emphasis combine. Each row is a
 * sentiment; each column is an emphasis level.
 */
export const SentimentEmphasisMatrix: Story = {
  render: () => {
    const sentiments: ButtonSentiment[] = [
      'neutral',
      'warning',
      'highlight',
      'success',
      'error',
    ];
    const emphases: ButtonEmphasis[] = ['high', 'medium', 'low'];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${emphases.length}, 1fr)`,
          gap: '0.5rem',
          alignItems: 'centre',
        }}
      >
        {/* Header row */}
        <div />
        {emphases.map((e) => (
          <strong key={e} style={{ textAlign: 'center', fontSize: '0.75rem' }}>
            {e}
          </strong>
        ))}

        {/* Data rows */}
        {sentiments.map((s) => (
          <>
            <strong key={`label-${s}`} style={{ fontSize: '0.75rem' }}>
              {s}
            </strong>
            {emphases.map((e) => (
              <Button key={`${s}-${e}`} sentiment={s} emphasis={e}>
                {s}
              </Button>
            ))}
          </>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'A full matrix showing every combination of sentiment and emphasis. This is useful for visual regression testing and ensuring token coverage.',
      },
    },
  },
};

/* ─── Full size scale ──────────────────────────────────────────────── */

/**
 * ## Size Scale
 *
 * All sizes displayed with a shared sentiment to illustrate relative proportions.
 */
export const SizeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} size={size} sentiment="highlight">
          Size {size}
        </Button>
      ))}
    </div>
  ),
};

/* ─── Accessibility: icon-only with aria-label ─────────────────────── */

/**
 * ## Accessibility
 *
 * Icon-only buttons **must** have an `aria-label` so that screen readers
 * announce a meaningful label instead of the icon glyph.
 */
export const AccessibleIconOnly: Story = {
  args: {
    children: '✕',
    structure: 'icon-only',
    'aria-label': 'Close dialogue',
    sentiment: 'error',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Always provide `aria-label` when using `structure="icon-only"`. The label slot is hidden, so the accessible name must come from the attribute.',
      },
    },
  },
};
