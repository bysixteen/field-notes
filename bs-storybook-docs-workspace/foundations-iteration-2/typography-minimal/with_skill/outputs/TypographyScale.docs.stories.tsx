import type { Meta } from '@storybook/react';
import {
  DocPage,
  Section,
  SectionHeading,
  TokenTable,
  DemoBox,
  Callout,
} from '../stories/helpers';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

/* ── Data extracted from typography.css ──────────────────────────── */

const FONT_FAMILIES = [
  { name: '--font-family-sans', value: "'Inter', system-ui, -apple-system, sans-serif", description: 'Primary sans-serif — UI text' },
  { name: '--font-family-mono', value: "'JetBrains Mono', ui-monospace, monospace", description: 'Monospace — code and technical content' },
] as const;

const FONT_SIZES = [
  { name: '--font-size-11', value: '0.6875rem', description: '11px — caption' },
  { name: '--font-size-12', value: '0.75rem', description: '12px — small' },
  { name: '--font-size-13', value: '0.8125rem', description: '13px — compact' },
  { name: '--font-size-14', value: '0.875rem', description: '14px — body' },
  { name: '--font-size-16', value: '1rem', description: '16px — body-lg' },
  { name: '--font-size-18', value: '1.125rem', description: '18px — subtitle' },
  { name: '--font-size-20', value: '1.25rem', description: '20px — heading-sm' },
  { name: '--font-size-24', value: '1.5rem', description: '24px — heading' },
  { name: '--font-size-32', value: '2rem', description: '32px — heading-lg' },
  { name: '--font-size-40', value: '2.5rem', description: '40px — display' },
  { name: '--font-size-48', value: '3rem', description: '48px — display-lg' },
] as const;

const FONT_WEIGHTS = [
  { name: '--font-weight-400', value: '400', description: 'Regular' },
  { name: '--font-weight-500', value: '500', description: 'Medium' },
  { name: '--font-weight-600', value: '600', description: 'Semibold' },
  { name: '--font-weight-700', value: '700', description: 'Bold' },
] as const;

const LEADING = [
  { name: '--leading-none', value: '1', description: 'No extra leading — single-line labels' },
  { name: '--leading-tight', value: '1.2', description: 'Tight — headings and display text' },
  { name: '--leading-snug', value: '1.375', description: 'Snug — sub-headings' },
  { name: '--leading-normal', value: '1.5', description: 'Normal — body text default' },
  { name: '--leading-relaxed', value: '1.625', description: 'Relaxed — long-form reading' },
  { name: '--leading-loose', value: '2', description: 'Loose — spacious blocks' },
] as const;

const TRACKING = [
  { name: '--tracking-tighter', value: '-0.04em', description: 'Tighter — large display text' },
  { name: '--tracking-tight', value: '-0.02em', description: 'Tight — headings' },
  { name: '--tracking-normal', value: '0em', description: 'Normal — body text' },
  { name: '--tracking-wide', value: '0.02em', description: 'Wide — small caps and labels' },
  { name: '--tracking-wider', value: '0.04em', description: 'Wider — uppercase labels' },
] as const;

/* ── Stories ─────────────────────────────────────────────────────── */

