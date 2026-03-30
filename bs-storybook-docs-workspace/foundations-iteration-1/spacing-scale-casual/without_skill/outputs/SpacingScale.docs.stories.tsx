import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DocPage, TokenTable, Callout } from '../../../../../../evals/files/stories/helpers';

import '../../../../../../evals/files/tokens/scale.css';

/* -----------------------------------------------------------------
   Token definitions
   ----------------------------------------------------------------- */

type SpacingToken = {
  name: string;
  cssVar: string;
  rem: string;
  px: string;
};

/** Full spacing / sizing scale from scale.css */
const allSpacingTokens: SpacingToken[] = [
  { name: 'size-0',   cssVar: '--size-0',   rem: '0rem',      px: '0' },
  { name: 'size-1',   cssVar: '--size-1',   rem: '0.0625rem', px: '1' },
  { name: 'size-2',   cssVar: '--size-2',   rem: '0.125rem',  px: '2' },
  { name: 'size-4',   cssVar: '--size-4',   rem: '0.25rem',   px: '4' },
  { name: 'size-6',   cssVar: '--size-6',   rem: '0.375rem',  px: '6' },
  { name: 'size-8',   cssVar: '--size-8',   rem: '0.5rem',    px: '8' },
  { name: 'size-10',  cssVar: '--size-10',  rem: '0.625rem',  px: '10' },
  { name: 'size-12',  cssVar: '--size-12',  rem: '0.75rem',   px: '12' },
  { name: 'size-14',  cssVar: '--size-14',  rem: '0.875rem',  px: '14' },
  { name: 'size-16',  cssVar: '--size-16',  rem: '1rem',      px: '16' },
  { name: 'size-20',  cssVar: '--size-20',  rem: '1.25rem',   px: '20' },
  { name: 'size-24',  cssVar: '--size-24',  rem: '1.5rem',    px: '24' },
  { name: 'size-28',  cssVar: '--size-28',  rem: '1.75rem',   px: '28' },
  { name: 'size-32',  cssVar: '--size-32',  rem: '2rem',      px: '32' },
  { name: 'size-40',  cssVar: '--size-40',  rem: '2.5rem',    px: '40' },
  { name: 'size-48',  cssVar: '--size-48',  rem: '3rem',      px: '48' },
  { name: 'size-56',  cssVar: '--size-56',  rem: '3.5rem',    px: '56' },
  { name: 'size-64',  cssVar: '--size-64',  rem: '4rem',      px: '64' },
  { name: 'size-80',  cssVar: '--size-80',  rem: '5rem',      px: '80' },
  { name: 'size-96',  cssVar: '--size-96',  rem: '6rem',      px: '96' },
  { name: 'size-128', cssVar: '--size-128', rem: '8rem',      px: '128' },
];

/** Gestalt density tiers */
const tightTokens = allSpacingTokens.filter((t) =>
  ['size-0', 'size-1', 'size-2', 'size-4', 'size-6', 'size-8'].includes(t.name),
);
const mediumTokens = allSpacingTokens.filter((t) =>
  ['size-10', 'size-12', 'size-14', 'size-16', 'size-20', 'size-24'].includes(t.name),
);
const looseTokens = allSpacingTokens.filter((t) =>
  ['size-28', 'size-32', 'size-40', 'size-48', 'size-56', 'size-64', 'size-80', 'size-96', 'size-128'].includes(t.name),
);

type RadiiToken = {
  name: string;
  cssVar: string;
  value: string;
  px: string;
};

const radiiTokens: RadiiToken[] = [
  { name: 'none', cssVar: '--radii-none', value: '0rem',    px: '0' },
  { name: 'sm',   cssVar: '--radii-sm',   value: '0.25rem', px: '4' },
  { name: 'md',   cssVar: '--radii-md',   value: '0.5rem',  px: '8' },
  { name: 'lg',   cssVar: '--radii-lg',   value: '0.75rem', px: '12' },
  { name: 'xl',   cssVar: '--radii-xl',   value: '1rem',    px: '16' },
  { name: '2xl',  cssVar: '--radii-2xl',  value: '1.5rem',  px: '24' },
  { name: 'full', cssVar: '--radii-full', value: '9999px',  px: '9999' },
];

/* -----------------------------------------------------------------
   Shared styles (inline objects to avoid external CSS dependency)
   ----------------------------------------------------------------- */

