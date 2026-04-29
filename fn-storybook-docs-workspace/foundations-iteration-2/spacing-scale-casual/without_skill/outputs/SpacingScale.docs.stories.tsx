import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DocPage, TokenTable, Callout } from '../../evals/files/stories/helpers';
import '../../evals/files/tokens/scale.css';

/* ================================================================
   Spacing & Sizing Scale — Documentation Stories
   Visual reference for all spacing/sizing primitives and radii,
   grouped by Gestalt density tiers (Tight / Medium / Loose).
   ================================================================ */

// ---------------------------------------------------------------------------
// Token data
// ---------------------------------------------------------------------------

interface SpacingToken {
  name: string;
  css: string;
  rem: string;
  px: number;
}

const spacingTokens: SpacingToken[] = [
  { name: 'size-0',   css: 'var(--size-0)',   rem: '0rem',      px: 0 },
  { name: 'size-1',   css: 'var(--size-1)',   rem: '0.0625rem', px: 1 },
  { name: 'size-2',   css: 'var(--size-2)',   rem: '0.125rem',  px: 2 },
  { name: 'size-4',   css: 'var(--size-4)',   rem: '0.25rem',   px: 4 },
  { name: 'size-6',   css: 'var(--size-6)',   rem: '0.375rem',  px: 6 },
  { name: 'size-8',   css: 'var(--size-8)',   rem: '0.5rem',    px: 8 },
  { name: 'size-10',  css: 'var(--size-10)',  rem: '0.625rem',  px: 10 },
  { name: 'size-12',  css: 'var(--size-12)',  rem: '0.75rem',   px: 12 },
  { name: 'size-14',  css: 'var(--size-14)',  rem: '0.875rem',  px: 14 },
  { name: 'size-16',  css: 'var(--size-16)',  rem: '1rem',      px: 16 },
  { name: 'size-20',  css: 'var(--size-20)',  rem: '1.25rem',   px: 20 },
  { name: 'size-24',  css: 'var(--size-24)',  rem: '1.5rem',    px: 24 },
  { name: 'size-28',  css: 'var(--size-28)',  rem: '1.75rem',   px: 28 },
  { name: 'size-32',  css: 'var(--size-32)',  rem: '2rem',      px: 32 },
  { name: 'size-40',  css: 'var(--size-40)',  rem: '2.5rem',    px: 40 },
  { name: 'size-48',  css: 'var(--size-48)',  rem: '3rem',      px: 48 },
  { name: 'size-56',  css: 'var(--size-56)',  rem: '3.5rem',    px: 56 },
  { name: 'size-64',  css: 'var(--size-64)',  rem: '4rem',      px: 64 },
  { name: 'size-80',  css: 'var(--size-80)',  rem: '5rem',      px: 80 },
  { name: 'size-96',  css: 'var(--size-96)',  rem: '6rem',      px: 96 },
  { name: 'size-128', css: 'var(--size-128)', rem: '8rem',      px: 128 },
];

interface RadiiToken {
  name: string;
  css: string;
  value: string;
  px: string;
}

const radiiTokens: RadiiToken[] = [
  { name: 'radii-none', css: 'var(--radii-none)', value: '0rem',    px: '0px' },
  { name: 'radii-sm',   css: 'var(--radii-sm)',   value: '0.25rem', px: '4px' },
  { name: 'radii-md',   css: 'var(--radii-md)',   value: '0.5rem',  px: '8px' },
  { name: 'radii-lg',   css: 'var(--radii-lg)',   value: '0.75rem', px: '12px' },
  { name: 'radii-xl',   css: 'var(--radii-xl)',   value: '1rem',    px: '16px' },
  { name: 'radii-2xl',  css: 'var(--radii-2xl)',  value: '1.5rem',  px: '24px' },
  { name: 'radii-full', css: 'var(--radii-full)', value: '9999px',  px: '9999px' },
];

// ---------------------------------------------------------------------------
// Gestalt density tiers
// ---------------------------------------------------------------------------

const tiers = {
  tight: {
    label: 'Tight',
    description: 'Dense interfaces — data tables, toolbars, compact forms. Values 0 through 8px.',
    tokens: spacingTokens.filter((t) => t.px <= 8),
    color: '#ef4444',
  },
  medium: {
    label: 'Medium',
    description:
      'General-purpose layouts — cards, form fields, standard component internals. Values 10 through 24px.',
    tokens: spacingTokens.filter((t) => t.px >= 10 && t.px <= 24),
    color: '#f59e0b',
  },
  loose: {
    label: 'Loose',
    description:
      'Breathing room — page sections, hero areas, generous whitespace. Values 28px and above.',
    tokens: spacingTokens.filter((t) => t.px >= 28),
    color: '#22c55e',
  },
} as const;

// ---------------------------------------------------------------------------
// Shared inline styles
// ---------------------------------------------------------------------------

const monoFont: React.CSSProperties = {
  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
  fontSize: '0.75rem',
};

const labelStyle: React.CSSProperties = {
  ...monoFont,
  minWidth: '7rem',
  color: '#6b7280',
};

