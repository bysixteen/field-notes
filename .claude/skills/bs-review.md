---
name: bs-review
description: >-
  Orchestrate a full design system component review across six stages:
  component API, React patterns, HTML semantics, accessibility (WCAG 2.2 AA),
  token integrity, and CSS authoring. Use when reviewing a component before
  merge, running a comprehensive quality check on an existing component, or
  performing a multi-stage audit. Produces a consolidated, scored report with
  actionable findings across all dimensions — the single entry point for
  complete component sign-off.
---

# Design System Component Review

## Foundations (read first)

- [DESIGN-INTENT](_foundations/DESIGN-INTENT.md)
- [DIMENSIONAL-MODEL](_foundations/DIMENSIONAL-MODEL.md)
- [TOKEN-ARCHITECTURE](_foundations/TOKEN-ARCHITECTURE.md)
- [QUALITY-GATES](_foundations/QUALITY-GATES.md)

Run all 6 review stages in sequence. Each stage has a dedicated skill -- this orchestrator ensures they run in the right order and produces a consolidated verdict.

## Stages

| Stage | Concern | Skill | Key Checks |
|-------|---------|-------|------------|
| 0 | Component API contract | `bs-component-api` | Enums not booleans, defaults, naming |
| 1 | React patterns | `bs-react-patterns` | forwardRef, rest spread, RSC, hooks |
| 2 | Semantic HTML + ARIA | `bs-html` | Native elements, ARIA roles, keyboard |
| 3 | WCAG 2.2 AA accessibility | `bs-accessibility` | Scored audit (B1-B6), rules A01-A30 |
| 4 | Token integrity | `bs-tokens` | Cascade chain, no hardcoded values |
| 5 | CSS/SCSS authoring | `bs-css` | Seven non-negotiables, section order |

## Workflow

1. Read all component files (`.tsx`, `.css`/`.scss`, `.test.tsx`, `.stories.tsx`, `.types.ts`)
2. Run stages 0-5 in order
3. Collect all findings across stages
4. Calculate consolidated score
5. Produce verdict using report template
6. Offer to fix

## Verdict Logic

| Verdict | Condition | Action |
|---------|-----------|--------|
| **NEEDS UPLIFT** | Any BLOCKING finding in any stage | Merge blocked, must remediate |
| **MINOR IMPROVEMENTS** | No BLOCKING, but SERIOUS findings exist | Merge at discretion, fix soon |
| **UP TO STANDARD** | No BLOCKING or SERIOUS findings | Good to merge |

## Stage Skip / Focus by Bracket

Not every component needs equal weight across all six stages. Use this matrix to prioritise:

| Bracket | Skip | Extra Weight |
|---------|------|-------------|
| B1 Display | Stage 0 (no API contract), Stage 1 (no React patterns needed) | Stage 2 (semantics), Stage 3 (a11y) |
| B2 Interactive | — | Stage 0 (API), Stage 3 (keyboard/focus) |
| B3 Form | — | Stage 2 (label association), Stage 3 (aria-invalid, live regions) |
| B4 Composite | — | Stage 1 (compound patterns), Stage 3 (arrow keys, roving tabindex) |
| B5 Data | — | Stage 2 (table semantics), Stage 3 (captions, headers) |
| B6 Overlay | — | Stage 3 (focus trap/restore, Escape), Stage 1 (controlled state) |

## Finding Severity Mapping

| Stage | BLOCKING | SERIOUS | MODERATE |
|-------|----------|---------|----------|
| 0 - API | Boolean dimension, missing default | Non-standard mode, visual name | Broad children vs named slot |
| 1 - React | Missing forwardRef, no rest spread | Missing 'use client', config over composition | Index as key, missing memo |
| 2 - HTML | Click on div, missing label, no href | Wrong ARIA role, missing keyboard | tabindex > 0, heading skip |
| 3 - A11y | A01-A05, A18-A21 (CRITICAL rules) | A06-A08, A13, A16-A17, A22-A25 | A09-A12, A14-A15, A26-A30 |
| 4 - Tokens | State not aliasing Emphasis, Emphasis not aliasing Sentiment | Structure missing alias | Non-standard naming |
| 5 - CSS | BEM for dimensions, section order, missing :not() | Margin, physical props, hardcoded | Missing reduced-motion |

## Consolidated Report Template

