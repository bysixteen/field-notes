---
version: alpha
name: field-notes
colors:
  neutral-50: "#F5F8FF"
  neutral-100: "#EAEFF7"
  neutral-200: "#DFE5F0"
  neutral-300: "#D1D8E5"
  neutral-400: "#BDC4D3"
  neutral-500: "#A7AEBD"
  neutral-600: "#888F9D"
  neutral-700: "#636975"
  neutral-800: "#51555F"
  neutral-900: "#373B41"
  neutral-950: "#1F2226"
  neutral-1000: "#0A0B0E"
  highlight-50: "#F5F9FF"
  highlight-100: "#E6EFFF"
  highlight-200: "#D7E5FF"
  highlight-300: "#C3D8FF"
  highlight-400: "#A5C4FF"
  highlight-500: "#82ADFF"
  highlight-600: "#4F89FF"
  highlight-700: "#215CDD"
  highlight-800: "#174AB9"
  highlight-900: "#0A3187"
  highlight-950: "#021A57"
  highlight-1000: "#00062A"
  positive: "#24AA51"
  warning: "#D37300"
  danger: "#F7453E"
  new-50: "#F8F7FF"
  new-100: "#EFECFF"
  new-200: "#E5E0FF"
  new-300: "#D8D0FF"
  new-400: "#C6B8FF"
  new-500: "#B29BFF"
  new-600: "#986EFF"
  new-700: "#7537E1"
  new-800: "#6029BC"
  new-900: "#431589"
  new-950: "#280459"
  new-1000: "#0F002A"
  primary: "#4F89FF"
  primary-hover: "#215CDD"
  primary-active: "#174AB9"
  primary-disabled: "#C3D8FF"
  on-primary: "#F5F8FF"
  fg: "#0A0B0E"
  fg-muted: "#636975"
  bg: "#F5F8FF"
  bg-elevated: "#EAEFF7"
  border: "#DFE5F0"
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
  xl: 16px
  full: 9999px
spacing:
  4: 4px
  8: 8px
  12: 12px
  16: 16px
  20: 20px
  24: 24px
  32: 32px
  40: 40px
  48: 48px
  64: 64px
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.8} {spacing.16}"
    height: 40px
  button-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.8} {spacing.16}"
    height: 40px
  button-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.8} {spacing.16}"
    height: 40px
  button-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.8} {spacing.16}"
    height: 40px
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.8} {spacing.12}"
    height: 40px
  badge:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "{spacing.4} {spacing.8}"
    height: 24px
---

## Overview

field-notes is a design system. The values in this file are the source of truth for an AI agent generating new UI; the prose below explains how to apply them.

## Colors

This system defines 49 colour tokens. The hex values in the YAML frontmatter are sRGB approximations — for wide-gamut OKLCH originals, see the sidecar `tokens.json`.

## Typography

Typography tokens map intent (heading, body, label) to specific font, size, weight, and leading. Use the named tokens; do not author one-off values.

## Components

6 component primitives are defined. Variants are sibling keys with related names (e.g. `button`, `button-hover`). Composition follows: Sentiment → Emphasis → Size → Structure → State.

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
