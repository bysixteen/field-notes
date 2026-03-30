import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { DocPage, DemoBox, Callout, TokenTable } from '../../stories/helpers';

/* ------------------------------------------------------------------ */
/*  Token data — derived from scale.css                               */
/* ------------------------------------------------------------------ */

const SPACING_SCALE = [
  { name: '--size-0', rem: '0rem', px: 0, tier: 'zero' },
  { name: '--size-1', rem: '0.0625rem', px: 1, tier: 'micro' },
  { name: '--size-2', rem: '0.125rem', px: 2, tier: 'micro' },
  { name: '--size-4', rem: '0.25rem', px: 4, tier: 'tight' },
  { name: '--size-6', rem: '0.375rem', px: 6, tier: 'tight' },
  { name: '--size-8', rem: '0.5rem', px: 8, tier: 'tight' },
  { name: '--size-10', rem: '0.625rem', px: 10, tier: 'medium' },
  { name: '--size-12', rem: '0.75rem', px: 12, tier: 'medium' },
  { name: '--size-14', rem: '0.875rem', px: 14, tier: 'medium' },
  { name: '--size-16', rem: '1rem', px: 16, tier: 'medium' },
  { name: '--size-20', rem: '1.25rem', px: 20, tier: 'medium' },
  { name: '--size-24', rem: '1.5rem', px: 24, tier: 'loose' },
  { name: '--size-28', rem: '1.75rem', px: 28, tier: 'loose' },
  { name: '--size-32', rem: '2rem', px: 32, tier: 'loose' },
  { name: '--size-40', rem: '2.5rem', px: 40, tier: 'loose' },
  { name: '--size-48', rem: '3rem', px: 48, tier: 'loose' },
  { name: '--size-56', rem: '3.5rem', px: 56, tier: 'loose' },
  { name: '--size-64', rem: '4rem', px: 64, tier: 'loose' },
  { name: '--size-80', rem: '5rem', px: 80, tier: 'loose' },
  { name: '--size-96', rem: '6rem', px: 96, tier: 'loose' },
  { name: '--size-128', rem: '8rem', px: 128, tier: 'loose' },
] as const;

const RADII_SCALE = [
  { name: '--radii-none', rem: '0rem', px: 0, label: 'none' },
  { name: '--radii-sm', rem: '0.25rem', px: 4, label: 'sm' },
  { name: '--radii-md', rem: '0.5rem', px: 8, label: 'md' },
  { name: '--radii-lg', rem: '0.75rem', px: 12, label: 'lg' },
  { name: '--radii-xl', rem: '1rem', px: 16, label: 'xl' },
  { name: '--radii-2xl', rem: '1.5rem', px: 24, label: '2xl' },
  { name: '--radii-full', rem: '9999px', px: 9999, label: 'full' },
] as const;

type Tier = 'zero' | 'micro' | 'tight' | 'medium' | 'loose';

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  zero: 'Reset value — used to collapse spacing intentionally.',
  micro: 'Sub-pixel and hairline gaps. Borders, outlines, and fine adjustments.',
  tight: '4-8 px. Inline gaps between icons and labels, compact list items, inner component padding.',
  medium: '10-20 px. Standard component padding, stack spacing, card insets.',
  loose: '24 px and above. Section padding, page margins, large vertical rhythm.',
};

const TIER_COLORS: Record<Tier, string> = {
  zero: '#94a3b8',
  micro: '#a78bfa',
  tight: '#38bdf8',
  medium: '#34d399',
  loose: '#fb923c',
};

/* ------------------------------------------------------------------ */
/*  Shared presentation components                                    */
/* ------------------------------------------------------------------ */

const ScaleBar: React.FC<{
  token: string;
  px: number;
  rem: string;
  tierColor: string;
}> = ({ token, px, rem, tierColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
    <code
      style={{
        width: 140,
        flexShrink: 0,
        fontSize: 13,
        fontFamily: 'monospace',
        color: '#e2e8f0',
      }}
    >
      {token}
    </code>
    <div
      style={{
        width: `var(${token})`,
        minWidth: px === 0 ? 2 : undefined,
        height: 24,
        backgroundColor: tierColor,
        borderRadius: 4,
        transition: 'width 0.2s ease',
      }}
    />
    <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
      {px}px / {rem}
    </span>
  </div>
);

const RadiusSpecimen: React.FC<{
  token: string;
  label: string;
  px: number;
  rem: string;
}> = ({ token, label, px, rem }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        backgroundColor: '#3b82f6',
        borderRadius: `var(${token})`,
      }}
    />
    <code style={{ fontSize: 13, fontFamily: 'monospace', color: '#e2e8f0' }}>
      {token}
    </code>
    <span style={{ fontSize: 12, color: '#94a3b8' }}>
      {label} ({px === 9999 ? '9999px' : `${px}px / ${rem}`})
    </span>
  </div>
);

