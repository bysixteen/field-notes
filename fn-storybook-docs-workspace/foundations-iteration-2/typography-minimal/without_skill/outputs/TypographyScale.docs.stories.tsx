import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import '../../../../evals/files/tokens/typography.css';

/* ── Token data extracted from typography.css ────────────────────────── */

const fontFamilies = [
  { token: '--font-family-sans', value: "'Inter', system-ui, -apple-system, sans-serif", description: 'Primary UI typeface for all interface text' },
  { token: '--font-family-mono', value: "'JetBrains Mono', ui-monospace, monospace", description: 'Code, data tables, and technical content' },
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
  { token: '--leading-none', value: 1, usage: 'Single-line elements, icons' },
  { token: '--leading-tight', value: 1.2, usage: 'Display and large headings' },
  { token: '--leading-snug', value: 1.375, usage: 'Subheadings' },
  { token: '--leading-normal', value: 1.5, usage: 'Body text (default)' },
  { token: '--leading-relaxed', value: 1.625, usage: 'Long-form prose' },
  { token: '--leading-loose', value: 2, usage: 'Widely-spaced text, legal copy' },
];

const trackings = [
  { token: '--tracking-tighter', value: '-0.04em' },
  { token: '--tracking-tight', value: '-0.02em' },
  { token: '--tracking-normal', value: '0em' },
  { token: '--tracking-wide', value: '0.02em' },
  { token: '--tracking-wider', value: '0.04em' },
];

/* ── Shared styles ───────────────────────────────────────────────────── */

const styles = {
  page: {
    fontFamily: 'var(--font-family-sans)',
    maxWidth: 960,
    lineHeight: 1.6,
    color: '#1a1a1a',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginTop: '2.5rem',
    marginBottom: '0.75rem',
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: '0.5rem',
  } as React.CSSProperties,
  intro: {
    fontSize: '0.9375rem',
    color: '#444',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: 'var(--font-family-sans)',
  } as React.CSSProperties,
  cell: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'left' as const,
    verticalAlign: 'middle' as const,
  } as React.CSSProperties,
  headerCell: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'left' as const,
    verticalAlign: 'middle' as const,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    color: '#6b7280',
  } as React.CSSProperties,
  code: {
    fontFamily: 'var(--font-family-mono)',
    fontSize: '0.8125rem',
    backgroundColor: '#f3f4f6',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    color: '#374151',
  } as React.CSSProperties,
  muted: {
    fontSize: '0.75rem',
    color: '#6b7280',
  } as React.CSSProperties,
  annotationLabel: {
    fontSize: '0.6875rem',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  } as React.CSSProperties,
};

/* ── Sub-components ──────────────────────────────────────────────────── */

/** Font family specimen card */
const FamilyCard: React.FC<{ token: string; value: string; description: string }> = ({
  token,
  value,
  description,
}) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ marginBottom: '0.25rem' }}>
      <code style={styles.code}>{token}</code>
    </div>
    <p
      style={{
        fontFamily: `var(${token})`,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        margin: '0.5rem 0 0.25rem',
      }}
    >
      The quick brown fox jumps over the lazy dog
    </p>
    <p style={{ ...styles.muted, margin: 0 }}>{description}</p>
    <p style={{ ...styles.muted, margin: '0.125rem 0 0', fontFamily: 'monospace', fontSize: '0.6875rem' }}>
      {value}
    </p>
  </div>
);

/* ── Doc page component ──────────────────────────────────────────────── */

