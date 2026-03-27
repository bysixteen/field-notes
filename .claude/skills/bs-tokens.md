---
name: bs-tokens
description: >-
  Use when working with design tokens — consuming tokens in CSS, reasoning
  about the dimensional model, auditing token cascade integrity, or building
  component token APIs. Triggers on: design tokens, CSS custom properties,
  semantic colors, theming, state/emphasis/sentiment/size dimensions, resolution
  chains, hardcoded value audits, mixing desk metaphor, "use our tokens",
  "style this to match our design", "which token for this element".
---

# Design Tokens

## Two Concerns

**Part 1 — Using Tokens:** How to write styles with CSS custom properties from the token system.
**Part 2 — Token Architecture:** How to reason about, build, and audit the multi-dimensional token model.

## The Mixing Desk Model

Each dimension is a fader on a mixing desk — faders move independently. The component's visual output is the intersection of all fader positions.

## Colour Cascade (bottom-up)

```
Sentiment → Emphasis → State
```

Each layer aliases the one below. A single Sentiment change propagates through Emphasis and State automatically.

## Audit Rules

### BLOCKING (colour track)
1. State layer: every COLOR must alias Emphasis
2. Emphasis layer: every COLOR must alias Sentiment
3. Sentiment layer: every COLOR must alias Semantic Colour

### WARNING (structural track)
4. Structure spacing → must alias Size
5. Structure typography → must alias Semantic Typography
6. Structure radius → must alias Semantic Scale

## Token Naming

**Colour:** `--{property}-{level}[-{state}]` (e.g., `--fg-primary`, `--color-bg-neutral-hover`)
**Scale:** `--{category}-{value}` (e.g., `--size-16`, `--radii-8`)

## Build Order (new component)

1. Sentiment collection → alias from Semantic Colour
2. Emphasis collection → alias from Sentiment
3. State collection → alias from Emphasis
4. Structure collection → alias Semantic Scale/Typography
5. Size collection → raw FLOAT values
6. Run audit on every collection

Full documentation: [Token Audit](/design-system/token-audit) · [Token Chain](/design-system/token-chain) · [Token Transform Pipeline](/design-system/token-transform-pipeline)