```
===============================================================
COMPONENT REVIEW: {ComponentName}
Files: {list of all files reviewed}
===============================================================

STAGE 0 -- COMPONENT API                    {PASS | n FINDINGS}
  {findings with severity and fix, if any}

STAGE 1 -- REACT PATTERNS                   {PASS | n FINDINGS}
  {findings with severity and fix, if any}

STAGE 2 -- HTML SEMANTICS                   {PASS | n FINDINGS}
  {findings with severity and fix, if any}

STAGE 3 -- ACCESSIBILITY (B{n})             Score: {n}/100
  {findings with severity and fix, if any}

STAGE 4 -- TOKEN INTEGRITY                  {PASS | n FINDINGS}
  {findings with severity and fix, if any}

STAGE 5 -- CSS AUTHORING                    {PASS | n FINDINGS}
  {findings with severity and fix, if any}

===============================================================
SUMMARY:
  BLOCKING:  {count}
  SERIOUS:   {count}
  MODERATE:  {count}
  A11y Score: {n}/100

VERDICT: {NEEDS UPLIFT | MINOR IMPROVEMENTS | UP TO STANDARD}
===============================================================

{If NEEDS UPLIFT or MINOR IMPROVEMENTS, numbered priority list of fixes}

OFFER:
  1. Apply all fixes directly to the component files
  2. Generate GitHub issues for findings that need discussion
===============================================================
```

## Reviewer Judgment

### When to merge findings across stages

A CSS issue that's also an a11y issue (e.g., `outline: none` — violates both non-negotiable #4 and rule A06) should be reported in both stages with a cross-reference note. Count it once in the severity totals; fix it once in the remediation list.

### How to prioritize when there are 15+ findings

Sort by:
1. Blast radius — findings that affect every instance of the component in production first
2. Severity — BLOCKING before SERIOUS before MODERATE
3. Stage order — earlier stage findings often unblock later ones

Don't list 15 equally-weighted findings. Group and consolidate where appropriate.

### When to recommend "rewrite" vs "fix incrementally"

Recommend rewrite when: the component has BLOCKING findings in 3+ stages, the root HTML element is wrong, or the component predates the dimensional token model entirely. Recommend incremental fix when: findings are concentrated in 1-2 stages and the structure is sound.

## Calibration Examples

### Too terse (bad)

```
STAGE 0 -- COMPONENT API    2 FINDINGS
  Boolean props found. Fix them.

VERDICT: NEEDS UPLIFT
```

### Too verbose (bad)

```
STAGE 0 -- COMPONENT API    2 FINDINGS
  [BLOCKING] In the Button component, which is a Tier 1 interactive element commonly
  used across the design system in many contexts including primary actions, secondary
  actions, and destructive actions, we found that the prop `isPrimary` uses a boolean
  pattern which, as documented in the component API skill, is problematic because...
```

### Just right

```
STAGE 0 -- COMPONENT API    2 FINDINGS
  [BLOCKING] isPrimary is a boolean — use emphasis="high" instead
    Current: isPrimary?: boolean
    Should be: emphasis?: 'high' | 'medium' | 'low'  // default: 'medium'

  [SERIOUS] No default for sentiment prop
    Current: sentiment?: Sentiment
    Should be: sentiment?: Sentiment  // default: 'neutral'
```

One finding per entry, severity tag, current state, desired state. No padding prose.

## Quick Reference: What Each Stage Checks

### Stage 0 -- Component API
- No boolean dimension inputs
- Every input has a default
- Names describe dimension, not visual
- Standard mode values only
- Loading merged into state='resolving'

### Stage 1 -- React Patterns
- forwardRef on all leaf components
- Spread remaining props (...rest)
- Correct 'use client' directive
- Composition over configuration
- Proper key usage

### Stage 2 -- HTML Semantics
- Native elements first
- Correct ARIA roles and attributes
- Keyboard path for all interactive elements
- Form labels and fieldsets
- No ARIA overriding native semantics

### Stage 3 -- Accessibility
- Bracket classification (B1-B6)
- Rules A01-A30 by bracket
- APG pattern compliance
- Contrast ratios (4.5:1 text, 3:1 UI)
- Score calculation

### Stage 4 -- Token Integrity
- Color cascade: Sentiment -> Emphasis -> State
- No hardcoded color values
- Structure aliases Size/Scale/Typography
- Token naming conventions

### Stage 5 -- CSS Authoring
- Seven non-negotiables
- Section order enforced
- :not() guards on pseudo-classes
- Logical properties
- No margin on components

## Cross-References

This skill orchestrates all other skills. Each stage corresponds to:

| Stage | Skill |
|-------|-------|
| 0 | `bs-component-api` |
| 1 | `bs-react-patterns` |
| 2 | `bs-html` |
| 3 | `bs-accessibility` |
| 4 | `bs-tokens` |
| 5 | `bs-css` |

See your project's design system documentation for full details on each stage.

Related but not stages:
- `bs-testing` -- Run after review to verify test coverage matches findings
- `bs-component-scaffold` -- If component needs full rewrite, scaffold from scratch
- `bs-storybook-docs` -- Generate docs stories after review passes

## Self-review

Before declaring done, run the self-review protocol from `_foundations/SELF-REVIEW.md`. The protocol applies to the review report this skill produces — confirm the findings match what was actually asked, list assumptions, list what wasn't audited, gate.
