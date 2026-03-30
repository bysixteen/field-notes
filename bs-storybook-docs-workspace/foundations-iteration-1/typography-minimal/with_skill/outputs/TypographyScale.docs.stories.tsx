import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DocPage, TokenTable, DemoBox } from '../../../../../../evals/files/stories/helpers';

/* =================================================================
   Token data — derived from typography.css custom properties
   ================================================================= */

const FONT_FAMILIES = [
  { token: '--font-family-sans', value: "'Inter', system-ui, -apple-system, sans-serif", role: 'Primary' },
  { token: '--font-family-mono', value: "'JetBrains Mono', ui-monospace, monospace", role: 'Code' },
] as const;

const FONT_SIZES = [
  { token: '--font-size-11', rem: '0.6875rem', px: 11, role: 'caption' },
  { token: '--font-size-12', rem: '0.75rem', px: 12, role: 'small' },
  { token: '--font-size-13', rem: '0.8125rem', px: 13, role: 'compact' },
  { token: '--font-size-14', rem: '0.875rem', px: 14, role: 'body' },
  { token: '--font-size-16', rem: '1rem', px: 16, role: 'body-lg' },
  { token: '--font-size-18', rem: '1.125rem', px: 18, role: 'subtitle' },
  { token: '--font-size-20', rem: '1.25rem', px: 20, role: 'heading-sm' },
  { token: '--font-size-24', rem: '1.5rem', px: 24, role: 'heading' },
  { token: '--font-size-32', rem: '2rem', px: 32, role: 'heading-lg' },
  { token: '--font-size-40', rem: '2.5rem', px: 40, role: 'display' },
  { token: '--font-size-48', rem: '3rem', px: 48, role: 'display-lg' },
] as const;

const FONT_WEIGHTS = [
  { token: '--font-weight-400', value: 400, role: 'regular' },
  { token: '--font-weight-500', value: 500, role: 'medium' },
  { token: '--font-weight-600', value: 600, role: 'semibold' },
  { token: '--font-weight-700', value: 700, role: 'bold' },
] as const;

const LEADING = [
  { token: '--leading-none', value: 1, role: 'No extra leading — single-line elements' },
  { token: '--leading-tight', value: 1.2, role: 'Headings, display text' },
  { token: '--leading-snug', value: 1.375, role: 'Compact body text' },
  { token: '--leading-normal', value: 1.5, role: 'Default body text' },
  { token: '--leading-relaxed', value: 1.625, role: 'Long-form reading' },
  { token: '--leading-loose', value: 2, role: 'Extra-spaced text' },
] as const;

const TRACKING = [
  { token: '--tracking-tighter', value: '-0.04em', role: 'Display headings' },
  { token: '--tracking-tight', value: '-0.02em', role: 'Headings' },
  { token: '--tracking-normal', value: '0em', role: 'Body text' },
  { token: '--tracking-wide', value: '0.02em', role: 'Small caps, labels' },
  { token: '--tracking-wider', value: '0.04em', role: 'All-caps labels, overlines' },
] as const;

/* =================================================================
   Shared inline styles
   ================================================================= */

const sampleText = 'The quick brown fox jumps over the lazy dog';
const multiLineText =
  'Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line spacing, and letter spacing.';

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  verticalAlign: 'middle',
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  color: '#6b7280',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontFamily: 'var(--font-family-sans)',
};

const tokenLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family-mono)',
  fontSize: '0.8125rem',
  color: '#6366f1',
};

const roleLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280',
  marginTop: 2,
};

/* =================================================================
   Meta
   ================================================================= */