const TierSection: React.FC<{
  tier: Tier;
  tokens: ReadonlyArray<(typeof SPACING_SCALE)[number]>;
}> = ({ tier, tokens }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: TIER_COLORS[tier],
        }}
      />
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, textTransform: 'capitalize', color: '#f1f5f9' }}>
        {tier}
      </h3>
    </div>
    <p style={{ margin: '0 0 12px', fontSize: 13, color: '#94a3b8' }}>
      {TIER_DESCRIPTIONS[tier]}
    </p>
    {tokens.map((t) => (
      <ScaleBar
        key={t.name}
        token={t.name}
        px={t.px}
        rem={t.rem}
        tierColor={TIER_COLORS[tier]}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Meta                                                              */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Foundations/Spacing Scale',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Stories                                                           */
/* ------------------------------------------------------------------ */

/** Full visual ruler of every spacing token in ascending order. */
export const Overview: Story = {
  render: () => (
    <DocPage title="Spacing Scale" subtitle="All spacing and sizing primitives from scale.css">
      <Callout>
        Every value is defined in rem with a pixel-equivalent name. Use the CSS
        custom property (<code>var(--size-*)</code>) rather than hardcoding
        values.
      </Callout>
      <DemoBox>
        <div style={{ padding: 24 }}>
          {SPACING_SCALE.map((t) => (
            <ScaleBar
              key={t.name}
              token={t.name}
              px={t.px}
              rem={t.rem}
              tierColor={TIER_COLORS[t.tier]}
            />
          ))}
        </div>
      </DemoBox>
    </DocPage>
  ),
};

/** Each value shown as a measured block with token name, px, and rem. */
export const Scale: Story = {
  render: () => (
    <DocPage title="Scale Detail" subtitle="Token name, pixel value, and rem value for every step">
      <DemoBox>
        <TokenTable
          tokens={SPACING_SCALE.map((t) => ({
            name: t.name,
            value: `${t.rem} (${t.px}px)`,
          }))}
        />
      </DemoBox>
      <DemoBox>
        <div style={{ padding: 24 }}>
          {SPACING_SCALE.map((t) => (
            <div
              key={t.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 8,
              }}
            >
              <code
                style={{
                  width: 140,
                  flexShrink: 0,
                  fontSize: 13,
                  fontFamily: 'monospace',
                  color: '#e2e8f0',
                }}
              >
                {t.name}
              </code>
              <div
                style={{
                  width: `var(${t.name})`,
                  minWidth: t.px === 0 ? 2 : undefined,
                  height: `var(${t.name})`,
                  minHeight: t.px === 0 ? 2 : undefined,
                  backgroundColor: TIER_COLORS[t.tier],
                  borderRadius: 4,
                }}
              />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {t.px}px &middot; {t.rem}
              </span>
            </div>
          ))}
        </div>
      </DemoBox>
    </DocPage>
  ),
};

/** Tokens grouped by gestalt tier: tight, medium, and loose. */
export const SpacingTiers: Story = {
  render: () => {
    const grouped = SPACING_SCALE.reduce(
      (acc, token) => {
        if (!acc[token.tier]) acc[token.tier] = [];
        acc[token.tier].push(token);
        return acc;
      },
      {} as Record<Tier, (typeof SPACING_SCALE)[number][]>,
    );

    const tierOrder: Tier[] = ['zero', 'micro', 'tight', 'medium', 'loose'];

    return (
      <DocPage
        title="Spacing Tiers"
        subtitle="Tokens grouped by gestalt density: tight, medium, and loose"
      >
        <Callout>
          Gestalt tiers help you pick the right spacing without memorising every
          value. Choose the tier that matches the relationship density you need,
          then pick a specific value within it.
        </Callout>
        <DemoBox>
          <div style={{ padding: 24 }}>
            {tierOrder.map((tier) =>
              grouped[tier] ? (
                <TierSection key={tier} tier={tier} tokens={grouped[tier]} />
              ) : null,
            )}
          </div>
        </DemoBox>
      </DocPage>
    );
  },
};

/** Usage examples showing where each tier is typically applied. */
export const Application: Story = {
  render: () => (
    <DocPage
      title="Application"
      subtitle="Where to use each spacing tier"
    >
      <DemoBox>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Tight example */}
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#38bdf8' }}>
              Tight (4-8 px) — Inline gaps
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--size-4)',
                padding: 'var(--size-8)',
                border: '1px solid #334155',
                borderRadius: 8,
              }}
            >
              <div style={{ width: 16, height: 16, backgroundColor: '#38bdf8', borderRadius: 4 }} />
              <span style={{ fontSize: 14, color: '#e2e8f0' }}>Icon + label with --size-4 gap</span>
            </div>
          </div>

          {/* Medium example */}
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#34d399' }}>
              Medium (10-20 px) — Component padding
            </h3>
            <div
              style={{
                padding: 'var(--size-16)',
                border: '1px solid #334155',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 14, color: '#e2e8f0' }}>
                Card content with --size-16 padding
              </span>
            </div>
          </div>

          {/* Loose example */}
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#fb923c' }}>
              Loose (24 px+) — Section spacing
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--size-32)',
              }}
            >
              <div
                style={{
                  padding: 'var(--size-24)',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>Section A — --size-32 gap between sections</span>
              </div>
              <div
                style={{
                  padding: 'var(--size-24)',
                  border: '1px solid #334155',
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>Section B — --size-24 internal padding</span>
              </div>
            </div>
          </div>
        </div>
      </DemoBox>
    </DocPage>
  ),
};

/** Border radius tokens visualised on specimen boxes. */
export const Radii: Story = {
  render: () => (
    <DocPage title="Radii" subtitle="Border-radius tokens from scale.css">
      <Callout>
        Radii control the roundness of corners. Use <code>--radii-full</code>{' '}
        for pills and avatars, <code>--radii-md</code> to <code>--radii-lg</code>{' '}
        for cards and dialogs.
      </Callout>
      <DemoBox>
        <div
          style={{
            padding: 24,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'center',
          }}
        >
          {RADII_SCALE.map((r) => (
            <RadiusSpecimen
              key={r.name}
              token={r.name}
              label={r.label}
              px={r.px}
              rem={r.rem}
            />
          ))}
        </div>
      </DemoBox>
      <DemoBox>
        <TokenTable
          tokens={RADII_SCALE.map((r) => ({
            name: r.name,
            value: r.px === 9999 ? '9999px' : `${r.rem} (${r.px}px)`,
          }))}
        />
      </DemoBox>
    </DocPage>
  ),
};
