import type { Meta } from '@storybook/react';
import {
  DocPage,
  Section,
  SectionHeading,
  DemoBox,
  TokenTable,
  Callout,
  DosDonts,
  SwatchGrid,
} from '../stories/helpers';

const meta = {
  title: 'Foundations/SpacingScale',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/* ── Data extracted from scale.css ──────────────────────────────── */

const SPACING_SCALE = [
  { name: '--size-0', px: 0, rem: '0rem', tier: 'zero' },
  { name: '--size-1', px: 1, rem: '0.0625rem', tier: 'tight' },
  { name: '--size-2', px: 2, rem: '0.125rem', tier: 'tight' },
  { name: '--size-4', px: 4, rem: '0.25rem', tier: 'tight' },
  { name: '--size-6', px: 6, rem: '0.375rem', tier: 'tight' },
  { name: '--size-8', px: 8, rem: '0.5rem', tier: 'tight' },
  { name: '--size-10', px: 10, rem: '0.625rem', tier: 'medium' },
  { name: '--size-12', px: 12, rem: '0.75rem', tier: 'medium' },
  { name: '--size-14', px: 14, rem: '0.875rem', tier: 'medium' },
  { name: '--size-16', px: 16, rem: '1rem', tier: 'medium' },
  { name: '--size-20', px: 20, rem: '1.25rem', tier: 'medium' },
  { name: '--size-24', px: 24, rem: '1.5rem', tier: 'loose' },
  { name: '--size-28', px: 28, rem: '1.75rem', tier: 'loose' },
  { name: '--size-32', px: 32, rem: '2rem', tier: 'loose' },
  { name: '--size-40', px: 40, rem: '2.5rem', tier: 'loose' },
  { name: '--size-48', px: 48, rem: '3rem', tier: 'loose' },
  { name: '--size-56', px: 56, rem: '3.5rem', tier: 'loose' },
  { name: '--size-64', px: 64, rem: '4rem', tier: 'loose' },
  { name: '--size-80', px: 80, rem: '5rem', tier: 'loose' },
  { name: '--size-96', px: 96, rem: '6rem', tier: 'loose' },
  { name: '--size-128', px: 128, rem: '8rem', tier: 'loose' },
] as const;

const RADII = [
  { name: '--radii-none', value: '0rem', description: '0px — no rounding' },
  { name: '--radii-sm', value: '0.25rem', description: '4px — subtle rounding' },
  { name: '--radii-md', value: '0.5rem', description: '8px — default rounding' },
  { name: '--radii-lg', value: '0.75rem', description: '12px — prominent rounding' },
  { name: '--radii-xl', value: '1rem', description: '16px — large rounding' },
  { name: '--radii-2xl', value: '1.5rem', description: '24px — extra-large rounding' },
  { name: '--radii-full', value: '9999px', description: 'Fully round — pills and circles' },
] as const;

const STROKE_WEIGHTS = [
  { name: '--stroke-weight-1', value: '1px', description: 'Hairline — subtle dividers' },
  { name: '--stroke-weight-2', value: '2px', description: 'Default — borders and outlines' },
  { name: '--stroke-weight-3', value: '3px', description: 'Heavy — emphasis borders' },
] as const;

/* ── Tier helpers ────────────────────────────────────────────────── */

const tightTokens = SPACING_SCALE.filter((t) => t.tier === 'tight');
const mediumTokens = SPACING_SCALE.filter((t) => t.tier === 'medium');
const looseTokens = SPACING_SCALE.filter((t) => t.tier === 'loose');

const toTableTokens = (tokens: readonly { name: string; rem: string; px: number }[]) =>
  tokens.map((t) => ({
    name: t.name,
    value: t.rem,
    description: `${t.px}px`,
  }));

/* ── Stories ─────────────────────────────────────────────────────── */

export const Overview = {
  render: () => (
    <DocPage title="Spacing & Scale" subtitle="Spacing, sizing, radii, and stroke-weight tokens from scale.css">
      <Section>
        <SectionHeading>Full spacing scale</SectionHeading>
        <Callout variant="note">
          Every spacing value is defined in rem with a pixel-equivalent name. The scale covers 0 through 128px across three gestalt tiers: tight, medium, and loose.
        </Callout>
        {SPACING_SCALE.map((token) => (
          <DemoBox key={token.name}>
            <div
              data-token={token.name}
              data-value={`${token.rem} (${token.px}px)`}
            >
              <div
                data-measured-block
                data-width={`var(${token.name})`}
                data-height="var(--size-16)"
                data-label={`${token.name}: ${token.px}px`}
              />
            </div>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token reference</SectionHeading>
        <TokenTable
          tokens={SPACING_SCALE.map((t) => ({
            name: t.name,
            value: t.rem,
            description: `${t.px}px — ${t.tier} tier`,
          }))}
        />
      </Section>
    </DocPage>
  ),
};

export const SpacingTiers = {
  render: () => (
    <DocPage title="Spacing Tiers" subtitle="Gestalt groupings: tight, medium, and loose">
      <Section>
        <SectionHeading>Tight (1–8px)</SectionHeading>
        <Callout variant="tip">
          Tight spacing is used for inline gaps, icon padding, and compact UI elements where items need to feel closely related.
        </Callout>
        {tightTokens.map((token) => (
          <DemoBox key={token.name}>
            <div
              data-token={token.name}
              data-measured-block
              data-width={`var(${token.name})`}
              data-height="var(--size-16)"
              data-label={`${token.name}: ${token.px}px`}
            />
          </DemoBox>
        ))}
        <TokenTable tokens={toTableTokens(tightTokens)} />
      </Section>

      <Section>
        <SectionHeading>Medium (10–20px)</SectionHeading>
        <Callout variant="tip">
          Medium spacing handles component padding, form field gaps, and card internals — the workhorse range for everyday layout.
        </Callout>
        {mediumTokens.map((token) => (
          <DemoBox key={token.name}>
            <div
              data-token={token.name}
              data-measured-block
              data-width={`var(${token.name})`}
              data-height="var(--size-16)"
              data-label={`${token.name}: ${token.px}px`}
            />
          </DemoBox>
        ))}
        <TokenTable tokens={toTableTokens(mediumTokens)} />
      </Section>

      <Section>
        <SectionHeading>Loose (24–128px)</SectionHeading>
        <Callout variant="tip">
          Loose spacing separates distinct sections, page margins, and hero areas — creating breathing room between unrelated content groups.
        </Callout>
        {looseTokens.map((token) => (
          <DemoBox key={token.name}>
            <div
              data-token={token.name}
              data-measured-block
              data-width={`var(${token.name})`}
              data-height="var(--size-16)"
              data-label={`${token.name}: ${token.px}px`}
            />
          </DemoBox>
        ))}
        <TokenTable tokens={toTableTokens(looseTokens)} />
      </Section>
    </DocPage>
  ),
};

export const Radii = {
  render: () => (
    <DocPage title="Border Radii" subtitle="Corner rounding tokens from scale.css">
      <Section>
        <SectionHeading>Radius scale</SectionHeading>
        <Callout variant="note">
          Radii range from none (sharp corners) to full (pill shapes). Each token maps directly to a CSS border-radius value.
        </Callout>
        <SwatchGrid>
          {RADII.map((radius) => (
            <DemoBox key={radius.name}>
              <div
                data-radius-specimen
                data-token={radius.name}
                data-radius={`var(${radius.name})`}
                data-label={`${radius.name}: ${radius.value}`}
              />
            </DemoBox>
          ))}
        </SwatchGrid>
      </Section>
      <Section>
        <SectionHeading>Token reference</SectionHeading>
        <TokenTable tokens={RADII.map((r) => ({ name: r.name, value: r.value, description: r.description }))} />
      </Section>
    </DocPage>
  ),
};

export const StrokeWeights = {
  render: () => (
    <DocPage title="Stroke Weights" subtitle="Border and line thickness tokens from scale.css">
      <Section>
        <SectionHeading>Weight scale</SectionHeading>
        {STROKE_WEIGHTS.map((sw) => (
          <DemoBox key={sw.name}>
            <div
              data-stroke-specimen
              data-token={sw.name}
              data-width={`var(${sw.name})`}
              data-label={`${sw.name}: ${sw.value}`}
            />
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token reference</SectionHeading>
        <TokenTable tokens={STROKE_WEIGHTS.map((s) => ({ name: s.name, value: s.value, description: s.description }))} />
      </Section>
    </DocPage>
  ),
};

export const Application = {
  render: () => (
    <DocPage title="Application Guide" subtitle="Where to use each spacing tier">
      <Section>
        <SectionHeading>Tier usage</SectionHeading>
        <Callout variant="note">
          Choose your spacing tier based on the visual relationship between elements. Tighter spacing signals that items belong together; looser spacing separates distinct groups.
        </Callout>
        <DosDonts
          dos={[
            'Use tight tokens (1–8px) for icon gaps, inline badge padding, and compact list items.',
            'Use medium tokens (10–20px) for component padding, form field spacing, and card internals.',
            'Use loose tokens (24–128px) for section margins, page gutters, and hero spacing.',
            'Reference tokens by name (var(--size-16)) rather than raw values.',
          ]}
          donts={[
            'Do not mix tiers within the same visual group — pick one tier per relationship.',
            'Do not use loose tokens for tight, related elements like icon-and-label pairs.',
            'Do not hardcode pixel or rem values — always use the scale tokens.',
            'Do not skip the scale (e.g., inventing --size-18) — use the nearest defined step.',
          ]}
        />
      </Section>
    </DocPage>
  ),
};
