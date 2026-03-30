import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from '../button-component';
import type {
  ButtonSentiment,
  ButtonEmphasis,
  ButtonSize,
  ButtonState,
  ButtonStructure,
} from '../button-component';
import {
  DocPage,
  TokenTable,
  DemoBox,
  DosDonts,
  Callout,
} from '../stories/helpers';

/* ================================================================
   Meta
   ================================================================ */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**Button** is the primary interactive element for triggering actions.

It uses a five-axis dimensional model — **sentiment**, **emphasis**, **state**, **size**, and **structure** — all expressed via \`data-*\` attributes so CSS can target every combination without class-name inflation.
        `,
      },
    },
  },
  argTypes: {
    sentiment: {
      control: 'select',
      options: ['neutral', 'warning', 'highlight', 'success', 'error'] satisfies ButtonSentiment[],
      description: 'Communicates the intent or tone of the action.',
      table: { defaultValue: { summary: 'neutral' } },
    },
    emphasis: {
      control: 'select',
      options: ['high', 'medium', 'low'] satisfies ButtonEmphasis[],
      description: 'Visual prominence within a layout.',
      table: { defaultValue: { summary: 'high' } },
    },
    state: {
      control: 'select',
      options: ['rest', 'hover', 'active', 'disabled', 'resolving'] satisfies ButtonState[],
      description: 'Interactive state driven by user interaction or logic.',
      table: { defaultValue: { summary: 'rest' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies ButtonSize[],
      description: 'Physical footprint on the screen.',
      table: { defaultValue: { summary: 'md' } },
    },
    structure: {
      control: 'select',
      options: ['standard', 'icon-only', 'split'] satisfies ButtonStructure[],
      description: 'Layout variant of the button.',
      table: { defaultValue: { summary: 'standard' } },
    },
    children: {
      control: 'text',
      description: 'Primary label text.',
    },
    prefix: {
      control: false,
      description: 'Optional leading icon slot.',
    },
    suffix: {
      control: false,
      description: 'Optional trailing icon slot.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/* ── Helpers ───────────────────────────────────────────────────── */

/** Placeholder icon for prefix/suffix demos. */
const IconPlaceholder = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const SENTIMENTS: ButtonSentiment[] = ['neutral', 'warning', 'highlight', 'success', 'error'];
const EMPHASES: ButtonEmphasis[] = ['high', 'medium', 'low'];
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const STATES: ButtonState[] = ['rest', 'hover', 'active', 'disabled', 'resolving'];
const STRUCTURES: ButtonStructure[] = ['standard', 'icon-only', 'split'];

/* ================================================================
   1. Default / Playground
   ================================================================ */

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    children: 'Button',
    sentiment: 'neutral',
    emphasis: 'high',
    state: 'rest',
    size: 'md',
    structure: 'standard',
  },
};

/* ================================================================
   2. Dimension Grid — Sentiment x Emphasis
   ================================================================ */

/**
 * Shows every combination of **sentiment** (row) and **emphasis** (column).
 * Use this grid to compare visual weight across intent and prominence levels.
 */
export const SentimentByEmphasis: Story = {
  name: 'Grid: Sentiment x Emphasis',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${EMPHASES.length}, 1fr)`, gap: '12px', alignItems: 'center' }}>
      {/* Header row */}
      <div />
      {EMPHASES.map((emphasis) => (
        <div key={emphasis} style={{ fontWeight: 600, textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {emphasis}
        </div>
      ))}

      {/* Data rows */}
      {SENTIMENTS.map((sentiment) => (
        <React.Fragment key={sentiment}>
          <div style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sentiment}
          </div>
          {EMPHASES.map((emphasis) => (
            <Button key={`${sentiment}-${emphasis}`} sentiment={sentiment} emphasis={emphasis}>
              {sentiment}
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complete matrix of every **sentiment** against every **emphasis** level. High emphasis buttons are filled, medium have a visible border, and low emphasis buttons appear as ghost/text-only.',
      },
    },
  },
};

/* ================================================================
   3. Dimension Grid — Size Scale
   ================================================================ */

/**
 * All five sizes rendered side by side for quick visual comparison.
 */
export const SizeScale: Story = {
  name: 'Grid: Size Scale',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Button key={size} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sizes range from **xs** (compact inline actions) through **xl** (hero CTAs). Each step adjusts padding, font size, and minimum height via dedicated design tokens.',
      },
    },
  },
};

/* ================================================================
   4. Dimension Grid — State
   ================================================================ */

/**
 * Every interactive state the button can occupy.
 */
export const StateVariants: Story = {
  name: 'Grid: States',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      {STATES.map((state) => (
        <Button key={state} state={state}>
          {state}
        </Button>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '`rest` is the default. `hover` and `active` are normally CSS-driven but can be forced via the `state` prop for documentation or testing. `disabled` prevents interaction and lowers opacity. `resolving` shows a spinner overlay and sets `aria-busy`.',
      },
    },
  },
};

/* ================================================================
   5. Dimension Grid — Structure
   ================================================================ */

/**
 * The three structural variants: standard, icon-only, and split.
 */
export const StructureVariants: Story = {
  name: 'Grid: Structure',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button structure="standard">Standard</Button>
      <Button structure="icon-only" aria-label="Settings" prefix={<IconPlaceholder />}>
        {/* label hidden in icon-only mode */}
        Settings
      </Button>
      <Button structure="split" suffix={<IconPlaceholder />}>
        Split
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '**Standard** is the default text button. **Icon-only** hides the label and forces a square aspect ratio — an `aria-label` is required for accessibility. **Split** removes the gap between label and suffix, typically used for dropdown triggers.',
      },
    },
  },
};

/* ================================================================
   6. With Prefix & Suffix
   ================================================================ */

/** Demonstrates prefix (leading) and suffix (trailing) icon slots. */
export const WithPrefixAndSuffix: Story = {
  name: 'Slots: Prefix & Suffix',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button prefix={<IconPlaceholder />}>With Prefix</Button>
      <Button suffix={<IconPlaceholder />}>With Suffix</Button>
      <Button prefix={<IconPlaceholder />} suffix={<IconPlaceholder />}>
        Both Slots
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons sit in flex-shrink-proof slots either side of the label. The label itself truncates with an ellipsis if space is constrained.',
      },
    },
  },
};

/* ================================================================
   7. Token Table
   ================================================================ */

/**
 * Lists every CSS custom property consumed by the button, grouped by category.
 */
export const DesignTokens: Story = {
  name: 'Token Table',
  render: () => {
    const tokens = [
      { category: 'Colour', token: '--btn/colour/bg/rest', fallback: '--colour-surface-primary', description: 'Background colour at rest' },
      { category: 'Colour', token: '--btn/colour/fg/rest', fallback: '--colour-text-on-primary', description: 'Foreground / text colour at rest' },
      { category: 'Colour', token: '--btn/colour/border/rest', fallback: '--colour-border-primary', description: 'Border colour at rest' },
      { category: 'Spacing', token: '--btn/spacing/padding-x', fallback: '--space-400', description: 'Inline (horizontal) padding' },
      { category: 'Spacing', token: '--btn/spacing/padding-y', fallback: '--space-200', description: 'Block (vertical) padding' },
      { category: 'Spacing', token: '--btn/spacing/gap', fallback: '--space-200', description: 'Gap between prefix, label, and suffix' },
      { category: 'Typography', token: '--btn/typography/font-size', fallback: '--type-body-md', description: 'Font size' },
      { category: 'Typography', token: '--btn/typography/font-weight', fallback: '--type-weight-semibold', description: 'Font weight' },
      { category: 'Typography', token: '--btn/typography/line-height', fallback: '--type-leading-tight', description: 'Line height' },
      { category: 'Structure', token: '--btn/structure/border-radius', fallback: '--radius-md', description: 'Corner radius' },
      { category: 'Structure', token: '--btn/structure/border-width', fallback: '--border-width-thin', description: 'Border width' },
      { category: 'Structure', token: '--btn/structure/min-height', fallback: '--control-height-md', description: 'Minimum block size (touch target)' },
    ];

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e2e2', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Category</th>
            <th style={{ padding: '8px' }}>Token</th>
            <th style={{ padding: '8px' }}>Default value</th>
            <th style={{ padding: '8px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(({ category, token, fallback, description }) => (
            <tr key={token} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px', fontWeight: 500 }}>{category}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '0.75rem' }}>{token}</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '0.75rem' }}>{fallback}</td>
              <td style={{ padding: '8px' }}>{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Every CSS custom property the Button consumes. Dimension selectors (sentiment, emphasis, size, etc.) override these tokens contextually. Theme changes only need to update the global aliases (right-hand column).',
      },
    },
  },
};

/* ================================================================
   8. Anatomy
   ================================================================ */

/**
 * Visual breakdown of the button's internal structure.
 */
export const Anatomy: Story = {
  name: 'Anatomy',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Annotated diagram */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          border: '2px dashed #999',
          borderRadius: '8px',
          position: 'relative',
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
        }}
      >
        <span style={{ padding: '4px 8px', border: '1px solid #4A90D9', borderRadius: '4px', background: '#EBF5FF', color: '#1a56db' }}>
          .btn__prefix
        </span>
        <span style={{ padding: '4px 8px', border: '1px solid #D946EF', borderRadius: '4px', background: '#FDF2F8', color: '#a21caf', flex: '1 1 auto', textAlign: 'center' }}>
          .btn__label
        </span>
        <span style={{ padding: '4px 8px', border: '1px solid #4A90D9', borderRadius: '4px', background: '#EBF5FF', color: '#1a56db' }}>
          .btn__suffix
        </span>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #f59e0b',
            borderRadius: '8px',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Legend */}
      <div style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
        <p><strong>Host element</strong> (<code>.btn</code>) — the <code>&lt;button&gt;</code> itself. Carries all <code>data-*</code> dimension attributes.</p>
        <p><strong>.btn__prefix</strong> — optional leading icon slot. Renders only when the <code>prefix</code> prop is provided.</p>
        <p><strong>.btn__label</strong> — primary label. Truncates with ellipsis. Hidden when <code>structure=&quot;icon-only&quot;</code>.</p>
        <p><strong>.btn__suffix</strong> — optional trailing icon slot. Renders only when the <code>suffix</code> prop is provided.</p>
        <p><strong>.btn__spinner</strong> — absolute-positioned overlay visible only when <code>state=&quot;resolving&quot;</code>. Uses a CSS-only spinner animation.</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The button is composed of a host `<button>` element containing up to four internal slots: **prefix**, **label**, **suffix**, and a conditionally-rendered **spinner** overlay.',
      },
    },
  },
};

/* ================================================================
   9. Usage Do's and Don'ts
   ================================================================ */

/**
 * Guidance on correct and incorrect usage patterns.
 */
export const UsageDosAndDonts: Story = {
  name: "Usage: Do's & Don'ts",
  render: () => {
    const items = [
      {
        type: 'do' as const,
        label: 'Use sentence case for labels',
        example: <Button>Save changes</Button>,
      },
      {
        type: 'dont' as const,
        label: 'Don\'t use ALL CAPS for labels',
        example: <Button>SAVE CHANGES</Button>,
      },
      {
        type: 'do' as const,
        label: 'Use a single primary (high emphasis) button per section',
        example: (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button emphasis="high">Confirm</Button>
            <Button emphasis="low">Cancel</Button>
          </div>
        ),
      },
      {
        type: 'dont' as const,
        label: 'Don\'t place multiple high-emphasis buttons side by side',
        example: (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button emphasis="high">Confirm</Button>
            <Button emphasis="high" sentiment="error">Delete</Button>
          </div>
        ),
      },
      {
        type: 'do' as const,
        label: 'Provide an aria-label for icon-only buttons',
        example: (
          <Button structure="icon-only" aria-label="Close dialogue" prefix={<IconPlaceholder />}>
            Close
          </Button>
        ),
      },
      {
        type: 'dont' as const,
        label: 'Don\'t use icon-only without an aria-label',
        example: (
          <Button structure="icon-only" prefix={<IconPlaceholder />}>
            Close
          </Button>
        ),
      },
      {
        type: 'do' as const,
        label: 'Use the resolving state to communicate async operations',
        example: <Button state="resolving">Saving...</Button>,
      },
      {
        type: 'dont' as const,
        label: 'Don\'t disable without explaining why to the user',
        example: <Button state="disabled">Submit</Button>,
      },
      {
        type: 'do' as const,
        label: 'Match sentiment to the action\'s consequence',
        example: <Button sentiment="error">Delete account</Button>,
      },
      {
        type: 'dont' as const,
        label: 'Don\'t use highlight sentiment for destructive actions',
        example: <Button sentiment="highlight">Delete account</Button>,
      },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {items.map(({ type, label, example }, i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: `2px solid ${type === 'do' ? '#22c55e' : '#ef4444'}`,
              background: type === 'do' ? '#f0fdf4' : '#fef2f2',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                color: type === 'do' ? '#16a34a' : '#dc2626',
              }}
            >
              {type === 'do' ? 'Do' : "Don't"}
            </div>
            <p style={{ fontSize: '0.8125rem', marginBottom: '12px' }}>{label}</p>
            <div>{example}</div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Best-practice guidance for using the Button component correctly. Follow these patterns to maintain consistency and accessibility across the product.',
      },
    },
  },
};

/* ================================================================
   10. Accessibility Notes
   ================================================================ */

/**
 * Key accessibility behaviours built into the component.
 */
export const Accessibility: Story = {
  name: 'Accessibility',
  render: () => (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.8, maxWidth: '640px' }}>
      <ul style={{ paddingLeft: '1.25rem' }}>
        <li>
          <strong>Disabled &amp; resolving states</strong> set the native <code>disabled</code> attribute, removing the button from the tab order and preventing click events.
        </li>
        <li>
          <strong>Resolving state</strong> adds <code>aria-busy=&quot;true&quot;</code> so assistive technology can announce that an operation is in progress.
        </li>
        <li>
          <strong>Icon-only structure</strong> requires an <code>aria-label</code> prop to provide an accessible name when the visible label is hidden.
        </li>
        <li>
          <strong>Spinner</strong> is marked <code>aria-hidden=&quot;true&quot;</code> because the <code>aria-busy</code> attribute on the host element already communicates the loading state.
        </li>
        <li>
          <strong>Colour contrast</strong> is managed via the design-token layer; each sentiment/emphasis pair is expected to meet WCAG 2.1 AA contrast ratios.
        </li>
        <li>
          <strong>Minimum touch target</strong> is enforced by the <code>--btn/structure/min-height</code> token — even the <code>xs</code> size meets the 24px minimum recommended by WCAG 2.5.8.
        </li>
      </ul>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Summary of the accessibility features built into the Button component.',
      },
    },
  },
};