const valueStyle: React.CSSProperties = {
  ...monoFont,
  minWidth: '4.5rem',
  textAlign: 'right' as const,
  color: '#374151',
};

// ---------------------------------------------------------------------------
// Presentational components (story-local)
// ---------------------------------------------------------------------------

/** Single measured block representing one spacing token. */
const MeasuredBlock: React.FC<{
  token: SpacingToken;
  color: string;
}> = ({ token, color }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      paddingBlock: '0.25rem',
    }}
  >
    <span style={labelStyle}>--{token.name}</span>
    <div
      style={{
        width: `${token.px}px`,
        height: '1rem',
        backgroundColor: color,
        borderRadius: '2px',
        flexShrink: 0,
        minWidth: token.px === 0 ? '2px' : undefined,
        opacity: token.px === 0 ? 0.3 : 1,
      }}
      title={`${token.px}px`}
    />
    <span style={valueStyle}>{token.px}px</span>
    <span style={{ ...monoFont, color: '#9ca3af' }}>{token.rem}</span>
  </div>
);

/** A tier group with heading, description, and its token blocks. */
const TierGroup: React.FC<{
  label: string;
  description: string;
  tokens: SpacingToken[];
  color: string;
}> = ({ label, description, tokens, color }) => (
  <section style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
      <div
        style={{
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{label}</h3>
    </div>
    <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{description}</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
      {tokens.map((t) => (
        <MeasuredBlock key={t.name} token={t} color={color} />
      ))}
    </div>
  </section>
);

/** Visual preview of a single radius token. */
const RadiusPreview: React.FC<{ token: RadiiToken }> = ({ token }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      paddingBlock: '0.375rem',
    }}
  >
    <span style={labelStyle}>--{token.name}</span>
    <div
      style={{
        width: '3rem',
        height: '3rem',
        backgroundColor: '#818cf8',
        borderRadius: token.value,
        flexShrink: 0,
      }}
      title={token.px}
    />
    <span style={valueStyle}>{token.px}</span>
    <span style={{ ...monoFont, color: '#9ca3af' }}>{token.value}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Foundations/Spacing & Sizing Scale',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The full spacing and sizing primitive scale, derived from `scale.css`. ' +
          'Tokens are grouped by Gestalt density tiers (Tight, Medium, Loose) to ' +
          'guide usage in different interface contexts.',
      },
    },
  },
};

export default meta;

// ---- Full Scale ----

export const FullScale: StoryObj = {
  name: 'Full Scale',
  render: () => (
    <DocPage title="Spacing & Sizing Scale">
      <Callout>
        All values are defined as CSS custom properties in <code>scale.css</code> and use{' '}
        <strong>rem</strong> units with pixel-equivalent names for easy mental mapping.
      </Callout>

      <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Gestalt Density Tiers</h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Choose spacing values from the tier that matches your interface density. Mixing across
        tiers is fine for deliberate contrast, but keep the majority of spacing within a single
        tier per component.
      </p>

      <TierGroup {...tiers.tight} />
      <TierGroup {...tiers.medium} />
      <TierGroup {...tiers.loose} />
    </DocPage>
  ),
};

// ---- Tight Tier ----

export const TightTier: StoryObj = {
  name: 'Tight Tier',
  render: () => (
    <DocPage title="Tight Tier (0 -- 8px)">
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        {tiers.tight.description}
      </p>
      <TierGroup {...tiers.tight} />
    </DocPage>
  ),
};

// ---- Medium Tier ----

export const MediumTier: StoryObj = {
  name: 'Medium Tier',
  render: () => (
    <DocPage title="Medium Tier (10 -- 24px)">
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        {tiers.medium.description}
      </p>
      <TierGroup {...tiers.medium} />
    </DocPage>
  ),
};

// ---- Loose Tier ----

export const LooseTier: StoryObj = {
  name: 'Loose Tier',
  render: () => (
    <DocPage title="Loose Tier (28px+)">
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        {tiers.loose.description}
      </p>
      <TierGroup {...tiers.loose} />
    </DocPage>
  ),
};

// ---- Radii ----

export const Radii: StoryObj = {
  name: 'Border Radii',
  render: () => (
    <DocPage title="Border Radii">
      <Callout>
        Radius tokens control the roundness of corners. They range from sharp
        (<code>radii-none</code>) to fully circular (<code>radii-full</code>).
      </Callout>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          marginTop: '1rem',
        }}
      >
        {radiiTokens.map((t) => (
          <RadiusPreview key={t.name} token={t} />
        ))}
      </div>
    </DocPage>
  ),
};

// ---- Token Table ----

export const SpacingTokenTable: StoryObj = {
  name: 'Token Reference Table',
  render: () => (
    <DocPage title="Token Reference">
      <h3>Spacing / Sizing</h3>
      <TokenTable
        tokens={spacingTokens.map((t) => ({
          name: `--${t.name}`,
          value: t.rem,
          description: `${t.px}px`,
        }))}
      />

      <h3 style={{ marginTop: '2rem' }}>Radii</h3>
      <TokenTable
        tokens={radiiTokens.map((t) => ({
          name: `--${t.name}`,
          value: t.value,
          description: t.px,
        }))}
      />
    </DocPage>
  ),
};