const TypographyDocs: React.FC = () => (
  <div style={styles.page}>
    <h1>Typography Scale</h1>
    <p style={styles.intro}>
      Typography tokens define the full typographic scale for the design system.
      All sizes use <code>rem</code> units with pixel-equivalent naming conventions.
      Tokens cover font families, sizes, weights, line-heights (leading), and
      letter-spacing (tracking). Source:{' '}
      <code>tokens/typography.css</code>.
    </p>

    {/* ── Font Families ────────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Font Families</h2>
    <p style={{ ...styles.intro, marginBottom: '1rem' }}>
      Two stacks: a sans-serif family for UI text and a monospace family for code
      and technical content.
    </p>
    {fontFamilies.map((f) => (
      <FamilyCard key={f.token} token={f.token} value={f.value} description={f.description} />
    ))}

    {/* ── Font Size Scale ──────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Font Size Scale</h2>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.headerCell}>Token</th>
          <th style={styles.headerCell}>Size</th>
          <th style={styles.headerCell}>Usage</th>
          <th style={styles.headerCell}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {fontSizes.map(({ token, rem, px, usage }) => (
          <tr key={token}>
            <td style={styles.cell}>
              <code style={styles.code}>{token}</code>
            </td>
            <td style={{ ...styles.cell, whiteSpace: 'nowrap' }}>
              {rem} <span style={{ color: '#9ca3af' }}>({px})</span>
            </td>
            <td style={styles.cell}>{usage}</td>
            <td style={styles.cell}>
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

    {/* ── Font Weights ─────────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Font Weights</h2>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.headerCell}>Token</th>
          <th style={styles.headerCell}>Weight</th>
          <th style={styles.headerCell}>Label</th>
          <th style={styles.headerCell}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {fontWeights.map(({ token, value, label }) => (
          <tr key={token}>
            <td style={styles.cell}>
              <code style={styles.code}>{token}</code>
            </td>
            <td style={styles.cell}>{value}</td>
            <td style={styles.cell}>{label}</td>
            <td style={styles.cell}>
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

    {/* ── Leading (Line Height) ────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Leading (Line Height)</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {leadings.map(({ token, value, usage }) => (
        <div
          key={token}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}
        >
          <div
            style={{
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <code style={styles.code}>{token}</code>
            <span style={styles.muted}>{value}</span>
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
            Typography is the craft of arranging type to make written language
            legible, readable, and visually appealing when displayed.
          </p>
          <p style={{ ...styles.muted, marginTop: '0.5rem', marginBottom: 0 }}>{usage}</p>
        </div>
      ))}
    </div>

    {/* ── Tracking (Letter Spacing) ────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Tracking (Letter Spacing)</h2>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.headerCell}>Token</th>
          <th style={styles.headerCell}>Value</th>
          <th style={styles.headerCell}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {trackings.map(({ token, value }) => (
          <tr key={token}>
            <td style={styles.cell}>
              <code style={styles.code}>{token}</code>
            </td>
            <td style={styles.cell}>{value}</td>
            <td style={styles.cell}>
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

    {/* ── Heading Hierarchy ────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Heading Hierarchy</h2>
    <p style={{ ...styles.intro, marginBottom: '1.5rem' }}>
      A practical example showing how size, weight, leading, and tracking tokens
      compose to form a heading hierarchy.
    </p>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      {[
        { label: 'display-lg / 48px / bold / tight', tag: 'h1', size: '--font-size-48', weight: '--font-weight-700', leading: '--leading-tight', tracking: '--tracking-tighter', text: 'Display Large' },
        { label: 'display / 40px / bold / tight', tag: 'h2', size: '--font-size-40', weight: '--font-weight-700', leading: '--leading-tight', tracking: '--tracking-tight', text: 'Display' },
        { label: 'heading-lg / 32px / semibold / tight', tag: 'h3', size: '--font-size-32', weight: '--font-weight-600', leading: '--leading-tight', tracking: '--tracking-tight', text: 'Heading Large' },
        { label: 'heading / 24px / semibold / snug', tag: 'h4', size: '--font-size-24', weight: '--font-weight-600', leading: '--leading-snug', tracking: '--tracking-normal', text: 'Heading' },
        { label: 'heading-sm / 20px / medium / snug', tag: 'h5', size: '--font-size-20', weight: '--font-weight-500', leading: '--leading-snug', tracking: '--tracking-normal', text: 'Heading Small' },
        { label: 'subtitle / 18px / medium / normal', tag: 'h6', size: '--font-size-18', weight: '--font-weight-500', leading: '--leading-normal', tracking: '--tracking-normal', text: 'Subtitle' },
        { label: 'body / 14px / regular / normal', tag: 'p', size: '--font-size-14', weight: '--font-weight-400', leading: '--leading-normal', tracking: '--tracking-normal', text: 'Body text used for paragraphs and general content throughout the interface.' },
      ].map(({ label, size, weight, leading, tracking, text }) => (
        <div key={label}>
          <span style={styles.annotationLabel}>{label}</span>
          <p
            style={{
              fontSize: `var(${size})`,
              fontWeight: `var(${weight})` as unknown as number,
              lineHeight: `var(${leading})` as unknown as number,
              letterSpacing: `var(${tracking})`,
              margin: '0.25rem 0 0',
            }}
          >
            {text}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Storybook meta & stories ────────────────────────────────────────── */

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'padded',
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

/** Complete typography documentation page covering all token categories and a composite heading hierarchy. */
export const Docs: Story = {
  render: () => <TypographyDocs />,
  name: 'Typography Scale',
};