export const FontFamilies = {
  render: () => (
    <DocPage title="Font Families" subtitle="Available typeface stacks">
      <Section>
        <SectionHeading>Families</SectionHeading>
        <Callout variant="tip">
          Use the sans family for all UI text. Reserve mono for code snippets,
          terminal output, and token references.
        </Callout>
        {FONT_FAMILIES.map(({ name, value }) => (
          <DemoBox key={name}>
            <p css-token={name}>
              {name}: The quick brown fox jumps over the lazy dog.
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </p>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={[...FONT_FAMILIES]} />
      </Section>
    </DocPage>
  ),
};

export const FontSizes = {
  render: () => (
    <DocPage title="Font Sizes" subtitle="11 steps from caption to display">
      <Section>
        <SectionHeading>Scale</SectionHeading>
        {FONT_SIZES.map(({ name, value, description }) => (
          <DemoBox key={name}>
            <p css-token={name}>
              {name} ({value}) — {description}
            </p>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={[...FONT_SIZES]} />
      </Section>
    </DocPage>
  ),
};

export const FontWeights = {
  render: () => (
    <DocPage title="Font Weights" subtitle="Four weight stops">
      <Section>
        <SectionHeading>Weight Scale</SectionHeading>
        {FONT_WEIGHTS.map(({ name, value, description }) => (
          <DemoBox key={name}>
            <p css-token={name}>
              {name} ({value}) — {description}: The quick brown fox jumps over the lazy dog.
            </p>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={[...FONT_WEIGHTS]} />
      </Section>
    </DocPage>
  ),
};

export const LeadingScale = {
  render: () => (
    <DocPage title="Leading" subtitle="Line-height scale from none to loose">
      <Section>
        <SectionHeading>Line Height</SectionHeading>
        <Callout variant="note">
          Leading values are unitless multipliers applied to the computed font size.
          Use tight or snug for headings, normal for body text, and relaxed for
          long-form content.
        </Callout>
        {LEADING.map(({ name, value, description }) => (
          <DemoBox key={name}>
            <p css-token={name}>
              {name} ({value}) — {description}. This paragraph contains multiple
              lines to demonstrate how the line-height value affects readability.
              A good leading value ensures comfortable scanning across long runs
              of text without lines feeling cramped or overly spacious.
            </p>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={[...LEADING]} />
      </Section>
    </DocPage>
  ),
};

export const TrackingScale = {
  render: () => (
    <DocPage title="Tracking" subtitle="Letter-spacing from tighter to wider">
      <Section>
        <SectionHeading>Letter Spacing</SectionHeading>
        <Callout variant="note">
          Tighter tracking suits large display text; wider tracking improves
          legibility of small uppercase labels.
        </Callout>
        {TRACKING.map(({ name, value, description }) => (
          <DemoBox key={name}>
            <p css-token={name}>
              {name} ({value}) — {description}: ABCDEFGHIJKLMNOPQRSTUVWXYZ
              abcdefghijklmnopqrstuvwxyz
            </p>
          </DemoBox>
        ))}
      </Section>
      <Section>
        <SectionHeading>Token Reference</SectionHeading>
        <TokenTable tokens={[...TRACKING]} />
      </Section>
    </DocPage>
  ),
};

export const TypePairings = {
  render: () => (
    <DocPage title="Type Pairings" subtitle="Common heading and body combinations">
      <Section>
        <SectionHeading>Display + Body</SectionHeading>
        <Callout variant="tip">
          Pair larger sizes with tighter tracking and tight leading. Body text
          uses normal tracking and normal or relaxed leading.
        </Callout>
        <DemoBox>
          <p css-token="--font-size-40">Display heading at --font-size-40</p>
          <p css-token="--font-size-14">
            Body text at --font-size-14 with --leading-normal. This demonstrates
            a common pairing for hero sections or landing pages where a large
            heading introduces a supporting paragraph.
          </p>
        </DemoBox>
      </Section>
      <Section>
        <SectionHeading>Heading + Body</SectionHeading>
        <DemoBox>
          <p css-token="--font-size-24">Section heading at --font-size-24</p>
          <p css-token="--font-size-14">
            Body text at --font-size-14. This pairing works well for content
            sections, cards, and article layouts where hierarchy needs to be
            clear without being overwhelming.
          </p>
        </DemoBox>
      </Section>
      <Section>
        <SectionHeading>Heading-sm + Compact</SectionHeading>
        <DemoBox>
          <p css-token="--font-size-20">Sub-heading at --font-size-20</p>
          <p css-token="--font-size-13">
            Compact text at --font-size-13. Suitable for dense UI areas like
            sidebars, settings panels, and secondary information blocks.
          </p>
        </DemoBox>
      </Section>
      <Section>
        <SectionHeading>Sans + Mono</SectionHeading>
        <DemoBox>
          <p css-token="--font-family-sans">
            Explanatory text set in --font-family-sans describes the purpose of
            the token.
          </p>
          <p css-token="--font-family-mono">
            --font-size-14: 0.875rem; /* 14px — body */
          </p>
        </DemoBox>
      </Section>
    </DocPage>
  ),
};
