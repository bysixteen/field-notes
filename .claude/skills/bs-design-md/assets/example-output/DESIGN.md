---
version: alpha
name: example-system
colors:
  primary: "#0072D5"
  primary-hover: "#005DBD"
  primary-active: "#004AA9"
  primary-disabled: "#92B1D3"
  on-primary: "#FFFFFF"
  warning: "#E27900"
  warning-hover: "#C66000"
  on-warning: "#231103"
  surface: "#FFFFFF"
  surface-elevated: "#F6F9FC"
  fg: "#13161A"
  fg-muted: "#51565B"
  border: "#D5D8DB"
typography:
  heading-lg:
    fontFamily: Inter, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  heading-md:
    fontFamily: Inter, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Inter, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Inter, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-warning}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-warning-hover:
    backgroundColor: "{colors.warning-hover}"
    textColor: "{colors.on-warning}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.sm}"
    height: 32px
  button-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
    height: 48px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    height: 40px
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
---

## Overview

example-system is a design system. The values in this file are the source of truth for an AI agent generating new UI; the prose below explains how to apply them.

## Colors

This system defines 13 colour tokens. The hex values in the YAML frontmatter are sRGB approximations — for wide-gamut OKLCH originals, see the sidecar `tokens.json`.

## Typography

Typography tokens map intent (heading, body, label) to specific font, size, weight, and leading. Use the named tokens; do not author one-off values.

## Components

10 component primitives are defined. Variants are sibling keys with related names (e.g. `button`, `button-hover`). Composition follows: Sentiment → Emphasis → Size → Structure → State.

## Do's and Don'ts

### Composition Model

Every component is the product of up to five independent dimensions: **Sentiment, Emphasis, Size, Structure, State**. Each is orthogonal — it does not conflict with any other dimension.

- Sentiment: what the component communicates (`neutral`, `warning`, `highlight`, `new`, `positive`)
- Emphasis: how loudly it communicates (`high`, `medium`, `low`)
- Size: physical footprint (`xs`, `sm`, `md`, `lg`, `xl`)
- Structure: fixed anatomical dimensions (radius, gap, internal padding)
- State: interactive condition (`rest`, `hover`, `active`, `selected`, `disabled`)

**Decision order:** Sentiment → Emphasis → Size → Structure → State. State is never a composition decision — it's a runtime response.

### Cascade and Interpolation

Not every (sentiment × emphasis × size × state) combination is named in this file. When a combination isn't named, find the closest named variant by swapping one dimension at a time toward the default. The colour cascade resolves bottom-up: **State → Emphasis → Sentiment → Semantic Color**.

### Anti-patterns

- Don't apply sentiment colour to non-component surfaces.
- Don't override state colours per component — state shifts come from the cascade.
- Don't use a primitive token directly in a component; always reference the semantic layer.
- Don't combine multiple high-emphasis components on the same surface.

### Wide-gamut colour

The `colors` block is hex sRGB only because the DESIGN.md spec mandates it. Original OKLCH/Display P3 values live in the sidecar `tokens.json`. When a tool round-trips through DTCG, prefer the sidecar.