const meta = {
  title: 'Foundations/Typography Scale',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* =================================================================
   Stories
   ================================================================= */

/** Each font-size token rendered as a text sample */
export const FontSizes: Story = {
  render: () => (
    <DocPage title="Font Sizes" description="Font size tokens use rem values with pixel-equivalent names. Eleven steps from caption (11 px) to display-lg (48 px).">
      <DemoBox>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Token</th>
              <th style={headerCellStyle}>Size</th>
              <th style={headerCellStyle}>Sample</th>
            </tr>
          </thead>
          <tbody>
            {FONT_SIZES.map(({ token, rem, px, role }) => (
              <tr key={token}>
                <td style={cellStyle}>
                  <div style={tokenLabelStyle}>{token}</div>
                  <div style={roleLabelStyle}>{role}</div>
                </td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>
                  {rem}
                  <br />
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{px}px</span>
                </td>
                <td style={cellStyle}>
                  <span style={{ fontSize: `var(${token})`, fontFamily: 'var(--font-family-sans)' }}>
                    {sampleText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoBox>
    </DocPage>
  ),
};

/** Weight scale rendered at a reference size (16 px) */
export const FontWeights: Story = {
  render: () => (
    <DocPage title="Font Weights" description="Four weight stops from regular (400) to bold (700), rendered at the body-lg reference size.">
      <DemoBox>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Token</th>
              <th style={headerCellStyle}>Value</th>
              <th style={headerCellStyle}>Sample</th>
            </tr>
          </thead>
          <tbody>
            {FONT_WEIGHTS.map(({ token, value, role }) => (
              <tr key={token}>
                <td style={cellStyle}>
                  <div style={tokenLabelStyle}>{token}</div>
                  <div style={roleLabelStyle}>{role}</div>
                </td>
                <td style={cellStyle}>{value}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      fontWeight: `var(${token})` as unknown as number,
                      fontSize: 'var(--font-size-16)',
                      fontFamily: 'var(--font-family-sans)',
                    }}
                  >
                    {sampleText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoBox>
    </DocPage>
  ),
};

/** Line-height values shown with multi-line text blocks */
export const LeadingScale: Story = {
  render: () => (
    <DocPage title="Leading (Line Height)" description="Six line-height values from none (1) to loose (2). Each sample uses a multi-line paragraph to demonstrate the vertical rhythm.">
      <DemoBox>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {LEADING.map(({ token, value, role }) => (
            <div key={token} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={tokenLabelStyle}>{token}</span>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{value}</span>
                <span style={roleLabelStyle}>{role}</span>
              </div>
              <p
                style={{
                  lineHeight: `var(${token})`,
                  fontSize: 'var(--font-size-14)',
                  fontFamily: 'var(--font-family-sans)',
                  maxWidth: '60ch',
                  margin: 0,
                }}
              >
                {multiLineText}
              </p>
            </div>
          ))}
        </div>
      </DemoBox>
    </DocPage>
  ),
};

/** Letter-spacing values shown with sample text */
export const TrackingScale: Story = {
  render: () => (
    <DocPage title="Tracking (Letter Spacing)" description="Five letter-spacing stops from tighter (-0.04 em) to wider (0.04 em).">
      <DemoBox>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Token</th>
              <th style={headerCellStyle}>Value</th>
              <th style={headerCellStyle}>Sample</th>
            </tr>
          </thead>
          <tbody>
            {TRACKING.map(({ token, value, role }) => (
              <tr key={token}>
                <td style={cellStyle}>
                  <div style={tokenLabelStyle}>{token}</div>
                  <div style={roleLabelStyle}>{role}</div>
                </td>
                <td style={cellStyle}>{value}</td>
                <td style={cellStyle}>
                  <span
                    style={{
                      letterSpacing: `var(${token})`,
                      fontSize: 'var(--font-size-16)',
                      fontFamily: 'var(--font-family-sans)',
                    }}
                  >
                    {sampleText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DemoBox>
    </DocPage>
  ),
};

/** Common heading + body combinations */
export const TypePairings: Story = {
  render: () => {
    const pairings = [
      {
        name: 'Display + Body',
        heading: { size: '--font-size-40', weight: '--font-weight-700', tracking: '--tracking-tighter', leading: '--leading-tight' },
        body: { size: '--font-size-16', weight: '--font-weight-400', tracking: '--tracking-normal', leading: '--leading-normal' },
      },
      {
        name: 'Heading + Body',
        heading: { size: '--font-size-24', weight: '--font-weight-600', tracking: '--tracking-tight', leading: '--leading-tight' },
        body: { size: '--font-size-14', weight: '--font-weight-400', tracking: '--tracking-normal', leading: '--leading-normal' },
      },
      {
        name: 'Heading Small + Compact',
        heading: { size: '--font-size-20', weight: '--font-weight-600', tracking: '--tracking-tight', leading: '--leading-tight' },
        body: { size: '--font-size-13', weight: '--font-weight-400', tracking: '--tracking-normal', leading: '--leading-snug' },
      },
      {
        name: 'Subtitle + Small',
        heading: { size: '--font-size-18', weight: '--font-weight-500', tracking: '--tracking-normal', leading: '--leading-snug' },
        body: { size: '--font-size-12', weight: '--font-weight-400', tracking: '--tracking-normal', leading: '--leading-normal' },
      },
    ];

    return (
      <DocPage title="Type Pairings" description="Common heading and body combinations showing how size, weight, leading, and tracking tokens work together.">
        <DemoBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {pairings.map(({ name, heading, body }) => (
              <div key={name} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '32px' }}>
                <div style={{ ...roleLabelStyle, marginBottom: '12px', fontWeight: 600 }}>{name}</div>
                <div
                  style={{
                    fontSize: `var(${heading.size})`,
                    fontWeight: `var(${heading.weight})` as unknown as number,
                    letterSpacing: `var(${heading.tracking})`,
                    lineHeight: `var(${heading.leading})`,
                    fontFamily: 'var(--font-family-sans)',
                    marginBottom: '8px',
                  }}
                >
                  The quick brown fox
                </div>
                <p
                  style={{
                    fontSize: `var(${body.size})`,
                    fontWeight: `var(${body.weight})` as unknown as number,
                    letterSpacing: `var(${body.tracking})`,
                    lineHeight: `var(${body.leading})`,
                    fontFamily: 'var(--font-family-sans)',
                    maxWidth: '60ch',
                    margin: 0,
                    color: '#374151',
                  }}
                >
                  {multiLineText}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <span style={tokenLabelStyle}>Heading: {heading.size} / {heading.weight} / {heading.tracking} / {heading.leading}</span>
                  <span style={tokenLabelStyle}>Body: {body.size} / {body.weight} / {body.tracking} / {body.leading}</span>
                </div>
              </div>
            ))}
          </div>
        </DemoBox>
      </DocPage>
    );
  },
};
