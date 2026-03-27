---
name: bs-testing
description: >-
  Review or write tests for design system components using the three-layer
  strategy: unit tests, accessibility automation, and visual regression.
  Use when writing tests, reviewing test coverage, deciding what to test,
  or setting up testing infrastructure. Triggers on: "write tests for",
  "test this component", "what should I test", "testing strategy",
  "jest-axe", "visual regression", "coverage".
---

# Testing Strategy

## Three Layers

```
Layer 1: Unit Tests        — Component contract (inputs → outputs)
Layer 2: Accessibility     — Automated WCAG via axe-core
Layer 3: Visual Regression — Screenshot comparison across states
```

## Layer 1: Unit Tests

**Test:** Input→attribute mapping, defaults, disabled state, slot rendering, events
**Don't test:** Token values, internal implementation, framework behaviour

## Layer 2: Accessibility

**jest-axe** for unit tests, **@axe-core/playwright** for integration.
Catches ~30-40% of WCAG violations. Manual review still needed.

## Layer 3: Visual Regression

Snapshot: all sentiments × emphases, programmatic states, all sizes, dark/light themes.

## Coverage by Bracket

| Bracket | Unit | A11y | Visual |
|---------|:----:|:----:|:------:|
| B1 Display | Inputs + defaults | jest-axe | All sentiments |
| B2 Interactive | + events + disabled | + keyboard | + emphases × states |
| B3 Form | + validation + value | + label association | + error states |
| B4 Composite | + sub-component | + keyboard nav | + expanded/collapsed |
| B5 Data | + data rendering | + table semantics | + empty state |
| B6 Overlay | + focus trap + restore | + focus management | + backdrop |

Full documentation: [Testing Strategy](/design-system/testing-strategy)
