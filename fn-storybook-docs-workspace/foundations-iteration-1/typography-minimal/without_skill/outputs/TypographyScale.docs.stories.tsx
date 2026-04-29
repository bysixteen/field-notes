import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import '../../../../evals/files/tokens/typography.css';

/* ── Token data extracted from typography.css ────────────────────────── */

const fontFamilies = [
  { token: '--font-family-sans', value: "'Inter', system-ui, -apple-system, sans-serif" },
  { token: '--font-family-mono', value: "'JetBrains Mono', ui-monospace, monospace" },
];

const fontSizes = [
  { token: '--font-size-11', rem: '0.6875rem', px: '11px', usage: 'caption' },
  { token: '--font-size-12', rem: '0.75rem', px: '12px', usage: 'small' },
  { token: '--font-size-13', rem: '0.8125rem', px: '13px', usage: 'compact' },
  { token: '--font-size-14', rem: '0.875rem', px: '14px', usage: 'body' },
  { token: '--font-size-16', rem: '1rem', px: '16px', usage: 'body-lg' },
  { token: '--font-size-18', rem: '1.125rem', px: '18px', usage: 'subtitle' },
  { token: '--font-size-20', rem: '1.25rem', px: '20px', usage: 'heading-sm' },
  { token: '--font-size-24', rem: '1.5rem', px: '24px', usage: 'heading' },
  { token: '--font-size-32', rem: '2rem', px: '32px', usage: 'heading-lg' },
  { token: '--font-size-40', rem: '2.5rem', px: '40px', usage: 'display' },
  { token: '--font-size-48', rem: '3rem', px: '48px', usage: 'display-lg' },
];

const fontWeights = [
  { token: '--font-weight-400', value: 400, label: 'regular' },
  { token: '--font-weight-500', value: 500, label: 'medium' },
  { token: '--font-weight-600', value: 600, label: 'semibold' },
  { token: '--font-weight-700', value: 700, label: 'bold' },
];

const leadings = [
  { token: '--leading-none', value: 1 },
  { token: '--leading-tight', value: 1.2 },
  { token: '--leading-snug', value: 1.375 },
  { token: '--leading-normal', value: 1.5 },
  { token: '--leading-relaxed', value: 1.625 },
  { token: '--leading-loose', value: 2 },
];

const trackings = [
  { token: '--tracking-tighter', value: '-0.04em' },
  { token: '--tracking-tight', value: '-0.02em' },
  { token: '--tracking-normal', value: '0em' },
  { token: '--tracking-wide', value: '0.02em' },
  { token: '--tracking-wider', value: '0.04em' },
];

/* ── Shared styles ───────────────────────────────────────────────────── */

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-family-sans)',
};

const cellStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #e5e7eb',
  textAlign: 'left',
  verticalAlign: 'middle',
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  color: '#6b7280',
};

const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family-mono)',
  fontSize: '0.8125rem',
  backgroundColor: '#f3f4f6',
  padding: '0.125rem 0.375rem',
  borderRadius: '0.25rem',
  color: '#374151',
};

/* ── Meta ─────────────────────────────────────────────────────────────── */

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Typography tokens define the typographic scale for the design system. ' +
          'All sizes use rem units with pixel-equivalent naming. ' +
          'Tokens cover font families, sizes, weights, line-heights (leading), and letter-spacing (tracking).',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ── Font Families ────────────────────────────────────────────────────── */