const styles = {
  page: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
  tierHeading: {
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    color: '#444',
  } as React.CSSProperties,
  tierDescription: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '1rem',
  } as React.CSSProperties,
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
    fontSize: '0.8125rem',
  } as React.CSSProperties,
  label: {
    width: 120,
    fontFamily: 'monospace',
    flexShrink: 0,
    color: '#555',
  } as React.CSSProperties,
  value: {
    width: 100,
    fontFamily: 'monospace',
    flexShrink: 0,
    color: '#888',
    fontSize: '0.75rem',
  } as React.CSSProperties,
  bar: (size: string) =>
    ({
      height: 20,
      width: `var(${size})`,
      minWidth: 1,
      backgroundColor: '#6366f1',
      borderRadius: 3,
      transition: 'width 0.2s ease',
    }) as React.CSSProperties,
  radiusSample: (radius: string) =>
    ({
      width: 64,
      height: 64,
      backgroundColor: '#6366f1',
      borderRadius: `var(${radius})`,
      flexShrink: 0,
    }) as React.CSSProperties,
  radiusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '1rem',
    fontSize: '0.8125rem',
  } as React.CSSProperties,
  radiusMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.125rem',
  } as React.CSSProperties,
  intro: {
    fontSize: '0.9375rem',
    color: '#444',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
};

/* -----------------------------------------------------------------
   Visual sub-components
   ----------------------------------------------------------------- */

/** Renders a single measured bar row */
const SpacingRow: React.FC<{ token: SpacingToken }> = ({ token }) => (
  <div style={styles.row}>
    <span style={styles.label}>{token.cssVar}</span>
    <span style={styles.value}>
      {token.rem} ({token.px}px)
    </span>
    <div style={styles.bar(token.cssVar)} />
  </div>
);

/** Renders a group of tokens under a tier heading */
const TierGroup: React.FC<{
  title: string;
  description: string;
  tokens: SpacingToken[];
}> = ({ title, description, tokens }) => (
  <div>
    <h3 style={styles.tierHeading}>{title}</h3>
    <p style={styles.tierDescription}>{description}</p>
    {tokens.map((t) => (
      <SpacingRow key={t.name} token={t} />
    ))}
  </div>
);

/** Renders a single radius sample */
const RadiusRow: React.FC<{ token: RadiiToken }> = ({ token }) => (
  <div style={styles.radiusRow}>
    <div style={styles.radiusSample(token.cssVar)} />
    <div style={styles.radiusMeta}>
      <span style={{ fontFamily: 'monospace', color: '#555' }}>{token.cssVar}</span>
      <span style={{ fontFamily: 'monospace', color: '#888', fontSize: '0.75rem' }}>
        {token.value} {token.px !== '9999' ? `(${token.px}px)` : ''}
      </span>
    </div>
  </div>
);

/* -----------------------------------------------------------------
   Doc page component
   ----------------------------------------------------------------- */

const SpacingScaleDocs: React.FC = () => (
  <div style={styles.page}>
    <h1>Spacing &amp; Sizing Scale</h1>
    <p style={styles.intro}>
      A unified spacing and sizing scale drawn from <code>scale.css</code>. Every
      token maps to a CSS custom property on <code>:root</code>, expressed in rem
      with pixel-equivalent naming. The scale is grouped below by Gestalt density
      tiers &mdash; <strong>Tight</strong>, <strong>Medium</strong>, and{' '}
      <strong>Loose</strong> &mdash; to guide usage by context.
    </p>

    {/* ── Full scale ─────────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Full Scale</h2>
    {allSpacingTokens.map((t) => (
      <SpacingRow key={t.name} token={t} />
    ))}

    {/* ── Gestalt tiers ──────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Gestalt Density Tiers</h2>

    <TierGroup
      title="Tight (0 &ndash; 8 px)"
      description="Use for intra-component spacing: icon gaps, inline padding, tight stacks. Keeps related elements visually bonded."
      tokens={tightTokens}
    />

    <TierGroup
      title="Medium (10 &ndash; 24 px)"
      description="Default component-level spacing: card padding, form field gaps, section insets. The workhorse range for most layouts."
      tokens={mediumTokens}
    />

    <TierGroup
      title="Loose (28 &ndash; 128 px)"
      description="Macro layout spacing: section margins, hero padding, page gutters. Creates breathing room between major content blocks."
      tokens={looseTokens}
    />

    {/* ── Radii ──────────────────────────────────────────────── */}
    <h2 style={styles.sectionTitle}>Border Radii</h2>
    <p style={styles.tierDescription}>
      Radius tokens control corner rounding. They progress from sharp
      (<code>none</code>) through to fully circular (<code>full</code>).
    </p>
    {radiiTokens.map((t) => (
      <RadiusRow key={t.name} token={t} />
    ))}
  </div>
);

/* -----------------------------------------------------------------
   Storybook meta & stories
   ----------------------------------------------------------------- */

const meta: Meta = {
  title: 'Foundations/Spacing Scale',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Visual reference for the spacing, sizing, and border-radius token scale. Tokens are grouped by Gestalt density tiers (Tight, Medium, Loose) to guide contextual usage.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

/** Complete documentation page showing the full scale, tier groupings, and radii. */
export const Docs: Story = {
  render: () => <SpacingScaleDocs />,
  name: 'Spacing Scale',
};