/** The two font family stacks: sans-serif (Inter) for UI text, and monospace (JetBrains Mono) for code. */
export const FontFamilies: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {fontFamilies.map(({ token, value }) => (
        <div key={token}>
          <div style={{ marginBottom: '0.5rem' }}>
            <code style={codeStyle}>{token}</code>
          </div>
          <p
            style={{
              fontFamily: `var(${token})`,
              fontSize: '1.5rem',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  ),
};

/* ── Font Size Scale ──────────────────────────────────────────────────── */

/** The full font size scale from 11px (caption) up to 48px (display-lg). Each row renders sample text at the given size. */
export const FontSizeScale: Story = {
  render: () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerCellStyle}>Token</th>
          <th style={headerCellStyle}>Size</th>
          <th style={headerCellStyle}>Usage</th>
          <th style={headerCellStyle}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {fontSizes.map(({ token, rem, px, usage }) => (
          <tr key={token}>
            <td style={cellStyle}>
              <code style={codeStyle}>{token}</code>
            </td>
            <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
              {rem}{' '}
              <span style={{ color: '#9ca3af' }}>({px})</span>
            </td>
            <td style={cellStyle}>{usage}</td>
            <td style={cellStyle}>
              <span
                style={{
                  fontSize: `var(${token})`,
                  fontFamily: 'var(--font-family-sans)',
                  lineHeight: 1.4,
                }}
              >
                Aa Bb Cc
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Font Weights ─────────────────────────────────────────────────────── */

/** All four font weight tokens rendered side by side. */
export const FontWeights: Story = {
  render: () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerCellStyle}>Token</th>
          <th style={headerCellStyle}>Weight</th>
          <th style={headerCellStyle}>Label</th>
          <th style={headerCellStyle}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {fontWeights.map(({ token, value, label }) => (
          <tr key={token}>
            <td style={cellStyle}>
              <code style={codeStyle}>{token}</code>
            </td>
            <td style={cellStyle}>{value}</td>
            <td style={cellStyle}>{label}</td>
            <td style={cellStyle}>
              <span
                style={{
                  fontWeight: `var(${token})` as unknown as number,
                  fontFamily: 'var(--font-family-sans)',
                  fontSize: '1.25rem',
                }}
              >
                The quick brown fox
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Leading (Line Height) ────────────────────────────────────────────── */

/** Line-height tokens demonstrated with multi-line sample text. */
export const Leading: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {leadings.map(({ token, value }) => (
        <div
          key={token}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}
        >
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <code style={codeStyle}>{token}</code>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{value}</span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-family-sans)',
              fontSize: '1rem',
              lineHeight: `var(${token})` as unknown as number,
              margin: 0,
              color: '#374151',
            }}
          >
            Typography is the craft of arranging type to make written language legible, readable, and
            visually appealing when displayed.
          </p>
        </div>
      ))}
    </div>
  ),
};

/* ── Tracking (Letter Spacing) ────────────────────────────────────────── */

/** Letter-spacing tokens from tighter to wider. */
export const Tracking: Story = {
  render: () => (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerCellStyle}>Token</th>
          <th style={headerCellStyle}>Value</th>
          <th style={headerCellStyle}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {trackings.map(({ token, value }) => (
          <tr key={token}>
            <td style={cellStyle}>
              <code style={codeStyle}>{token}</code>
            </td>
            <td style={cellStyle}>{value}</td>
            <td style={cellStyle}>
              <span
                style={{
                  letterSpacing: `var(${token})`,
                  fontFamily: 'var(--font-family-sans)',
                  fontSize: '1.125rem',
                }}
              >
                LETTER SPACING SAMPLE
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/* ── Composite: Heading Hierarchy ─────────────────────────────────────── */

/** A practical example showing how size, weight, leading, and tracking tokens compose to form a heading hierarchy. */
export const HeadingHierarchy: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-family-sans)' }}>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          display-lg / 48px / bold / tight
        </span>
        <h1 style={{ fontSize: 'var(--font-size-48)', fontWeight: 'var(--font-weight-700)' as unknown as number, lineHeight: 'var(--leading-tight)' as unknown as number, letterSpacing: 'var(--tracking-tighter)', margin: '0.25rem 0 0' }}>
          Display Large
        </h1>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          display / 40px / bold / tight
        </span>
        <h2 style={{ fontSize: 'var(--font-size-40)', fontWeight: 'var(--font-weight-700)' as unknown as number, lineHeight: 'var(--leading-tight)' as unknown as number, letterSpacing: 'var(--tracking-tight)', margin: '0.25rem 0 0' }}>
          Display
        </h2>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          heading-lg / 32px / semibold / tight
        </span>
        <h3 style={{ fontSize: 'var(--font-size-32)', fontWeight: 'var(--font-weight-600)' as unknown as number, lineHeight: 'var(--leading-tight)' as unknown as number, letterSpacing: 'var(--tracking-tight)', margin: '0.25rem 0 0' }}>
          Heading Large
        </h3>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          heading / 24px / semibold / snug
        </span>
        <h4 style={{ fontSize: 'var(--font-size-24)', fontWeight: 'var(--font-weight-600)' as unknown as number, lineHeight: 'var(--leading-snug)' as unknown as number, letterSpacing: 'var(--tracking-normal)', margin: '0.25rem 0 0' }}>
          Heading
        </h4>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          heading-sm / 20px / medium / snug
        </span>
        <h5 style={{ fontSize: 'var(--font-size-20)', fontWeight: 'var(--font-weight-500)' as unknown as number, lineHeight: 'var(--leading-snug)' as unknown as number, letterSpacing: 'var(--tracking-normal)', margin: '0.25rem 0 0' }}>
          Heading Small
        </h5>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          subtitle / 18px / medium / normal
        </span>
        <h6 style={{ fontSize: 'var(--font-size-18)', fontWeight: 'var(--font-weight-500)' as unknown as number, lineHeight: 'var(--leading-normal)' as unknown as number, letterSpacing: 'var(--tracking-normal)', margin: '0.25rem 0 0' }}>
          Subtitle
        </h6>
      </div>
      <div>
        <span style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          body / 14px / regular / normal
        </span>
        <p style={{ fontSize: 'var(--font-size-14)', fontWeight: 'var(--font-weight-400)' as unknown as number, lineHeight: 'var(--leading-normal)' as unknown as number, margin: '0.25rem 0 0' }}>
          Body text used for paragraphs and general content throughout the interface.
        </p>
      </div>
    </div>
  ),
};
